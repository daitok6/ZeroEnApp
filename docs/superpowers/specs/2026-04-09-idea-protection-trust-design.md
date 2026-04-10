# Idea Protection & Trust System — Design Spec

**Date:** 2026-04-09  
**Status:** Draft  
**Problem:** Founders are skeptical about sharing their ideas through the application form. ZeroEn currently has zero trust signals — no NDA, no confidentiality clause, no reassurance copy anywhere in the funnel.

**Goal:** Remove idea-theft fear as a barrier to applications by adding legal protection + trust messaging across the entire founder-facing surface.

---

## Architecture: Three Layers

1. **Legal foundation** — Confidentiality clause in `/terms` + inline NDA checkbox in apply flow
2. **Trust messaging** — Homepage section + how-it-works callout
3. **Credibility framing** — Equity alignment as proof of incentive

---

## 1. Confidentiality Clause in `/terms`

**File:** `HQ/platform/messages/en.json` (and `ja.json`)  
**Location:** New section 11 in `terms.full.sections` accordion

**Content covers:**
- Mutual non-disclosure obligation (both parties)
- Definition of confidential information: application data, business plans, technical specs, financials, user research
- Standard exclusions: publicly available info, independently developed info, legally compelled disclosures
- **Data deletion guarantee:** Any founder (accepted or rejected) can request full deletion of their data at any time
- Rejected application data auto-deleted within 30 days
- Survival: confidentiality obligations survive termination of any agreement
- Governing law: matches existing terms (Section 10)

**Tone:** Plain language, not dense legalese. Match the clarity of existing terms sections.

---

## 2. Inline NDA in Application Flow

**Files:**
- New component: `HQ/platform/src/components/apply/step-0-nda.tsx`
- Update: `HQ/platform/src/components/apply/wizard.tsx` (add step 0, shift existing steps)
- Update: `HQ/platform/src/lib/validations/application.ts` (add NDA acceptance field)
- Update: `en.json` and `ja.json` (NDA step copy)

**UX flow:**
1. Founder clicks "Apply" → lands on Step 0 (not Step 1)
2. Screen shows:
   - **Header:** "Before you share your idea"
   - **Subheader:** "We take your trust seriously. Here's our commitment:"
   - **NDA body** (plain language, ~150 words):
     - We will not share, copy, or use your idea without written agreement
     - This is mutual — we're bound by the same terms
     - You can request deletion of all your data at any time
     - Rejected applications are wiped within 30 days
   - **Link:** "Read full confidentiality terms" → `/terms#confidentiality`
   - **Checkbox:** "I've read and agree to the mutual confidentiality agreement" (required)
   - **Button:** "Continue to application" (disabled until checked)
3. After checking → proceeds to existing Step 1 (idea details)

**Design notes:**
- Use ZeroEn brand: dark bg, electric green accent on checkbox/button
- Tone: friendly reassurance, not legal gate. Developer-honest voice.
- Mobile-first layout (per existing feedback memory)
- Checkbox state persisted in wizard form state (same pattern as other steps)

---

## 3. Homepage Trust Section

**File:** `HQ/platform/messages/en.json` (and `ja.json`)  
**Location:** New section between "Why ZeroEn" and tech stack terminal on homepage  
**Component:** New section in homepage, following existing section component patterns

**Header:** "Your idea stays yours."

**Three points (icon + short copy each):**

1. **Mutual NDA before you apply**  
   "We sign a confidentiality agreement with every applicant before you share a single detail."

2. **Aligned incentives**  
   "We take equity. If we stole ideas instead of building them, we'd make $0."

3. **Full data control**  
   "Request deletion of your data at any time. Rejected applications are wiped within 30 days."

**Design notes:**
- Section style: matches existing homepage sections (dark bg, green accents)
- Icons: Lucide React — `Shield`, `Handshake`, `Trash2` or similar
- Mobile: stack vertically, single column

---

## 4. How It Works Update

**File:** `HQ/platform/messages/en.json` (and `ja.json`)  
**Location:** Step 1 on `/how-it-works` page

**Change:** Add subtitle/badge to Step 1 ("Submit your idea"):  
→ "Protected by our mutual NDA — signed before you share anything"

Small copy addition, no structural changes to the page.

---

## 5. i18n — Japanese Translations

All new copy requires Japanese translations in `ja.json`:
- Confidentiality clause (Section 11 in terms)
- NDA step copy (step-0-nda)
- Homepage trust section
- How-it-works subtitle update

**Note:** NDA and confidentiality clause need proper Japanese legal phrasing (秘密保持契約 / 機密保持義務), not direct translation. The tone should match: formal enough to be legally meaningful, clear enough to be reassuring.

---

## Files to Create/Modify

| Action | File |
|--------|------|
| Create | `HQ/platform/src/components/apply/step-0-nda.tsx` |
| Modify | `HQ/platform/src/components/apply/wizard.tsx` |
| Modify | `HQ/platform/src/lib/validations/application.ts` |
| Modify | `HQ/platform/messages/en.json` |
| Modify | `HQ/platform/messages/ja.json` |
| Modify | Homepage component (add trust section) |
| Modify | How-it-works component (add NDA callout to step 1) |

---

## Verification

1. **Application flow:** Navigate to `/apply` → Step 0 (NDA) appears first → checkbox required → can proceed to idea step after agreeing
2. **Terms page:** `/terms` shows new Section 11 (Confidentiality) in accordion
3. **Homepage:** Trust section visible between Why ZeroEn and tech stack
4. **How it works:** Step 1 shows NDA protection callout
5. **Mobile:** All new elements render correctly on mobile viewports
6. **i18n:** Switch to Japanese locale → all new copy displays in Japanese
7. **Form state:** NDA acceptance persists through wizard navigation (back/forward)
