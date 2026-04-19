# Contributing

Thanks for your interest in improving the Picture Viewer.

## What's welcome

- **Better image selections** for any week (more meaningful, higher contrast, clearer subject).
- **New symbols** — the pictogram set is intentionally minimal; add more when they serve a real lesson.
- **Accessibility improvements** — anything that helps people with cognitive, visual, or motor differences use the app more easily.
- **Bug fixes, typos, date corrections.**
- **Translations of UI strings** (see the "Internationalization" note below).

## What's probably not a fit

- New frameworks, build tools, or npm dependencies. The project is intentionally a single HTML file plus three JSON files; keeping it that way is a feature.
- Opinionated theming swaps. The calm, reverent parchment aesthetic is deliberate.
- Bundling Church artwork directly into the repo. We only reference Church-hosted URLs.

## Development setup

No install step. Clone and go.

```bash
git clone https://github.com/<you>/<repo>.git
cd <repo>
python3 -m http.server 8000     # or any static server
# open http://localhost:8000
```

For the admin editor, open `http://localhost:8000/admin.html`.

## Before opening a PR

Run the validator — it catches broken image/symbol references and malformed JSON:

```bash
node scripts/bundle.mjs --check
```

If you've edited any of the three JSON files, run the full bundler so the `file://` fallback inside `index.html` stays in sync:

```bash
node scripts/bundle.mjs
```

Commit both the JSON file(s) and the updated `index.html`.

## Style notes

- **JSON:** two-space indent. Keys in lowercase-hyphenated slugs.
- **Dates:** ISO `YYYY-MM-DD`. Monday → Sunday coverage for each week.
- **Image URLs:** prefer `churchofjesuschrist.org` with `!1200,` width or higher.
- **Symbols:** SVGs should use `viewBox='0 0 100 100'`, `fill='none'`, and `stroke='currentColor'` so they inherit the app's ink color and scale cleanly. Keep them to one visual idea.

## Internationalization

The UI strings currently live directly in `index.html`. If you want to add translations, open an issue first — the cleanest path is probably a small `strings.json` map keyed by locale, but we should discuss before you build it.

## Reporting issues

Please use the issue templates. Screenshots or a short screen recording are incredibly helpful, especially for accessibility reports.

## Code of conduct

Be kind. Remember this project started to help someone recovering from a brain aneurysm follow Sunday School; every design decision should pass the "does this make the experience calmer and clearer?" test.
