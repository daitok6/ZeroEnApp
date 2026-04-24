# ZeroEn Brand Kit — Brutalist Terminal
**Status:** Active — source of truth for all agents and developers

---

## Identity

**ZeroEn** carries a triple meaning:
- **Zero friction** — from scoping call to shipped product, no barriers
- **Zero language barriers** — bilingual EN/JA built in from day one
- **Zero ambiguity** — fixed price, clear scope, no equity, no surprises

**Positioning:** Bilingual product studio, Tokyo. Fixed price. Shipped in weeks.  
**Visual direction:** Brutalist Terminal — cream paper, ink type, hard shadows, ASCII rules, heavy mono, build-in-public tone.  
**Personality:** Tactical / CLI / production-grade engineer. Anti-agency, anti-freelancer.

---

## Logo & Mark

### Files
| File | Use |
|---|---|
| `docs/logo-dark.svg` | SVG mark — dark backgrounds |
| `docs/logo-full.svg` | SVG mark — light backgrounds |
| `docs/logo-icon.svg` | Icon only — favicon, avatar, app icon |

### Nav chip (text logo)
The BTNav uses a text chip instead of the SVG mark: **`$ ZEROEN`** in accent fill on ink background. Either the SVG or the chip is acceptable in context — confirm per surface.

### Logo rules
- Never place the logo on the accent (`#00E87A`) background
- Never distort or stretch the mark
- Minimum icon height: 32px (with wordmark), 24px (icon only)

---

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#E8E6DD` | Page background (warm cream / off-white paper) |
| `--color-bg-alt` | `#DEDCD3` | Subtle alt stripe (rarely used) |
| `--color-paper` | `#F2F0E8` | Card / box fill (lighter than bg, adds elevation contrast) |
| `--color-ink` | `#0A0A0A` | Primary text, borders, heavy CTAs (near-black) |
| `--color-ink-dim` | `#5A584F` | Secondary text, muted rows, timestamps |
| `--color-accent` | `#00E87A` | **Default green.** Highlights, pulse dot, featured price, CTA fill |
| (alt) | `#FF6A1A` | Alt accent — orange |
| (alt) | `#E53935` | Alt accent — red |
| (alt) | `#0A0A0A` | Alt accent — black (monochrome variant) |
| `--color-danger` | `#C8351E` | Error / destructive (reserved) |

**Accent is a single runtime variable.** Everything "green" (highlights, price tags, pulse dot, CTA button, focus state, LIVE indicators) reads from `--color-accent`. Green ships as default.

> CSS tokens: `HQ/brand/tokens.css` · JSON tokens: `HQ/brand/tokens.json`

---

## Typography

### Typefaces
| Role | Font | Weights | Usage |
|---|---|---|---|
| Display | `Space Grotesk` | 400–800 | H1–H3, large numerics, tier prices, step numbers |
| Mono | `JetBrains Mono` | 400–700 | Everything else: body, labels, nav, table cells, FAQs |
| JP body | `Noto Sans JP` | 400/500/700/900 | Appended to mono stack when `locale === 'ja'` |

Load from Google Fonts. Consider self-hosting Noto Sans JP for JP-user latency.

### Type scale (fluid)
| Level | Size | Weight | Tracking | Line-height |
|---|---|---|---|---|
| H1 hero | `clamp(40px, 9vw, 104px)` | 800 | `-0.04em` | `0.95` EN / `1.05` JA |
| H1 page | `clamp(38px, 7vw, 84px)` | 800 | `-0.04em` | `0.95` / `1.05` |
| H2 section | `clamp(28px, 5vw, 48px)` | 800 | `-0.025em` | `0.95` |
| H3 card | `20px` | 800 | `-0.015em` | `1.1` |
| Body | `13–14px` | 400 | — | `1.5–1.55` |
| Label / eyebrow | `10–11px` | 700 | `0.1–0.2em` | — |
| Large numerics | `clamp(28px, 4vw, 44px)` | 800 | `-0.02 to -0.03em` | — |

All display type: `text-transform: uppercase`. **Do NOT apply `text-transform: uppercase` to Japanese strings.**

### JA-specific typography rules
- Increase line-height to `1.05` on uppercase display type (kana/kanji fills more vertical space than Latin caps)
- Add `display: inline-block; line-height: 0.95` on accent-highlight `<span>` inside hero H1 to prevent highlight bleed between lines
- Hero H1 highlight must use `indexOf` substring match, **not equality** — `プロダクト` appears inside `プロダクトに。`
- Flex rows mixing JP text with fixed-width badges need `flex-wrap: wrap` + `flex-shrink: 0` + `white-space: nowrap` on badges — without this JP overflows or overlaps

---

## Borders & Shadows

```
Primary border:  2px solid #0A0A0A   → every card, CTA, tier, box
Secondary:       1px dashed #0A0A0A  → internal dividers, list separators
Hard shadow:     4px 4px 0 #0A0A0A  → CTAs and hover-lifted cards
Hover shadow:    6px 6px 0 #0A0A0A  → on :hover (card lifts -2px,-2px)
Active shadow:   2px 2px 0 #0A0A0A  → on :active (card presses +1px,+1px)
```

**No border-radius anywhere.** Everything is square (`border-radius: 0`).

Shadow transition: `transition: transform .08s, box-shadow .08s`.

---

## Spacing / Layout

- Container max-width: **1200px** — centered with `16px` gutter on mobile
- Section vertical rhythm: `padding: 28px 0 10px`
- Grid gap: **14px** standard (cards), **10px** tight (tables)
- Density (user-tweakable, ships regular): `dense 10px / regular 14px / loose 18px` padding, row-pad `6/8/12`, line-height `1.4/1.5/1.6`

---

## Interactions

| Class | Behavior |
|---|---|
| `bt-hover-shadow` | hover: translate `-2px,-2px` + shadow `6px 6px 0`; active: translate `+1px,+1px` + shadow `2px 2px 0` |
| `bt-link` | hover inverts: bg→ink, text→bg |
| `bt-caret` | `::after` blinking `_` at 1.1s step-end |

Keyframes: `btpulse` (1.8s scale 1→2.6), `btblink` (1.1s step-end), `btmarquee` (40s linear horizontal), `btfadein` (0.35s ease-out page transition).

---

## Brand Voice

### Principles
- **Terse and direct.** Say it in half the words.
- **Confident, not arrogant.** No overselling.
- **Bilingual parity.** EN and JP feel equally native — not translated.
- **Tactical / CLI tone.** Concrete terms. No vague promises.

### Copy rules
| Do | Don't |
|---|---|
| "Fixed price. No equity." | "Experience our innovative platform." |
| "Bilingual from day one." | "Flexible equity arrangements available." |
| "Shipped in weeks, not months." | "Rapid development timelines." |
| "BOOK SCOPING CALL →" | "Get started today!" |

---

## Asset Formats
- **SVG** — primary (all digital)
- **PNG @2x** — social, email
- **ICO / PNG 16/32/64px** — favicon set
