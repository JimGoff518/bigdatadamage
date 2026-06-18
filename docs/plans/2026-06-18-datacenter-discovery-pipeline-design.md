# Texas Data-Center Discovery Pipeline — v1 Design

**Date:** 2026-06-18
**Goal:** Auto-discover new Texas data-center *projects* and surface them as reviewed pins on the `/locations` `TexasMap`, using the same human-in-the-loop PR pattern as the content pipeline.

## What already exists (do not rebuild)

- `src/lib/facilities.ts` — the `Facility` type + `getFacilities()` loader. **Validation already rejects** any facility that is not: named, inside the Texas bounding box (`lat`/`lng`), assigned an allowed `status`, and backed by an `https` `sourceUrl`. This is the code-level accuracy/IP guard.
- `src/components/TexasMap.tsx` — renders each facility as a status-colored pin; already on the `/locations` page.
- `src/content/facilities/_example.json` — the per-facility schema/template. One JSON file per facility. Files starting with `_` are ignored.
- **No real facilities exist yet** — the pipeline is what populates `src/content/facilities/`.

## Facility JSON shape (target output)

```json
{
  "name": "Hut 8 AI Data Center",
  "operator": "Hut 8",
  "city": null,
  "county": "Nueces",
  "lat": 27.73,
  "lng": -97.51,
  "status": "proposed",
  "harm": ["water", "air"],
  "sourceUrl": "https://gov.texas.gov/news/...",
  "sourceName": "Office of the Governor announcement",
  "note": "Announced ~$17B AI data center in Nueces County (our summary; see source).",
  "dateFound": "2026-06-18"
}
```

## Sources (v1)

| Source | URL | Role | Tool |
|---|---|---|---|
| Governor's project announcements | https://gov.texas.gov/business/page/recent-project-announcements | **Primary pin feed** — gives company, county, $ | Firecrawl scrape → markdown |
| Comptroller qualifying data centers | https://comptroller.texas.gov/taxes/data-centers/data-center-lists.php | **Enrichment/verification only** (no locations → cannot place pins) | Deferred to v2 |

### Why not TCEQ directly (yet)
TCEQ permit data lives behind search forms and JS map/portal apps — not Firecrawl-friendly. The clean, structured Texas sources are the **Socrata API (data.texas.gov)** for water permits and the **PUC Interchange #58481** large-load filings; both are v2 enrichment, not v1 pin sources.

## Pipeline flow (n8n)

1. **Schedule (weekly)** + **manual trigger**
2. **Firecrawl Scrape** — `POST https://api.firecrawl.dev/v1/scrape`, body `{ "url": "<governor URL>", "formats": ["markdown"] }`, header `Authorization: Bearer <FIRECRAWL_KEY>`
3. **Gemini extract** (reuse existing Gemini setup) — prompt returns a JSON array, **filtered to data-center / AI / hyperscale / computing projects only**, each `{ company, projectType, county, investmentText, isDataCenter }`. Prompt must instruct: summarize in our own words, never copy source text.
4. **Geocode (Code node)** — fetch `pipeline/texas-county-centroids.json` from GitHub raw; map `county` → `[lat, lng]`. Build the facility object: `status: "proposed"`, factual `note` in our own words, `sourceUrl` = the Governor page, `sourceName`, `dateFound`. **County not in lookup → route to a "needs manual coords" branch (PR comment), never guess.**
5. **Dedupe** — GitHub "get contents" on `src/content/facilities/<slug>.json`; skip if it already exists.
6. **GitHub PR + email-to-review** — reuse existing branch/commit/PR/approve-webhook machinery, targeting `src/content/facilities/<slug>.json`. Approved PR → Vercel deploy → new pin.

## Geocoding

- Decision: **county-centroid lookup** (free, no API, no rate limits). Lives at `pipeline/texas-county-centroids.json` (~80 seed counties). Expand via PR.
- Unknown county → flagged for manual coordinates; never placed at a guessed point.

## IP / accuracy guardrails (carry-over of site rules)

- Only **public-record facts** (government announcements/filings). Original wording only — Gemini summarizes, never reproduces.
- Every pin carries a working `sourceUrl`; the loader drops any that don't.
- Human approves every PR before it goes live.

## Out of scope for v1 (later)

- Comptroller operator enrichment, Socrata water-permit join, PUC interconnection filings, street-level geocoding, a tabular tracker page alongside the map.
