# Legislation Tracker — n8n flow

One importable workflow that surfaces legislation leads for the `/legislation` page. Inactive on
import — wire it up, test, then activate.

- `bdd-legislation-radar.workflow.json` — **policy radar (leads only).** Weekly Google News RSS for
  Texas data-center bills + local ordinances/moratoriums → Gemini keeps genuine legislative leads →
  emails you a digest. Writes **no** entries; you curate verified `/legislation` entries from the
  leads (with the Claude + Descrybe fact-check).

> **Why no LegiScan flow?** We also built a LegiScan API bill-tracker, but LegiScan's API sits behind
> a Cloudflare "managed challenge" that blocks server requests from n8n Cloud's datacenter IP
> (browsers pass; a server can't solve the JS challenge, and this n8n plan has no static IP to get
> allowlisted). So state bills/statutes are curated by hand instead — low volume until the 2027
> session anyway. Revisit LegiScan automation closer to 2027 if volume ever justifies a workaround.

## Import & wire

1. n8n → new blank workflow → paste the JSON onto the canvas (`Ctrl+V`) → Save.
2. Wire credentials on the red-triangle nodes:
   | Node | Credential |
   | --- | --- |
   | Gemini: filter leads | **Google Gemini(PaLM) Api account** |
   | Email leads | **Gmail account 3** |

## Test & activate

- **Run now (manual)** → expect a "Legislation radar" email (or "no new leads").
- Toggle **Active** (scheduled weekly Thursday, 8am).

## Curating state bills (manual)

With LegiScan out, add state bills/statutes by hand as `src/content/legislation/<slug>.json` (same
shape as the seed files), each fact-checked against the official Texas Legislature record (Claude +
Descrybe). The radar's weekly leads are good prompts for what to add.
