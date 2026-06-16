# n8n Article Drafting Pipeline — Setup Guide

Implements the design in `docs/plans/2026-06-16-n8n-drafting-pipeline-design.md`.
Two workflows: **(A) Draft** (scheduled) and **(B) Approve** (webhook the email button hits).

---

## Step 0 — Credentials to create (you do this; never share these with anyone)

Create each inside **n8n → Credentials**. They live encrypted in n8n's vault.

1. **GitHub** — a fine-grained Personal Access Token for `JimGoff518/bigdatadamage`
   with **Contents: Read/Write** and **Pull requests: Read/Write**.
   GitHub → Settings → Developer settings → Fine-grained tokens.
2. **Gemini (Google AI)** — an API key from Google AI Studio.
3. **Google Sheets** — the n8n "Google Sheets OAuth2" credential (sign in with your Google account).
4. **Resend** — reuse the key already in the site's env (`RESEND_API_KEY`).

Also pick a **shared secret** string (any long random value), call it `APPROVE_SECRET`. It guards the
approve webhook so only your email button can trigger a merge. Store it as an n8n variable/credential.

---

## Step 1 — The Google Sheet (topic queue)

Create a sheet named **`BDD Content Queue`**, first row = headers exactly:

```
status | title | keyword | harm | location | internal_links | notes | pr_url
```

Seed rows from `docs/content-calendar.md` Batch 1, all with `status = queued`. Example:

```
queued | Amarillo Data Centers and the Ogallala Aquifer: What Potter County Landowners Should Know | amarillo data center water | water | amarillo | /damage/water, rule-of-capture | lead with Ogallala, Panhandle irrigation |
```

---

## Workflow A — "BDD Draft" (scheduled)

### Node 1 — Schedule Trigger
- Cron: `0 13 * * 2,5` (Tue & Fri 08:00 America/Chicago ≈ 13:00 UTC; adjust for DST as needed).
- Also add a **Manual Trigger** wired to the same Node 2 for "Run now."

### Node 2 — Google Sheets: Get rows
- Operation: **Get Row(s)**, your sheet.
- Filter: `status = queued`. Take the **first** returned row (add a "Limit 1" / use item[0]).
- If none, stop (optional: email "queue empty").

### Node 3 — HTTP Request: Gemini (grounded draft)
- Method: **POST**
- URL: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
  - **Live build uses `gemini-2.5-flash`** (free tier). The Pro alias `gemini-pro-latest` returns
    `limit: 0` unless the API key has **billing enabled** — Jim's consumer Gemini subscription is
    separate from API billing. To upgrade: enable billing, then swap the model in the URL.
  - Grounding = the `google_search` tool. Do **not** add `thinkingConfig.thinkingLevel` on 2.5
    models (Gemini-3 only — 2.5-flash rejects it).
- Auth: header `x-goog-api-key: {{ your Gemini credential }}`.
- Body (JSON):

```json
{
  "tools": [{ "google_search": {} }],
  "system_instruction": { "parts": [{ "text": "<<STYLE GUIDE — see below>>" }] },
  "contents": [{ "role": "user", "parts": [{ "text": "<<BRIEF — see below>>" }] }]
}
```

**STYLE GUIDE (system_instruction):**

```
You are a staff writer for BigDataDamage.com, a Texas public-interest site that helps rural
landowners understand the harms of data centers (water, air, property). Audience: worried but
non-expert landowners. Voice: calm, plain, authoritative, specific — NOT hypey or salesy. Vary
sentence length; avoid filler one-word sentences.

OUTPUT: a single Markdown document with YAML frontmatter and nothing else (no code fences, no
preamble). Frontmatter keys, in order:
title, excerpt, date, author ("Big Data Damage"), harm, location (omit if none), seoTitle, seoDescription.

RULES:
- Markdown only. GFM tables are allowed. NO raw HTML, NO <style>, NO <iframe>, NO inline CSS.
- To embed a video, put a bare YouTube link on its own line (the site auto-embeds it).
- Cite real sources inline as Markdown links. Prefer the grounded results. Use ranges, not false
  precision. Never invent statistics, case names, statutes, or quotes.
- Structure: intro (2-3 short paragraphs) → 3-5 H2 sections → an H2 "Frequently Asked Questions"
  with 4-6 H3 Q&As → a short closing H2. ~900-1300 words.
- Add internal links from the brief's internal_links list using root-relative paths (e.g. /damage/water).
- Do NOT add any tool-attribution footer.
- This is a YMYL legal-adjacent topic: be accurate and measured; note when something is general
  information, not legal advice about a specific property.
```

**BRIEF (user content) — build with expressions from the Sheet row:**

