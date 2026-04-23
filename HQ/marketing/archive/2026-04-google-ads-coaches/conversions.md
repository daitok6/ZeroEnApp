# Conversion Tracking Setup

**Primary conversion:** `apply_submit`
**Platform:** Google Ads + GA4 (dual tracking)

---

## Google Ads Conversion Action

| Setting | Value |
|---|---|
| Name | `apply_submit` |
| Category | Submit lead form |
| Value | ¥10,000 (LTV proxy: Basic×6mo = ¥30k gross ÷ 3 = ¥10k conservative) |
| Count | One (only count first conversion per click) |
| Click-through window | 30 days |
| View-through window | 1 day |
| Attribution | Data-driven (if unavailable: Last click) |
| Include in "Conversions" column | Yes |
| Include in bid optimization | Yes (after 30 conversions, switch to Max Conversions) |

**LTV proxy rationale:** Basic ¥5,000 × 6 months = ¥30,000 gross per client. Using ¥10,000 (33%) as conservative bid optimization signal. Revise to actual LTV after W4 when signed client data available.

---

## Google Ads Tag (gtag snippet)

After creating the conversion action in Google Ads, capture:
- **Conversion ID:** `AW-XXXXXXXXX` (fill in after account setup)
- **Conversion Label:** `XXXXXXXXXXXX` (fill in after account setup)

The tag is loaded sitewide via `HQ/platform/src/components/analytics/google-ads.tsx` in the layout.
Conversion fires on `/ja/apply/thank-you` and `/en/apply/thank-you` page mount.

```typescript
// Fire conversion (called from thank-you page on mount)
fireApplyConversion() // from @/components/analytics/google-ads
```

---

## GA4 Event

Per `HQ/marketing/plan/analytics-spec.md` line 24:

```
Event name: apply_submit
Required params:
  - icp_segment: string (self-reported occupation: coach | therapist | counselor | other)
  - referral_source: string (first-touch attribution from localStorage key 'attribution_source')
```

Called from `trackEvent` helper in `HQ/platform/src/components/analytics/google-analytics.tsx`:
```typescript
trackEvent({
  action: 'apply_submit',
  params: {
    icp_segment: occupation,         // form field value
    referral_source: attribution,    // from localStorage
  }
})
```

Also fires `apply_start` when any form field first gains focus (per analytics-spec line 23).

---

## Test Protocol

**Run after Block 3 (tracking setup) and before Block 7 (campaign enable):**

### Step 1 — Tag Assistant verification
1. Install [Google Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy) in Chrome
2. Enable recording, navigate to `https://zeroen.dev/ja/apply`
3. Fill out the form with test data (use email prefix `test_ads_verification_YYYYMMDD@example.com`)
4. Submit → redirect to `/ja/apply/thank-you`
5. Tag Assistant should show: gtag fires, conversion event fires with correct `send_to` value
6. GA4 DebugView (Google Analytics → Admin → DebugView): `apply_submit` event visible with `icp_segment` and `referral_source` params within ~5 seconds

### Step 2 — Mobile verification
1. Open Chrome mobile emulation (iPhone SE = 375px) OR use real device on mobile data
2. Repeat steps above
3. Confirm form renders correctly, submit button reachable without horizontal scroll
4. Confirm conversion fires

### Step 3 — Google Ads conversion status
1. Wait up to 3 hours after test conversion
2. Google Ads → Tools → Conversions → `apply_submit` → should show "1 conversion" in last 7 days
3. If status shows "No recent conversions" after 24h: recheck gtag snippet placement and `send_to` value format

### Step 4 — UTM verification
1. Navigate to `https://zeroen.dev/ja/apply?utm_source=google&utm_medium=cpc&utm_campaign=2026-first-5&utm_content=ad-1&utm_term=coach`
2. Submit the form
3. Check Supabase `lp_inquiries` table: `attribution_meta` column should contain `{utm_source: "google", utm_medium: "cpc", utm_campaign: "2026-first-5", ...}`

**All 4 steps must pass before enabling the campaign.**

---

## Kill Switch

If conversions stop firing after the campaign goes live (0 conversions for 3+ consecutive days with confirmed clicks):
1. Pause campaign immediately
2. Run Tag Assistant verification again on staging
3. Check Vercel env vars: `NEXT_PUBLIC_GOOGLE_ADS_ID` set and deployed
4. Check for CSP headers blocking gtag on zeroen.dev
5. Do not re-enable until test conversion confirmed
