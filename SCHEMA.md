# Content Schema

The app's content lives in three JSON files at the repo root: `lessons.json`, `images.json`, and `symbols.json`. You can edit them freely — no code changes needed.

## `lessons.json`

```json
{
  "lessons": [
    {
      "id": 14,
      "dateStart": "2026-03-30",
      "dateEnd":   "2026-04-05",
      "dateLabel": "March 30 – April 5",
      "scripture": "Easter",
      "images":  ["empty-tomb", "jesus-crown-thorns"],
      "symbols": ["jesus-christ", "atonement", "resurrection"]
    }
  ]
}
```

| Field | Type | Notes |
| --- | --- | --- |
| `id` | number | Sequential week id. Used in URL fragment (`#week-14`) and for bookmarks. |
| `dateStart` | ISO date | First day of the study week (Monday). |
| `dateEnd` | ISO date | Last day (Sunday). Used by the "today" highlighter. |
| `dateLabel` | string | Human label shown in the UI (e.g. `"March 30 – April 5"`). |
| `scripture` | string | Scripture title shown as the lesson heading. |
| `images` | string[] | Ids from `images.manual`, in display order. Shown when *Manual Art* mode is on. |
| `gospelArtImages` | string[] | *Optional.* Ids from `images.gospelArt`, in display order. Shown when *Gospel Art* mode is on. If absent or empty, the viewer falls back to `images`. |
| `symbols` | string[] | Ids from `symbols.json`. Optional but recommended. |

## `images.json`

Two separate collections so the app can offer a user-facing toggle between *Manual Art* and *Gospel Art Book*:

```json
{
  "manual": {
    "moses-burning-bush": {
      "title":  "Moses and the Burning Bush",
      "url":    "https://www.churchofjesuschrist.org/imgs/…/full/!1200,/0/default",
      "source": "Come Follow Me 2026 manual"
    }
  },
  "gospelArt": {
    "moses-burning-bushes-gab": {
      "title":  "Moses and the Burning Bush",
      "artist": "Jerry Thompson",
      "url":    "https://www.churchofjesuschrist.org/imgs/…/full/!1200,/0/default",
      "source": "Gospel Art Book, no. 15"
    }
  }
}
```

| Field | Type | Notes |
| --- | --- | --- |
| `title` | string | Caption beneath the picture. |
| `url` | string | Full image URL. Prefer `churchofjesuschrist.org`. |
| `artist` | string | Optional. Shown in the caption. |
| `source` | string | Where the image lives (e.g. "Gospel Art Book", "Come Follow Me 2026 manual"). |

A lesson's `images` array looks up ids in `images.manual`; its `gospelArtImages` array looks up ids in `images.gospelArt`. Ids are independent between the two — you can reuse a slug or not, whichever reads better.

**Tip on Church image URLs:** they use an IIIF-style pattern `.../imgs/{hash}/full/!{width},/0/default`. Change `!500,` to `!1200,` (or higher) for a sharper picture. Change `full` → `square` for a square crop.

## `symbols.json`

```json
{
  "symbols": {
    "covenant": {
      "label": "Covenant",
      "svg":   "<svg viewBox='0 0 100 100' …>…</svg>",
      "imageUrl": "https://…"
    }
  }
}
```

| Field | Type | Notes |
| --- | --- | --- |
| `label` | string | Human label shown under the pictogram. |
| `svg` | string | Inline SVG (uses `currentColor`; scales to any size). |
| `imageUrl` | string | *Optional.* If present, the viewer uses this image instead of the SVG. Drop in a [Gospel Language Symbols](https://www.churchofjesuschrist.org/study/manual/gospel-symbols?lang=eng) URL to upgrade any symbol to the official graphic. |

---

## Editing workflow

### The easy way — `admin.html`

1. Open `admin.html` (via `python3 -m http.server 8000`).
2. Pick a tab (Lessons, Images, Symbols, or Schema).
3. Edit anything.
4. Click **Export All JSON** (top right) — three files download.
5. Replace `lessons.json`, `images.json`, `symbols.json` in the repo with the downloaded files.
6. Run `node scripts/bundle.mjs` (or open `index.html` from a server — the embedded fallback only matters for `file://` use).

### The code way

Edit the JSON files directly with any editor. Commit. Done.

If you want the `file://` fallback inside `index.html` to stay in sync (so someone can just double-click `index.html` without a server), run the bundler:

```bash
node scripts/bundle.mjs
```

This re-embeds the three JSON files into the matching `<script type="application/json">` blocks in `index.html`. There are no npm dependencies — Node ≥ 18 is all that's needed.

---

## Swapping imagery for a week

**Option A** — change which ids a lesson references:
```json
// lessons.json
{ "id": 14, "images": ["jesus-crown-thorns", "empty-tomb"] }
```

**Option B** — change what an id points to (affects every lesson using that id):
```json
// images.json
"empty-tomb": {
  "title": "The Empty Tomb",
  "url":   "https://your-new-church-hosted-url/...",
  "source": "Gospel Art"
}
```

**Option C** — add a new image id, then reference it:
```json
// images.json — add:
"easter-sunrise": { "title": "Easter Sunrise", "url": "...", "source": "..." }
// lessons.json — edit:
{ "id": 14, "images": ["empty-tomb", "easter-sunrise"] }
```

---

## Validation

A small validator runs in the bundle script — it will fail if:

- any image id referenced by a lesson is missing from `images.json`
- any symbol id referenced by a lesson is missing from `symbols.json`
- any JSON file is malformed

Run it manually any time:
```bash
node scripts/bundle.mjs --check
```
