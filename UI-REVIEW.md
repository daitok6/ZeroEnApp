# ZeroEn Marketing Site — UI Review

**Audited:** 2026-04-23
**Scope:** Post-repositioning rebuild — all 7 marketing pages
**Method:** Code audit (no dev server; visual screenshots not captured)
**Pages audited:** `/`, `/pricing`, `/how-it-works`, `/startups`, `/about`, `/book-a-call`, `/cases`

---

## Dimension Scores

| Dimension | Score | Key Finding |
|-----------|-------|-------------|
| 1. Visual Hierarchy | 5/5 | H1→H2→body clear; eyebrow pattern consistent across all pages |
| 2. CTA Clarity | 4/5 | Every page ends with green CTA to scoping-call; nav CTA routes to `/login` not `/scoping-call` |
| 3. Mobile-First | 4/5 | Grids stack correctly; hero H1 progressive sizing good; one layout gap on `how-it-works` timeline |
| 4. Consistency | 4/5 | Cards, spacing, GreenGlowLine usage highly consistent; two minor spacing deviations |
| 5. Content Completeness | 3/5 | `TODO-SCREENSHOT` and `TODO-CASE-STUDY-BODY` visible on `/cases` (expected); cases scaffold renders raw bullet notes as public-facing copy |
| 6. Navigation | 3/5 | No "Book a call" in nav; nav CTA ("Apply") routes to `/login`; `/startups` not in nav |

**Overall: 23/30**

**Verdict: SHIP WITH FIXES**
The site is structurally strong and brand-consistent. Two navigation issues and the cases page placeholder content must be addressed before treating this as production-ready for prospects. Everything else is minor polish.

---

## Priority Fixes

### Fix 1 — Nav CTA routes to `/login` instead of `/scoping-call` (BLOCK-level risk)
**File:** `src/components/layout/header.tsx` lines 86–99 and 167–173

Both the desktop "Apply" button and the mobile "Apply" button use `href={`/${locale}/login`}`. A prospect clicking the main nav CTA lands on a login screen, not a booking page. This breaks the primary conversion funnel.

**Fix:** Change both `Link href` values to `` `/${locale}/book-a-call` `` (or directly to the external scoping-call URL used on every page). The `/book-a-call` page already exists and handles the Calendly/booking flow.

```tsx
// header.tsx line 88 — change:
href={`/${locale}/login`}
// to:
href={`/${locale}/book-a-call`}
```
Apply to both desktop (line 88) and mobile (line 167).

---

### Fix 2 — `/cases` page exposes raw placeholder content publicly (content issue)
**File:** `src/app/[locale]/(marketing)/cases/page.tsx` lines 76–93, 120–137

Two issues:
1. `TODO-SCREENSHOT` text is rendered inside `<p>` tags that are visible to any visitor (`text-[#374151]` — very dark but still DOM-present and readable by screen readers / SEO crawlers).
2. `TODO-CASE-STUDY-BODY` renders as a visible labeled section with internal dev notes ("→ What would change at scale: shared Supabase schema...") directly in the case study card. This is internal architecture commentary, not marketing copy.

**Fix:** Either gate `/cases` behind a `noindex` meta tag until content is ready, or replace the TODO blocks with a clean "Coming soon" placeholder matching the existing dashed-border card pattern already used at the bottom of the page (lines 149–166). The dashed placeholder style is correct — apply it consistently to all incomplete case study bodies.

---

### Fix 3 — `/startups` page missing from navigation
**File:** `src/components/layout/header.tsx` (desktop nav lines 41–78, mobile nav lines 116–158)

`/startups` is a high-intent landing page for the primary ICP (funded founders) but has no nav entry. Visitors from cold email or ads who land on `/startups` and then navigate away have no path back to it. The page also has no cross-link from `/pricing` or `/how-it-works`.

