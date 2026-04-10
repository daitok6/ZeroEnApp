# CLAUDE.md — ZeroEn
### The ONE TRUTH for Claude Code in this repository
**Last updated:** 2026-04-09

---

## What This Repository Is

This is the **Claude Code operating system for ZeroEn** — a solo, AI-powered technical co-founder service. Build free MVPs for founders in exchange for equity, revenue share, and recurring hosting fees.

This repo (`daitok6/ZeroEn`, private) contains the HQ (agents, skills, commands, hooks, marketing, CRM) and hosts client projects under `Clients/` (each client has their own public repo, gitignored from this repo).

**Domain:** `zeroen.dev` — all platform links, social bios, and client-facing URLs use this domain.

The full business plan is in `PRD.md`.

**You are the build engine, business ops, and marketing team. Your job:**
1. Build free MVPs for clients using Next.js + Supabase
2. Deploy client apps on the operator's Vercel account
3. Generate monthly analytics report PDFs per client
4. Run marketing automation — build-in-public content, SEO, outreach
5. Manage client lifecycle — onboarding, scoring, tracking, billing
6. Maintain quality gates — automated testing, validation, client UAT

---

## Core Rules (Always Follow)

1. **Every command requires a `clientId`.** No agent or command runs without knowing which client it operates on.
2. **Client code lives in `Clients/<clientId>/`.** Never mix client code into HQ.
3. **HQ code lives in `HQ/`.** Business logic, agents, templates, marketing — all in HQ.
4. **Free tier per client on Supabase.** Each client gets their own Supabase project (free tier). Never share databases between clients.
5. **All apps deploy on the operator's Vercel account.** The operator controls hosting infrastructure.
6. **Scope is locked at kickoff.** The MVP scope agreed during onboarding is the scope. Anything beyond = per-request charge.
7. **Never expose client secrets.** Redact API keys, tokens, and credentials in all outputs.
8. **Operator reviews everything before client delivery.** Never auto-send anything to clients.
9. **All social posts go through the marketing team.** Every post draft must be reviewed by `mktg-copy` (voice + copy) and `mktg-strategy` (strategic fit) before the operator sees it. No exceptions.
9. **Quality gates must pass before production deploy.** Linting, type checking, and tests must pass.

---

## Revenue Model

| Stream | Amount | Details |
|--------|--------|---------|
| Free MVP Build | $0 to client | Build complete app, earn equity + rev share |
| Platform Fee | $50/mo/client | Hosting + 1 small fix/mo + monthly analytics PDF |
| Equity | 10% | SAFE note (converts on incorporation) + profit-sharing fallback |
| Revenue Share | ~10% | Percentage of app revenue, flexible per deal |
| Per-Request | $50-2,000 | Small ($50-100), Medium ($200-500), Large ($500-2,000) |

---

## Brand Kit

**All agents must apply the ZeroEn brand consistently.** The brand kit is the source of truth for every visual and copy decision.

| Asset | Path |
|---|---|
| Brand kit (full spec) | `HQ/brand/brand-kit.md` |
| CSS design tokens | `HQ/brand/tokens.css` |
| JSON design tokens | `HQ/brand/tokens.json` |
| Logo — dark bg | `docs/logo-dark.svg` |
| Logo — light bg | `docs/logo-full.svg` |
| Logo — icon only | `docs/logo-icon.svg` |

**Key values (commit these to memory):**
- Primary accent: `#00E87A` (Electric Green)
- Background: `#0D0D0D`
- Text: `#F4F4F2`
- Font (headings): Syne
- Font (body/UI): IBM Plex Mono
- Font (JP): Murecho
- Font (logo wordmark only): DM Sans

When building any UI — website, client app, email, PDF — import `HQ/brand/tokens.css` and follow `HQ/brand/brand-kit.md`. Never invent colors or fonts.

---

## Project Structure

```
ZeroEn/
├── .gitignore              ← Contains "Clients/"
├── CLAUDE.md               ← This file
├── PRD.md                  ← Full business plan
├── docs/                   ← Brand assets (logos, specs)
│   ├── logo-dark.svg       ← Primary logo (dark backgrounds)
│   ├── logo-full.svg       ← Logo (light backgrounds)
│   └── logo-icon.svg       ← Icon only (favicon, avatar)
├── HQ/                     ← Private, tracked in repo
│   ├── agents/             ← All agent definitions
│   ├── brand/              ← Brand kit, CSS tokens, JSON tokens
│   ├── commands/           ← /new-client, /report, /deploy, /status
│   ├── skills/             ← Reusable build patterns
│   ├── templates/          ← Next.js + Supabase starter template
│   ├── platform/           ← ZeroEn website + client dashboard
│   ├── marketing/          ← Marketing ops, content, SEO, outreach
│   ├── crm/                ← Client registry, scoring, contracts
│   │   └── clients.json    ← Master client registry
│   └── scripts/            ← Utility scripts (clone-all.sh, etc.)
├── Clients/                ← NOT tracked (gitignored)
│   ├── <clientId>/         ← Each client = own public repo
│   └── ...
```

