# Phase 0 Summary — Research + Reconciliation (2026-04-14)

**Status:** Phase 0 research & planning docs complete. Ready for operator review + Coconala rebrand execution.
**Next gate:** 2026-04-20 (end of W1) — all Phase 0 artifacts signed off, Coconala rebranded, zeroen.dev v2 copy merged, GA4 firing.
**90-day target:** ¥300k MRR by 2026-07-14 (base case ¥200k, stretch ¥300k).

---

## What's in this summary

1. Headline findings from the research
2. The single positioning decision that unblocks everything
3. What was produced (every file path)
4. What the operator must do this week
5. What each marketing agent does next

---

## Headline findings

### 1. The saturated segment: JP solo coaches / therapists / counselors (score 22/25)

`HQ/marketing/research/market-saturation.md` evaluated 7 JP solopreneur segments against 5 dimensions (LP need, WTP, channel reachability, ICP fit, competitive saturation). Winner by a margin:

| # | Segment | Score | Why |
|---|---|---|---|
| 1 | **Coaches / therapists / counselors** | **22/25** | Entire sales funnel = LP. 70% female operators, 32-52, ¥3-12M/yr. Launched but pre-scale. Willing to pay monthly because it *feels like a business tool, not a website fee*. |
| 2 | Solo consultants (経営/IT/法務/税務) | 20/25 | Higher WTP, need refreshed LP. Proof points differ, use as spillover ICP. |
| 3 | Small service businesses | 14/25 | LP ≠ MEO. Out of scope Phase 1. |
| 4 | 副業 side-hustlers | 9/25 | Won't pay recurring. Skip. |
| 5 | 士業 (legal/accounting) | 13/25 | Slow sales cycle. Phase 2 post-Aug. |

**Canonical ICP:** `HQ/marketing/research/icp-profile.md` — one page, opens in under 10 seconds.

### 2. The competitive hole: "fast + cheap + done-for-you" is empty

`HQ/marketing/research/competitor-matrix.md` — 11 competitors across 3 tiers, plotted price × speed:

- **ペライチ/STUDIO/Wix JP** — cheap (¥1,465-3,500/mo) but DIY. Hundreds of hours of customer work.
- **Coconala/Lancers freelancers** — done-for-you (¥50-150k one-off) but slow + no recurring relationship.
- **Agencies** — done-for-you but ¥500k-2M floor, 2-3 month timeline.
- **ZeroEn** — done-for-you, 3 days, ¥0 upfront + ¥5k/mo. **No one else is in this cell.**

Mermaid quadrant in the file shows ZeroEn isolated at [0.12, 0.90] — fast + cheap + high-service.

### 3. Demand is massive and underserved

`HQ/marketing/research/demand-signals.md`:
- **Coconala LP category (503):** 4,680 active listings, median price ¥92,500
- **Coconala HP category (500):** 12,115 active listings, median ¥150k
- **Wepage 2024 survey:** 81.7% of Japanese 個人事業主 have no homepage
- **JP freelance population (Lancers 2024):** 15.7M people

Even at a fractional capture, the addressable market is orders of magnitude larger than the 45-client target.

### 4. Keyword priorities (SEO)

`HQ/marketing/research/keyword-demand.md` — top 3 primary clusters:

| Keyword | Monthly volume | SERP difficulty | Why it matters |
|---|---|---|---|
| ホームページ作成 個人事業主 | 12,100 | Medium | Direct ICP match |
| LP制作 格安 個人 | 6,000 | Low-Medium | Price-sensitive buyers searching with intent |
| 月額制 ホームページ | 2,400 | Low | Exact-match for the business model |

Plus 5 programmatic-SEO templates (e.g., `/templates/coaching-lp`, `/templates/consultant-lp`) to stack long-tail terms starting W3.

### 5. Pricing: current ¥5k/¥10k is correctly positioned

`HQ/marketing/research/pricing-benchmarks.md` — 12+ concrete market price points:
- **Keep** ¥5k / ¥10k as-is. Sits cleanly between ペライチ (¥1,465) and Coconala freelancer one-offs (¥50-150k).
- **Consider** a ¥15k Premium+ tier by W8 (bridge to agency retainer buyers, per market research)
- **Consider** raising Coconala intake to ¥3,000 after client #5 (signals quality, screens tire-kickers)

