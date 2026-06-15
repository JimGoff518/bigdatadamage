# Deploying BigDataDamage.com (Vercel + GoDaddy)

The site is a Next.js app. Host = **Vercel** (zero-config for Next.js). Leads are emailed via
**Resend**. Domain = **bigdatadamage.com** (registered at GoDaddy).

> Note on plan: Vercel's free **Hobby** tier is for non-commercial use. This is a commercial
> lead-gen site, so use **Vercel Pro (~$20/mo)**. No code changes are needed either way.

---

## 1. Set up lead email (Resend) — ~5 min
1. Sign up at https://resend.com using **jim@gofflawdfw.com** (so test sending works immediately).
2. Create an **API key**, copy it (used in step 2 as `RESEND_API_KEY`).
3. Optional/better deliverability later: in Resend, **verify the domain** bigdatadamage.com, then
   set `LEAD_FROM=Big Data Damage <leads@bigdatadamage.com>`.

## 2. Deploy to Vercel — ~10 min

**Option A — from GitHub (recommended; auto-deploys on every push):**
1. Push this `bigdatadamage/` folder to a new GitHub repo:
   ```bash
   cd bigdatadamage
   git add -A && git commit -m "Launch build"
   git remote add origin https://github.com/<you>/bigdatadamage.git
   git push -u origin main
   ```
2. Go to https://vercel.com/new → **Import** the repo. Vercel auto-detects Next.js — no settings
   to change. (Root directory = repo root, since the app lives at the repo root.)
3. Before the first deploy finishes, add the env vars (step 3), then deploy.

**Option B — from your machine (no GitHub), Vercel CLI:**
```bash
npm i -g vercel
cd bigdatadamage
vercel            # links/creates the project (accept the defaults)
vercel --prod     # production deploy
```

### Environment variables (Vercel → Project → Settings → Environment Variables)
Add these for the **Production** (and Preview) environments:
```
RESEND_API_KEY = <from step 1>
LEAD_EMAIL     = jim@gofflawdfw.com
LEAD_FROM      = Big Data Damage <onboarding@resend.dev>
```
(With the CLI you can instead run `vercel env add RESEND_API_KEY` etc.) Redeploy after adding them.

After it builds, Vercel gives you a `*.vercel.app` URL. Open it, click around, and submit the
form — you should receive the lead email.

## 3. Connect the GoDaddy domain — ~5 min + DNS propagation
1. In Vercel → Project → **Settings → Domains** → add `bigdatadamage.com` (and `www.bigdatadamage.com`).
   Vercel will show the exact DNS records to create.
2. In **GoDaddy → your domain → DNS**, add what Vercel specifies — typically:
   - **A** record: Name `@` → `76.76.21.21`
   - **CNAME** record: Name `www` → `cname.vercel-dns.com`
   (Vercel will flag if anything differs — follow what its dashboard shows.)
3. Vercel auto-issues HTTPS once DNS resolves (minutes to ~an hour). It also sets up the
   www↔apex redirect for you.

## 4. Point the secondary domains (optional)
For `txwaterlaw.com` and `texansforwater.com`: either add them as redirecting domains in Vercel,
or in GoDaddy use **Forwarding** → `https://bigdatadamage.com`.

## 5. Post-launch checklist
- [ ] Submit the live form → confirm the email arrives.
- [ ] Visit `https://bigdatadamage.com/sitemap.xml` and `/robots.txt`.
- [ ] Add the site to **Google Search Console** and submit the sitemap.
- [ ] (Later) Verify bigdatadamage.com in Resend for a branded "from" + best deliverability.
- [ ] (Later) Swap email capture for GoHighLevel if/when you want full CRM automation.

## Local dev reminder
```bash
cd bigdatadamage
cp .env.example .env.local   # fill in RESEND_API_KEY to test email locally
npm run dev                   # http://localhost:3000
```
