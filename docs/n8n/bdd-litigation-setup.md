# Litigation Tracker — n8n flow

One importable workflow that surfaces litigation leads for the `/litigation` page. Inactive on
import — wire it up, test, then activate.

- `bdd-litigation-radar.workflow.json` — **case radar (leads only).** Weekly Google News RSS across
  all five tracker categories (nuisance/noise, water, zoning, environmental, utility) + a
  CourtListener RECAP feed for newly-filed federal dockets → Gemini keeps only genuine
  data-center *litigation* (a filed lawsuit or contested agency/utility proceeding — not policy,
  not opinion) → emails you a digest, Texas leads first. Writes **no** entries; you curate verified
  `/litigation` entries from the leads.

> **Why leads-only, not auto-drafting?** Same reason the legislation radar is leads-only, but the
> stakes are higher: a case entry carries a caption, court, and docket number, and describes what a
> filing asserts about real, named parties. Letting an LLM draft those from a headline is exactly
> where fabrication (and a defamation/accuracy problem) would creep in. The radar finds the lead;
> a human confirms it against the actual docket and writes the entry. The Gemini prompt is told
> never to invent a caption, court, or docket.

## Import & wire

1. n8n → **Workflows** → **Import from File** → pick `bdd-litigation-radar.workflow.json`.
   (Or new blank workflow → paste the JSON → Save.)
2. Wire credentials on the red-triangle nodes — the **same** credentials the legislation radar uses:
   | Node | Credential |
   | --- | --- |
   | Gemini: filter leads | **Google Gemini(PaLM) Api account** |
   | Email leads | **Gmail account 3** |

## Test & activate

- **Run now (manual)** → expect a "Litigation radar" email (or "no new leads").
- Toggle **Active** (scheduled weekly Tuesday, 8am — a day before the Thursday legislation radar so
  the two digests don't land together).

## Curating a case from a lead (the important part)

For any lead that checks out, add `src/content/litigation/<slug>.json` by copying `_example.json`.
Before publishing, confirm against the **actual public record** (the court/agency docket,
CourtListener/PACER, or reputable reporting) and follow the tracker's rules:

- Describe only what the filing **asserts** — no characterizing the merits, no predicting outcomes.
- **Never** call a party liable before a court has ruled; attribute claims (e.g. property-value
  diminution) to the plaintiffs.
- Every entry needs a `caption`, a plain-English `summary` in our own words, a known `category` +
  `status`, and a public `sourceUrl`, or the loader silently drops it.
- Set `national: true` for out-of-Texas landmark cases.

The loader (`src/lib/litigation.ts`) enforces the required fields; the radar just tells you what to
look at each week.

## Notes

- **Model:** `gemini-2.5-flash` (free tier), `temperature: 0`, strict JSON — same as the other flows.
- **CourtListener feed** is best-effort: the RSS node is set to *continue on error*, so if that
  endpoint ever changes the news feeds still run. CourtListener only indexes federal dockets well;
  most Texas data-center suits are state court and will surface via the news feeds instead.
- **If a node errors:** open the **Executions** tab, copy the red node's error, and send it over.
  Most-likely tweak spots are the Gemini request body and the Gmail HTML toggle.
