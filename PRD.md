# ZeroEn — Product Requirements Document

**Last updated: 2026-04-23 (Phase 1 repositioning)**

---

## The Business

**ZeroEn** — bilingual product studio. We ship production-grade Next.js + Supabase + Stripe SaaS for funded founders and serious businesses in Tokyo. Fixed price. No equity. No revenue share. Delivered in weeks.

**Positioning:** "Zero friction from idea to shipped product."
**Tagline (EN):** "Bilingual SaaS, shipped."
**Tagline (JA):** 「バイリンガルSaaS、確実に出荷。」

---

## Revenue Model

| Stream | Amount | When it pays |
|--------|--------|-------------|
| **Starter Site (one-time)** | ¥380,000 | On kickoff (50%) + delivery (50%) |
| **Growth Site (one-time)** | ¥880,000 | 40% kickoff / 30% staging / 30% delivery |
| **MVP / SaaS Build (one-time)** | ¥1,500,000–¥2,500,000 | 30% kickoff / 30% alpha / 30% beta / 10% go-live |
| **Starter Retainer** | ¥15,000/mo | Hosting, SSL, 1 content update/mo, priority email |
| **Growth Retainer** | ¥35,000/mo | Everything in Starter + 3 updates/mo, 30-min strategy call, analytics report |
| **MVP/SaaS Retainer** | ¥80,000–¥150,000/mo | All infra, bug SLA, 1 feature/mo, Slack access, roadmap reviews |
| **Out-of-scope work** | ¥15,000/hr | Anything beyond retainer or locked scope. See `HQ/crm/change-catalogue.md` |

**Revenue targets:**
- ¥300,000+/mo net MRR by August 2026 (minimum to keep Malaysia move on track)
- ¥150,000+/mo net MRR maintained for 2+ months → GO signal for Malaysia move
- GO/NO-GO on Malaysia (Nov 2026) by Oct 15, 2026

---

## Ideal Customer Profile (ICP)

Both dimensions must be true: **(a) budget to pay ¥380,000+ for a site or ¥1,500,000+ for an MVP** and **(b) online presence directly drives revenue.**

**Five target segments, ranked by priority:**

1. **Foreign founders in Tokyo who just raised seed/pre-seed** — English-first, bilingual need, urgent timelines, cash on hand. Primary.
2. **Foreign companies entering the Japan market** — bilingual product/marketing sites, enterprise budget, often via Japan GM. Secondary but highest deal size.
3. **Bilingual recruiting and staffing agencies in Tokyo** — candidate acquisition flows through web presence and outreach systems.
4. **Foreign-owned SMBs in Tokyo** — Western revenue models (consulting, design, import, specialty retail with online sales).
5. **Funded Japanese startups pre-IPO** — needing English-facing product for global fundraising.

**Explicitly excluded:** flower shops, cafes, restaurants (unless foreign-owned chain), solo coaches, therapists, independent consultants, individual freelancers, Japanese SMBs where website doesn't drive sales.

---

## Pricing Structure

See `HQ/docs/revenue-model.md` for the full three-tier breakdown.

### Tier 1 — Starter Site
**¥380,000 one-time + ¥15,000/month**
5-page bilingual Next.js site. Timeline: 14 business days. Payment: 50/50.

### Tier 2 — Growth Site ★ FLAGSHIP
**¥880,000 one-time + ¥35,000/month**
10-15 pages, CMS-ready, lead capture, analytics dashboard. Timeline: 21-28 business days. Payment: 40/30/30.

### Tier 3 — MVP / SaaS Build
**¥1,500,000–¥2,500,000 one-time + ¥80,000–¥150,000/month**
Full production Next.js + Supabase + Stripe SaaS, bilingual, auth, subscription billing, admin panel, CI/CD. Timeline: 6-8 weeks. Payment: 30/30/30/10.

---

## Client Journey (5 Steps)

```
1. SCOPING CALL   → 30 min, free. Discuss product, timeline, goals.
2. PROPOSAL       → Fixed-price proposal within 48 hours. Sign or walk.
3. KICKOFF        → Deposit received. Repo created. First staging deploy within 48 hours.
4. DELIVERY       → Weekly Loom demos. Staging always live. Direct Slack/email access.
5. LAUNCH         → Production deploy, domain cutover, analytics verified, docs delivered.
```

Retainer begins month after launch if selected.

---

## Tech Stack