```
Write the article for this brief.
Title: {{ $json.title }}
Target keyword: {{ $json.keyword }}
Harm category: {{ $json.harm }}
Location (if any): {{ $json.location }}
Internal links to include: {{ $json.internal_links }}
Notes/angle: {{ $json.notes }}

Differentiate from our EXISTING articles (do not duplicate their angle or repeat their core stats):
<<paste the existing-titles list here, or inject it from Node 2b>>
```

> Tip: maintain the existing-titles list as a second tab in the Sheet, or hardcode it and refresh
> occasionally. (v2: Pinecone does this automatically.)

### Node 4 — Code: validate & derive slug
```js
const text = $json.candidates?.[0]?.content?.parts?.map(p => p.text).join("") ?? "";
const fmMatch = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
if (!fmMatch) throw new Error("No frontmatter found in draft");
const [, fm, body] = fmMatch;

const title = (fm.match(/title:\s*"?(.+?)"?\s*$/m) || [])[1] || "";
const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);

if (/<\/?[a-z][\s\S]*?>/i.test(body.replace(/^\s*https?:\/\/\S+\s*$/gim, "")))
  throw new Error("Raw HTML detected in body");
if (body.trim().split(/\s+/).length < 600) throw new Error("Draft too short");

return [{ json: { slug, path: `src/content/articles/${slug}.md`, content: text, title } }];
```
On error → route to the "email raw draft + reason" branch; leave Sheet status `queued`.

### Node 5 — GitHub via HTTP Request (create branch, file, PR)
Base URL `https://api.github.com`, auth = your GitHub token, header `Accept: application/vnd.github+json`.

1. **Get main SHA** — `GET /repos/JimGoff518/bigdatadamage/git/ref/heads/main` → `{{ $json.object.sha }}`.
2. **Create branch** — `POST /repos/JimGoff518/bigdatadamage/git/refs`
   body `{ "ref": "refs/heads/draft/{{slug}}", "sha": "<main SHA>" }`.
3. **Create file** — `PUT /repos/JimGoff518/bigdatadamage/contents/{{path}}`
   body `{ "message": "Draft: {{title}}", "content": "<base64 of content>", "branch": "draft/{{slug}}" }`.
   (Base64-encode in a Code node: `Buffer.from(content).toString("base64")`.)
4. **Open PR** — `POST /repos/JimGoff518/bigdatadamage/pulls`
   body `{ "title": "Draft: {{title}}", "head": "draft/{{slug}}", "base": "main", "body": "Auto-drafted. Review the Vercel preview, then approve." }`
   → capture `number` (PR #) and `html_url`.

### Node 6 — Resend email (with approve button)
- POST `https://api.resend.com/emails`, auth bearer = Resend key.
- The Vercel preview URL pattern is shown on the PR; you can also link the PR's "View deployment".
- Body HTML:

```html
<h2>New draft ready: {{title}}</h2>
<p><a href="{{PR html_url}}">Open PR & preview on GitHub</a></p>
<h3>Sources Gemini grounded against:</h3>
<ul>…list…</ul>
<p>
  <a href="https://<your-n8n>.app.n8n.cloud/webhook/approve?pr={{number}}&token=APPROVE_SECRET"
     style="background:#16a34a;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none">
     ✅ Approve &amp; publish
  </a>
</p>
```

### Node 7 — Google Sheets: update row
- Set `status = in review`, `pr_url = {{ PR html_url }}` on the row you took in Node 2.

---

## Workflow B — "BDD Approve" (webhook the button hits)

### Node 1 — Webhook (GET, path `approve`)
- Reads query params `pr` and `token`.

### Node 2 — IF: token check
- `{{ $json.query.token }} === APPROVE_SECRET`. If not, return 403.

### Node 3 — GitHub: merge PR
- `PUT /repos/JimGoff518/bigdatadamage/pulls/{{ $json.query.pr }}/merge`
  body `{ "merge_method": "squash" }`. → Vercel deploys `main` to prod.

### Node 4 — Google Sheets: update row → `status = published`
- Match the row by `pr_url` containing `/pull/{{pr}}`.

### Node 5 — Respond to Webhook
- Return simple HTML: "✅ Published — live in ~1 minute." (so your browser shows a confirmation).

---

## Go-live checklist
- [ ] 4 credentials + APPROVE_SECRET created in n8n
- [ ] Sheet created + seeded with Batch 1 (status=queued)
- [ ] Workflow A built; run once via Manual Trigger → confirm a PR + preview appear
- [ ] Workflow B built; click the email button on that test PR → confirm it merges + deploys
- [ ] Turn on the Schedule Trigger
- [ ] (v2 later) Pinecone dedup, Leonardo hero images, geo auto-publish
```
