# CARTO Impact Analysis — Design

**Date:** 2026-06-27
**Status:** Validated design, ready for implementation plan
**Author:** Jim Goff + Claude

## Purpose

The site has a polished, accessible, IP-clean map at `/locations`
([TexasMapClient.tsx](../../src/components/TexasMapClient.tsx)) but **no computed
analysis surfaced anywhere** — no "X data centers sit inside water districts
serving Y people," no per-county impact numbers on county/article pages.

This project uses CARTO as an **offline analysis engine** to compute real impact
metrics from public-domain data, export them as committed JSON, and render them
statically across the site. It serves the core BDD positioning: communities and
landowners harmed (water, land, quiet enjoyment) → just compensation.

It does **not** rebuild the existing map (that would be a lateral move). The map
stays; this adds the numbers beside it.

## Decisions (validated via brainstorming)

| Decision | Choice | Why |
|---|---|---|
| Direction | Tier 2 analysis (not a map rebuild) | Map already exists & works; analysis is what's missing |
| Metrics | All four (below) | Coherent story: exposure + who's affected + how close + where |
| Delivery | Committed JSON, static render | Matches static-Vercel + PR-deploy model; no public token, no runtime cost |
| Execution | CARTO Workflow, driven via CLI | Repeatable as data centers are added; n8n-triggerable later |
| Demographics | Data Observatory **public/free** only | Hard cost/IP rule; never subscribe premium without explicit sign-off |
| Counties | Import existing repo GeoJSON | Already on disk, Census public-domain, IP-clean, no new dependency |
| Buffer radius | **5 miles** | "Who lives near these" net |

## Metrics

1. **Water-district exposure** — # data centers inside public water-service
   areas; total population served by affected districts (the ~6.8M headline).
   Statewide + per-county.
2. **Per-county breakdown** — per county: # data centers (total + by status),
   # affected water districts, population in those districts, people within
   buffers.
3. **Proximity / buffer** — population within a **5-mile** ring of each data
   center (plain distance buffer = free; no LDS isoline credits).
4. **Demographic enrichment** — free Census/ACS population + median income near
   each facility, from the Data Observatory public catalog.

## Architecture & data flow

```
SOURCE DATA (carto_dw)                 CARTO Workflow (CLI)
  water_service_areas  (have it)  ──┐   spatial join · 5mi buffer
  data_centers   (import ~80)     ──┼─▶ enrich (free DO demo) ──▶ OUTPUT TABLES
  tx_counties    (import repo)    ──┤   aggregate                  impact_by_facility
  demographics   (free DO)        ──┘                              impact_by_county
                                                                   impact_statewide
                                          │ export (CLI) → JSON
                                          ▼
                        src/content/impact/{statewide,by-county,by-facility}.json  (committed)
                                          │ static import at build
                                          ▼
                        /locations · county/article pages · facility pages
```

Properties: single source of truth for numbers is committed JSON (diff-able in
PRs); re-run is `import → workflow run → export → commit`; later n8n triggers the
Workflow API and opens the PR (same muscle as the content pipeline); the existing
map is untouched.

## Data prep (in `carto_dw`)

1. `water_service_areas` — ✅ already in `carto-dw-ac-iq24z7xp.shared`
   (2,234 polygons; `tpopsrv`, `wsa_sqkm`). Verified: SUM(tpopsrv)=17,085,846.
2. `data_centers` — consolidate `src/content/facilities/*.json` into one GeoJSON
   (point from `lat`/`lng`; carry name/operator/county/city/status/sourceUrl) and
   `carto import`. **Repo stays source of truth**; this is a regenerated export.
3. `tx_counties` — `carto import` the existing
   [public/geo/texas-counties.geojson](../../public/geo/texas-counties.geojson)
   (195 KB, Census public domain).
4. `demographics` — one **free public** DO layer (verify free + TX coverage +
   has population/income before wiring). `carto do search --license public`.

## Output → site integration

Three JSON files in `src/content/impact/`, read at build (static import):
- `statewide.json` — headline figures → stat band on `/locations`.
- `by-county.json` — keyed by county name (standardized to match `NAMELSAD`/
  `NAME` used by the map) → county/article page stat blocks.
- `by-facility.json` — keyed by facility slug → facility detail pages.

A small typed helper `lib/impact.ts` so pages pull numbers type-safely and a
missing county degrades gracefully (no number, not a crash).

Every rendered stat carries **"as of [date]" + "Source: USGS / US Census,
analysis by BigDataDamage"** for provenance next to legal content.

## Risks & edge cases

- **Buffer math** — 5-mile rings as true geography (meters, EPSG:4326), not flat
  degrees.
- **Double-counting** — statewide population unions the rings before summing;
  affected-district population counts each district once even with multiple DCs.
- **County name matching** — standardize the `by-county.json` key to the site's
  county naming.
- **Missing coordinates** — facilities lacking `lat`/`lng` excluded + logged.
- **DO layer fit** — verify free + TX coverage + has needed columns; fallback to
  another free layer.

## Cost

Warehouse compute trivial (80 pts × 2,234 polys); DO public = free; buffers free;
storage negligible. Ongoing ≈ **$0** atop existing CARTO subscription. No premium
DO subscription without explicit approval.

## Verification

- Sanity-check output vs. known repo-side figure (~58/79 inside districts, ~6.8M
  served). Divergence → stop and investigate before shipping.
- Spot-check named facilities.
- Build site locally to confirm pages render the numbers.

## Notes

- [AGENTS.md](../../AGENTS.md): this is a non-standard Next.js — read relevant
  `node_modules/next/dist/docs` before writing page/lib code.
- Execution path proven 2026-06-27: CLI v0.8.0 installed, authed as
  jim@gofflawdfw.com (org Goff Law, gcp-us-east1), live spatial query succeeded.
- For any future public-site embed (not needed here): mint a separate
  referer-locked, read-only, table-scoped token — never the all-access claude-mcp one.
