# Coconala Playbook — ZeroEn

The authoritative reference for ZeroEn's Coconala channel strategy. All Coconala-related decisions, policies, and listing guidelines live here.

---

## Service Tiers

| | Basic | Premium |
|---|---|---|
| **Monthly fee** | ¥5,000 | ¥10,000 |
| **Hosting (Vercel)** | Included | Included |
| **Monthly changes** | 1 small | 2 small OR 1 medium |
| **Analytics** | Prior-month PDF | Full-year dashboard |
| **Security audit (WebMori)** | — | Quarterly (included) |
| **SEO audit (WebMori)** | — | Quarterly (included) |
| **DNS configuration** | Included | Included |

Unused monthly changes **do not roll over**.

**Why ¥5k/¥10k:** Pricing is set deliberately below the Coconala market anchor to maximize conversion volume. The free build is the primary differentiator — the monthly fee just needs to be low enough not to be a barrier. At ¥5,000 net ~¥3,900 after Coconala commission, you need ~38 active subs to clear ¥150k/mo net (Malaysia move threshold). The free build + quality of work retains clients; the low fee acquires them.

---

## Scope: Homepages & Landing Pages Only (Phase 1)

**Initially, ZeroEn only builds homepages and landing pages.** No dynamic sites, no auth, no databases.

### What's included in a free build:
- Single-page or multi-section homepage/landing page
- Responsive design (mobile-first)
- Contact form (external service — Formspree, Google Forms, etc.)
- Basic SEO setup (meta tags, OG tags, sitemap)
- Deployed on Vercel

### What's NOT included (Phase 1):
- User authentication / login systems
- Database-backed features (Supabase not needed for landing pages)
- E-commerce / payments
- Booking systems
- CMS / blog with admin panel
- Multi-page sites beyond 3-5 pages

### Why landing pages only:
1. **Speed:** A landing page takes 1-3 days, not 1-2 weeks. More clients per month.
2. **Zero infrastructure cost:** No Supabase needed. Pure static/SSG on Vercel free tier.
3. **Template leverage:** 80%+ of landing pages share the same structure. One solid template covers most clients.
4. **Lower maintenance burden:** Static sites rarely break. Monthly changes are simple.
5. **Clear scope:** "We build your homepage" is easier to sell than "we build anything."

### Phase 2 expansion (after 15+ clients):
- Add dynamic sites as a premium offering with separate pricing
- Supabase usage policy applies (client pays for Pro if limits exceeded)
- Scope and timeline quoted individually

---

## Upgrade / Downgrade Policy

- **Upgrade (Basic → Premium):** Allowed anytime. Prorated from upgrade date.
- **Downgrade (Premium → Basic):** Allowed after a 3-month minimum on Premium. Prevents gaming quarterly audits.

**Why allow upgrades:** Cautious Coconala buyers pick Basic to trial the service. Blocking upgrades permanently caps revenue. An a-la-carte audit at ¥15,000 is 3× the ¥5,000 monthly difference — the math sells the upgrade.

---

## Free Build Policy

### Phase 1: First 15 Clients (Free Build)
**Framing:** "First 5 priority slots — free website build + priority onboarding"

- Slot scarcity is more compelling than a time deadline
- After the 5 priority slots, free builds continue up to 15 total clients
- All free-build clients require a **6-month minimum subscription commitment**
- Do NOT use "April only" framing — it becomes dishonest when the free model continues

### Phase 2: After 15 Clients (Selective Free Builds)
- Free builds continue but become selective — prioritize clients with strong revenue potential, referral value, or equity fit
- Frame as: "Limited partner slots — applications reviewed on strategic fit"
- 6-month minimum subscription still required
- **Why selective:** Free builds consume ~1 week of unbilled labor each. At 20+ clients, maintenance compounds (20+ changes/month), so incoming free-build capacity is limited — not sold.

---

## A-La-Carte Pricing

Basic-tier clients can purchase premium services individually. See `HQ/crm/change-catalogue.md` for full pricing.

