---
name: pre-deploy-checklist
description: Pre-production checklist for a client site — env vars, domain, SEO, integrations. Pair with /deploy (quality gates).
args: "<clientId>"
---

# /pre-deploy-checklist `<clientId>`

**Run before pushing a client site to production.** Catches missing env vars, SEO gaps, and integrations the template doesn't ship with. Use alongside `/deploy` (quality gates) — this covers *setup*, `/deploy` covers *code quality*.

---

## 1. Vercel — Project & Env Vars

- [ ] Vercel project created, linked to the client's GitHub repo under the operator's account
- [ ] **Production branch = `main`**; preview branches enabled for PRs
- [ ] Production environment variables set (Vercel → Settings → Environment Variables):
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` *(only if Phase 2 / dynamic site — skip for landing pages)*
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` *(Phase 2 only)*
  - [ ] `NEXT_PUBLIC_APP_URL` — **must be the production URL** (e.g. `https://client.com`), not `localhost`
  - [ ] `NEXT_PUBLIC_APP_NAME` — the client's app name (used in `<title>`)
  - [ ] `NEXT_PUBLIC_UMAMI_WEBSITE_ID` — website UUID from umami.zeroen.dev (see `HQ/crm/umami-setup.md`)
  - [ ] `NEXT_PUBLIC_UMAMI_URL` — `https://umami.zeroen.dev` (explicit even though default matches)
- [ ] All vars set on **Production** (not just Preview/Development)
- [ ] No secrets accidentally marked `NEXT_PUBLIC_*` (only URLs and IDs — anything sensitive must stay server-side)

## 2. Domain & DNS

- [ ] Custom domain added in Vercel → Settings → Domains
- [ ] DNS configured at the client's registrar:
  - Apex: `A` record → `76.76.21.21`
  - `www`: `CNAME` → `cname.vercel-dns.com`
- [ ] Apex vs `www` redirect decision made (Vercel handles automatically)
- [ ] SSL certificate issued (Vercel auto-provisions via Let's Encrypt — wait until "Valid Configuration" shows green)
- [ ] `NEXT_PUBLIC_APP_URL` matches the resolved production domain

## 3. Umami Analytics

- [ ] Website record created in umami.zeroen.dev with name = `<clientId>` and domain = production domain
- [ ] Website UUID copied and saved in:
  - [ ] Vercel env var (`NEXT_PUBLIC_UMAMI_WEBSITE_ID`)
  - [ ] Supabase `projects.umami_website_id` column
  - [ ] `HQ/crm/clients/<clientId>/profile.md`
- [ ] After deploy: visit the site, then confirm a hit appears in Umami Realtime within ~30s
- [ ] Full setup manual: `HQ/crm/umami-setup.md`

## 4. SEO, OG, and Metadata (template gaps — fill per client)

The Next.js template does NOT ship these. Add them before launch:

- [ ] `src/app/layout.tsx` metadata extended with:
  - [ ] `metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!)`
  - [ ] `description` — client-specific, not the default "Built by ZeroEn"
  - [ ] `openGraph` block — `title`, `description`, `url`, `siteName`, `locale`, `images`
  - [ ] `twitter` block — `card: 'summary_large_image'`, same title/description/images
- [ ] `src/app/opengraph-image.tsx` (or `.png` in `/public`) — 1200×630 OG image with brand/hero text
- [ ] `src/app/icon.tsx` or `/public/favicon.ico` — replace the default Next.js favicon
- [ ] `src/app/apple-icon.tsx` (optional but recommended for iOS home-screen)
- [ ] `src/app/robots.ts` — allow indexing production, disallow preview domains
- [ ] `src/app/sitemap.ts` — at minimum include `/` and any key landing sections
- [ ] `src/app/not-found.tsx` — branded 404 page
- [ ] `src/app/error.tsx` — graceful error boundary

## 5. Forms & Integrations (per-client decisions)

- [ ] Contact / lead form destination decided and wired:
  - [ ] Formspree, Google Form, Typeform, or Supabase table?
  - [ ] Spam protection (hCaptcha, Turnstile, or honeypot)?
  - [ ] Confirmation email to operator or client mailbox?
- [ ] Any third-party embeds (YouTube, Calendly, Maps) — verify they load over HTTPS and don't break CSP

## 6. Supabase (Phase 2 only — skip for landing pages)

- [ ] Supabase project created (free tier)
- [ ] Initial migration applied
- [ ] RLS policies defined on every table
- [ ] Auth providers configured (email, Google, etc. per scope)
- [ ] Redirect URLs include production domain (Supabase → Authentication → URL Configuration)
- [ ] Service role key stored only server-side — NEVER in a `NEXT_PUBLIC_*` var

## 7. CRM + Platform Registration

- [ ] `HQ/crm/clients.json` entry has `repo`, `vercel`, and (if applicable) `supabase` URLs filled in
- [ ] `HQ/crm/clients/<clientId>/profile.md` has:
  - [ ] Vercel project URL
  - [ ] GitHub repo URL
  - [ ] Production domain
  - [ ] `Project UUID` (Supabase `projects.id`)
  - [ ] Umami website ID
- [ ] Supabase `projects` row status is up-to-date (`onboarding` → `active` once live)

## 8. Billing & Contract

- [ ] 6-month commitment confirmed in writing
- [ ] Stripe subscription created via zeroen.dev checkout (recurring ¥5,000 or ¥10,000/mo)
- [ ] First invoice paid OR first billing cycle scheduled post-launch (per `admin-manual.md §2.5`)
- [ ] Coconala intake fee received (¥500) if applicable
- [ ] Partnership Agreement signed → row exists in `signed_documents` for client's `user_id` with `document_type = 'partnership_agreement'`

## 9. Quality Gates (run `/deploy <clientId>` — don't skip)

- [ ] `npm run lint` clean
- [ ] `npm run build` succeeds
- [ ] `npm test` passes (if tests exist)
- [ ] `code-reviewer` verdict ≠ BLOCK
- [ ] Mobile-first check: site works on 375px viewport (iPhone SE)
- [ ] Lighthouse mobile score ≥ 90 for Performance, Accessibility, Best Practices, SEO

## 10. Post-Deploy Smoke Test

- [ ] Production URL loads over HTTPS
- [ ] OG preview renders correctly (test with https://www.opengraph.xyz/ or Slack unfurl)
- [ ] Favicon shows in browser tab
- [ ] Umami Realtime shows your test hit
- [ ] 404 page shows branded `not-found.tsx` (visit `/nonexistent-path`)
- [ ] Form submission reaches the configured destination
- [ ] Page speed acceptable on 4G (use Chrome DevTools throttling)
- [ ] No console errors in production build
- [ ] Robots / sitemap accessible: `https://client.com/robots.txt` and `/sitemap.xml`

## 11. Launch Communication

- [ ] Client notified via launch message template (`admin-manual.md` template 06)
- [ ] `HQ/crm/clients.json` status updated to `active`
- [ ] First monthly report scheduled (runs 1st of next month via `/report` cron)

---

**If any box is unchecked → do not push to production.** Preview deploys on Vercel are free; use them until this list is green.
