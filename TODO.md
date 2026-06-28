# BigDataDamage.com — TODO / Roadmap

Running backlog of features and ideas not yet built. Newest decisions at top.

## Launch tasks (owner action)

- [ ] **Lead email (most important):** in Vercel → Settings → Environment Variables, set
  `RESEND_API_KEY` (from resend.com), `LEAD_EMAIL=jim@gofflawdfw.com`, and
  `LEAD_FROM=Big Data Damage <onboarding@resend.dev>`, then redeploy and submit a test form to
  confirm the email arrives. Until done, form leads are not captured (tap-to-call still works).
- [ ] **SEO kickoff:** in Google Search Console, submit `sitemap.xml` and use URL Inspection to
  request indexing on the top ~10 pages.
- [ ] **Upgrade Vercel Hobby → Pro** (~$20/mo) for commercial-use compliance.

## Backlog

### Laredo / "Data City" follow-ups (added 2026-06-28)
Webb County / Laredo location shipped LIVE to the map (`slug: laredo`, commit c687a40). Facts
verified — see memory `ref-laredo-data-city`. Remaining work:

- [ ] **Verify the live page** at `/locations/laredo` once the Vercel deploy lands.
- [ ] **Flesh out the location page** beyond the one-line intro (ties to the "Harden location
  pages" backlog item): nearby/planned facilities, Webb County/Rio Grande water specifics,
  related reporting, next-step CTA.
- [ ] **Content opportunity — the "accountability gap":** a 50,000-acre data campus proposed in a
  city with ~hours of stored water and **no disclosed water-use figure**. Strong BDD-positioned
  story (ties to fair-share/disclosure reform recs, `ref-datacenter-water-policy`). Could be an
  article and/or a `/legislation` entry. Original words + link-out only (IP constraint).
- [ ] **Add Laredo local TV coverage embeds** (per the location-embeds pattern) when official
  KGNS/Border-market clips are found.
- [ ] **Pin specifics when filings surface:** exact parcel/location within Webb County, project
  water demand (currently NDA), financing/groundbreaking status — and flip `hot: true` if Data
  City breaks ground.

### YouTube video embeds — DONE, awaiting content (2026-06-14)
Reusable lazy `VideoEmbed` component is built & verified (typecheck/lint/build green). Works on
any page; cookie-less youtube-nocookie, click-to-load facade (SEO/Core-Web-Vitals friendly).
- Files: `src/components/VideoEmbed.tsx`, `src/lib/youtube.ts`; wired into `next.config.ts`,
  `src/lib/articles.ts` (new `video:` frontmatter field), and `articles/[slug]/page.tsx`
  (featured video + inline auto-embed of bare YouTube URLs).
- Usage: any page → `<VideoEmbed url="https://youtu.be/ID" title="..." />`; article top →
  `video: "..."` in frontmatter; article body → paste a YouTube URL on its own line.
- **Pending:** user is sourcing YouTube URLs. When ready, decide which pages get videos
  (e.g. homepage hero explainer, per-county video on location pages) and supply URLs.
- **Optional follow-up:** add a `video` field to location/topic data so location pages auto-show
  their own video when one exists.

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