### 6. Outbound channels ranked

`HQ/marketing/research/demand-signals.md` + NotebookLM strategic briefing:
1. **Coconala** — warm intent, platform SEO (-22% net)
2. **Note JP** — credibility + referral chain to every other channel (free)
3. **X JP** — daily build-in-public, cheap reach, compounds (free)
4. **zeroen.dev direct** — 0% fee, highest margin, needs traffic (paid via SEO)
5. **Lancers** — mirror of Coconala (-20% net)
6. **Cold outbound** — independent of platform algorithms, 50-100/wk
7. **CrowdWorks / MENTA / TimeTicket** — set-and-forget
8. **LinkedIn / paid ads** — dormant, unlock if MRR >¥150k by W8

---

## The positioning decision (unblocks everything else)

**Before:** zeroen.dev pitched "Free MVP + 10% Equity, AI Technical Co-Founder" while the Coconala campaign pitched "Free LP + ¥5,000/mo". Two offers in two languages to two audiences with no internal link — a prospect visiting both gets whiplash.

**Decision (operator, 2026-04-14):** SaaS is primary. Equity pitch moves to `/startups` gated route — not killed, just not led with.

**The single offer, used everywhere for 90 days:**

> **前金0円。LPは無料で作ります。月¥5,000で、制作・運用・毎月の改善まで。6ヶ月から。**

Canonical spec: `HQ/marketing/plan/positioning.md` — hero copy (JP + EN), nav, pricing table, FAQ, do's & don'ts. Every asset must match this file. Any drift = a bug, fixed within 48h (see Risk R5).

---

## Deliverables produced (Phase 0)

### Research (`HQ/marketing/research/`)

| File | Lead agent | What it's for |
|---|---|---|
| `market-saturation.md` | mktg-strategy | Segment scoring heatmap — picks the ICP |
| `icp-profile.md` | mktg-strategy | One-page ICP with pains/triggers/objections |
| `competitor-matrix.md` | mktg-strategy | 11 competitors + positioning quadrant |
| `keyword-demand.md` | mktg-seo | SEO plan: top keywords + 5 programmatic templates |
| `pricing-benchmarks.md` | mktg-strategy | Recurring pricing evidence across JP market |
| `demand-signals.md` | sales-advisor | Live demand counts (Coconala/Note/X) |
| `notebooklm/strategic-briefing.md` | NotebookLM | Exec summary synthesizing all 11 indexed sources |
| `notebooklm/market-positioning-infographic.png` | NotebookLM | Shareable visual (heatmap + pricing ladder + stats) |

**NotebookLM notebook:** https://notebooklm.google.com/notebook/165ea4e5-2159-4439-b1c8-87a5e10625ef

### Plan (`HQ/marketing/plan/`)

| File | Owner | What it's for |
|---|---|---|
| `positioning.md` | mktg-gtm | Single-source offer doc. Every asset references this. |
| `analytics-spec.md` | mktg-cro | GA4 events + UTM schema + 4 dashboards |
| `content-calendar.md` | ops-scheduler | Weekly cadence + 13-week roadmap + topic banks |
| `weekly-rituals.md` | operator | Mon-Sun operator rhythm (15-25h/wk) |
| `risk-register.md` | finance-tracker | 15 risks with triggers + kill-switches |
| `phase-0-summary.md` | (this file) | Operator status report |

### Approved plan

`/Users/Daito/.claude/plans/golden-puzzling-bubble.md` — the 90-day plan (5 phases, weekly gates, exit criteria).

---

## What the operator must do this week (Apr 14-20)

Ordered by urgency. Nothing publishes until all 6 are done.

| # | Action | Owner | Deadline | Notes |
|---|---|---|---|---|
| 1 | **Execute Coconala rebrand** — `webmori` → ZeroEn/大都 | operator | Apr 16 | Follow `HQ/marketing/campaigns/2026-04-first-5/webmori-takedown-checklist.md` step-by-step. Ratings carry over via rename. |
| 2 | **Read and sign off `HQ/marketing/plan/positioning.md`** | operator | Apr 15 | This is the blocking artifact. Everything downstream references it. 15-min read. |
| 3 | **Update `HQ/platform/src/app/[locale]/page.tsx`** — SaaS hero, add `/startups` route | web-developer | Apr 18 | Per `positioning.md` hero copy. Equity pitch moves intact to `/startups`. |
| 4 | **Instrument GA4 + UTM capture** | web-developer | Apr 20 | Per `HQ/marketing/plan/analytics-spec.md` implementation checklist (11 events, 7 UTM sources). DebugView must confirm. |
| 5 | **WebMori baseline capture** (screenshots, goals, timeline, quotes) | client-manager | Apr 20 | Feeds Week 5 case study — the single highest-leverage asset in the plan. |
| 6 | **Review NotebookLM briefing + infographic** | operator | Apr 17 | `HQ/marketing/research/notebooklm/strategic-briefing.md` + `market-positioning-infographic.png`. 20 min. Note any surprises. |

