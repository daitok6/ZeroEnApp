# Pre-Launch Checklist

Operator runs through this before clicking "Enable" on the campaign. ALL items must be ✅ YES.

Estimated time to complete: 20 minutes.

---

## Infrastructure

- [ ] `https://zeroen.dev/ja/apply` is publicly accessible (no auth required, no redirect to /login)
- [ ] Form renders correctly on mobile (iPhone SE = 375px viewport via Chrome DevTools)
- [ ] Form loads in < 3 seconds on 4G throttled (Chrome DevTools → Network → Slow 4G)
- [ ] All 5 form fields visible above the fold on 375px viewport
- [ ] Submit button is Electric Green `#00E87A`, tap target ≥ 44px height
- [ ] APPI consent checkbox present, links to `/privacy`
- [ ] Submit → redirects to `/ja/apply/thank-you`

## Conversion Tracking

- [ ] Test form submission completed (throwaway email used)
- [ ] GA4 DebugView shows `apply_submit` event within 5 seconds of thank-you page load
- [ ] `apply_submit` params correct: `icp_segment` and `referral_source` present
- [ ] Google Ads conversion status shows test conversion (allow up to 3 hours)
- [ ] Tag Assistant shows `AW-XXXXXXX` firing on thank-you page
- [ ] Mobile conversion test passed (same as above but on mobile browser)

## UTM Attribution

- [ ] Navigate to `/ja/apply?utm_source=google&utm_medium=cpc&utm_campaign=2026-first-5&utm_content=ad-1&utm_term=coach`
- [ ] Submit form → check Supabase `lp_inquiries` table → `attribution_meta` JSON includes UTMs
- [ ] `first_touch` field matches stored localStorage value

## Campaign Settings

- [ ] Campaign name: `GOOG_Search_Coaches-JP_FreeLP_2026Q2`
- [ ] Daily budget: ¥170
- [ ] Account monthly spending limit: ¥5,500 (set under Billing → Account budget)
- [ ] Network: Search only — Display Network ✗ — Search Partners ✗
- [ ] Location: Japan only, "Presence" not "Interest in"
- [ ] Language: Japanese only
- [ ] Bid strategy: Maximize Clicks, max CPC ¥150
- [ ] Ad rotation: Optimize

## Ad Group

- [ ] Ad group `AG1_Coach-LP_Exact-Phrase` created
- [ ] All 13 keywords uploaded with correct match types (exact or phrase, NO broad)
- [ ] Shared negative list `ZeroEn_GlobalNegatives` applied
- [ ] All 3 RSA ads active (no disapprovals)
- [ ] Final URLs include UTM params (`utm_source=google&utm_medium=cpc&utm_campaign=2026-first-5`)

## Extensions

- [ ] 4 sitelinks live: 料金を見る / よくある質問 / 制作事例 / 応募する
- [ ] 6 callouts live: 前金0円 / 月¥5,000から / 6ヶ月契約 / 3日で公開 / 元日立・元楽天 / 先着5名
- [ ] Structured snippet (Services) live: LP制作, 運用・改善, ホスティング, アナリティクス, Stripe連携

## Automated Rules

- [ ] Rule 1 (pause low-CTR ads) configured — see `budget-pacing.md`
- [ ] Rule 2 (pause wasted keywords) configured
- [ ] Rule 3 (pause campaign at ¥5,500 monthly cap) configured

## Creative Review

- [ ] mktg-copy approval logged in `ads.md` review section with date
- [ ] mktg-strategy approval logged in `ads.md` review section with date

## Post-Launch Actions (within 1 hour of enabling)

- [ ] Open Google Ads Overview tab — confirm campaign status = ELIGIBLE
- [ ] Search for `[コーチング ホームページ]` from JP IP or mobile data, confirm ad appears
- [ ] Monday 2026-04-20 09:00 review slot booked in operator calendar
- [ ] `HQ/marketing/plan/content-calendar.md` updated with Google Ads launch row
- [ ] `HQ/marketing/metrics/funnel.md` Google Ads row initialized with ¥0 spend, 0 clicks, 0 submissions

---

**Campaign enabled by:** _________________ **Date/time:** _________________
