# ZeroEn Brand Kit
**Status:** Active — source of truth for all agents and developers

---

## Identity

**ZeroEn** carries a triple meaning:
- **Zero friction** — from scoping call to shipped product, no barriers
- **Zero language barriers** — bilingual EN/JA built in from day one
- **Zero ambiguity** — fixed price, clear scope, no equity, no surprises

**Positioning:** Bilingual product studio, Tokyo. Fixed price. Shipped in weeks.

**Personality:** Bold disruptor. Terse, honest, direct. No corporate hedging.

---

## Logo & Mark

### Files
| File | Use |
|---|---|
| `docs/logo-dark.svg` | Primary — dark backgrounds (website, decks, social) |
| `docs/logo-full.svg` | Light backgrounds (print, email, light-mode) |
| `docs/logo-icon.svg` | Icon only — favicon, avatar, app icon |

### Mark structure
- Circle stroke icon with two horizontal bars through center (stylized "0")
- Circle: off-white stroke on dark, dark stroke on light
- Bars: Electric Green `#00E87A` always
- Wordmark: `Zero` (regular weight) + `En` (bold, Electric Green)
- Font: DM Sans (logo/wordmark only)

### Variants
| Variant | File | Use |
|---|---|---|
| Icon + wordmark (horizontal) | `logo-dark.svg`, `logo-full.svg` | Website header, docs, presentations |
| Icon only | `logo-icon.svg` | Favicon, social avatar, app icon |
| Stacked | (render from SVG source) | Hero sections, pitch decks |

### Taglines
- **EN:** "Bring your idea to life."
- **JP:** 「アイデアを、形にする。」

### Logo rules
- Never place the logo on Electric Green backgrounds
- Never remove the Zero/En color split
- Never distort or stretch the mark
- Minimum icon height: 32px (with wordmark), 24px (icon only)

---

## Color Palette

### Primary
| Token | Hex | Use |
|---|---|---|
| `--color-green` | `#00E87A` | Primary accent · CTAs · logo bars · highlights |
| `--color-dark` | `#0D0D0D` | Primary background · hero sections |
| `--color-off-white` | `#F4F4F2` | Primary text on dark · logo circle on dark |

### Supporting
| Token | Hex | Use |
|---|---|---|
| `--color-surface` | `#111827` | Cards · panels |
| `--color-elevated` | `#1F2937` | Hover states · input backgrounds |
| `--color-border` | `#374151` | Dividers · outlines · secondary buttons |
| `--color-muted` | `#9CA3AF` | Body copy · secondary text |
| `--color-subtle` | `#6B7280` | Captions · labels · placeholders |
| `--color-green-glow` | `rgba(0, 232, 122, 0.1)` | Tag fills · highlight backgrounds |

### Light-mode variant (print / email)
| Role | Value |
|---|---|
| Background | `#FFFFFF` |
| Text | `#111111` |
| Accent | `#00AA55` (darkened for WCAG AA) |

> CSS tokens file: `HQ/brand/tokens.css`  
> JSON design tokens: `HQ/brand/tokens.json`

---

## Typography

### Typefaces
| Role | Font | Weight | Use |
|---|---|---|---|
| Logo wordmark | DM Sans | 500, 700 | Logo only — not for website body |
| EN headings | Syne | 700, 800 | Hero, section titles, CTAs |
| EN body / UI | IBM Plex Mono | 400, 500 | Body copy, labels, nav |
| JP headings | Murecho | 700 | Japanese hero, section titles |
| JP body | Murecho | 400, 500 | Japanese body copy, UI labels |

### Google Fonts import
```css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=IBM+Plex+Mono:wght@400;500;600;700&family=Murecho:wght@400;500;700&family=DM+Sans:wght@400;500;700&display=swap');
```

### Type scale
| Level | Size | Weight | Color |
|---|---|---|---|
| Hero | 42–48px | 700 | `#F4F4F2` |
| Section heading | 28–32px | 700 | `#F4F4F2` |
| Subheading | 20px | 600 | `#F4F4F2` |
| Body | 15–16px | 400 | `#9CA3AF` |
| Label / caption | 11–12px | 500 | `#6B7280`, uppercase, letter-spacing 2px |
| CTA button | 12px | 700 | `#0D0D0D` on `#00E87A`, letter-spacing 1.5px |

---

## Brand Voice

### Principles
- **Terse and direct.** Say it in half the words.
- **Confident, not arrogant.** No overselling.
- **Bilingual parity.** EN and JP feel equally native — not translated.
- **Developer-honest.** Concrete terms. No vague promises.

### Copy rules
| Do | Don't |
|---|---|
| "Fixed price. No equity." | "Experience our innovative platform." |
| "Bilingual from day one." | "Flexible equity arrangements available." |
| "Shipped in weeks, not months." | "Rapid development timelines." |
| "Scoping call → proposal in 48 hours." | "Eliminate the need for traditional engineering resources." |

### Sample hero copy
**EN:** "Production-grade bilingual Next.js + Supabase + Stripe. Fixed price. No equity. Delivered in weeks."

**JP:** 「バイリンガルSaaSを固定価格で。エクイティ不要。数週間で納品。」

---

## Asset Production Formats
- **SVG** — primary (all digital uses)
- **PNG @2x** — social, email
- **ICO / PNG 16/32/64px** — favicon set
- **PDF** — print / pitch decks
