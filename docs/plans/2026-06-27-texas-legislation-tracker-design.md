# Texas Legislation Tracker — Design

_Date: 2026-06-27_

## Goal

Add a tracker to BigDataDamage.com for Texas **legislation** affecting data centers,
water, and landowner rights, surfaced to readers as plain-English summaries that link
out to the official record.

## Scope (decided)

**Strictly legislation: bills, statutes, and local ordinances.** Court rulings and
agency actions are explicitly **out of scope** (different branch of government). This
keeps the page honestly named. Trade-off accepted: the page launches lean because Texas
has no regular session until **2027** (the 89th was 2025; we are in the interim).

- In scope now: 2025 (89R) data-center / water statutes + local ordinances/moratoriums.
- Fills in as 2027 bills are filed.

## Positioning & IP guardrails

- Frame on accountability + landowner protection, **not** opposition to technology.
- **Link-out only.** Summaries are our own words; never republish source text.
- Page carries a "general information, not legal advice" note.

## Data model

One JSON file per entry in `src/content/legislation/`, loaded by `src/lib/legislation.ts`,
mirroring the facilities pattern. Files prefixed `_` are templates and never render. The
loader rejects any entry missing a title, summary, valid category/status, or a public
`sourceUrl` — the code-level "never assert unsourced" guard.

Fields: `category` (bill | statute | ordinance), `title`, `billNumber?`, `session?`,
`jurisdiction?`, `status` (filed | in-committee | passed | signed | enacted | in-effect |
adopted | failed), `chamber?`, `harm?` (reuses water/air/property), `summary`,
`whyItMatters?`, `sourceUrl`, `sourceName?`, `lastAction?`, `lastActionDate?`,
`legiscanId?` (pipeline dedup/update key), `dateFound?`.

`LEGISLATION_STATUS_META` and `LEGISLATION_CATEGORY_META` give badge labels + colors,
parallel to `FACILITY_STATUS_META`.

## Rendering

`/legislation` server page, grouped into sections by category (Bills / Enacted laws /
Local ordinances). **Empty categories auto-hide** so the sparse interim page never shows
a blank section. Each entry is a `LegislationCard` (in `cards.tsx`): colored status badge,
bill number + session (or jurisdiction), title, summary, "Why it matters", harm tags
(cross-linking to `/damage/*`), and a "View the official record →" outbound link. **No
detail pages in v1** — cards link out to the authoritative source (IP-safe, less to build).
Per-entry schema.org `Legislation` JSON-LD for GEO/AI-search. Nav entry added via
`src/lib/site.ts` (feeds header + footer).

## Phase 1 (this PR) — the site

- `src/lib/legislation.ts`, `src/content/legislation/` (`_example.json` + seeds),
  `LegislationCard`, `/legislation` page, nav entry.
- Seed entries (sourced + verified): **SB 6** (large-load interconnection), **HB 49**
  (produced water reuse + liability), **SB 7** (water-supply financing), **SB 1583**
  (groundwater district management plans), **Hill County** (1-year data-center pause).

## Phase 2 (later) — automation

Two n8n flows, mirroring existing pipelines, each opening a reviewed GitHub PR:

1. **LegiScan bill tracker (authoritative).** Weekly LegiScan API search of TX bills by
   keyword (data center, groundwater, aquifer, water rights, eminent domain, transmission,
   GCD) → `getBill` for status/chamber/last action → Gemini summarizes in our words →
   dedup by `legiscanId` → PR writing a `statute`/`bill` JSON → email to review. Reuses the
   existing approve webhook. Free LegiScan key stored as an n8n `$vars`/credential.
2. **Policy radar (leads only).** Weekly Google News RSS for TX data-center legislation /
   local ordinances → Gemini keeps genuine developments → emails leads. Writes **no**
   tracker entries; we curate local-ordinance entries from leads. Keeps unverified news off
   the page.

## Fact-check gate

Every Phase-2 PR (and these Phase-1 seeds) goes through the Claude + Descrybe verification
before approval: confirm each statute/ordinance is described accurately and is sourced.
The risk is concentrated in describing a statute's *effect* — pure reporting, verified.
