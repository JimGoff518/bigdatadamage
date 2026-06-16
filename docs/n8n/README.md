# n8n workflows — import & test

Two workflows implement the pipeline in `../plans/2026-06-16-n8n-drafting-pipeline-design.md`:

- `bdd-draft.workflow.json` — scheduled drafter (Sheet → Gemini → GitHub PR → email)
- `bdd-approve.workflow.json` — webhook the email's "Approve" button hits (merges the PR)

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

## If a node errors

Open the **Executions** tab, click the failed run, copy the red node's error, and send it over.
Most-likely tweak spots: Google Sheets filter/column mapping, the Gemini request body
(`generationConfig`/grounding field names), and the Gmail HTML toggle.