**Fix:** Add a "For founders" or "Startups" nav link between "Cases" and "Blog":
```tsx
<Link href={`/${locale}/startups`} className="text-[#9CA3AF] hover:text-[#F4F4F2] text-sm transition-colors font-mono">
  {t('startups')}  {/* add key to nav translation */}
</Link>
```
Or alternatively, add a contextual text link from the `/pricing` page hero pointing to `/startups` for founders evaluating tiers.

---

## Detailed Findings

### 1. Visual Hierarchy (5/5)

All pages use the same eyebrow → H1 → subhead → body pattern. Eyebrow labels are consistent in style (`text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em]`). H1 sizes are appropriate per page type (homepage `text-4xl sm:text-5xl md:text-6xl`, interior pages `text-4xl sm:text-5xl`). The `about` page uses an intentionally provocative H1 ("Japanese agencies quote ¥8M and 4 months") with no eyebrow label — this is a valid editorial choice, not a hierarchy issue.

Green dot accent (`w-2 h-2 rounded-full bg-[#00E87A]`) used sparingly as section dividers on the homepage deliverable pillars section. Well-controlled.

No findings requiring action.

---

### 2. CTA Clarity (4/5)

**Passing:**
- Every page ends with a green `bg-[#00E87A] text-[#0D0D0D] font-heading font-bold uppercase tracking-widest` CTA. Button styles are fully consistent across all 7 pages.
- External href pattern (`href={scopingCallHref}` with `target="_blank" rel="noopener noreferrer"`) applied consistently.
- `/book-a-call` page uses `block w-full` for full-width CTA on mobile — good tap affordance.
- Footer CTAs use larger padding (`px-10 py-4` to `px-14 py-5`) on homepage, appropriate escalation.

**Issue (addressed in Fix 1):**
- Desktop and mobile nav "Apply" CTA routes to `/login`. This is the only CTA on the entire site not pointing at the scoping call flow.

**Minor:** The `/cases` placeholder section CTA (lines 156–163) uses `border border-[#374151] text-[#6B7280]` — a muted ghost button style that is intentionally understated for a scaffold. Acceptable, but once real case studies are live this should be upgraded to the standard green CTA.

---

### 3. Mobile-First (4/5)

**Passing:**
- All card grids use `grid-cols-1 md:grid-cols-3` or `grid-cols-1 md:grid-cols-2`. Correct stacking.
- Hero H1 uses `text-4xl sm:text-5xl md:text-6xl` — no overflow risk on 375px.
- Pricing cards use `flex flex-col h-full` — prevents layout collapse on stacked mobile view.
- Mobile nav links use `min-h-[44px]` — meets 44px tap target standard (WCAG 2.5.5).
- Desktop nav links have no `min-h` — acceptable for pointer devices.

**Issue:** `how-it-works` timeline uses a `left-[2.75rem]` absolutely positioned vertical line. On very narrow screens (320px) the flex gap between the node circle (`w-10`) and the content card (`flex-1`) may compress the card. The `w-22` class on the node column (`flex-shrink-0 w-22`) — `w-22` is not a standard Tailwind value (standard scale goes `w-20` → `w-24`). This will silently fall back to no width, collapsing the timeline node column. This needs verification.

**Fix:** Change `w-22` (line 74) to `w-20` or `w-24`. Also verify the dashed vertical line remains aligned with the circles on mobile.

---

### 4. Consistency (4/5)

**Card styling — consistent:**
- ICP pillars, case study cards, pricing cards: all use `bg-[#111827] rounded-lg border border-[#374151] p-7` or `p-8`. Uniform.
- Hover state `hover:border-[#00E87A]/40` used consistently on cards.

**Section alternation — consistent:**
- `bg-[#0D0D0D]` (default) alternates with `bg-[#080808]` sections. Applied on homepage, pricing, startups, about. Clean rhythm.

**GreenGlowLine — consistent:**
- Used as section dividers between major content blocks. Applied on every page except `/book-a-call` (which only has one section, so the mid-section `GreenGlowLine` is appropriate there). `/pricing` page places it between FAQ and CTA — good usage.

