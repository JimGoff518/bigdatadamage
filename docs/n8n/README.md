# n8n workflows — import & test

Workflows that implement the pipelines:

- `bdd-draft.workflow.json` — scheduled drafter (Sheet → Gemini → GitHub PR → email)
- `bdd-approve.workflow.json` — webhook the email's "Approve" button hits (merges the PR)
- `bdd-facility-discovery.workflow.json` — finds Texas data centers (Firecrawl scrape → Gemini extract → GitHub PR → email). **Reuses `bdd-approve` as-is** — the approve webhook merges any PR by number. Adds facility pins to the map (`src/content/facilities/*.json`, rendered by `src/components/TexasMap.tsx`, colored by status).

## Facility discovery — setup notes

1. **Credential:** the `Firecrawl scrape` node uses a generic **Header Auth** credential named `Firecrawl API` (`Authorization` = `Bearer fc-...`).
2. **Seed sources:** edit the `Seed sources` Code node — paste facility-specific public URLs (a TCEQ permit detail page, a county agenda item, or a news article about ONE specific Texas data center). A generic homepage returns "no facility found."
3. **Approve secret:** the email's Approve button uses the same `REPLACE_WITH_APPROVE_SECRET` / `/webhook/approve` as `bdd-draft`.
4. **One toggle on `bdd-approve`:** set its **Mark published** (Google Sheets) node to **Continue On Fail** — facility PRs have no Sheet row, and without this the success page won't render after the (already-completed) merge.
5. **Coordinates:** Gemini never guesses lat/lng; if the source has no address, the PR is flagged "coordinates missing" and the pin won't render until you add them in the PR. This is intentional accuracy protection.

## Import (both files)

1. n8n → **Workflows** → top-right **⋮** → **Import from File** → pick the `.json`.
2. Repeat for the second file.

## Wire credentials (each node with a red warning)

Open the flagged node → pick the matching credential from the dropdown:

| Node type | Credential to select |
| --- | --- |
| Google Sheets nodes | **Google Sheets account** |
| Gemini draft (HTTP) | **Google Gemini(PaLM) account** |
| GitHub nodes (HTTP) | **GitHub account** |
| Email me to review (Gmail) | **Gmail account 3** |

## Replace the shared secret (2 places — must match exactly)

Find/replace `REPLACE_WITH_APPROVE_SECRET` with your real `APPROVE_SECRET` in:
- **BDD Draft** → node **Email me to review** (inside the Approve button URL)
- **BDD Approve** → node **Check token** (the comparison value)

## Activate + test

1. Open **BDD Approve** → toggle **Active** (top-right). Its production webhook is
   `https://gofflawdfw.app.n8n.cloud/webhook/approve` — already baked into the email button.
2. Open **BDD Draft** → click **Test workflow** (runs the manual trigger).
   Expect: a new `draft/<slug>` branch + PR in the repo, and a review email.
3. In the email, click **Approve & publish** → the PR merges → Vercel deploys.

## Code-node scripts (kept as readable files)

The two Code nodes' scripts also live as standalone `.js` files for readability/version control;
the JSON embeds copies of them:
- `parse-and-validate.js` — the "Parse & validate" node (handles Gemini's ```yaml-fenced output)

Model note: the live build uses **`gemini-2.5-flash`** (free tier). Pro (`gemini-pro-latest`)
needs API billing enabled. `thinkingLevel` is Gemini-3-only — not used on 2.5.

## If a node errors

Open the **Executions** tab, click the failed run, copy the red node's error, and send it over.
Most-likely tweak spots: Google Sheets filter/column mapping, the Gemini request body
(`generationConfig`/grounding field names), and the Gmail HTML toggle.
