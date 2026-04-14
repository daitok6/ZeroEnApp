# Risk Register — 90-Day MRR Push

**Owner:** finance-tracker (monitors) + operator (decides) · **Review cadence:** weekly Monday 09:00 · **Date:** 2026-04-14 · **Target:** ¥300k MRR by 2026-07-14

---

## How to use

Each risk has: trigger threshold, check cadence, action, owner. Walk the table every Monday. If a trigger has fired, the action executes *this week*, not next.

Status convention:
- 🟢 **Clear** — no concern, within expected range
- 🟡 **Watch** — within 20% of trigger threshold
- 🔴 **Triggered** — execute action immediately

---

## Risk table

| # | Risk | Trigger threshold | Check | Action on trigger | Owner |
|---|---|---|---|---|---|
| R1 | Coconala channel dead | <5 inquiries/wk by W4 (May 11) | Mon weekly | Shift 50% content weight to Lancers + cold outbound. Rework listing copy with mktg-copy | operator |
| R2 | Website conversion poor | apply_submit / visits <1% by W6 (May 25) | Mon weekly | Pause SEO work. Full CRO sprint — rerun mktg-cro A/B test plan | mktg-cro |
| R3 | MRR trajectory miss | <¥75k MRR by W7 (Jun 1) | Mon weekly | Drop Basic from outbound messaging. Push Premium-only positioning | operator + sales-advisor |
| R4 | Coconala fee erodes net | Net MRR <¥150k by W10 (Jun 22) | Mon weekly | Hard-route new sign-ups to zeroen.dev (Stripe-direct). Cap Coconala intake | operator |
| R5 | Positioning confusion re-emerges | Any prospect asks "wait, is it equity or SaaS?" | Ad-hoc | Freeze publishing. Rerun `positioning.md` review. Fix any inconsistent asset within 48h | mktg-strategy |
| R6 | Operator capacity slip | <15h/wk marketing for 2 consecutive weeks | Mon weekly | Drop Phase 3 growth loops (referral, OSS, PH). Double down on Phase 1-2 channels | operator |
| R7 | WebMori case study delayed | Not published by W5 end (May 18) | W4 Friday | Ship at best-available quality. Follow-up update post W7. Delay = silent damage to every channel | client-manager + mktg-copy |
| R8 | Cold outbound spam/bounce | >15% bounce rate OR any spam report | W2 after launch | Pause sequence. Verify DMARC/DKIM/SPF. Warm inbox 2 weeks. Rewrite copy | sales-advisor |
| R9 | Early churn | Any paying client cancels in first 2 months | Immediate | Post-mortem interview within 48h. Log at `HQ/crm/clients/<id>/churn.md`. Brief mktg-strategy + client-manager | client-manager |
| R10 | Review damage | Any Coconala rating <4★ | Immediate | Operator outreach within 24h. If fair critique, accept + publish response. If unfair, request Coconala mediation | operator |
| R11 | Tier-A listing dead (Lancers) | <3 applicants to any Lancers LP project we post by W6 | Mon weekly | Kill Lancers listing activity. Reallocate outbound 2× | sales-advisor |
| R12 | WebMori site deploy blocks | Not launched by W4 end (May 11) | Wed W4 | Launch with best available — iterate post-launch. Case study ships anyway | client-manager + web-developer |
| R13 | Stripe payout delay for JP | First payout >14 days after first sale | Stripe notifies | Escalate to Stripe JP support. Operator cash-flow plan for 30-day float | operator + finance-tracker |
| R14 | Brand/voice drift | Any published asset uses colors/fonts/phrases off-brand | Fri retro | Revert or edit asset. Log lesson in `content-log.md`. Update brand kit if justified | mktg-copy |
| R15 | Legal / ToS violation (Coconala) | Coconala flags listing for ToS (esp. billing off-platform) | Immediate | Pull listing. Revise per ToS. Re-submit. CLAUDE.md rule #12 reminder: intake fee is Coconala-only | operator |

---

## Weekly monitoring output

Every Monday, finance-tracker publishes `HQ/marketing/metrics/risk-check-<yyyy-mm-dd>.md`:

```
## Risk check — {date}

| # | Risk | Status | Current value | Trigger | Note |
|---|------|--------|---------------|---------|------|
| R1 | Coconala inquiries | 🟢 | 7/wk | <5/wk | Rising trend |
| R2 | Apply conversion | 🟡 | 1.2% | <1.0% | Close to watch |
| ... |

### Triggered actions this week
- ...

### Watches (near threshold)
- ...

### Recommendation
- ...
```

Published Monday 09:30 immediately after MRR review.

---

## Escalation path

- 🟡 (watch) — mention in Monday review, no action, monitor next week
- 🔴 (triggered) — action from the owner column this week; operator logs outcome in daily journal
- **2+ 🔴 in one week** — convene 30-min strategy session. mktg-strategy + sales-advisor + operator. Output: revised phase plan, pushed to `/Users/Daito/.claude/plans/golden-puzzling-bubble.md` as an amendment

---

## Top 3 most likely triggers (prior probability)

Based on agent research + market conditions:

1. **R2 (conversion poor)** — zeroen.dev is new, no testimonials yet until W5. High risk W2-W4. Mitigation: WebMori case study is the single highest-leverage asset — prioritize by any means.
2. **R3 (MRR miss)** — ¥300k in 90 days is a stretch. ¥200k base case is more likely. Plan already reflects this in MRR-forecast scenarios.
3. **R8 (outbound spam)** — cold email in JP has low tolerance. Warm inbox carefully, personalize aggressively.

---

## Related

- Plan: `/Users/Daito/.claude/plans/golden-puzzling-bubble.md`
- Positioning: `HQ/marketing/plan/positioning.md`
- Analytics: `HQ/marketing/plan/analytics-spec.md`
- Weekly rituals: `HQ/marketing/plan/weekly-rituals.md`