**Phase 0 exit gate (Apr 20):** 6/6 above ✅ → Phase 1 publishing begins Apr 21.

---

## What each marketing agent does next

| Agent | W2 action | W3-4 action |
|---|---|---|
| `mktg-strategy` | Approve Rule #9 batch for Note article + X threads (Fri Apr 17) | Replenish Note topic bank monthly |
| `mktg-copy` | Voice-review all W2 posts against `positioning.md` do's/don'ts | Draft WebMori case study (W4-5) |
| `mktg-seo` | Target top-3 keywords in Note article meta + zeroen.dev `/pricing` | Programmatic SEO template scaffolding |
| `mktg-cro` | Confirm GA4 events fire + UTMs captured | Build weekly funnel dashboard template |
| `mktg-gtm` | Final positioning sign-off with operator | Co-own Product Hunt playbook (W10) |
| `mktg-growth` | — (Phase 3) | Referral program spec (W8) |
| `mktg-paid` | — | Dormant until MRR >¥150k |
| `sales-advisor` | Draft cold email COACH-01 + 25-person target list | Batch send pilot (W3) |
| `sales-closer` | Proposal template matching `positioning.md` | Close first 2 Basic signs |
| `client-scorer` | Score any inbound applicants (15+/20 rubric) | Weekly pipeline review with sales-advisor |
| `client-manager` | WebMori baseline + weekly check-ins | Case study publication + onboarding templates |
| `ops-scheduler` | Publish W2 content calendar Mon Apr 21 | Enforce Rule #9 batch review Fridays |
| `finance-tracker` | First funnel + risk check Mon Apr 27 | Every Monday thereafter |

---

## Math to ¥300k MRR — reality check

Target mix to hit ¥300k gross: **30 Basic × ¥5k + 15 Premium × ¥10k = ¥300k/mo**

At ~22% Coconala blended take, net depends on channel split. If half the 45 clients come via Coconala and half via zeroen.dev-direct, net MRR is ~¥267k. The plan explicitly routes new clients to Stripe-direct from W8 to protect net (see Risk R4 kill-switch).

**Base case: ¥200k (20 Basic + 10 Premium).** Still clears the Oct 15 Malaysia GO/NO-GO gate (¥150k+/mo).

The lever that converts base → stretch is cold outbound volume at 50-100/wk. If Thursday batches underperform by W6, the plan downshifts to ¥200-250k and refocuses content density on Coconala + Note.

---

## Open questions (resolve by Apr 28)

1. **`/startups` visibility** — main nav or hidden-link-only? (per `positioning.md` open questions)
2. **Coconala intake fee** — hold at ¥1,000 or raise to ¥3,000 after client #5? (pricing-benchmarks recommendation)
3. **Premium+ ¥15k tier** — out of scope Phase 0-1, decide by W8
4. **Cold outbound tool** — Buttondown vs ConvertKit vs manual Gmail? (operator preference, logged in weekly-rituals tool stack)

These are not blocking for W2 launch. Note them; return to them at the Fri Apr 24 retro or earlier if a customer surfaces one.

---

## Related

- Plan: `/Users/Daito/.claude/plans/golden-puzzling-bubble.md`
- Positioning: `HQ/marketing/plan/positioning.md`
- Content calendar: `HQ/marketing/plan/content-calendar.md`
- Weekly rituals: `HQ/marketing/plan/weekly-rituals.md`
- Risk register: `HQ/marketing/plan/risk-register.md`
- Analytics spec: `HQ/marketing/plan/analytics-spec.md`
- NotebookLM: https://notebooklm.google.com/notebook/165ea4e5-2159-4439-b1c8-87a5e10625ef
