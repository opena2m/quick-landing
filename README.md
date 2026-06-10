# HAIPNET & FLEXOFAB — Landing Pages

Two independent, self-contained static landing sites for a **flexible manufacturing
printer network and IP management platform** — printing on fabric, plastic, and metal,
plus true 3D via **print-stacking technology**.

| Site | Domain | Purpose |
| ---- | ------ | ------- |
| [`sites/haipnet`](sites/haipnet) | **haipnet.com** | The company — printer manufacturer hosting the manufacturing network & IP platform |
| [`sites/flexofab`](sites/flexofab) | **flexofab.com** | The product line & trademark — FLEXOFAB®, the multi-surface print products |

Both sites cross-link to each other (HAIPNET ↔ FLEXOFAB).

## Features

- **i18n** — English + Simplified Chinese (简体中文), toggled in the header. The choice
  is persisted in `localStorage` and the initial language is auto-detected from the
  browser (`navigator.language`).
- **Responsive** — mobile-first layout with a collapsing nav menu; tested from 360px up.
- **Zero build / zero dependencies** — plain HTML, CSS, and vanilla JS. Drop either
  folder onto any static host (Nginx, S3, Cloudflare Pages, GitHub Pages, Netlify…).
- **Accessible** — semantic landmarks, skip link, `aria` labels, keyboard-friendly nav,
  and `prefers-reduced-motion` support.
- **No external runtime calls** except the Google Fonts stylesheet (degrades gracefully
  to a system font stack if blocked/offline).

## Project layout

```
sites/
  haipnet/                 # → haipnet.com
    index.html
    css/styles.css
    js/
      i18n.js              # generic i18n engine (identical across sites)
      translations.js      # HAIPNET copy: { en, zh }
      main.js              # nav, sticky header, reveal-on-scroll
  flexofab/                # → flexofab.com  (same structure)
```

Each site folder is the deployable web root — there is nothing above it to ship.

## Run locally

Any static file server works. From the repo root:

```bash
# Option A — npm scripts (uses npx serve, no install needed)
npm run haipnet     # serves sites/haipnet on http://localhost:4321
npm run flexofab    # serves sites/flexofab on http://localhost:4322

# Option B — Python, no Node required
python3 -m http.server 4321 --directory sites/haipnet
python3 -m http.server 4322 --directory sites/flexofab
```

Then open the printed URL. Use the **EN / 中文** switch in the header to change language.

## Editing copy

All user-facing text lives in each site's `js/translations.js` under `en` and `zh`
keys. The HTML carries the English text inline as a no-JS fallback; keep the two in sync
when you edit. Markup is wired up with:

- `data-i18n="path.to.key"` → element text
- `data-i18n-html="path.to.key"` → element HTML (allows `<br>`, `<strong>`)
- `data-i18n-attr="content:meta.description"` → element attribute(s)

## Brand assets

FLEXOFAB's logo lives in [`sites/flexofab/assets/`](sites/flexofab/assets):

| File | Use |
| ---- | --- |
| `flexofab-mark.png` | Transparent circuit-"FF" monogram — header & footer brand mark |
| `flexofab-favicon.png` | 64px favicon |
| `flexofab-logo.png` | Full lockup (monogram + wordmark) — social `og:image` |

The white background of the supplied artwork was knocked out to transparent so the mark
sits cleanly on both the light header and the dark footer. HAIPNET still uses an inline
SVG "H" mark — drop a real HAIPNET logo into `sites/haipnet/assets/` and wire it the same
way if you have one.

## Notes

- "Chinese" is implemented as **Simplified Chinese**. If Traditional Chinese is
  preferred, translate the `zh` blocks in both `translations.js` files and set the
  toggle/`<html lang>` to `zh-Hant`.
- Replace placeholder contact addresses (`partners@haipnet.com`, `hello@flexofab.com`)
  with real ones before going live.
