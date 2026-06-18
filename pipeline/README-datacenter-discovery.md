# Data-Center Discovery — n8n setup

Imports the workflow that finds new Texas data-center projects and opens a PR adding
a map pin to `src/content/facilities/`. Mirrors the content pipeline's review flow.

## Files

- `datacenter-discovery.workflow.json` — import this into n8n.
- `texas-county-centroids.json` — county → [lat, lng] lookup the workflow fetches at runtime.

## 1. Import

n8n → **Workflows** → **Import from File** → pick `datacenter-discovery.workflow.json`.

## 2. Find-and-replace the repo owner

The workflow has `REPLACE_OWNER` in 6 node URLs (GitHub + raw centroids). Replace every
`REPLACE_OWNER` with your GitHub username/org (the owner of the `bigdatadamage` repo).
Fastest: open each GitHub/centroids node and fix the URL, or re-export, sed, re-import.

## 3. Attach credentials (n8n will prompt per node)

| Node | Credential type | Value |
|---|---|---|
| Firecrawl: scrape announcements | **Header Auth** | Name `Authorization`, Value `Bearer fc-YOUR_FIRECRAWL_KEY` |
| Gemini: extract data centers | **Query Auth** | Name `key`, Value `YOUR_GEMINI_API_KEY` |
| Get existing facilities / all GitHub nodes | **Header Auth** | Name `Authorization`, Value `Bearer ghp_YOUR_PAT` (PAT needs `repo` scope) |
| Get county centroids | none (public repo) | — if repo is private, reuse the GitHub Header Auth |
| Email nodes | your existing **Gmail OAuth2** | same one the content pipeline uses |

You can reuse the GitHub and Gmail credentials already in your content pipeline.

## 4. Test

Click **Run now (manual)** → **Execute Workflow**. Watch the data flow:

1. Firecrawl returns markdown of the announcements page.
2. Gemini returns a JSON array of data-center projects only.
3. **Parse candidates** → a `candidates` list.
4. **Build facility files** → one item per *new* facility; `placeable:true` ones have lat/lng.
5. Placeable → GitHub branch/commit/PR → review email. Unplaceable (unknown county) → a
   "needs a map location" email so you can add the county to `texas-county-centroids.json`.

Merge a PR → Vercel deploys → the pin appears on `/locations`.

## Notes / tuning

- **Dedupe** is by slug (`company-county-data-center`); a facility already in the repo is skipped.
- **Schedule** is weekly (Tue 7am). Change in the Schedule node.
- **Status** is always `proposed` (announcements = proposed projects). Edit a PR's JSON to bump
  to `permitted` / `under-construction` / `operating` when you have a source.
- If a node errors on import (n8n version differences in param shape), tell me which node and the
  error — most are a one-field fix in the node UI.
- v2 ideas (not built): Comptroller operator enrichment, Socrata water-permit join, PUC #58481
  large-load filings. See `docs/plans/2026-06-18-datacenter-discovery-pipeline-design.md`.