- **Frontend:** Next.js 15+ (App Router), React, Tailwind, shadcn/ui
- **Backend/DB:** Supabase (isolated project per client)
- **Payments:** Stripe (subscriptions, invoices, webhooks)
- **Hosting:** Vercel (operator's Pro account)
- **Email:** Resend
- **i18n:** next-intl with EN/JA routing
- **Analytics:** Vercel Analytics + GA4
- **CI/CD:** GitHub auto-deploy with Vercel preview environments

Phase 2 details: `HQ/docs/phase-2-stack.md` (do not use until 15-client gate).

---

## Acquisition Strategy

**Primary:** Cold email to named targets in five ICP segments. Templates in `HQ/marketing/campaigns/`. Do NOT write sequences until discovery calls validate the language.

**Secondary:** Content — technical posts on Qiita/Zenn/note, X build-in-public threads, this platform (ZeroEn) and WebMori as first-party case studies.

**Google Ads:** ¥5,000/mo R&D only. Not a reliable channel until ICP language is validated.

**Channels abandoned:** Coconala (ToS takedown, structurally incompatible), MENTA, Lancers, CrowdWorks, Meta.

---

## Legal Structure

- **Current:** Canadian sole proprietorship
- **Contracts:** Fixed-price engagement agreement per client. No equity, no revenue share. Milestone-based payments. IP ownership: ZeroEn retains code; client licenses it via active retainer. On retainer cancel: site archived, code stays with ZeroEn.
- **USD invoicing:** Available for international clients.
- **Next step:** Wyoming LLC when revenue allows (~$225 setup cost).

---

## Contract Terms

| Clause | Detail |
|--------|--------|
| **Pricing** | Fixed-price per tier. No hourly billing after kickoff. |
| **IP ownership** | ZeroEn retains all code. Client licenses the live site via active retainer. |
| **Scope freeze** | Deliverables locked at kickoff. Out-of-scope = ¥15,000/hr per `HQ/crm/change-catalogue.md` |
| **Payment terms** | Per tier (see above). Retainer begins month after launch. |
| **Cancellation** | Retainer cancel: 30-day notice. Site archived on lapse. |
| **Refund policy** | 50% refundable before kickoff. 25% refundable within first week. No refunds after milestone 1 acceptance. |
| **Portfolio rights** | ZeroEn always retains right to showcase work. |

---

## Project Structure

```
~/repos/ZeroEn/                  ← Private ZeroEn HQ repo
├── CLAUDE.md                    ← Operator manual (read this first)
├── PRD.md                       ← This file
├── HQ/                          ← Tracked
│   ├── agents/                  ← Claude Code agent prompts
│   ├── brand/                   ← Tokens, brand kit
│   ├── commands/                ← /new-client, /report, /deploy, etc.
│   ├── crm/                     ← clients.json, change-catalogue.md
│   ├── docs/                    ← On-demand reference docs
│   ├── marketing/               ← Campaigns, research, assets
│   ├── platform/                ← ZeroEnApp repo (nested git checkout)
│   └── scripts/                 ← clone-all.sh
└── Clients/                     ← NOT tracked (each = own public repo)
```

---

## Quality Assurance

See `HQ/docs/quality-gates.md` for the full pipeline. No production deploy without gates passing.

---

## Risk Mitigation

| Risk | Safeguard |
|------|-----------|
| No paying clients | Cold email to named targets; clear pricing removes "is this real?" friction. |
| Scope creep | Scope locked at kickoff. ¥15,000/hr for anything beyond it. |
| Client stops paying | 30-day notice period. Site archived on retainer lapse. |
| Revenue too slow | Target ¥300k MRR by Aug 2026; pivot cadence if not on track by Jun 2026. |
| Supabase limits | Client pays for Pro upgrade if usage exceeds free tier. Stated in terms. |
| Malaysia deadline | GO/NO-GO at Oct 15, 2026. Need ¥150k+ net MRR for 2+ months. |

---

---

## Historical — Original PRD (April 2026)

*The following is the original PRD from ZeroEn's founding. Preserved for reference. The business model, ICP, and pricing described below are no longer active.*

---

### The Business (Original)

**ZeroEn** — "Zero" + Engineer/Entrepreneur/Yen
*"From zero to launch."*

A solo technical co-founder service. Build MVPs with ¥0 upfront for founders in exchange for equity, revenue share, and recurring subscriptions.

---

### Revenue Model (Original — 5 Streams)

| Stream | Amount | When it pays |
|--------|--------|-------------|
| **No-Upfront MVP Build** | ¥0 upfront to client | You invest time, earn equity + rev share + monthly subscription |
| **Monthly Subscription** | ¥10,000-20,000/mo | Hosting + changes + analytics. Two tiers: Basic and Growth. |
| **10% Equity** | SAFE + profit-sharing | Long-term: converts when client incorporates, or profit-sharing if they don't |
| **~10% Revenue Share** | % of app revenue | Ongoing passive income, negotiated per deal |
| **Per-Request Charges** | ¥4,000-25,000+ | Small, Medium, Large. See `HQ/crm/change-catalogue.md` |
| **Code Buyout** | ¥300,000+ | Optional after 6-month commitment. Grants perpetual license. |

**Revenue target:** $3,000-5,000/mo (long-term)
**Interim target:** $1,000-1,500/mo by November 2026

---

### Target Market (Original)

- **Who:** Anyone with a business idea, globally
- **Filter:** Application form scored on: idea viability, founder commitment, technical feasibility, revenue potential
- **Scoring:** Viability (1-5), Commitment (1-5), Feasibility (1-5), Market (1-5). Accept 15+/20
- **No specialization** — generalist, build whatever interesting ideas come

---

### Client Journey (Original — 9 Steps)

```
1. DISCOVER  → Build-in-public content, social media, communities, cold outreach
2. APPLY     → Detailed application form
3. SCORE     → Accept 15+/20
4. ONBOARD   → Questionnaire → kickoff call → scope locked
5. BUILD     → ¥0 upfront MVP on Next.js + Supabase
6. LAUNCH    → 30 days launch support
7. OPERATE   → ¥10,000-20,000/mo subscription begins
8. GROW      → Per-request charges. Rev share kicks in.
9. UPSELL    → Natural pipeline to WebMori audit service
```

---

### Contract Terms (Original)

| Clause | Detail |
|--------|--------|
| **Equity** | 10% via SAFE note (converts on incorporation) + profit-sharing fallback |
| **Revenue share** | ~10%, flexible per deal |
| **Kill switch** | 90 days unpaid → agreement terminates |
| **Reversion clause** | Client doesn't launch in 6 months → full code rights revert |
| **Anti-dilution** | Minimum equity floor if client raises funding |
| **6-month minimum** | Early cancel = pay remaining months |
| **Code Buyout** | ¥300,000+ after 6-month commitment |

---

*End of Historical section. For context on why the model changed, see the repositioning notes in `HQ/docs/zeroen-repositioning-spec.md`.*
