# Legislation Tracker — n8n flows (Phase 2)

Two importable workflows that feed the `/legislation` page (Phase 1) the same JSON shape
(`src/content/legislation/*.json`). Both are **inactive** on import — wire them up, test, then activate.

- `bdd-legislation-legiscan.workflow.json` — **authoritative bill tracker.** Weekly LegiScan
  search of Texas bills → `getBill` detail → Gemini summarizes in our words → opens a GitHub PR
  with a new `src/content/legislation/<slug>.json` → emails you to review.
- `bdd-legislation-radar.workflow.json` — **policy radar (leads only).** Weekly Google News RSS for
  Texas data-center bills + local ordinances/moratoriums → Gemini keeps genuine legislative leads →
  emails you a digest. Writes **no** entries; you curate local-ordinance entries from leads.

## Prerequisite: a (free) LegiScan API key

1. Register at <https://legiscan.com/legiscan> → get an API key.
2. In n8n: **Credentials → New → "Query Auth"** → set **Name = `key`**, **Value = your LegiScan API
   key** → save it as **"LegiScan API key"**. (LegiScan takes the key as a `?key=...` URL parameter,
   which is exactly what Query Auth adds — so the key never lives in the workflow file.)
   - Variables (`$vars`) are NOT used — they require the n8n Pro plan. The Query Auth credential works
     on any plan. On import, the two `LegiScan: getSearch` / `getBill` nodes will flag this credential;
     just pick "LegiScan API key" on each.

## Import & wire

1. n8n → Workflows → **⋮ → Import from File** → import each `.json`.
2. Open each node with a red credential warning and pick the matching credential:
   | Node | Credential |
   | --- | --- |
   | Gemini (HTTP) | **Google Gemini(PaLM) Api account** |
   | GitHub (HTTP) | **GitHub account** |
   | Email (Gmail) | **Gmail account 3** |
3. **Depends on Phase 1 being merged.** Flow A reads/writes `src/content/legislation/` and the
   page loader — both land when PR #30 merges. Until then, `Get existing legislation` 404s (handled:
   it just treats everything as new), and merged entries won't render until the loader exists.

## Test

- Open each workflow → **Run now (manual)**.
  - Flow A: expect a `legislation/<slug>` branch + PR per new bill, and a review email.
  - Flow B: expect a digest email (or "no new leads").
- Then toggle **Active** (both scheduled weekly Thursday — Flow A 7am, Flow B 8am).

## Known limits (v1 — verify in review)

- **Fact-check gate applies.** Every Flow-A PR must pass the Claude + Descrybe check before you
  merge — the risk is Gemini mis-stating a bill's effect, or the status→category mapping being off.
- **Status mapping** is best-effort: LegiScan 1=Introduced→filed, 2/3=Engrossed/Enrolled→passed,
  4=Passed→`statute`/in-effect, 5/6=Vetoed/Failed→failed. Confirm per PR.
- **Dedup is by slug** `tx-<session>-<billnumber>` (e.g. `tx-89r-sb6`). It will **not** dedup against
  the Phase-1 seed files (which have descriptive slugs like `sb-6-large-load-interconnection`), so the
  first run may open a PR for a bill already seeded (e.g. SB 6) — just close that PR. It dedups fine
  against its own future entries.
- `year=2` = current Texas session. Revisit when the 90th Legislature (2027) convenes.
