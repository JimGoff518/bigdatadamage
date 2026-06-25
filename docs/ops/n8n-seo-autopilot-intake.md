# n8n SEO Autopilot Intake — Setup

This is the **intake webhook** that receives planned article rows from the
`seo-content-autopilot` Claude skill and appends them to the content Sheet, where the
existing draft pipeline (Sheet → Gemini → PR → approve email → deploy) picks them up.

## The contract

The skill sends:

```
POST  <your n8n webhook URL>
Header: x-bdd-secret: <shared secret>
Body:   { "rows": [ { status, slug, title, seoTitle, seoDescription, harm, location,
                       cluster, intent, priority_score, target_keyword, volume,
                       difficulty, outline, tldr, sources_to_cite, eeat_angle,
                       date_planned }, ... ] }
```

The webhook replies `{ "ok": true, "queued": <n> }` on success, or `401 { "ok": false }`
if the secret is missing/wrong.

## Flow (6 nodes)

```
Webhook (POST /seo-autopilot-intake)
   └─ Verify shared secret (IF: header x-bdd-secret == $env.BDD_INTAKE_SECRET)
        ├─ true  → Split rows (body.rows) → Append to content Sheet → Respond OK
        └─ false → Respond 401
```

- **Webhook** — `responseMode: responseNode` so we control the reply.
- **Verify shared secret** — rejects anything without the matching `x-bdd-secret` header.
  Keeps the public webhook from being spammed.
- **Split rows** — turns the `rows` array into one item per article so the Sheets node
  appends each as its own row.
- **Append to content Sheet** — Google Sheets *append*, `status` defaults to `queued`.
- **Respond OK / 401** — single JSON reply.

## Install (one-time)

1. **Import** `n8n-seo-autopilot-intake.workflow.json` into n8n
   (Workflows → ⋯ → Import from File).
2. **Google Sheets node** — open *Append to content Sheet* and set:
   - your Google Sheets **credential**,
   - **documentId** → the content Sheet (replace `REPLACE_WITH_SHEET_ID`),
   - **sheetName** → the queue tab (default `Queue`).
   - Confirm the column keys match your Sheet's **header row exactly**. If your headers
     differ, rename either the Sheet headers or the keys in this node — and mirror any
     change in the skill's row schema (`.claude/skills/seo-content-autopilot/SKILL.md`).
3. **Secret** — set an n8n env var `BDD_INTAKE_SECRET` to a long random string.
4. **Activate** the workflow and copy its **Production webhook URL**.
5. **Point the skill at it** — set, in the Claude Code environment that runs the skill:
   - `BDD_N8N_WEBHOOK_URL` = the production webhook URL,
   - `BDD_INTAKE_SECRET`  = the same secret as step 3.
   (Or use `.claude/seo-autopilot.local.json` → `{ "webhookUrl": "...", "secret": "..." }`.)

## Test

```bash
curl -X POST "$BDD_N8N_WEBHOOK_URL" \
  -H "x-bdd-secret: $BDD_INTAKE_SECRET" \
  -H "content-type: application/json" \
  -d '{"rows":[{"status":"queued","slug":"test-row-delete-me","title":"Test row",
       "harm":"water","location":"granbury"}]}'
```

Expect `{"ok":true,"queued":1}` and a new `Queue` row. Delete the test row after.

## Notes
- The human approval email in the existing pipeline stays the publish gate — this webhook
  only *queues*, it never publishes.
- `outline` and `sources_to_cite` arrive as JSON if structured; the node stringifies them
  so they land cleanly in a single cell for Gemini to read.