| Service | A-La-Carte Price | Included in Premium? |
|---------|-------------------|----------------------|
| Security audit (WebMori) | ¥15,000 | Yes (quarterly) |
| SEO audit (WebMori) | ¥15,000 | Yes (quarterly) |
| Small change | ¥4,000 | 1/mo (Basic), 2/mo (Premium) |
| Medium change | ¥10,000 | 1/mo (Premium only) |
| Large change | ¥25,000+ | Not included in any plan |

**Value prop for Premium:** Quarterly audits at ¥15,000 each × 4/yr = ¥60,000/yr of included value. Premium plan = ¥120,000/yr (+¥60,000 over Basic). Breakeven at just one extra audit per year — after that it's pure gain.

---

## Code Ownership & Exit

- **ZeroEn retains code rights permanently.** Client licenses the live site via active subscription — similar to Squarespace, Wix, or Shopify.
- **No code buyout option.** On cancellation, the site is archived and ZeroEn keeps the code. Clients rebuild elsewhere if they want to leave.
- **State this upfront in listings.** Clear upfront disclosure is essential — clients must understand they are paying for a hosted service, not receiving ownership of the codebase.

---

## Non-Payment Policy

| Day | Action |
|-----|--------|
| 0 | Payment due date |
| +1 | Automated reminder sent via dashboard |
| +14 | Grace period ends — site paused (maintenance page shown) |
| +44 | Site archived — agreement terminated |

Code rights remain with ZeroEn after termination. Client may reactivate within 90 days by paying all outstanding fees.

---

## Domain Policy

- **Client purchases their own domain.** ZeroEn handles DNS configuration (included in all plans).
- ZeroEn does NOT buy domains on behalf of clients.
- **Why:** Keeps ownership clean, eliminates liability on domain disputes/transfers.
- During build phase, sites use `.vercel.app` subdomains. Custom domain connected at launch.

---

## Communication Policy

| Phase | Channels |
|-------|----------|
| Build phase | Coconala messaging (acceptable) |
| Post-launch | ZeroEn dashboard only |
| First 5 clients (transition) | LINE allowed as secondary channel |

After the first 10 clients, enforce dashboard-only for all new clients.

---

## Coconala Platform Rules

**Coconala ToS prohibits taking transactions off-platform.** Billing directly via Stripe for clients acquired through Coconala risks an account ban — which kills the primary acquisition channel.

### Billing Strategy (Phased)

| Phase | Billing Method | Why |
|-------|---------------|-----|
| Months 1-6 | Coconala billing (~22% commission) | Build reviews, stay compliant, establish trust |
| Month 6+ | zeroen.dev for new clients (Stripe direct) | Own landing page bypasses Coconala commission |
| Ongoing | Coconala-acquired clients stay on Coconala billing | Don't migrate existing clients off-platform |

**The long-term play:** Use Coconala purely for lead generation and reviews. Build zeroen.dev as the primary conversion/billing funnel. New clients from zeroen.dev or direct referrals go straight to Stripe.

**Revenue after commission:** At 22% Coconala fee, ¥5,000 plan nets ¥3,900. ¥10,000 plan nets ¥7,800. Factor this into projections.

---

## Legal Structure

- **Entity:** Canadian sole proprietorship → Wyoming LLC (target: Sep 2026, ~$225 formation cost)
- **Malaysia (Nov 2026):** DE Rantau digital nomad visa. Wyoming LLC works internationally — no Malaysian business entity needed.
- **No 個人事業主 needed** — operator is Canadian, not Japan-resident. Coconala accepts international sellers.

---

## Client Scoring

Even on Coconala, score every applicant before accepting. A quick 5-question questionnaire filters out clients who will churn in month 2.

**Minimum criteria:**
- Has a clear purpose for the website (not "I just want one")
- Can articulate their target audience
- Has content ready or can provide it within 1 week
- Understands the 6-month commitment
- Responds to messages within 48 hours during onboarding

