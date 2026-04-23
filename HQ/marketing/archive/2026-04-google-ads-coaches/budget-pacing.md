# Budget Pacing — ¥5,000/mo R&D Campaign

---

## Budget Settings

| Setting | Value | Why |
|---|---|---|
| Daily budget | ¥170 | ¥5,100/mo total, minimal buffer over ¥5k target |
| Google auto-smooth ceiling | ¥204/day | Google may spend up to 2× daily budget on high-intent days, smoothed over the month |
| Account monthly spending limit | **¥5,500** | Hard stop — belt + suspenders. Set under Billing → Account budget. If hit, all campaigns pause. |
| Max CPC bid cap | ¥150 | Prevents runaway CPCs on broad-match-like queries in phrase match |

**30-day worst-case spend:** ¥204 × 30 = ¥6,120 (if Google consistently over-spends every day — extremely unlikely). Account cap of ¥5,500 prevents this.

---

## Bid Strategy Progression

| Phase | Trigger | Strategy | Notes |
|---|---|---|---|
| **Phase 1 (launch)** | Day 1 | Maximize Clicks, max CPC ¥150 | Build impression/click data. Do NOT switch early. |
| **Phase 2** | ≥30 conversions AND ≥4 weeks | Maximize Conversions | Switch only when both conditions met. Fewer than 30 = underfed algorithm. |
| **Phase 3** | ≥50 conversions AND ≥6 weeks | Target CPA = ¥3,500 | Based on actual historical CPA from Phase 2 data. Adjust target if needed. |

**WARNING:** Do not switch bid strategy before 30 conversions. At ¥5k/mo budget, 30 conversions = ~3–4 months minimum unless CPC is very low. Accept that bid strategy will stay at Phase 1 for most of Q2.

---

## Automated Kill-Switch Rules

Set up these 3 rules under Google Ads → Tools → Automated Rules:

### Rule 1 — Pause underperforming ads
- **If:** Ad CTR < 0.5% AND impressions > 500 in last 30 days
- **Then:** Pause ad
- **Frequency:** Weekly (Monday 09:00 JST)
- **Email notification:** operator email

### Rule 2 — Pause wasted keyword spend
- **If:** Keyword cost > ¥1,000 AND conversions = 0 in last 14 days
- **Then:** Pause keyword
- **Frequency:** Weekly (Monday 09:00 JST)
- **Email notification:** operator email

### Rule 3 — Pause campaign at monthly cap
- **If:** Campaign cost > ¥5,500 in current calendar month
- **Then:** Pause campaign
- **Frequency:** Daily (06:00 JST)
- **Email notification:** operator email

---

## Manual Weekly Review (every Monday)

1. Open Google Ads → Overview tab
2. Check: total spend this month vs. pacing (should be ~¥170 × days elapsed)
3. Check: any policy disapprovals (flag immediately if yes)
4. Check: CTR by ad (any below 0.8% after 200+ impressions = candidate to pause)
5. Check: Search Terms report for new negative candidates
6. Update `HQ/marketing/metrics/funnel.md` Google Ads row

---

## Spend Philosophy

> "If we only spend ¥80/day but those ¥80 are converting, under-pacing is success, not failure."

Do NOT raise bids purely to hit the ¥170/day target. The ¥170 cap is a ceiling, not a floor. If keyword volume is low (likely in early weeks), underspend is fine — it means the keyword pool is tight and intentional.

Only increase bids if: (a) impression share is consistently <30% with known-intent keywords, AND (b) CTR is positive, AND (c) cost is tracking well under cap.