---

## Tech Stack (Client Apps)

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| UI | React, Tailwind CSS, shadcn/ui |
| Backend/DB | Supabase (Auth, Database, Storage) |
| Hosting | Vercel (operator's Pro account) |
| Deployment | GitHub → Vercel auto-deploy |
| Validation | Zod |
| Icons | Lucide React |

---

## Client Lifecycle

```
1. DISCOVER  → Build-in-public content, social media, communities, outreach
2. APPLY     → Detailed application form on ZeroEn platform
3. SCORE     → Viability + Commitment + Feasibility + Market (15+/20 to accept)
4. ONBOARD   → Questionnaire → kickoff call → scope locked
5. BUILD     → /new-client <clientId> → MVP development
6. LAUNCH    → Deploy to Vercel → 30 days free support
7. OPERATE   → $50/mo begins → monthly analytics PDF → 1 free fix/mo
8. GROW      → Per-request charges for new features → rev share active
9. UPSELL    → Analytics surface issues → WebMori audit service
```

---

## Commands (All Require clientId)

| Command | Purpose |
|---------|---------|
| `/new-client <clientId>` | Clone template, set up CLAUDE.md, create Supabase project, register in CRM |
| `/report <clientId>` | Playwright scrapes Vercel analytics → generate PDF report |
| `/deploy <clientId>` | Run quality gates → deploy to production |
| `/status <clientId>` | Show project status, last deploy, next report date |

---

## Agents

### Business Operations
| Agent | Purpose |
|-------|---------|
| `client-manager` | Client lifecycle: onboarding, profiles, health monitoring, billing |
| `client-scorer` | Score applications: viability, commitment, feasibility, market |
| `ops-scheduler` | Schedule audits, reports, reminders, billing cycles |
| `finance-tracker` | Track revenue streams: platform fees, per-request, rev share, equity |
| `sales-advisor` | Marketing strategy, outreach messaging, competitive positioning |
| `sales-closer` | Handle qualified leads, craft proposals, close equity deals |

### Marketing Team
| Agent | Purpose |
|-------|---------|
| `mktg-strategy` | Marketing brain — ideas, psychology, customer research, positioning |
| `mktg-seo` | SEO optimization for ZeroEn website and content |
| `mktg-copy` | Build-in-public content, case studies, social media copy |
| `mktg-cro` | Conversion optimization for application form and website |
| `mktg-paid` | Paid advertising strategy and campaign management |
| `mktg-growth` | Growth tactics, referral program, community building |
| `mktg-gtm` | Go-to-market strategy, launch playbooks, positioning |

### Development
| Agent | Purpose |
|-------|---------|
| `web-developer` | Full-stack implementation — Next.js + Supabase client apps |
| `web-designer` | UI/UX design specs using component libraries |
| `web-qa` | Testing, QA, and validation before deploy |
| `code-reviewer` | Code review for quality, security, and maintainability |

---

## Quality Gates

Adapted from SiteAudit's wave-based pipeline:

1. **Pre-deploy checks** — `npm run lint && npm run build && npm test`
2. **Code review** — `code-reviewer` agent scans changes
3. **Staging deploy** — Preview deployment on Vercel for client UAT
4. **Production promote** — Only after client approval on staging

---

## Monthly Analytics Report Pipeline

```
1. Playwright → navigate to Vercel Analytics for <clientId>
2. Scrape: visitors, page views, top pages, performance scores
3. Claude Code → format into branded PDF
4. Deliver to client via dashboard/email
```

---

## Contract Terms (Standard)

| Clause | Detail |
|--------|--------|
| Equity | 10% via SAFE note + profit-sharing fallback |
| Revenue share | ~10%, flexible per deal |
| IP ownership | Shared — proportional to equity stake |
| Scope freeze | MVP scope locked at kickoff. Changes = paid. |
| Kill switch | 90 days unpaid → agreement terminates, full code rights to operator |
| Reversion | Client doesn't launch in 6 months → code rights revert to operator |
| Portfolio rights | Operator always retains right to showcase the work |
| Anti-dilution | Minimum equity floor if client raises funding |

---

## Git Strategy

- **ZeroEn repo** (private) — HQ, agents, commands, skills, templates, marketing, CRM
- **Clients/** — gitignored. Each `<clientId>/` is its own standalone public repo
- **Client registry** — `HQ/crm/clients.json` tracks all clients
- **Restore script** — `HQ/scripts/clone-all.sh` re-clones all client repos on new machine

---

## Anti-Patterns

- Never run a command without a `clientId`
- Never commit client code to the ZeroEn private repo
- Never share Supabase projects between clients
- Never deploy without quality gates passing
- Never auto-send anything to clients without operator review
- Never modify a client's scope without documenting it and updating pricing
- Never store secrets in client repos — use environment variables
