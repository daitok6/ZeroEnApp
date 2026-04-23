---
phase: phase1-repositioning-rebuild
reviewed: 2026-04-23T00:00:00Z
depth: standard
files_reviewed: 14
files_reviewed_list:
  - src/app/[locale]/(marketing)/page.tsx
  - src/app/[locale]/(marketing)/pricing/page.tsx
  - src/app/[locale]/(marketing)/how-it-works/page.tsx
  - src/app/[locale]/(marketing)/startups/page.tsx
  - src/app/[locale]/(marketing)/cases/page.tsx
  - src/app/[locale]/(marketing)/about/page.tsx
  - src/app/[locale]/(marketing)/book-a-call/page.tsx
  - src/app/[locale]/(marketing)/apply/_form.tsx
  - src/app/[locale]/(marketing)/apply/page.tsx
  - src/app/[locale]/(marketing)/apply/thank-you/page.tsx
  - src/app/api/lp-inquiry/route.ts
  - messages/en.json
  - messages/ja.json
  - src/i18n/routing.ts
  - next.config.ts
  - src/app/[locale]/(marketing)/layout.tsx
findings:
  critical: 2
  warning: 5
  info: 4
  total: 11
status: issues_found
---

# Phase 1 Repositioning Rebuild — Code Review

**Reviewed:** 2026-04-23
**Depth:** standard
**Files Reviewed:** 16
**Status:** issues_found

## Summary

The rebuild is structurally sound. Routing, i18n configuration, Cal.com redirects, and the `Messages` type contract between `apply/page.tsx` and `_form.tsx` are all correctly wired. The Zod schema in `lp-inquiry/route.ts` matches the new field set. Both `en.json` and `ja.json` contain parity keys for every `t()` call in every reviewed page.

Two critical issues need operator sign-off before going live: the `lp_inquiries` table has not had its schema migration run (a TODO comment in the route explicitly flags this), and the Terms page contains two `TODO-REVIEW` placeholder sections that are rendered as literal body text visible to the public. Four warnings cover logic gaps and stale copy that could confuse visitors. Four info items are style/content notes.

---

## Critical Issues

### CR-01: `lp_inquiries` table migration not run — form submissions will 500

**File:** `src/app/api/lp-inquiry/route.ts:6-10`
**Issue:** A comment at the top of the route lists four DDL statements that have not been applied yet:
```sql
ALTER TABLE lp_inquiries ADD COLUMN company text;
ALTER TABLE lp_inquiries ADD COLUMN blurb text NOT NULL DEFAULT '';
ALTER TABLE lp_inquiries DROP COLUMN occupation;
ALTER TABLE lp_inquiries DROP COLUMN current_site_url;
ALTER TABLE lp_inquiries DROP COLUMN challenge;
```
The route inserts `company` and `blurb` into the table. If the migration has not been run, every `/api/lp-inquiry` POST will fail with a Supabase column-not-found error (status 500). The apply form on `/apply` will be completely broken for real prospects.

**Fix:** Run the four SQL statements against the production Supabase project before any traffic reaches `/apply`. Remove the TODO comment once done. Also note that `blurb` is declared `NOT NULL DEFAULT ''` in the migration but the Zod schema allows `blurb: z.string().min(1)` — the NOT NULL DEFAULT is a migration convenience only; at runtime an empty string will pass the DB constraint but be rejected by Zod, which is correct.

---

### CR-02: Terms page sections 6 and 7 render raw `TODO-REVIEW` placeholder text to visitors

**File:** `messages/en.json:524-529`, `messages/ja.json:524-529`
**Issue:** Terms sections 6 ("Service Continuity") and 7 ("Project Delivery Timeline") have `body` values that begin with `**TODO-REVIEW (operator sign-off required before production):**`. The terms page renders these bodies as prose visible to any visitor who navigates to `/terms` or `/ja/terms`. Showing placeholder legal text to prospects or clients is a trust and legal liability problem.

**Fix:** Either write the actual terms for these two sections before going live, or temporarily remove sections 6 and 7 from the `sections` arrays in both JSON files. Do not ship these as-is.

---

## Warnings

### WR-01: `apply/thank-you` content mismatches the new fixed-price positioning

**File:** `src/app/[locale]/(marketing)/apply/thank-you/page.tsx:31-37`
**Issue:** The English thank-you page still says "We confirm scope and kick off the build" and "Your LP is live within 3 days." These are copy from the old ¥0-upfront model where ZeroEn built an LP on day one. Under the new model, the scoping call → proposal flow does not promise an LP in 3 days. This could set a wrong expectation for real incoming prospects.

**Fix:** Replace steps 3 and 4 in the `en` copy object with content matching the `lpApply.thankYou` keys in `en.json` (which are correctly written for the new model: "We schedule a 30-minute scoping call" / "Fixed-price proposal within 48 hours of the call").

---

### WR-02: `apply/page.tsx` uses `lpApply` namespace but `apply/thank-you` hardcodes stale copy — divergence risk

