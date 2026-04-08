# ZeroEn — Product Requirements Document

## The Business

**ZeroEn** — "Zero" + Engineer/Entrepreneur/Yen
*"From zero to launch."*

A solo, AI-powered technical co-founder service. Build free MVPs for founders in exchange for equity, revenue share, and recurring hosting fees. Powered by Claude Code.

---

## Revenue Model (5 Streams)

| Stream | Amount | When it pays |
|--------|--------|-------------|
| **Free MVP Build** | $0 to client | You invest time, earn equity + rev share |
| **$50/mo Platform Fee** | $50/client/mo | Hosting on your Vercel + 1 small fix/mo + monthly analytics PDF |
| **10% Equity** | SAFE + profit-sharing | Long-term: converts when client incorporates, or profit-sharing if they don't |
| **~10% Revenue Share** | % of app revenue | Ongoing passive income, negotiated per deal |
| **Per-Request Charges** | $50-2,000 | Small ($50-100), Medium ($200-500), Large ($500-2,000) for extra changes |

**Revenue target:** $3,000-5,000/mo
**Path to target:** 60 clients × $50/mo = $3,000 from platform fees alone. Per-request charges and rev share add on top.

---

## Target Market

- **Who:** Anyone with a business idea, globally
- **Filter:** Detailed application form scored on: idea viability, founder commitment, technical feasibility, revenue potential, gut feeling
- **Scoring:** Viability (1-5), Commitment (1-5), Feasibility (1-5), Market (1-5). Accept 15+/20
- **No specialization** — generalist, build whatever interesting ideas come

---

## Tech Stack

- **Frontend:** Next.js (React)
- **Backend/DB:** Supabase (free tier per client, own project per client)
- **Hosting:** Your Vercel account (Pro plan, $20/mo)
- **Deployment:** Vercel + GitHub (auto-deploy)
- **Design:** Component libraries (shadcn/Tailwind) + design skills/plugins. Client can provide designs; custom design tweaks cost extra.

---

## Client Journey

```
1. DISCOVER     → Build-in-public content, social media, communities, cold outreach
2. APPLY        → Detailed application form (idea, target users, competitors, monetization, founder background)
3. SCORE        → Score: viability (1-5), commitment (1-5), feasibility (1-5), market (1-5). Accept 15+/20
4. ONBOARD      → Structured questionnaire → focused kickoff call → scope locked
5. BUILD        → Free MVP on Next.js + Supabase, deployed on your Vercel
6. LAUNCH       → 30 days free launch support (bugs, deployment issues, tweaks)
7. OPERATE      → $50/mo platform fee begins. Monthly analytics report. 1 free small fix/mo.
8. GROW         → Per-request charges for new features. Rev share kicks in as app earns.
9. UPSELL       → Analytics reports surface issues → natural pipeline to WebMori audit service
```

---

## Deliverables

### What's FREE (the MVP build):
- Working app with core features
- Deployed on your Vercel
- Connected to client's Supabase (free tier)
- Ready to use by end users

### What's included in $50/mo:
- Hosting on your Vercel account
- 1 small fix per month
- Monthly analytics report PDF (automated via Playwright + Claude Code scraping Vercel analytics)

### What costs extra:
- Additional features/changes (tiered per-request pricing)
- Custom design work
- Domain setup / custom configurations
- Anything beyond locked MVP scope

---

## Legal Structure

### Phase 1 — Now (April 2026):
- **Canadian sole proprietorship** ($0)
- Written agreements (SAFE + profit-sharing hybrid) for each client
- NDA template ready for founders

### Phase 2 — When revenue allows (~$225):
- **Wyoming LLC** ($100 state fee + $125/yr registered agent)
- Mercury bank account (free)
- Formalized contracts under LLC

### Phase 3 — November 2026 (Malaysia):
- DE Rantau nomad visa — work for foreign entities, no Malaysian entity needed
- Continue operating Canadian sole prop or US LLC
- File Canadian taxes on worldwide income

---

## Contract Terms

| Clause | Detail |
|--------|--------|
| **Equity** | 10% via SAFE note (converts on incorporation) + profit-sharing fallback |
| **Revenue share** | ~10%, flexible per deal |
| **IP ownership** | Shared — proportional to equity stake |
| **Scope freeze** | MVP scope locked at kickoff. Changes = paid per-request. |
| **Kill switch** | 90 days unpaid → agreement terminates, you retain full code rights |
| **Reversion clause** | Client doesn't launch in 6 months → full code rights revert to you |
| **Portfolio rights** | Always retain right to showcase the work |
| **Anti-dilution** | Minimum equity floor if client raises funding |
| **Founder vesting** | Client's equity also vests — abandonment = they lose equity proportionally |

---

## Project Structure

