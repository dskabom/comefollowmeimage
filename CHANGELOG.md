# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] — 2026-04-19

### Added
- **Gospel Art Book toggle.** New masthead chip (and `G` keyboard shortcut) switches between two Church-hosted catalogs: the 2026 Come Follow Me manual imagery and the official **Gospel Art Book** — 30 traditional paintings by Del Parson, Harry Anderson, Minerva Teichert, Jerry Harston, Robert T. Barrett, Ted Henninger, Clark Kelley Price, Grant Romney Clawson, Judith Mehr, and others. Gospel Art is the default.
- Preference persists across sessions via `localStorage`.
- Automatic fallback: 13 weeks without Gospel Art Book coverage (Psalms, Ezra, Haggai, etc.) silently use the manual images, and the caption notes the fallback.
- Admin editor now has Manual / Gospel Art sub-tabs on the Images panel, with separate add/edit/delete for each catalog. Lessons panel now shows and lets you edit both `images` and `gospelArtImages` arrays side-by-side.
- Bundler validator reports Gospel Art coverage (`39/52 weeks`) and validates references against both catalogs.

### Changed
- `images.json` migrated from a flat `{ images: {...} }` shape to a two-collection `{ manual: {...}, gospelArt: {...} }` shape. The app still reads the legacy shape if it finds one, so existing forks keep working.
- Each lesson in `lessons.json` gained an optional `gospelArtImages` string[] alongside its existing `images` string[].
- Caption format now includes artist name when available (e.g. *"Elijah Contends against the Priests of Baal · Jerry Harston · Gospel Art Book, no. 20"*).

### Fixed
- Error state for failed JSON loads now shows a visible on-page message with the actual error text, instead of silent dashes.

## [1.0.0] — 2026-04-18

### Added
- Initial release.
- All 52 weekly lessons of the 2026 Old Testament Come, Follow Me schedule, dates and scriptures sourced from the official Church manual.
- 52 Church-hosted narrative images, keyed by id in `images.json`.
- 22 doctrinal symbols as inline SVG in `symbols.json`, covering covenant, faith, prayer, temple, repentance, commandments, Jesus Christ, atonement, resurrection, creation, family, shepherd, light, messiah, scripture, priesthood, law, Israel, sacrifice, deliverance, prophet, and wisdom.
- Main viewer (`index.html`) with large Prev/Next buttons, thumbnail strip, symbol strip, today-highlighter, hash routing, swipe, and full keyboard support.
- **Simple Mode** (key `S`) that substitutes clean pictograms for detailed artwork.
- **Full-Screen Class Mode** (key `F`) that hides all chrome and requests browser fullscreen.
- Admin editor (`admin.html`) with tabs for Lessons, Images, Symbols, and raw JSON; exports all three files as a downloadable bundle.
- `scripts/bundle.mjs` — dependency-free Node script that validates references and embeds the three JSON files into `index.html` so the app works from `file://`.
- GitHub Actions workflow (`.github/workflows/pages.yml`) that auto-deploys to GitHub Pages on push to `main`.
