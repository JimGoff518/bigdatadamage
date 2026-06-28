# CARTO impact data

Computes the data-center / water-exposure figures the site renders, using CARTO
as an offline spatial-analysis engine. Output is committed JSON
(`src/content/impact/*.json`); nothing CARTO-dependent runs at build or visitor
time.

## What it produces

- `statewide.json` — headline figures (total data centers, # inside public water
  districts, population served by those districts, # on private wells).
- `by-county.json` — per-county breakdown (counts by status, affected districts,
  population in affected districts), keyed by county name.
- `by-facility.json` — per-facility flags (in a water district? which one? its
  population served), keyed by facility slug.

Consumed via [`src/lib/impact.ts`](../../src/lib/impact.ts); rendered by
[`src/components/ImpactStats.tsx`](../../src/components/ImpactStats.tsx).

## Inputs (in `carto_dw`)

| Table | Source | Loaded |
|---|---|---|
| `shared.data_centers` | `src/content/facilities/*.json` | regenerated each run |
| `shared.texas-water-service-areas` | USGS WSA_v1 (DOI 10.5066/P9I22Z24) | static, already loaded |
| `shared.tx_counties` | US Census county boundaries | static, already loaded |

All inputs are public domain — safe to cite next to legal content.

## Regenerate

Prerequisites: CARTO CLI installed and authenticated.

```bash
npm i -g @carto/carto-cli      # one-time
carto auth login               # one-time (browser)
npm run build:impact           # consolidate -> import -> analyze -> export
```

`build:impact` runs [`build-impact-data.mjs`](./build-impact-data.mjs), which
consolidates the facilities, imports them, runs
[`impact-analysis.sql`](./impact-analysis.sql), and exports the three JSON files.
Re-run whenever the facility set changes, then commit the updated JSON.

## Methodology notes

- A data center "in a water district" = its point falls inside a USGS
  public-supply water-service-area polygon (`ST_INTERSECTS`).
- Population served counts each affected district **once** (no double-counting
  when a district hosts multiple data centers).
- Per-county population sums the distinct districts whose data centers sit in
  that county; a district spanning two counties is counted in each.

Full design: [`docs/plans/2026-06-27-carto-impact-analysis-design.md`](../../docs/plans/2026-06-27-carto-impact-analysis-design.md).
