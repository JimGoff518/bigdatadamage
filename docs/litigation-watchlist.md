# Litigation watchlist — data-center matters to monitor

Matters that are **not yet filed lawsuits** (or not yet verifiable enough to publish), tracked here
so a `/litigation` entry can be curated the moment one ripens into a real, sourceable case. These do
**not** go on the site — the tracker publishes filed litigation only, sourced-or-it-doesn't-render.

Last reviewed: 2026-07-11. The weekly n8n litigation radar (`docs/n8n/bdd-litigation-radar.workflow.json`)
emails fresh leads that belong here or, once confirmed, in `src/content/litigation/`.

## Utility / grid (regulatory — could become litigation)

- **Maryland OPC v. PJM — FERC EL26-63-000** (filed May 7, 2026). Maryland ratepayer advocate says
  PJM's cost-allocation saddles ratepayers with ~$1.6B for transmission serving out-of-state data
  centers. Regulatory complaint, not a court case — watch for appeals of the FERC order.
- **Talen / Amazon Susquehanna — FERC ER24-2172.** FERC rejected the amended interconnection
  agreement for co-located Amazon data-center load at the Susquehanna nuclear plant; rehearing
  deferred. Precedent-setting for co-located load; watch for a court appeal of the final FERC order.
- **Texas PUC — SB 6 large-load rulemaking.** PUCT is writing large-load interconnection and
  transmission cost-allocation rules (final expected ~end of 2026). Rulemaking, not litigation —
  but a contested final rule is the most likely source of a *Texas* utility case. Highest-priority
  watch for our lane. (Ties to SB 6 in `/legislation`.)
- **State PSC rate fights** — Georgia (residential cost-shift investigation), Virginia (new GS-5
  ≥25 MW rate class, 2027 proceeding), Montana/NorthWestern (Sept 2025 tariff complaint). Watch for
  appeals to state courts.

## Water (regulatory / unconfirmed)

- **Arizona defamation suit (April 2026)** — a data-center developer sued activists over statements
  about the project's water use. Water-*adjacent*, not a water-rights case; no verified docket yet.
- **Tucson construction-water diversion** — administrative enforcement over ~650k gallons trucked to
  a data-center project; administrative, not litigation.
- **West Texas bitcoin-mine groundwater claim** — referenced in general coverage but no verifiable
  caption/court/docket found. If a real filing surfaces, this would be our first *Texas* water case.

## Texas nuisance (already-tracked facility, more filings likely)

- **Granbury / Hood County (Marathon/MARA)** — beyond the three suits already on the site
  (Citizens Concerned, Engle, Adair), watch for additional neighbor filings and the outcome of the
  criminal noise citations; update the existing entries' status as the dockets move.

## How to promote a watchlist item to the tracker

1. Confirm it is an actual **filed** lawsuit or contested adjudicative proceeding with a public record.
2. Get the caption, forum, and docket/cause number from the primary source (court/agency docket,
   CourtListener/PACER).
3. Copy `src/content/litigation/_example.json`, write the summary in our own words (assertions only,
   no liability pre-judgment), cite the public `sourceUrl`, set `national` appropriately.