```
~/repos/ZeroEn/                  ← Private repo
├── .gitignore                   ← contains "Clients/"
├── CLAUDE.md                    ← Master operating manual
├── PRD.md                       ← This file
├── HQ/                          ← Tracked in private repo
│   ├── agents/                  ← Carried from SiteAudit + new ZeroEn agents
│   ├── commands/                ← /new-client, /report, /deploy, etc.
│   ├── skills/                  ← Reusable build patterns
│   ├── templates/               ← Next.js + Supabase starter
│   ├── platform/                ← ZeroEn website + client dashboard
│   ├── marketing/               ← Marketing ops (from SiteAudit)
│   ├── crm/                     ← Client tracking, scoring, contracts
│   │   └── clients.json         ← Registry of all clients
│   └── scripts/
│       └── clone-all.sh         ← Restore all client repos on new machine
├── Clients/                     ← NOT tracked by ZeroEn repo
│   ├── client-alpha/            ← Own public repo
│   ├── client-beta/             ← Own public repo
│   └── ...
```

### Git Strategy
- **ZeroEn** = private repo (HQ, agents, commands, skills, templates, marketing, crm)
- **Clients/** = gitignored. Each client folder is its own standalone public repo.
- Client registry tracked in `HQ/crm/clients.json`
- `HQ/scripts/clone-all.sh` restores all client repos on a new machine

### Command Convention
All commands require `clientId` parameter:
- `/new-client <clientId>` — creates the project
- `/report <clientId>` — generates analytics PDF
- `/deploy <clientId>` — deploys client app
- `/status <clientId>` — shows project status

---

## Quality Assurance

Adapted from SiteAudit's wave-based pipeline:
1. **Automated testing** — CI/CD with linting, type checking, tests before every deploy
2. **SiteAudit-style validation gates** — automated checks must pass before production deploy
3. **Client UAT** — staging deploy → client tests and approves → production promote

---

## Marketing Strategy

### Build in Public (Primary Channel)
| Format | Platform | Frequency |
|--------|----------|-----------|
| Build threads + screenshots | Twitter/X | 2-3/week |
| Case studies / technical breakdowns | Blog / Dev.to / Hashnode | 1/week |
| Ship announcements | Indie Hackers / Reddit | Per launch |
| Client app launches | Product Hunt | Per client app |
| Open source starter template | GitHub | Ongoing |

**No video** — all content is text, screenshots, code snippets, architecture diagrams, and metrics.

### Additional Channels
- Multi-channel approach using SiteAudit's 7 marketing agents (adapted for ZeroEn)
- Cold outreach to founders posting ideas on social media
- Community participation in startup/founder forums
- Referral program — existing clients get discount on next change request for referrals

### Strategic Pipeline
```
ZeroEn (build free apps)
    → $50/mo hosting clients
        → Monthly analytics reports surface issues
            → Natural upsell to WebMori audit service (¥19,800-99,000/mo)
```
ZeroEn feeds WebMori. Two businesses, one pipeline. Kept as separate brands.

---

## Brand

- **Name:** ZeroEn
- **Meaning:** Zero + Engineer / Entrepreneur / Yen
- **Tagline:** "From zero to launch."
- **Vibe:** Technical co-founder — professional, partnership-oriented
- **Positioning:** "I'm your CTO, not a freelancer"

---

## Claude Code Operating System

### Carried from SiteAudit:
- All 7 marketing agents (SEO, copy, CRO, growth, GTM, paid, strategy)
- Business ops agents (client manager, ops scheduler, finance tracker, sales advisor/closer)
- Dev workflow (hooks system, quality gates, session management, code review, skills)
- 27 hooks adapted for client project workflows
- PDF generation pipeline adapted for monthly analytics reports

### New for ZeroEn:
- `/new-client <clientId>` command — clones template, sets up CLAUDE.md, creates Supabase project
- `/report <clientId>` command — Playwright scrapes Vercel analytics, Claude generates PDF
- `/deploy <clientId>` command — push to production with quality gates
- Client scoring agent — evaluates applications against criteria
- Template repo — pre-built Next.js + Supabase starter

---

## Risk Mitigation

| Risk | Safeguard |
|------|-----------|
| Legal disputes | Sole prop → LLC. Written contracts for every deal. |
| Equity = $0 | Platform fees + per-request = real income. Equity is bonus. |
| Scope creep | Locked scope. Changes = paid. No exceptions. |
| Client stops paying | Kill switch: site offline after 90 days unpaid. You control Vercel. |
| Burnout | Start with 3 clients max. Automate everything. Template system accelerates each build. |
| Client copies code | Shared IP. Code on YOUR Vercel. They can't easily leave. |
| Revenue too slow | Need other income stream while building client base to 60+. |

---

## Immediate Next Steps

1. Set up ZeroEn Claude Code project (CLAUDE.md, agents, commands, template)
2. NotebookLM research on Claude Code best practices
3. Build application form + scoring system
4. Create SAFE + profit-sharing contract template
5. Create Next.js + Supabase starter template
6. Build ZeroEn website + client dashboard
7. Start build-in-public content
8. Land first 3 clients
