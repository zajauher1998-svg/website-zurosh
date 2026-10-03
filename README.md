# Zurosh Enterprises — website

Static website for Zurosh Enterprises (telecom and construction, Pakistan). There's no build step and no framework. Upload the folder to any static host (GitHub Pages, Netlify, cPanel, etc.).

## Pages
| File | Content |
|---|---|
| `index.html` | Home. A 3D voxel **Z** rotates as you scroll, breaks into pixels and re-forms into a split globe (two sectors), a 5G tower, buildings, and finally the Z again. |
| `telecom.html` | Sector 01: FTTH, 5G tower infrastructure (site acquisition → handover lifecycle), consultancy. |
| `construction.html` | Sector 02: residential units, commercial plazas, design & build process. |
| `about.html` | Company overview (uses the stacked logo). |
| `contact.html` | Sector-aware enquiry form (opens the visitor's email app). |

The "Our Sectors" dropdown is a two-panel mega menu: **Telecom** (navy) and **Construction** (light/gold), kept visually separate. Moving between pages plays a navy/gold pixel transition.

## Logos
- `assets/img/zurosh-logo-horizontal.svg`: header on every page.
- `assets/img/zurosh-logo-stacked.svg` / `-white.svg`: limited use only (footer, About, Contact).
- `assets/img/z-mark.svg`: Z mark. The 3D model in `assets/js/pixel-stage.js` uses the same coordinates.

## Editing content
The header, mega menu and footer are shared, so the pages are generated from `tools/build_pages.py`:

```bash
python3 tools/build_pages.py
```

Edit the text in that script and re-run it. Don't hand-edit the generated `.html` files, or your changes will be overwritten the next time the script runs.

**Before going live, update these placeholders at the top of `tools/build_pages.py`:** `EMAIL`, `PHONE`, `CITY` (office address).

## Preview locally
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Tech
- three.js r160 is bundled locally in `assets/vendor/` (MIT licence included), so there's no CDN dependency.
- Without WebGL, the static Z mark is shown instead. With `prefers-reduced-motion` set, the bursts, idle motion and page transitions are turned off.
