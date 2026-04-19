<div align="center">

# Come, Follow Me — Picture Viewer

### A calm, picture-first companion for the 2026 Old Testament Sunday School curriculum

[![License: MIT](https://img.shields.io/badge/license-MIT-9a7a2e.svg)](LICENSE)
[![No build step](https://img.shields.io/badge/build-none-3a6a3a.svg)](#quick-start)
[![Accessible](https://img.shields.io/badge/a11y-first-3a6a3a.svg)](#accessibility)
[![Made for ward use](https://img.shields.io/badge/made%20for-ward%20%26%20home-9a7a2e.svg)](#)

<p><em>Large controls · minimal text · strong contrast · full-screen class mode · picture-first UX</em></p>

<!-- Screenshot placeholder — replace docs/screenshot.png with a real capture -->
<img src="docs/screenshot.png" alt="Screenshot of the Picture Viewer showing a lesson from Exodus with large Previous and Next buttons beneath a Church-hosted painting." width="820">

</div>

---

## Why this exists

This app was built for a Latter-day Saint Sunday School attendee recovering cognitive ability after a brain aneurysm. During class he needs to **follow the weekly lesson visually** while someone else teaches. Dense menus, tiny controls, and cluttered layouts don't work; a single picture, large Prev/Next buttons, and optional symbols for abstract ideas do.

If it helps someone else — a child learning to read, a member with a visual-processing difference, a family that wants imagery-driven scripture study — all the better.

## Quick start

**Option 1 — open the HTML file.** Clone or download the repo and double-click `index.html`. The JSON data is embedded as a fallback so it runs from `file://` with no server.

**Option 2 — local server.** The admin editor (`admin.html`) and hot-swap JSON editing both need a server context:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

**Option 3 — GitHub Pages.** See [Deploy to GitHub Pages](#deploy-to-github-pages).

## Features

- **All 52 weekly lessons** of the 2026 Old Testament — dates and scriptures from the [official Come, Follow Me manual](https://www.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026?lang=eng).
- **Two image sources, one tap to switch** — *Gospel Art Book* (default: traditional Church-approved paintings by Del Parson, Harry Anderson, Minerva Teichert, Jerry Harston, Robert Barrett, Ted Henninger, Clark Kelley Price, and others) or *Manual Art* (imagery from the 2026 Come Follow Me manual). Preference is remembered across sessions. Weeks without a Gospel Art Book image fall back automatically to the manual image.
- **Today highlighter** — the current week surfaces automatically at the top and is marked in the grid.
- **Large Previous and Next buttons** — 72 px minimum height, tap- and keyboard-friendly.
- **Thumbnail strip** and **symbol strip** — optional, toggleable.
- **Simple Mode** — replaces detailed artwork with clean doctrinal pictograms (covenant, faith, prayer, temple, atonement, etc.).
- **Full-Screen Class Mode** — hides all chrome; only the picture and two big buttons remain.
- **Keyboard, swipe, and touch** — works the same on desktop, tablet, and phone.
- **Hash routing** — `#week-14` opens Easter week directly; bookmarkable.
- **No frameworks, no build step, no dependencies** — one HTML file, three JSON files.
- **Content editor** (`admin.html`) — edit weeks, images (both catalogs), and symbols in-browser, then export updated JSON.

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `→` / `Space` | Next picture |
| `←` | Previous picture |
| `G` | Toggle Gospel Art / Manual Art |
| `T` | Jump to today's lesson (home) · toggle thumbnails (viewer) |
| `S` | Toggle Simple Mode |
| `F` | Toggle Full-Screen Class Mode |
| `Esc` | Exit full-screen, then close lesson |
| `Home` / `End` | First / last picture in the week |

## Repo layout

```
.
├── index.html                ← the app (self-contained; embeds JSON as a fallback)
├── admin.html                ← in-browser editor + JSON exporter
├── lessons.json              ← 52-week 2026 Old Testament schedule
├── images.json               ← catalog of narrative pictures (Church-hosted URLs)
├── symbols.json              ← catalog of doctrinal symbols (inline SVG)
├── scripts/
│   └── bundle.mjs            ← embeds the three JSON files into index.html
├── docs/
│   ├── screenshot.png        ← for the README
│   └── SCHEMA.md             ← full content-model reference
├── .github/
│   ├── workflows/pages.yml   ← auto-deploys to GitHub Pages
│   └── ISSUE_TEMPLATE/       ← bug + feature templates
├── CONTRIBUTING.md
├── CHANGELOG.md
└── LICENSE
```

## Content model

The app renders two kinds of imagery, both referenced by stable ids:

- **Narrative images** (`images.json`) — historical/artistic scenes from Church-hosted media.
- **Symbols** (`symbols.json`) — simple pictograms for abstract doctrines.

Weeks reference imagery by id, so you can change what shows for any week by editing one line. See **[docs/SCHEMA.md](docs/SCHEMA.md)** for the full schema reference and editing workflow.

## Where the images come from

Two Church-hosted catalogs, picked via the **Gospel Art / Manual Art** toggle:

- **Gospel Art Book (default)** — [the Church's officially curated collection](https://www.churchofjesuschrist.org/media/collection/old-testament-gospel-art-book-images?lang=eng) used in Primary, seminary, and missionary work. 30 traditional paintings by Church-commissioned artists (Del Parson, Harry Anderson, Minerva Teichert, Jerry Harston, Robert T. Barrett, Ted Henninger, Clark Kelley Price, Grant Romney Clawson, Judith Mehr, and others). 39 of 52 weeks are covered; the rest fall back to the manual images automatically.
- **Come Follow Me 2026 Manual** — 52 images pulled directly from the official weekly lesson pages.

All image URLs point at `churchofjesuschrist.org` — this app does **not** bundle or redistribute Church artwork. When the Church updates an image, the viewer shows the new one automatically.

Symbols ship as **inline SVG** for offline reliability and perfect scaling. Any symbol can be upgraded to the official [Gospel Language Symbols](https://www.churchofjesuschrist.org/study/manual/gospel-symbols?lang=eng) graphic by adding an `imageUrl` field — the viewer prefers it over the SVG when present.

## Deploy to GitHub Pages

The repo ships with a ready-to-go workflow at `.github/workflows/pages.yml`.

1. Push the repo to GitHub.
2. **Settings → Pages → Source: GitHub Actions.**
3. Push to `main` — the workflow auto-deploys.

Your app will be live at `https://<you>.github.io/<repo>/`.

## Accessibility

- Serif typography (Fraunces + Lora) with strong contrast at every size.
- Touch targets meet or exceed 44×44 px; navigation buttons are much larger.
- Full keyboard navigation with a visible focus ring.
- Respects `prefers-reduced-motion`.
- Simple Mode for lower visual load.
- Full-Screen mode removes all chrome and color noise for class use.

## Contributing

PRs welcome — especially for better image selections, new symbols, and accessibility improvements. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) for the app code. Artwork remains the property of its respective copyright holders and is displayed via Church-hosted URLs under the Church's [terms of use](https://www.churchofjesuschrist.org/legal).

---

<div align="center"><em>Built with love for anyone who wants to follow along visually.</em></div>
