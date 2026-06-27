# Design — Texas Water-Service-Area Overlay on an Interactive Map

**Date:** 2026-06-27
**Status:** Approved design, not yet implemented
**Goal:** Replace the static SVG Texas map with a real interactive (MapLibre) map that shows USGS public-supply water-service-area polygons as a toggleable overlay beneath the existing data-center facility pins — visually proving data centers sit inside community water-supply areas.

---

## Decisions (locked)

| Choice | Decision | Why |
|---|---|---|
| Map library | **MapLibre GL JS** | Matches the IMMM-SFA data's vector-tile format; native WebGL rendering + native layer toggling (`setLayoutProperty` visibility). |
| Basemap | **CARTO Positron** (vector GL style, no API key) | Best-looking light basemap; matches the Golden-Hour theme. Requires "© CARTO © OpenStreetMap" credit — acceptable to the user. |
| Water data source | **USGS ScienceBase DOI [10.5066/P9I22Z24](https://doi.org/10.5066/P9I22Z24)** — "Public-Supply Water Service Areas Within the Conterminous United States, 2017" (`WSA_v1` shapefile) | U.S. federal data = **public domain**, no license/attribution barrier. USGS citation added as good practice. |
| Data already on disk | `C:\Users\jim\OneDrive\Documents\Fight For Water\For Maps\WSA_v1.shp` (316 MB, national) | User downloaded + unzipped; no 124 MB re-download needed. (`v1_GU_wWS` = building-block units, not used. CSV tables = reference, not geometry.) |
| County overlay | **Deferred to Phase 2** using `github.com/texas/maps` | CARTO basemap already shows county lines; a clickable county→county-page overlay is a future enhancement. |

### Data facts
- **Projection:** `NAD_1983_Contiguous_USA_Albers` (EPSG:5070, meters). Must reproject to **WGS84 (EPSG:4326)** for the web map — mapshaper does this from the `.prj`.
- **Texas is the #1 state** by water-service-area in this dataset (Table 2: 46,591 sq-units), so the clipped file is heavy → the **simplify step matters**; target ~1–4 MB. AWS S3 is the fallback host if it won't shrink enough.
- **Open item:** read the actual `WSA_v1.dbf` attribute column names at build time (the data dictionary only documents the CSV tables) to pick popup fields (water-system name, PWS ID). Key field from Table 5: `WSA_AGIDF` (unique aggregate WSA id).

### IP / licensing
- Water polygons: USGS public domain. ✅
- Basemap: CARTO + OSM, attributed in-map. ✅
- We take the *source* (USGS) directly — **no dependency on the proprietary-licensed ringmast4r repo** (All Rights Reserved — rejected) and **no reliance on IMMM-SFA's BSD code** (we only learned the source from it). ✅

---

## Section 1 — Data pipeline (one-time, offline, repeatable)

A small Node script (`scripts/build-water-service-areas.mjs`) using **mapshaper**:
1. Read local `For Maps/WSA_v1.shp`.
2. **Reproject** Albers (EPSG:5070) → WGS84 (EPSG:4326).
3. **Clip to Texas** using the `TX_BOUNDS` box already defined in `src/lib/facilities.ts` (minLat 25.5, maxLat 36.7, minLng -107.0, maxLng -93.3).
4. **Simplify** geometry (Visvalingam) to shrink vertex count; tune to keep output ~1–4 MB.
5. **Keep only useful fields** (name/operator/PWS id/`WSA_AGIDF` + population if present).
6. Output → `src/content/geo/texas-water-service-areas.geojson` (committed static asset).
7. Script committed so it's re-runnable when USGS updates WSA.

---

## Section 2 — Component architecture

Split server/client so the build-time data guard stays server-side and only the browser-required code is client-side.

- **`src/components/TexasMap.tsx` — stays a server component.** Calls `getFacilities()` at build, converts facilities + city markers (`locations`) into plain GeoJSON, passes them as props. The "never render an unsourced pin" validation in `facilities.ts` is untouched.
- **`src/components/TexasMapClient.tsx` — NEW** (`"use client"`, loaded via `next/dynamic` with `ssr: false`). Receives facilities GeoJSON as props; creates the MapLibre map; loads CARTO Positron; adds the water overlay from `texas-water-service-areas.geojson`; adds facility + city layers on top; renders legend + toggle.

**Runtime layer stack (bottom → top):** CARTO basemap → water-service areas → facility pins → city pins.

**Consequence:** the hand-rolled SVG projection + cartoon Texas outline in the current `TexasMap.tsx` are removed. Facility/city *data* carries over unchanged; only rendering swaps.

---

## Section 3 — Toggle UX, legend & attribution

- **Controls:** small panel, top-right. v1 toggles: **Water service areas** (default on) and **Data centers** (default on). Checkboxes flip MapLibre layer `visibility`.
- **Water styling:** semi-transparent blue fill + thin blue outline so pins and labels read through. Story = pins sitting inside blue water areas.
- **Interactivity:** click water polygon → popup (name/operator); click pin → name, status, link to facility/location page (carries over today's tooltip behavior).
- **Legend:** reuses `FACILITY_STATUS_META` status colors + a water-area swatch.
- **Attribution:** MapLibre built-in control shows "© CARTO © OpenStreetMap"; append USGS citation.
- **Accessibility:** real labeled checkboxes; color never the only cue (every layer labeled), matching the existing a11y bar.

---

## Section 4 — File-by-file changes & verification

**New files**
- `scripts/build-water-service-areas.mjs` — mapshaper clip/reproject/simplify (Section 1).
- `src/content/geo/texas-water-service-areas.geojson` — generated output (committed).
- `src/components/TexasMapClient.tsx` — the MapLibre client component.

**Modified files**
- `package.json` — add `maplibre-gl` dependency; add `"build:water"` script; add `mapshaper` as devDependency.
- `src/components/TexasMap.tsx` — becomes the server wrapper: builds facilities/cities GeoJSON, dynamically imports `TexasMapClient` with `ssr:false`, passes data + legend meta as props.
- (maybe) `src/lib/facilities.ts` — small helper to emit facilities as GeoJSON, if cleaner than inlining in the component.
- Import MapLibre CSS (`maplibre-gl/dist/maplibre-gl.css`) in the client component or global styles.

**Verification (before deploy)**
1. Run the data script; confirm `texas-water-service-areas.geojson` exists and is ~1–4 MB (AWS S3 fallback if larger).
2. `npm run dev`; load the map page — confirm CARTO basemap tiles render, water polygons appear in blue, facility pins sit on top.
3. Toggle each layer on/off; confirm visibility flips.
4. Click a water polygon (popup) and a pin (link works).
5. Confirm attribution shows CARTO + OSM + USGS.
6. `npm run build` passes (no SSR/window errors from MapLibre).
7. Check page weight / bundle is acceptable, then deploy (push main → Vercel).

> ⚠️ Per `bigdatadamage/AGENTS.md`: this is a modified Next.js — read the relevant guide in `node_modules/next/dist/docs/` before writing code (esp. for `next/dynamic` + `ssr:false` and client components).

---

## Phase 2 (future, user-requested) — County overlay

- Add a **county-boundary overlay** as a third toggle, sourced from **`github.com/texas/maps`** (evaluate that repo + `Cincome/tx.geojson` + the ThomasThoren gist when starting Phase 2).
- Make counties **clickable → jump to that county's location page**, leveraging the site's county-based content structure.
- Same pipeline pattern: clip/simplify to a committed GeoJSON, add as a MapLibre layer with a toggle.