**File:** `src/app/[locale]/(marketing)/apply/thank-you/page.tsx:9-38`
**Issue:** All other pages pull strings from `en.json`/`ja.json`. The thank-you page inlines a `copy` object with EN/JA strings that duplicate (and partially conflict with) the `lpApply.thankYou` keys that exist in both JSON files. There are now two sources of truth for the thank-you content. A future copy update to `en.json` will not propagate.

**Fix:** Convert `apply/thank-you/page.tsx` to a Server Component (or use `next-intl`'s `useTranslations` hook pattern), and pull `lpApply.thankYou.*` from the message files. The `lpApply.thankYou` keys are already present and correctly translated in both JSON files.

---

### WR-03: Tokushoho page contains `TODO-REVIEW` visible to visitors

**File:** `messages/en.json:1225`, `messages/ja.json:1225`
**Issue:** The "Pricing" section body and the "Cancellation Policy" section body both end with `⚠️ TODO-REVIEW: ...` notes rendered as literal text on `/tokushoho` and `/ja/tokushoho`. This page is required by Japanese law (特定商取引法) and must have accurate, final content before accepting payments.

**Fix:** Remove or replace both TODO notes with final pricing and cancellation copy, confirmed by the operator.

---

### WR-04: `apply/_form.tsx` — consent label duplicates "Privacy Policy" link text in English

**File:** `src/app/[locale]/(marketing)/apply/_form.tsx:220-225`
**Issue:** The consent label renders `{t.consent}` followed by a hardcoded "Privacy Policy" link. For English, `t.consent` (from `lpApply.form.consent`) already reads "I agree to ZeroEn's privacy policy and consent to being contacted about this inquiry." The appended "Privacy Policy" link text is redundant but more importantly the link just points to `/${locale}/privacy` without the consent label text referencing it explicitly. For Japanese, `t.consent` says "ZeroEnのプライバシーポリシーに同意し..." so the appended EN "Privacy Policy" link is untranslated.

**Fix:** Either: (a) remove "Privacy Policy" from `t.consent` in `en.json` and keep the inline link as the explicit label, or (b) translate the link label using the locale. The current state renders an English link label on the Japanese form.

---

### WR-05: `pricing/page.tsx` comparison table hardcodes column headers in JSX instead of using i18n keys

**File:** `src/app/[locale]/(marketing)/pricing/page.tsx:195-203`
**Issue:** The comparison table column headers are hardcoded as ternary inline strings (`locale === 'ja' ? '選択肢' : 'Option'`, etc.) instead of using translation keys. The `startups/page.tsx` uses `t.raw('comparison.columns')` correctly from the JSON. The pricing page bypasses the translation system, so if copy changes are made to `ja.json`'s comparison heading strings, they won't be reflected here.

**Fix:** Add `columns` array to `pricing.anchor` in both JSON files (matching `startups.comparison.columns` pattern), then use `t.raw('anchor.columns')` in `pricing/page.tsx` to render headers.

---

## Info

### IN-01: Cases page does not use i18n at all — hardcoded bilingual strings

**File:** `src/app/[locale]/(marketing)/cases/page.tsx:43-182`
**Issue:** `cases/page.tsx` contains no `getTranslations()` call and inlines all EN/JA strings as ternary expressions (`ja ? '...' : '...'`). This is inconsistent with every other marketing page. The `home.caseStudies` keys in both JSON files cover some of this content.

**Fix:** Not a runtime bug, but flagged for consistency. When the case study body content is written, migrate the strings to `en.json`/`ja.json` under a `cases` namespace.

---

### IN-02: `about/page.tsx` similarly hardcodes all content without i18n

**File:** `src/app/[locale]/(marketing)/about/page.tsx:43-158`
**Issue:** Same pattern as cases — no `getTranslations()`, all copy inlined as ternary expressions. Not a runtime bug.

**Fix:** Add an `about` namespace to both JSON files and migrate when convenient.

---

### IN-03: `terms` sections 8 and 11 contain old subscription-era IP/code ownership language

**File:** `messages/en.json:533`, `messages/en.json:545`
**Issue:** Section 8 ("IP Ownership") still reads "The client receives a non-exclusive license to use the live hosted application for as long as the platform fee is paid." This contradicts the new model where "Code ownership transfers to client on final payment" (as stated in the FAQ, the summary block, and CLAUDE.md). Section 11 also references "rejected applications" being wiped in 30 days — this is onboarding-model language and may be confusing in the fixed-price context.

**Fix:** Operator to review and rewrite section 8 to reflect the new code-transfer-on-final-payment model before publishing.

---

### IN-04: `book-a-call/page.tsx` CTA button opens Cal.com via redirect — no fallback if JS is disabled

**File:** `src/app/[locale]/(marketing)/book-a-call/page.tsx:89-96`
**Issue:** The CTA `<a>` points to `/scoping-call` (or `/ja/scoping-call`), which is a Next.js `permanent: false` redirect to `cal.com/zeroen/scoping-call`. This works correctly. Minor note: if the Cal.com embed is desired inline in the future, this page is the right place, but the current external link approach is valid and functional.

**Fix:** No action required. Document as future enhancement opportunity.

---

_Reviewed: 2026-04-23_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
