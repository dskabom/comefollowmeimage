#!/usr/bin/env node
// Bundle + validate content for Come, Follow Me — Picture Viewer.
//
// Usage:
//   node scripts/bundle.mjs          → validate and re-embed JSON into index.html
//   node scripts/bundle.mjs --check  → validate only; never writes

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const checkOnly = process.argv.includes('--check');

function readJSON(relPath) {
  const full = resolve(root, relPath);
  try {
    return { raw: readFileSync(full, 'utf8'), path: full };
  } catch (err) {
    fail(`Could not read ${relPath}: ${err.message}`);
  }
}

function parse(raw, label) {
  try { return JSON.parse(raw); }
  catch (err) { fail(`Invalid JSON in ${label}: ${err.message}`); }
}

function fail(msg) {
  console.error(`\x1b[31m✗ ${msg}\x1b[0m`);
  process.exit(1);
}

function ok(msg) { console.log(`\x1b[32m✓\x1b[0m ${msg}`); }

// ---------- load ----------
const lessonsFile = readJSON('lessons.json');
const imagesFile  = readJSON('images.json');
const symbolsFile = readJSON('symbols.json');
const htmlFile    = readJSON('index.html');

const lessons = parse(lessonsFile.raw, 'lessons.json');
const images  = parse(imagesFile.raw,  'images.json');
const symbols = parse(symbolsFile.raw, 'symbols.json');

// ---------- validate ----------
if (!Array.isArray(lessons.lessons)) fail('lessons.json must have a "lessons" array');
if (typeof symbols.symbols !== 'object') fail('symbols.json must have a "symbols" object');

// images.json can be either:
//   { images: {...} }                     (legacy single-collection)
//   { manual: {...}, gospelArt: {...} }   (current two-collection)
let manualIds, gospelArtIds;
if (images.manual || images.gospelArt) {
  if (typeof images.manual !== 'object')   fail('images.json: "manual" must be an object');
  if (typeof images.gospelArt !== 'object') fail('images.json: "gospelArt" must be an object');
  manualIds    = new Set(Object.keys(images.manual));
  gospelArtIds = new Set(Object.keys(images.gospelArt));
} else if (typeof images.images === 'object') {
  manualIds    = new Set(Object.keys(images.images));
  gospelArtIds = new Set();
  console.warn('\x1b[33m! images.json uses the legacy "images" shape; consider migrating to { manual: {...}, gospelArt: {...} }\x1b[0m');
} else {
  fail('images.json must have either { manual, gospelArt } or { images }');
}

const symbolIds = new Set(Object.keys(symbols.symbols));

let errors = 0;
for (const L of lessons.lessons) {
  for (const k of ['id', 'dateStart', 'dateEnd', 'dateLabel', 'scripture']) {
    if (L[k] === undefined) { console.error(`  week ${L.id}: missing "${k}"`); errors++; }
  }
  for (const id of (L.images  || []))
    if (!manualIds.has(id))    { console.error(`  week ${L.id}: unknown manual image id "${id}"`);      errors++; }
  for (const id of (L.gospelArtImages || []))
    if (!gospelArtIds.has(id)) { console.error(`  week ${L.id}: unknown gospelArt image id "${id}"`);   errors++; }
  for (const id of (L.symbols || []))
    if (!symbolIds.has(id))    { console.error(`  week ${L.id}: unknown symbol id "${id}"`);            errors++; }
}
if (errors) fail(`${errors} validation error(s)`);
ok(`validated ${lessons.lessons.length} lessons, ${manualIds.size} manual images, ${gospelArtIds.size} Gospel Art images, ${symbolIds.size} symbols`);

// Report Gospel Art coverage
const withGospelArt = lessons.lessons.filter(L => Array.isArray(L.gospelArtImages) && L.gospelArtImages.length > 0).length;
ok(`Gospel Art coverage: ${withGospelArt}/${lessons.lessons.length} weeks (${lessons.lessons.length - withGospelArt} will fall back to manual images)`);

// Continuous date coverage check (warn only)
let prevEnd = null;
for (const L of lessons.lessons) {
  const ds = new Date(L.dateStart + 'T00:00:00Z');
  const de = new Date(L.dateEnd   + 'T00:00:00Z');
  if (prevEnd) {
    const gap = Math.round((ds - prevEnd) / 86400000);
    if (gap !== 1) console.warn(`\x1b[33m! week ${L.id} date gap/overlap: ${gap} days after previous\x1b[0m`);
  }
  prevEnd = de;
}

if (checkOnly) { ok('check-only mode — no files written'); process.exit(0); }

// ---------- embed ----------
function esc(s) { return s.replace(/<\/script>/g, '<\\/script>'); }

let html = htmlFile.raw;
const embedBlock = (id, body) =>
  new RegExp(
    `(<script type="application/json" id="embedded-${id}">)([\\s\\S]*?)(</script>)`
  );

const replacements = [
  ['lessons', lessonsFile.raw],
  ['images',  imagesFile.raw],
  ['symbols', symbolsFile.raw],
];

let missed = [];
for (const [id, raw] of replacements) {
  const re = embedBlock(id);
  if (!re.test(html)) { missed.push(id); continue; }
  html = html.replace(re, (_m, open, _mid, close) => `${open}${esc(raw)}${close}`);
}
if (missed.length) fail(`index.html is missing embedded block(s): ${missed.join(', ')}`);

writeFileSync(resolve(root, 'index.html'), html);
ok(`embedded JSON into index.html (${(html.length / 1024).toFixed(1)} KB)`);

// ---------- syntax check ----------
// Extract the main <script> (NOT the JSON blocks) and make sure it parses as valid JS.
// This catches the class of bug where a naive string-replace corrupts real code.
const mainScriptMatch = html.match(/<script>\s*\(\(\) => \{[\s\S]*?<\/script>/);
if (mainScriptMatch) {
  try {
    // Wrap in a Function to trigger parsing without executing
    new Function(mainScriptMatch[0].replace(/<\/?script>/g, ''));
    ok('main <script> passes syntax check');
  } catch (synErr) {
    fail(`main <script> has a SYNTAX ERROR after bundling: ${synErr.message}. This usually means a placeholder in the JS source got replaced with JSON content. Fix the source so no literal strings collide with your bundler tokens.`);
  }
} else {
  console.warn('\x1b[33m! could not locate main <script> for syntax check\x1b[0m');
}