Coconala skews price-sensitive. Clients who choose "free" are often the highest-maintenance. Rejecting low-quality leads — even if it means fewer clients initially — protects your time and review scores.

---

## 6-Month Commitment Enforcement

The free build is justified by the 6-month subscription. Without enforcement, clients churn after month 1 and you've worked for free.

**Early cancellation policy:**
- Cancel within 6 months → client pays the remaining months on commitment
- Site is archived on cancellation; code is retained by ZeroEn (no handover)
- This must be agreed to **in writing before the build starts**
- On Coconala: include in the service description and confirm via message before accepting the order

---

## Supabase Usage Policy

Supabase free tier limits: 500MB database, 1GB file storage, 50,000 MAU, 2GB bandwidth.

- Simple/static sites: free tier is sufficient indefinitely
- Dynamic sites with auth: can approach limits as usage grows
- **If a client's usage exceeds free tier:** client is responsible for the Supabase Pro upgrade ($25/mo), either paid directly or added to their monthly bill
- State this in onboarding terms

---

## Revenue Targets

### With Coconala Commission (~22%)

| Milestone | Clients | Mix (B/P) | Gross MRR (¥) | Net after commission (¥) | Net ($) |
|-----------|---------|-----------|---------------|--------------------------|---------|
| Promo complete | 5 | 3B + 2P | ¥54,000 | ¥42,120 | ~$280 |
| 3-month target | 15 | 9B + 6P | ¥162,000 | ¥126,360 | ~$842 |
| Stretch goal | 25 | 15B + 10P | ¥270,000 | ¥210,600 | ~$1,404 |

### With Direct Billing (zeroen.dev clients, no commission)

| Milestone | Coconala Clients | Direct Clients | Combined Net ($) |
|-----------|-----------------|----------------|------------------|
| Month 6 (mixed) | 10 Coconala | 5 direct | ~$950-1,200 |
| Month 8 (mostly direct) | 12 Coconala | 10 direct | ~$1,500-2,000 |

**Key insight:** Coconala commission means you need ~20 Coconala-only clients to hit $1,000/mo net. With a direct channel (zeroen.dev), you hit it at ~15 mixed clients. Build the direct channel by July.

---

## Running Costs (Per Client)

| Item | Monthly | Notes |
|------|---------|-------|
| Vercel Pro share | ~¥150-300 | $20/mo shared across all clients |
| Supabase | ¥0 | Not needed for landing pages (Phase 1) |
| Domain | ¥0 | Client-owned, charged separately |
| Claude Code API | ~¥500-2,000 | Variable, depends on maintenance volume |
| Coconala commission | ~22% of gross | Only for Coconala-billed clients |

**Margin:** ~70% on Coconala-billed Basic, ~90%+ on direct-billed. The real cost is operator time.

---

## Malaysia Move Timeline (Target: November 2026)

| Deadline | Milestone | Status |
|----------|-----------|--------|
| Apr 25 | Coconala listing live + first client signed | |
| Jun 30 | 5 clients billing, 5+ Coconala reviews | |
| Jul 31 | zeroen.dev live with application form + Stripe billing | |
| Aug 31 | 12+ billing clients, $700+/mo net MRR | |
| Sep 15 | Wyoming LLC formed | |
| Oct 1 | DE Rantau visa application submitted (4-8 week processing) | |
| Oct 15 | ¥150,000+/mo net MRR confirmed for 2+ consecutive months — GO/NO-GO | |
| Nov | Move to Malaysia | |

**Malaysia living costs (KL):** ¥150,000-225,000/mo ($1,000-1,500) for rent, food, transport, coworking.

**Minimum MRR to move:** ¥150,000/mo net (~$1,000) sustained for 2+ months. Below this = delay move.

---

## References

- Change catalogue: `HQ/crm/change-catalogue.md`
- Client profiles: `HQ/crm/clients/<clientId>/profile.md`
- Brand kit: `HQ/brand/brand-kit.md`
- PRD: `PRD.md`
