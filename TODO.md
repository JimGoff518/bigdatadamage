# BigDataDamage.com — TODO / Roadmap

Running backlog of features and ideas not yet built. Newest decisions at top.

## Backlog

### Realtime "Breaking Data Center News" ticker (deferred 2026-06-14)
Live "Recent Updates" feed of breaking Texas data-center news (eventually filterable by county).

- **Decision:** Plan on **free Google News RSS + GDELT**, **link-out only** (headline + source +
  date + link). Realtime news is a solved free problem; queries like "Texas data center water",
  "eminent domain 765 kV Oncor", or per-county searches return live results with no API key / no
  per-call cost. Fetch at build time or via a lightweight serverless route.
- **Why NOT just-scrape / ScrapeGraphAI for this:** it's a CLI wrapper around a *paid* cloud
  scraper API (key + per-call cost, Node 22/Bun), general-purpose, no news features — pays to do
  worse than RSS. It's also a CLI/cron job, not a website feature (our site is static-ish on
  Vercel). And scraping + re-hosting article *content* is a copyright risk (worse for an attorney
  site) — link-out via RSS avoids it. Repo: https://github.com/ScrapeGraphAI/just-scrape
- **Where ScrapeGraph COULD earn its keep (separate, later):** structured extraction from pages
  with no feed — TCEQ water-permit filings, ERCOT interconnection queue, county commissioner
  agendas. That's the "Recent Updates by County" *data layer*, distinct from a news ticker.
- **Status:** Deferred. Ticker = RSS/GDELT when built; ScrapeGraph = maybe for TCEQ/ERCOT scrapes.

### Texas Data Center Map (deferred 2026-06-14)
Interactive map of Texas data centers so a landowner can see what's operating/planned
near their property, framed around harm + their legal options (feeds the County Impact
Report funnel).

- **Reference:** Cleanview (https://cleanview.co/data-centers/texas) already has a strong
  Texas map — blue = operating (90 / 5,250 MW), orange = planned (165 / 94,034 MW), marker
  size = capacity; per-facility name, MW, year online, city/county, developer. Map + summary
  stats are free to view; full data behind paid trial. **No public embed / free API** (their
  API is a paid licensed product; terms won't allow scrape + re-host).
- **Paths considered:**
  1. Link out to Cleanview's free explorer — zero build, but sends our traffic away and
     isn't framed for landowners. (weakest)
  2. **Build our own map** from free public data (ERCOT interconnection queue, TCEQ permits,
     county filings, news) — our SEO asset, landowner/harm framing, feeds funnel.
     **(recommended)**
  3. License Cleanview's API and render in our own UI — fastest to rich data, recurring cost,
     dependent on their terms for lead-gen use.
- **Status:** Deferred. Revisit and pick a path before scoping.
