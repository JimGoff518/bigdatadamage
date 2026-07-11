# Data-Center Litigation Tracker — Design

**Date:** 2026-07-11
**Status:** Approved, ready for implementation
**Route:** `/litigation` (alias `/cases` may redirect)

## Purpose

A public tracker of lawsuits involving data centers, modeled on the copyright
case tracker at chatgptiseatingtheworld.com — but built for BDD's lane:
**Texas + legal remedy**. It is the missing sibling to the two existing
trackers:

- `/locations` — where the data centers are (facilities + water overlays)
- `/legislation` — the laws (bills / statutes / ordinances), deliberately
  walled off from court rulings
- `/litigation` — **the court fights** (this design)

Cross-linking the three makes the site read as one authoritative system:
locations ↔ legislation ↔ litigation.

### Why we curate manually (not an auto-feed)

The copyright tracker advertises "Curated daily · Sources: CourtListener,
PACER" because **copyright is 100% federal jurisdiction** — every suit lands in
federal court, which CourtListener/PACER/RECAP index cleanly. Our cases are the
opposite: nuisance, noise, zoning, water, and ratepayer disputes are
overwhelmingly **state** court (often county-level in Texas), where no free
unified feed exists. CourtListener only covers the federal subset (Clean
Air/Water Act citizen suits, some enforcement, diversity cases).

So the engine is **manual curation** — one JSON file per case, sourced-or-it-
doesn't-render, exactly like `legislation.ts`. We *cite* CourtListener / PACER /
county dockets as per-case sources, which earns the same credibility line
without pretending a state-court auto-feed exists. A CourtListener pull for the
federal environmental subset is a possible Phase 2, not required for launch.

## Scope

**Texas-first, national as context.** Texas cases featured and grouped by
category up top; a thinner "National landmark cases" section below for
precedent/credibility (`national: true` entries).

### Categories (five)

| key | label | intake lane? |
|-----|-------|--------------|
| `nuisance` | Nuisance / noise / property | **Yes** (Goff CTA) |
| `water` | Water (groundwater, wells, produced water) | **Yes** (Goff CTA) |
| `zoning` | Zoning / permitting / land use | No |
| `environmental` | Environmental / regulatory (air, TCEQ, citizen suits) | No |
| `utility` | Electricity / utility (ratepayer, PUC, grid cost-shifting) | No |

## Data model

New `src/lib/litigation.ts`, mirroring `legislation.ts`. One JSON file per case
in `src/content/litigation/`. Files starting with `_` are templates, never
rendered. The loader refuses any entry not titled, summarized, categorized,
status-typed, and backed by a public `sourceUrl` — the code-level "never assert
unsourced" guard.

Per-case fields:

- `slug` (from filename), `category` (one of the five)
- `caption` — e.g. *Smith v. Vantage Data Centers*
- `court` — e.g. "Hood County District Court, 355th"
- `docketNumber`, `jurisdiction` (state/federal + county), `filedDate`
- `status` — litigation lifecycle (below); `harm[]` reuses water/air/property taxonomy
- `parties` (plaintiff / defendant), `dataCenterOperator`, `county` (links to `/locations/[slug]`)
- `summary` (plain English, our words), `whyItMatters`, `reliefSought` (damages / injunction / permit denial)
- `sourceUrl` + `sourceName`, `docketUrl` (CourtListener/county portal)
- `lastAction`, `lastActionDate`, `dateFound`
- `national: true` — routes landmark out-of-state cases to the national section
- optional `stage`, `stageNote`, `stageDates` (explicit lifecycle overrides)

## Litigation lifecycle tracer

Reuses the `/legislation` golden-hour stage-tracer component with a litigation
track:

`Filed → Answer → Discovery → Motions (MSJ/plea) → Trial → Judgment → Appeal → Resolved`

Terminal off-ramps (honest endings, not "everything goes to trial"):

- **Settled** — distinct green terminal (most common real ending)
- **Dismissed** — terminal, dim
- **Voluntarily nonsuited** — terminal, dim (common in TX)

Status → stage derived via a `deriveIndex()`-style map; overridable per case
with an explicit `stage` key and optional `stageNote` ("Plea to the
jurisdiction pending"). Golden-hour color ramp: cool "filed" → warm "trial" →
green "resolved/settled".

Payoff the copyright tracker lacks: a visual **posture at a glance**, and — once
cases resolve — an **outcomes signal** ("this is what happens when landowners
sue"). That is intake evidence nobody else has for data centers.

## Accuracy / ethics guardrails

- State only what the **public docket/filing says**: captions, dates, claims
  asserted, rulings entered. No characterizing the merits, no predicting
  outcomes, no implying a defendant is liable before judgment.
- Sourced-or-it-doesn't-render (loader guard), same as legislation.
- IP-safe: original words only, link-out to dockets/coverage, no copied text.

## Page layout

### `/litigation` index (mirrors `/legislation`)

- Header + one-line scope statement + sources line ("Tracking Texas data-center
  litigation · Sources: county dockets, CourtListener, PACER, public court
  records").
- **Texas cases first**, grouped by the five categories. Card = caption, status
  badge, court, county, operator, one-line summary, last action + date.
- **National landmark cases** section below (`national: true`), thinner treatment.
- Optional client-side filter chips by category/status — match whatever
  `/legislation` does, no new deps.

### `/litigation/[slug]` detail (mirrors `/legislation/[slug]`)

- Lifecycle tracer up top.
- Full summary, `whyItMatters`, relief sought, parties/court/docket metadata,
  source link-out(s).
- Where `county` matches, link to that `/locations/[slug]` and any related
  `/legislation` items.

### Intake integration (ethics-safe)

- **Only** `nuisance` and `water` detail pages carry a soft Goff CTA — framed
  *"Facing similar harm on your land? Talk to a Texas attorney"*, not "join this
  case." Link-out to gofflawdfw.com (BDD stays walled off, no embed).
- `zoning` / `environmental` / `utility` stay informational, no CTA.

## Reuse summary

~90% of the legislation architecture:

- `litigation.ts` ≈ `legislation.ts` (loader + guard + category/status meta + lifecycle)
- `/litigation/page.tsx` ≈ `/legislation/page.tsx`
- `/litigation/[slug]/page.tsx` ≈ `/legislation/[slug]/page.tsx`
- Lifecycle tracer component reused with a new track array.

## Phase 2 (not required for launch)

- CourtListener API pull for the federal environmental subset, drafting entries
  as reviewed PRs (like the LegiScan bills flow).
- News-radar n8n assist scanning legal news for new filings.
