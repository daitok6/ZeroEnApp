# Analytics & Attribution Spec — 2026-Q2

**Owner:** mktg-cro · **Implemented by:** web-developer · **Consumed by:** finance-tracker (Monday reports) · **Date:** 2026-04-14

---

## Purpose

Instrument zeroen.dev so every channel's contribution to the ¥300k MRR target is measurable. Detect funnel leaks within 72h. Trigger risk-register kill-switches on evidence, not intuition.

---

## GA4 events

Property: `zeroen-dev-prod`. Fallback: Vercel Web Analytics for path-level data.

| Event | Trigger | Required params |
|---|---|---|
| `page_view` | Every page load | `page_location`, UTM params (captured client-side) |
| `hero_cta_click` | Any hero button click | `cta_label`, `cta_destination` |
| `pricing_view` | `/pricing` reaches 50% scroll OR 15s dwell | `plan_focused` (inferred from hover/scroll position) |
| `plan_selected` | Click on Basic or Premium CTA | `plan` = `basic` \| `premium` |
| `apply_start` | `/apply` first field focused | — |
| `apply_submit` | Form submitted successfully | `icp_segment` (self-reported), `referral_source` (self-reported) |
| `startups_apply_submit` | `/startups` apply form submit | `stage`, `sector` |
| `stripe_checkout_start` | Redirect to Stripe checkout | `plan`, `amount` |
| `stripe_checkout_complete` | Stripe webhook confirms payment | `plan`, `amount`, `subscription_id` (server-side event) |
| `outbound_click` | Click on external link (Coconala/Lancers/case URL) | `destination`, `context` |
| `case_study_view` | `/cases/[slug]` 50% scroll | `case_id` |

All events also log a `channel_hint` param derived from captured UTMs (last-touch) for in-GA4 segmentation.

---

## UTM schema

Every external inbound link into zeroen.dev MUST carry UTMs. No exceptions.

```
utm_source = coconala | lancers | crowdworks | menta | timeticket | note | x-jp | x-en | linkedin | cold-email | referral | qr-card | podcast | newsletter
utm_medium = listing | organic-social | paid-social | email | referral | direct | podcast | print
utm_campaign = 2026-q2 | 2026-first-5 | ref-program | webmori-case | premium-upsell | ph-launch
utm_content = <asset-id>  # e.g. coconala-listing-v1, x-thread-001, note-article-slug
utm_term = <segment>      # coach | consultant | startup | other
```

**Shortlink builder:** `HQ/marketing/plan/utm-builder.md` (operator task — W1 end, or use Bitly/TinyURL free tier with named tags).

---

## Attribution rules

- **First-touch:** stored in `localStorage` on first landing, submitted with `apply_submit`.
- **Last-touch:** GA4 default attribution (data-driven), also captured in Stripe customer metadata as `attribution_source`.
- **Reporting default:** last-touch. **Strategy review:** first-touch monthly.
- **Cross-channel journey:** use GA4 "conversion path" reports monthly.

---

## Dashboards

### 1. Weekly funnel — `HQ/marketing/metrics/funnel.md`

Published Mondays 09:00 by finance-tracker. Columns per channel:

| Channel | Impressions | Visits | apply_start | apply_submit | Scored 15+/20 | Proposal sent | Signed | MRR added |
|---|---|---|---|---|---|---|---|---|

Deltas vs prior week. Red cells for any MoM drop >20%.

### 2. MRR forecast — `HQ/marketing/metrics/mrr-forecast.md`

Three scenarios plotted as Mermaid line chart:
- **Base (¥200k):** 20 Basic × ¥5k + 10 Premium × ¥10k = ¥200k
- **Target (¥250k):** 25 Basic + 12 Premium = ¥245k ~= ¥250k
- **Stretch (¥300k):** 30 Basic + 15 Premium = ¥300k

Actual MRR overlaid weekly.

### 3. Coconala scrape — `HQ/marketing/metrics/coconala-weekly.md`

No Coconala API. Manual Monday scrape:
- Listing views (if shown)
- Favorite count
- Active consults (相談中)
- New DMs this week
- Ratings count + avg

Automation candidate for Phase 2 (Playwright scrape).

### 4. Cohort retention (once clients > 10)

Monthly cohort: sign date → retained m+1 / m+2 / m+3. Fed by Stripe subscription status.

---

## Privacy & consent

- **APPI compliance (JP):** consent banner required before GA4 fires — Next.js cookie banner with accept/reject.
- **No PII** in GA4 events beyond hashed user ID.
- **Stripe** handles all payment data. Never stored in client CRM or GA4.
- `robots.txt` + `noindex` on admin routes.

---

## Implementation checklist (owner: web-developer)

- [ ] Install GA4 via Next.js App Router — `providers/analytics.tsx` component
- [ ] Wire all 11 events listed above; verify in GA4 DebugView
- [ ] Capture UTMs on landing → `localStorage` → submit with `apply_submit`
- [ ] Stripe webhook → append `attribution_source` to customer metadata
- [ ] APPI consent banner (ja.wix-style: 同意する / 詳細を見る)
- [ ] UTM builder page or tooling documented in `HQ/marketing/plan/utm-builder.md`
- [ ] Weekly funnel dashboard template in `HQ/marketing/metrics/funnel.md` (manual fill for W1-4, auto-populate from GA4 API after W5)

**Done when:** DebugView shows all 11 events with correct params within 2h of deploy. Test flow: click X JP thread → land → apply → checkout → subscription → every event fired with UTMs.

---

## Ownership of weekly capture

| Metric source | Who captures | Cadence | Target file |
|---|---|---|---|
| GA4 events | finance-tracker (via GA4 API) | Mon 09:00 | `funnel.md` |
| Stripe MRR | finance-tracker (Stripe Sigma) | Mon 09:00 | `funnel.md` + `mrr-forecast.md` |
| Coconala listing stats | operator (manual scrape) | Mon 09:00 | `coconala-weekly.md` |
| Lancers project stats | operator (manual scrape) | Mon 09:00 | `coconala-weekly.md` (same file) |
| X analytics | mktg-copy (X native dashboard) | Fri retro | `content-log.md` |
| Note analytics | mktg-copy | Fri retro | `content-log.md` |

---

## Related

- Positioning: `HQ/marketing/plan/positioning.md`
- Risk register: `HQ/marketing/plan/risk-register.md`
- Content calendar: `HQ/marketing/plan/content-calendar.md`