**Minor spacing deviation:**
- `/about` section padding uses `py-20` (hero, founder story) and `py-16` (credentials), while most pages use `py-24` as the primary section spacing. Not an error — the about page has more prose sections and tighter cadence is intentional — but it creates a slightly different density feel vs. other pages.
- `/book-a-call` hero uses `py-20` inside a `pt-24` container. Slightly more compact than other interior pages (`py-24`). No user impact.

**Deliverable pillars cards on homepage (lines 169–180):**
- These use `<div className="p-7">` with no `bg-[#111827]` or border, unlike ICP pillars and case cards which have the full card treatment. This appears intentional (list vs. card pattern) but may look visually disconnected without a separating line. Not a blocking issue.

---

### 5. Content Completeness (3/5)

**Expected placeholders (flagged, not blocking on `/cases`):**
- `TODO-SCREENSHOT: zeroen.dev homepage` — line 78, visible in DOM at `text-[#374151]`
- `TODO-SCREENSHOT: webmori.jp homepage` — line 121, visible in DOM
- `TODO-CASE-STUDY-BODY` label — line 86, rendered as green text visible to users and crawlers
- Internal dev notes in case study cards (lines 88–93, 132–136) — exposed as public copy

**Unexpected placeholders — none found on other pages.** Homepage, pricing, how-it-works, startups, about, and book-a-call are clean.

**Content gaps:**
- `/cases` WebMori entry references `webmori.jp` but the architecture notes mention "automated monthly audit PDF generation" — this reads as internal implementation notes, not user-facing copy.
- The homepage "Built by ZeroEn" section has a "Slot open" placeholder card (lines 234–243) — this is intentional positioning, appropriate.

---

### 6. Navigation (3/5)

**What's present:**
- How It Works, Pricing, Cases, Live from Day One, Blog, About — desktop and mobile
- Mobile links have `min-h-[44px]` tap targets — correct
- Scroll-activated backdrop blur on header — good progressive enhancement

**Issues:**

1. **"Book a call" is not in the nav.** The nav CTA is labeled `t('apply')` and routes to `/login`. A visitor who wants to book a call must scroll to a page CTA or know to visit `/book-a-call` directly. The entire conversion funnel depends on this path.

2. **`/startups` is not linked from anywhere in nav.** It's a first-class landing page in the route tree but orphaned from navigation. Prospects from cold email who navigate from it cannot return to it via nav.

3. **`/live-from-day-one` in nav** — this route links to a page not audited in this pass. Ensure it exists and is not a 404. The nav label uses `t('dashboard')` which is an unusual key name for a marketing page.

4. **Locale switcher position on mobile:** `LocaleSwitcher` appears between nav links and the Login/Apply CTAs in the mobile drawer (line 159). Consider moving it to the top of the drawer or keeping it at the bottom-most position for less disruption to the primary action flow.

---

## Files Audited

- `/Users/Daito/repos/ZeroEn/HQ/platform/src/app/[locale]/(marketing)/page.tsx`
- `/Users/Daito/repos/ZeroEn/HQ/platform/src/app/[locale]/(marketing)/pricing/page.tsx`
- `/Users/Daito/repos/ZeroEn/HQ/platform/src/app/[locale]/(marketing)/how-it-works/page.tsx`
- `/Users/Daito/repos/ZeroEn/HQ/platform/src/app/[locale]/(marketing)/startups/page.tsx`
- `/Users/Daito/repos/ZeroEn/HQ/platform/src/app/[locale]/(marketing)/about/page.tsx`
- `/Users/Daito/repos/ZeroEn/HQ/platform/src/app/[locale]/(marketing)/book-a-call/page.tsx`
- `/Users/Daito/repos/ZeroEn/HQ/platform/src/app/[locale]/(marketing)/cases/page.tsx`
- `/Users/Daito/repos/ZeroEn/HQ/platform/src/app/[locale]/(marketing)/layout.tsx`
- `/Users/Daito/repos/ZeroEn/HQ/platform/src/components/layout/header.tsx`
