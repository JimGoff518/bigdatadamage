# Design: n8n Autopilot-to-Draft Article Pipeline

_Date: 2026-06-16 · Status: approved, pre-implementation_

## Goal

Increase publishing volume on BigDataDamage **without** sacrificing quality or risking bad facts
on a YMYL site. n8n drafts articles on a schedule into the existing Next.js markdown pipeline, but
**nothing publishes without a one-click human approval.** Replaces the need for a paid SEO tool
(RankOrg) using subscriptions Jim already owns.

## Decisions (locked)

| Decision | Choice | Why |
| --- | --- | --- |
| Orchestrator | **n8n Cloud** | Public webhooks, managed credential vault, no infra to run |
| Drafting engine | **Gemini, grounded** | Already paid; Google-Search grounding cites live sources, cuts hallucinated stats |
| Topic queue | **Google Sheet** | Native n8n node; trivial for Jim to edit/reorder; fits Google stack |
| Output target | **GitHub PR** (branch `draft/<slug>`) | Autopilot-to-draft; never commits to `main` directly |
| Review surface | **Vercel PR preview** | Free rendered preview of the actual article per PR |
| Approval | **One-click "Approve & publish"** email button → n8n webhook merges PR | ~10s gate, phone-friendly, human okays every piece |
| Notifications | **Resend** (already wired) | Email with preview link, PR link, source list, approve button |

## Data flow

```
[Schedule: Tue + Fri 08:00 CT]  (+ manual "Run now")
   → Google Sheet: read top row where status = "queued"
   → Gemini (grounded): draft from brief + style guide + existing-titles list
   → Code node: validate frontmatter / slug / no raw HTML / today's date
   → GitHub: create branch draft/<slug>, add src/content/articles/<slug>.md, open PR
   → Vercel: auto-builds preview deploy of the PR
   → Resend: email Jim — preview URL + PR URL + sources + [Approve & publish]
   → Sheet: row status → "in review", save pr_url
        … Jim clicks Approve …
   → n8n webhook: merge PR  → Vercel deploys to prod  → Sheet status → "published"
```

## Google Sheet schema

One row per planned article. Columns:

`status` · `title` · `keyword` · `harm` · `location` · `internal_links` · `notes` · `pr_url`

- `status`: `queued` → `in review` → `published` (n8n advances it)
- Seed it from the Batch 1 list in `docs/content-calendar.md`.

## What Gemini is fed

1. **The brief** (the Sheet row).
2. **Style guide**: house voice; output must be Markdown with YAML frontmatter
   (`title, excerpt, date, author, harm, location?, seoTitle, seoDescription`); GFM tables only,
   **no raw HTML**; cite sources inline; use ranges not false precision; include an FAQ + a
   closing section; no tool-attribution footers.
3. **Existing titles + keywords list** (pulled from the repo or maintained in the Sheet) so it
   writes *around* current coverage — anti-cannibalization guardrail.

Returns: the finished `.md` content + a list of grounded source URLs.

## Validation (Code node) — must pass before a PR opens

- Frontmatter has all required keys; `date` = run date.
- `slug` is kebab-case and **not** already present in `src/content/articles/`.
- Body contains no `<...>` raw HTML (except permitted bare YouTube link lines).
- Body is non-trivial length (e.g. > 600 words).
- On failure: skip the PR, email Jim the raw draft + the reason, leave Sheet status `queued`.

## v1 scope vs. deferred

**In v1:** everything above.

**Deferred to v2 (YAGNI):**
- **Pinecone** semantic cannibalization check (v1 relies on the titles/keywords list).
- **Leonardo.ai** hero images.
- **Full auto-publish** for low-risk geo pages (graduate to this after ~10–15 reviewed drafts
  prove output quality).

## Risks & mitigations

- _Hallucinated facts on a YMYL site_ → grounding + mandatory human approval + validation gate.
- _Cannibalization_ → existing-titles guardrail now; Pinecone later.
- _Secrets_ → live only in n8n's credential vault; never shared in plaintext or committed.
- _n8n JSON import drift_ → ship a node-by-node build guide alongside the JSON.

## Credentials Jim must create (in n8n's vault)

1. **GitHub** personal access token (repo scope) for `JimGoff518/bigdatadamage`.
2. **Gemini** API key.
3. **Google** OAuth (Sheets access).
4. **Resend** API key (reuse the site's).
