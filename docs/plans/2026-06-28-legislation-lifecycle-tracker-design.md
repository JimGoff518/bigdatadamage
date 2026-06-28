# Legislation Lifecycle Tracker — Design

_Date: 2026-06-28_

## Goal

For each tracked item on `/legislation`, show **where it sits in the legislative
lifecycle** as an animated tracer line — completed stages fill in, the current stage glows, and an
item that died stops at a red marker. Inspired by UW's LegEx ("tracers" + dramatizing that most
bills die). Leans into BDD's accountability angle: a landowner-protection bill that **died in
committee** tells the story at a glance.

## Stage model (two tracks)

Faithful to the Texas "how a bill becomes law" flow, flattened to one canonical line.

- **Bill / statute track (8):** Filed → Committee → 1st chamber → 2nd chamber → Conference →
  Enrolled → Governor → Law. A statute is just a completed bill (ends at Law).
- **Ordinance track (4):** Proposed → Hearing → Vote → Adopted.
- **Terminal:** `status: "failed"` marks the item as died/rejected at its current stage (red).

Stages, labels, and one-line blurbs live in `BILL_TRACK` / `ORDINANCE_TRACK` in `src/lib/legislation.ts`.

## Placement (both)

- **Card:** a compact tracer line + a one-line caption ("Stage 2 of 8 · Committee"). Scannable.
- **Detail page (`/legislation/[slug]`, new):** the tracer plus a full stage list with blurbs,
  the summary, why-it-matters, harm tags, the official-record link-out, and `Legislation` JSON-LD.
  The card now links **in** to this page; the page links **out** to the source.

## Data

Two optional fields per item: `stage` (an explicit track key, e.g. `"committee"`) and `stageNote`
(a one-line caption). When `stage` is absent, the position is **derived** from the existing coarse
`status` (filed→Filed, in-committee→Committee, passed→2nd chamber, signed→Governor,
in-effect→Law, adopted→Adopted; failed→died, defaulting to committee). So **existing entries need
no rework** — the 5 seeds all derive to "complete" (they're enacted), and partial progress appears
when we track a live bill. `getLifecycle(item)` returns `{ track, currentIndex, terminal }`.

## Implementation

- **`LifecycleTracker`** (`src/components/LifecycleTracker.tsx`) — a **server component**, no client
  JS. The fill width is an inline `--fill` custom property; CSS `@keyframes lifecycle-fill` animates
  `0 → var(--fill)` once on load, and the current dot pulses. `prefers-reduced-motion` shows the
  resting filled state (no animation). Accessible: `role="img"` + summary aria-label. CSS in
  `globals.css`. Golden-Hour theme: done/current = `--color-orange`, died = `--color-danger`,
  upcoming = `--color-line`.
- Files: `legislation.ts` (stage model + `getLifecycle` + `getLegislationItem` + `stage`/`stageNote`
  fields), `LifecycleTracker.tsx` (new), `globals.css` (tracker CSS), `cards.tsx` (compact tracker +
  card now links to detail), `legislation/[slug]/page.tsx` (new detail page).

## Notes

- IP-safe: still our own words + link-out; the tracker is derived facts, no republished text.
- All 5 current seeds show **complete** tracks (they're enacted) — partial-progress drama begins with
  the next live bill curated mid-session.
