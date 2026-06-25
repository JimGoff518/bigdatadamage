# SEO Content Autopilot — Design

**Date:** 2026-06-25
**Status:** Implemented (skill v1)
**Source:** Distilled from 3 YouTube SEO-automation videos (Tim the SEO Guru ×2, Nico podcast),
adapted to BDD's stack and IP/positioning constraints.

## Purpose
A Claude Code skill that acts as the **planning brain** for BDD's content engine. It finds
high-value SEO content gaps, prioritizes them, and produces SERP-structured outlines, then
queues them into the existing n8n content Sheet. It replaces the "buy Arvow" pitch — BDD
already owns the autopilot/publish layer (n8n).

## Key decisions
- **Division of labor:** skill *plans*, n8n/Gemini *drafts*. Skill never writes prose, never
  edits `src/`, never commits.
- **Data sources:** Semrush MCP (real volume/difficulty/gaps) + WebSearch (live SERP +
  AI-citation check) + own content/facilities datasets.
- **Handoff:** direct write to the Sheet via an n8n intake webhook (`BDD_N8N_WEBHOOK_URL`),
  with a local-CSV fallback so it works before the webhook exists.
- **Human gate:** kept after Phase 3 (approve the cluster map) and at n8n's approval email.

## Pipeline
1. Inventory own content + taxonomies (3 harms × 15 locations matrix).
2. Gap analysis (Semrush + web), favoring bottom-of-funnel remedy-seeking queries.
3. Cluster + score (intent × opportunity × authority-fit) → **STOP for approval**.
4. SERP-structured outlines (content-capsule headings, TL;DR, sources, E-E-A-T angle).
5. Queue rows into the Sheet (status=`queued`).

## Constraints baked into the skill
IP firewall (link-out only, no republishing, no YouTube-to-blog); positioning lock (pro
just-compensation, never anti-AI); taxonomy lock (existing slugs only); content-capsule
structure; source-everything; attorney E-E-A-T; not-legal-advice framing; velocity guardrail
(~3–5/week, ramp slowly, include old-post refreshes).

## Off-limits
YouTube-to-blog republishing; automated reciprocal backlink pools; inventing taxonomy or
facility data; case-specific legal advice.

## Open follow-ups
- Stand up the n8n intake webhook and set `BDD_N8N_WEBHOOK_URL`.
- Confirm the live Sheet's column order matches the row schema (adjust the webhook mapping if not).
- Optional later: Remotion video + social repurposing (separate skill).
