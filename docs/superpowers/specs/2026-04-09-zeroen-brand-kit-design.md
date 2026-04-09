# ZeroEn Brand Kit Design Spec

**Date:** 2026-04-09  
**Status:** Approved  
**Direction:** Terminal Precision

---

## 1. Brand Identity

### Name & Meaning

**ZeroEn** carries a deliberate triple meaning:

| Reading | Meaning | Audience |
|---|---|---|
| Zero Yen (¥0) | Zero cost to start | Japanese market |
| Zero Engineers | No engineers needed to build | All markets |
| Zero English | No language barrier | Japanese clients |

### Positioning

ZeroEn is a solo AI-powered technical co-founder service. It is **not** an agency, a dev shop, or a SaaS tool. The brand must communicate a partnership — a real co-founder who happens to be powered by AI.

### Personality

**Bold disruptor.** Confrontational, confident, unapologetic. The brand says out loud what founders are thinking: "Why do I need to hire engineers?" Copy is terse, honest, and direct. No corporate hedging, no vague promises.

---

## 2. Logo & Mark

### Primary logo — horizontal lockup

- **Icon:** Stylized "0" numeral inside a rounded-square border (stroke, not filled)
- **Wordmark:** `ZERO` in white · `EN` in Electric Mint (#4ADE80)
- **Font:** IBM Plex Mono, weight 700–900
- **Icon border:** 2.5px stroke, border-radius ~10px, color #4ADE80
- **Glow:** `box-shadow: 0 0 20px rgba(74, 222, 128, 0.2)` — subtle, not flashy

### Variants

| Variant | Use case |
|---|---|
| Icon + wordmark (horizontal) | Primary — website header, docs, presentations |
| Icon only | Favicon, social avatar, app icon (24px–64px) |
| Wordmark only | Text-constrained contexts (email signatures, plain text) |
| Full lockup (logo + tagline) | Hero sections, pitch decks |

### Full lockup tagline
> Bring your idea to life

Tagline rendered in IBM Plex Mono, weight 400, color #6B7280, letter-spacing 2px, uppercase.

### Light background usage
On white or light backgrounds: darken green to `#00AA55`, text to `#111111`.

### Clear space
Minimum clear space on all sides = height of the icon.

### Minimum sizes
- Digital: 32px icon height (with wordmark)
- Favicon: 24px icon only
- Social avatar: 48px icon only

### Never do
- Place logo on the green accent color
- Remove the ZERO/EN color split
- Use grey or single-color version on dark backgrounds
- Stretch or distort the mark

---

## 3. Color Palette

### Primary

| Name | Hex | Use |
|---|---|---|
| Electric Mint | `#4ADE80` | Primary accent · CTAs · brand mark · highlights |
| Deep Navy | `#0D1117` | Primary background · hero sections |
| Soft White | `#F9FAFB` | Primary text on dark backgrounds |

### Supporting

| Name | Hex | Use |
|---|---|---|
| Surface | `#111827` | Cards · panels |
| Elevated | `#1F2937` | Hover states · input backgrounds |
| Border | `#374151` | Dividers · outlines · secondary buttons |
| Muted | `#9CA3AF` | Body copy · secondary text |
| Subtle | `#6B7280` | Captions · labels · placeholders |
| Green Glow | `rgba(74, 222, 128, 0.1)` | Tag fills · highlight backgrounds |

### Light background variant
For contexts that must appear on white (print, email clients):
- Background: `#FFFFFF`
- Text: `#111111`
- Accent: `#00AA55` (darkened mint for WCAG AA compliance)

---

## 4. Typography

### Typefaces

| Role | Font | Weight | Use |
|---|---|---|---|
| EN headings | IBM Plex Mono | 700, 900 | Hero, section titles, CTAs |
| EN body / UI | IBM Plex Mono | 400, 500 | Body copy, labels, nav |
| JP headings | M PLUS 1 Code | 700 | Japanese hero, section titles |
| JP body | M PLUS 1 Code | 400, 500 | Japanese body copy, UI labels |

Both IBM Plex Mono and M PLUS 1 Code are monospace — creating a unified terminal aesthetic across English and Japanese.

### Type scale

| Level | Font | Size | Weight | Color |
|---|---|---|---|---|
| Hero heading | IBM Plex Mono / M PLUS 1 Code | 42–48px | 700 | #F9FAFB |
| Section heading | IBM Plex Mono / M PLUS 1 Code | 28–32px | 700 | #F9FAFB |
| Subheading | IBM Plex Mono / M PLUS 1 Code | 20px | 600 | #F9FAFB |
| Body | IBM Plex Mono / M PLUS 1 Code | 15–16px | 400 | #9CA3AF |
| Label / caption | IBM Plex Mono | 11–12px | 500 | #6B7280, uppercase, letter-spacing 2px |
| CTA button | IBM Plex Mono | 12px | 700 | #0D1117 on #4ADE80, letter-spacing 1.5px |

### Google Fonts import
```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=M+PLUS+1+Code:wght@400;500;700&display=swap');
```

---

## 5. Brand Voice & Copy

### Principles
- **Terse and direct.** No fluff. Say it in half the words.
- **Confident, not arrogant.** You know it works. No overselling.
- **Bilingual parity.** EN and JP copy feels equally native — not translated.
- **Developer-honest.** Concrete terms. No vague promises.

### Tone by context

| Context | Tone |
|---|---|
| Hero / landing | Bold, punchy, confrontational |
| Pricing / terms | Direct, transparent, no asterisks |
| Onboarding | Warm, encouraging, practical |
| Error / failure | Honest, solution-first, no corporate apology |
| Japanese market | Same voice — not softened, not over-formalized |

### Copy rules

| Do | Don't |
|---|---|
| "Build for free." | "Experience our innovative platform." |
| "We take 10%. You keep the rest." | "Flexible equity arrangements available." |
| "Your MVP ships in 4 weeks." | "Rapid development timelines." |
| "No engineers needed." | "Eliminate the need for traditional engineering resources." |

### Tagline
**English:** "Bring your idea to life."  
**Japanese:** 「アイデアを、形にする。」

### Sample hero copy
**EN:**
> "Your idea is worth building. We'll do it for free. You give us 10% equity and $50/month once you're live. That's the whole deal."

**JP:**
> 「あなたのアイデア、無料で作ります。エクイティ10%と月額$50。それだけです。」

---

## 6. Usage Summary

### Approved background contexts
- Deep Navy `#0D1117` — primary
- Surface `#111827` — secondary / cards
- Elevated `#1F2937` — inputs / hover
- White `#FFFFFF` — light mode / print (use darkened accent)

### Never place the logo on
- The Electric Mint accent color
- Busy photography or patterned backgrounds
- Any mid-tone grey (poor contrast)

### File formats to produce
- SVG — primary (all uses)
- PNG @2x — social, email
- ICO / PNG 16/32/64px — favicon set
- PDF — print / pitch decks

---

## 7. Next Steps

1. Generate logo SVG files using nanobanana
2. Export all color tokens as CSS variables and design tokens (JSON)
3. Build component library with brand applied (buttons, cards, nav)
4. Create Japanese and English landing page hero sections
5. Produce social media templates (Twitter/X header, avatar, OG image)
