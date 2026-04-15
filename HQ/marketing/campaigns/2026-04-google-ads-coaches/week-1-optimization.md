# Week 1 Optimization Rules

**Critical rule:** Do not touch anything for the first 3 days after launch. Google's learning phase needs data before your interference helps. Every significant change during learning resets the algorithm's data.

---

## Days 1–3: Data Collection Phase

**Do:**
- Monitor for policy disapprovals (check daily)
- Monitor for obvious budget leaks (check spend pacing)
- Note down any Search Terms queries that look clearly wrong (save to review on day 4)

**Do NOT:**
- Change bids
- Pause keywords
- Edit ad copy
- Add negatives (exception: if an obviously offensive/irrelevant term appears with 5+ clicks, add it immediately)
- Change budget

---

## Days 4–7: First Tune

### Search Terms review
Go to Google Ads → Keywords → Search Terms. Filter: last 7 days.

**Add as exact match if:**
- Query has 2+ clicks AND
- CPC was under ¥150 AND
- The query clearly matches our ICP (coach/therapist/counselor + LP/HP)

**Add as negative (campaign-level) if:**
- Query has 1+ clicks AND
- 0 form page views (check via GA4 landing page report) AND
- Query is clearly off-ICP (副業, 転職, 自作, 学生, 無料作成, etc.)

### Ad performance
- Pause any ad where CTR < 0.7% AND impressions > 200
- Do NOT pause based on impressions < 100 — not enough data

### Keyword performance
- If a keyword has spent > ¥500 with 0 clicks: check if match type is correct and if the keyword is actually triggering any queries
- If a keyword consistently shows avg CPC near ¥150 cap: may be losing auctions; consider raising cap to ¥200 only if budget allows

**Do NOT change bid strategy yet.**

---

## Week 2: First Optimization Gate

### If CTR avg across all 3 ads is > 2.0%:
→ Winning hook angle identified. Write Ad 4 as a variation of the best-performing headline combination. Pause the lowest-CTR ad.

### If zero form submissions by day 14:
→ STOP. Do not increase budget or change keywords.
→ Audit the landing page first:
1. Does `/ja/apply` load under 3 sec on mobile (4G throttled)?
2. Is the form visible above the fold on iPhone SE?
3. Check GA4: are users hitting `apply_start`? If yes → form fields might be confusing. If no → CTA is not visible.
4. Fix landing page issues before resuming ad changes.

### If cost per form submission is trending > ¥3,500 (based on limited data):
→ Tighten keyword list to top-intent only: pause #9 (`"月額制 ホームページ"`) and #13 (`"LP制作 月額"`) — these are broader
→ Focus budget on coach/counselor/therapist exact matches and the ペライチ problem-aware keywords

---

## Week 3+: Ongoing Cadence

Every Monday (30 min):
1. Pull Search Terms → add/negative
2. Review ad performance → pause/promote
3. Review budget pacing (any over/underspend?)
4. Update `HQ/marketing/metrics/funnel.md` Google Ads row with:
   - Impressions, Clicks, CTR, Avg CPC, Spend
   - apply_start events (from GA4)
   - apply_submit conversions
   - New Supabase rows from `lp_inquiries`
5. Compare: paid vs. organic vs. cold-email in funnel.md — is paid pulling its weight?

---

## Month 1 Gate (≈2026-05-15)

If after 30 days:
- CPA > ¥5,000 per submission (not signed client — just submission): **pause campaign**, diagnose copy/ICP/landing page
- CPA < ¥2,500 AND ≥2 Stripe subscriptions started from paid channel: **increase budget to ¥300/day** (document this decision)
- 0 submissions from paid channel with confirmed clicks and CTR > 1%: **landing page or offer problem** — fix before increasing budget

---

## What to NEVER do before sufficient data

- Do NOT switch to automated bidding before 30 conversions
- Do NOT run more than 1 campaign simultaneously at this budget (dilutes learning)
- Do NOT copy the same campaign structure to target a different ICP (consultants) until coach campaign has 10+ conversions
- Do NOT add broad match keywords at any budget under ¥500/day
