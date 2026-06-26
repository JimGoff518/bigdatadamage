# n8n SEO Autopilot Intake — Setup

This is the **intake webhook** that receives planned article briefs from the
`seo-content-autopilot` Claude skill and appends them to the **live** BDD Content Queue
sheet (`1V-anSvUJ…`, tab `1271705953`) that the existing `bdd-draft` pipeline reads
(Sheet → Gemini → PR → approve email → deploy). One sheet, one pipeline.

## The contract

The skill sends briefs matching the live queue's 8-column schema
(`status | title | keyword | harm | location | internal_links | notes | pr_url`; the skill
writes the first 7, the pipeline fills `pr_url`):

```
POST  <your n8n webhook URL>
Header: x-bdd-secret: <shared secret>
Body:   { "rows": [ { status, title, keyword, harm, location, internal_links, notes }, ... ] }
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
- **Verify shared secret** — rejects anything without the matching `x-bdd-secret` header
  (compared against the n8n Variable `$vars.BDD_INTAKE_SECRET`). Keeps the public webhook
  from being spammed. On n8n **Cloud**, use **Variables** (`$vars`) — OS env vars (`$env`)
  can't be set on Cloud. On self-hosted, you may use `$env` instead.
- **Split rows** — turns the `rows` array into one item per article so the Sheets node
  appends each as its own row.
- **Append to content Sheet** — Google Sheets *append*, `status` defaults to `queued`.
- **Respond OK / 401** — single JSON reply.

## Install (one-time)

1. **Import** `n8n-seo-autopilot-intake.workflow.json` into n8n
   (Workflows → ⋯ → Import from File).
2. **Google Sheets node** — open *Append to content Sheet* and set:
   - your Google Sheets **credential**,
   - **documentId** → the **live** queue sheet `1V-anSvUJt1bCTFEP0OYcmJRUMw11PXi5Z-jXA5n7G2Q`,
   - **sheetName** → tab `1271705953` (the one `bdd-draft` reads),
   - the 7 mapped columns are `status, title, keyword, harm, location, internal_links, notes`,
     matching the live queue header row. Do NOT point this at a separate staging sheet, or
     drafts won't fire.
3. **Secret** — add an n8n **Variable** named `BDD_INTAKE_SECRET` (long random string).
   The IF node compares the `x-bdd-secret` header against `$vars.BDD_INTAKE_SECRET`.
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
  -d '{"rows":[{"status":"queued","title":"Test row — safe to delete","keyword":"test",
       "harm":"water","location":"granbury","internal_links":"/damage/water","notes":"test"}]}'
```

Expect `{"ok":true,"queued":1}` and a new row in the live queue. Delete the test row after.

## Notes
- The human approval email in the existing pipeline stays the publish gate — this webhook
  only *queues*, it never publishes.
- `internal_links` may arrive as a JSON array or a comma-separated string; the node
  normalizes it to a single comma-separated cell for the draft prompt to read.
