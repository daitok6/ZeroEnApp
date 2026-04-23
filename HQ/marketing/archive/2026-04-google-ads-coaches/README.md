# Campaign: Google Search Ads — Coaches JP (First-5)

**Name:** `GOOG_Search_Coaches-JP_FreeLP_2026Q2`
**Platform:** Google Search only (no Display, no Partners)
**Status:** DRAFT → awaiting mktg-copy + mktg-strategy review, then launch
**Launch date:** 2026-04-15 (target)
**Owner:** operator (mktg-paid tactical exception — see `HQ/agents/mktg-paid.md`)

---

## Objective

Drive JP coach/therapist/counselor prospects to submit the `/apply` form on zeroen.dev. This is the first paid channel ZeroEn has ever run — purely R&D spend to build battle-tested ad copy and gather early conversion data ahead of the Oct 15 Malaysia GO/NO-GO gate.

**KPIs (first 30 days):**
| Metric | Target | Kill threshold |
|---|---|---|
| Avg daily impressions | 150+ | — |
| Click-through rate (CTR) | ≥2.0% | <0.8% by day 14 → pause worst ad |
| Apply form submissions | 4 (1/wk) | 0 by day 14 → audit landing page first |
| Cost per submission | <¥2,500 | >¥5,000 by day 21 → pause & review |

---

## Budget

| Item | Value |
|---|---|
| Daily budget | ¥170 |
| Monthly cap | ¥5,100 (account hard stop: ¥5,500) |
| Max CPC bid cap | ¥150 |
| Bid strategy | Maximize Clicks → Maximize Conversions (after 30 conv) |

See `budget-pacing.md` for full pacing rules.

---

## ICP

**Primary:** JP solo coaches / therapists / counselors
- Age 32–52, ~70% women, ¥3-12M/yr income
- Launched practice (6–36mo) but broken/absent LP
- Entire sales funnel depends on the LP
- Currently on ペライチ or no site at all

Source: `HQ/marketing/research/icp-profile.md`

---

## Offer

> 前金0円。LPは無料で作ります。月¥5,000で、制作・運用・毎月の改善まで。6ヶ月から。

All ad copy pins to `HQ/marketing/plan/positioning.md` hero line. No drift allowed (Risk R5).

---

## Conversion Funnel

```
Google Search → Ad → zeroen.dev/ja/apply → form submit → /ja/apply/thank-you
                                                              ↓
                                           GA4: apply_submit + Google Ads conversion
```

Conversion action: `apply_submit` — website form submit, ¥10,000 LTV proxy (Basic×6mo÷3), count One.

---

## Campaign Settings

| Setting | Value |
|---|---|
| Campaign type | Search |
| Goal | Leads |
| Bid strategy | Maximize Clicks (max CPC ¥150) |
| Networks | Search only — Display ✗ Partners ✗ |
| Location | Japan (Presence, not Interest) |
| Language | Japanese |
| Ad rotation | Optimize |
| Ad schedule | All hours (narrow in W3 with data) |
| Devices | All (adjust in W2 with data) |
| Audience | Observation only: Business Services in-market + Business Professionals affinity |

---

## Ad Group

**AG1:** `AG1_Coach-LP_Exact-Phrase`
- 13 keywords (exact + phrase only) — see `keywords.md`
- 3 RSA ads — see `ads.md`
- All negatives from shared list — see `negatives.md`

---

## Ad Extensions

| Extension | Content |
|---|---|
| Sitelinks (4) | 料金を見る → /pricing · よくある質問 → /#faq · 制作事例 → /cases · 応募する → /apply |
| Callouts (6) | 前金0円 / 月¥5,000から / 6ヶ月契約 / 3日で公開 / 元日立・元楽天 / 先着5名 |
| Structured snippet | Services: LP制作, 運用・改善, ホスティング, アナリティクス, Stripe連携 |

---

## Review Gate (Block 5)

All ads must be reviewed and approved before campaign is enabled.

| Reviewer | Status | Date |
|---|---|---|
| mktg-copy | ⬜ PENDING | — |
| mktg-strategy | ⬜ PENDING | — |

---

## Sibling files

| File | Purpose |
|---|---|
| `keywords.md` | 13 keywords with match types and rationale |
| `negatives.md` | Account-level negative keyword list |
| `ads.md` | 3 RSA ad variations (JP) |
| `conversions.md` | Conversion action setup + test protocol |
| `budget-pacing.md` | Daily cap, bid progression, kill switches |
| `week-1-optimization.md` | Day-by-day iteration rules |
| `launch-checklist.md` | Pre-enable binary checklist |
