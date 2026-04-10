# ZeroEn Platform — Product Requirements Document

**Date:** 2026-04-09  
**Status:** Approved  
**Scope:** zeroen.dev — marketing site + client dashboard + operator admin panel  
**Stack:** Next.js (App Router) · Supabase · Vercel · Stripe · Resend · DocuSign/HelloSign · next-intl  

---

## 1. Overview

ZeroEn is a solo, AI-powered technical co-founder service. The platform (zeroen.dev) is the operational backbone of the business: it acquires founders via a marketing site, filters them via an application system, manages the build relationship via a client dashboard, and gives the operator full control via an admin panel.

### Brand Feel

> "I need to apply right now before they close applications."

Every design and copy decision should reinforce urgency and scarcity. The platform should feel exclusive, serious, and fast-moving. Not a SaaS — a partnership you have to earn.

---

## 2. User Roles

| Role | Description | Access |
|------|-------------|--------|
| **Founder (Client)** | Applies to ZeroEn, goes through the build, pays $50/mo after launch | Public site + client dashboard (post-approval) |
| **Operator (Admin)** | The solo operator running ZeroEn — manages all clients, billing, builds | Everything + `/admin/*` routes |

Role is stored in Supabase. Operator account has `role = 'admin'`. All `/admin/*` routes are middleware-protected by role.

---

## 3. Information Architecture

```
zeroen.dev/
├── / (home)
├── /how-it-works
├── /pricing
├── /apply
├── /blog
│   └── /blog/[slug]
├── /terms
├── /login
├── /signup (→ redirect to /apply)
├── /dashboard/
│   ├── (overview)
│   ├── /milestones
│   ├── /scope
│   ├── /contract
│   ├── /messages
│   ├── /requests (change requests)
│   ├── /files
│   ├── /invoices
│   └── /analytics (monthly PDF)
└── /admin/
    ├── (overview — revenue dashboard)
    ├── /applications
    │   └── /applications/[id]
    ├── /clients
    │   └── /clients/[id]
    │       ├── /project
    │       ├── /milestones
    │       ├── /messages
    │       ├── /requests
    │       ├── /invoices
    │       └── /contract
    └── /reports
```

---

## 4. Marketing Site

### 4.1 Homepage Sections (in order)

**Section 1 — Hero** *(existing)*  
Terminal window animation. Rotating typed lines. Primary CTA: "Apply Free."

**Section 2 — Why ZeroEn** *(new)*  
Confrontational copy anchored on: *"Build for free. Pay us when you win."*  
Three-column breakdown of the value prop — no engineers, no upfront cost, real equity partner.  
Secondary copy should create urgency: limited slots, selective process.

**Section 3 — Tech Stack Showcase** *(new)*  
Interactive animated terminal: CLI-style output showing the stack being initialised:
```
$ zeroen --init your-app
> installing next@15...
> linking supabase...
> configuring vercel...
> wiring stripe...
> deploying...
✓ MVP ready in 4 weeks.
```
Each tool (Next.js, Supabase, Vercel, Stripe) highlighted as it appears. Static description cards beneath.

**Section 4 — How It Works** *(existing — keep)*  
9-step vertical timeline.

**Section 5 — Case Studies Preview** *(new)*  
3-card grid. Initially: 3 placeholder "Coming Soon" cards.  
When populated, each card shows:
- App name + one-line description
- Tech stack tags (Next.js, Stripe, Supabase, etc.)
- Screenshot / preview image of the live app

No dedicated `/cases` page at this stage. Cards are static content managed by operator.

**Section 6 — Pricing** *(existing — keep)*  
MVP Build ($0) · Platform ($50/mo) · Per-Request ($50+).

**Section 7 — Apply CTA** *(existing — keep)*  
Big CTA block. Reinforce urgency: "Applications close when we reach capacity."

**Section 8 — Newsletter** *(new — homepage + blog only)*  
Full-width email capture: "Get weekly build updates — real numbers, real clients, no fluff."  
Connects to Resend mailing list.

### 4.2 Supporting Pages

**`/how-it-works`** — 9-step detailed timeline. No changes needed.

**`/pricing`** — 3 tiers + comparison table + FAQ. No changes needed.

**`/apply`** — 4-step wizard (existing). No changes needed.

**`/terms`** — Two-version layout:
- **Summary card** (top): Plain English, ZeroEn-branded terminal card style. Covers: equity, kill switch, scope freeze, reversion, portfolio rights — one sentence each.
- **Full legal text** (below, collapsible accordion): Complete contract terms. Operator maintains this section.

### 4.3 Blog System

Critical channel for SEO and build-in-public content.

| Feature | Spec |
|---------|------|
| Content format | MDX files in `/content/blog/[locale]/[slug].mdx` |
| Categories | `build-update`, `case-study`, `operator-log`, `tutorial` |
| Tags | Free-form, stored in MDX frontmatter |
| Bilingual | EN and JP versions per post. Locale-routed via next-intl. |
| OG image | Auto-generated per post via `/api/og?title=...&category=...` |
| RSS feed | `/feed.xml` — EN and `/feed.ja.xml` — JP |
| Newsletter CTA | Inline section above footer on all blog pages |
| Listing page | Cards with category badge, title, date, estimated read time |

---

## 5. Authentication & Access

| Flow | Behaviour |
|------|-----------|
| Sign up | Google or GitHub OAuth via Supabase Auth |
| Post-signup state | Account created, dashboard is locked (`status = 'pending'`) |
| After approval | Operator approves → `status = 'active'` → client gets email → dashboard unlocks |
| Operator login | Same OAuth, Supabase role check → `/admin/*` access granted |
| Auth guard | Middleware protects `/dashboard/*` (requires `status = 'active'`) and `/admin/*` (requires `role = 'admin'`) |

---

## 6. Application System

### 6.1 Submission

4-step wizard (existing) collects:
- Step 1 — Idea: name, description, problem solved
- Step 2 — Market: target users, competitors, monetisation
- Step 3 — Founder: name, email, background, time commitment, LinkedIn
- Step 4 — Review + submit

On submit:
1. Application saved to `applications` table
2. AI auto-scores on 4 dimensions (Claude API call with structured output)
3. Email sent to operator with application summary + AI score breakdown

### 6.2 AI Scoring

Each dimension scored 1–5 by AI with a one-sentence rationale:

| Dimension | What it measures |
|-----------|-----------------|
| **Viability** | Is this a real problem worth solving? |
| **Commitment** | Does the founder seem serious and available? |
| **Feasibility** | Can this be built as an MVP in reasonable scope? |
| **Market** | Is there genuine demand and a clear revenue path? |

**Total:** Sum of 4 dimensions (max 20). Threshold to accept: 15+.

### 6.3 Operator Review (Admin)

In `/admin/applications/[id]`:
- View full application
- See AI score per dimension with rationale
- Adjust any dimension score (1–5 slider) — total recalculates live
- Click **Accept** or **Reject**

**On Accept:**
- `applications.status = 'accepted'`
- `profiles.status = 'active'` (unlocks dashboard)
- Email sent to founder: subject "You're in — here's what happens next", with next steps + dashboard link

**On Reject:**
- `applications.status = 'rejected'`
- Email sent to founder: polite rejection with option to reapply in 3 months

---

## 7. Client Dashboard

Clients access their dashboard after approval. Each client is associated with one `project` record.

### 7.1 Overview

- **Project status card**: current lifecycle stage (DISCOVER → UPSELL), last updated
- **Milestone tracker**: visual progress of current stage + sub-milestones

### 7.2 Milestones

**Fixed stages** (operator moves client through these):
`DISCOVER` → `APPLY` → `SCORE` → `ONBOARD` → `BUILD` → `LAUNCH` → `OPERATE` → `GROW` → `UPSELL`

**Custom sub-milestones** (operator adds within each stage):
- Title, description, status (`pending` / `in_progress` / `completed`), optional due date
- Client sees sub-milestones as a checklist within the current stage

### 7.3 Scope Document

- Read-only view of the agreed MVP feature list (up to 5 features)
- Set by operator at project creation
- Locked — client cannot edit
- Timestamp of when scope was frozen

### 7.4 Contract

- View their specific equity agreement:
  - Equity %
  - Revenue share %
  - Contract signed date
  - DocuSign/HelloSign document link (embedded viewer or link to provider)
- Status badge: `Pending Signature` / `Signed`

### 7.5 Messages

- Simple threaded chat with operator
- Real-time via Supabase Realtime
- Email notification to operator on new client message
- Email notification to client when operator posts

### 7.6 Change Requests

**Client-initiated:**
1. Client fills change request form (title, description, priority)
2. Status: `submitted`
3. Operator receives email notification
4. Operator responds with a quote in admin panel
5. Status: `quoted` — client sees quote + "Approve & Pay" button
6. Client pays via Stripe → status: `approved`
7. Work begins → status: `in_progress` → `completed`

**Operator-initiated:**
1. Operator creates a suggested change in admin panel (title, description, quote)
2. Client sees it as a new request with status `suggested`
3. Client approves + pays → `approved` → work begins

### 7.7 Files

- Drag-and-drop upload (client or operator)
- Download any file
- File list with name, size, uploader, upload date
- Stored in Supabase Storage

### 7.8 Invoices

- List of all invoices: monthly platform fee + per-request charges
- Status: `pending` / `paid` / `overdue`
- Pay button → Stripe Checkout for unpaid invoices
- **Overdue flow (30 days):** Email reminder sent + dashboard enters read-only mode (banner: "Your account is paused — please settle your invoice to resume access")

### 7.9 Analytics

- **No live charts.** Analytics data is delivered via the monthly PDF report only.
- Invoices page shows the latest PDF report with a download link
- PDF is auto-generated on the 1st of each month via cron (see §10)

---

## 8. Operator Admin Panel (`/admin/*`)

Role-gated. Accessible only to accounts with `role = 'admin'` in Supabase.

### 8.1 Overview (Revenue Dashboard)

| Metric | Source |
|--------|--------|
| MRR | Active Stripe subscriptions × $50 |
| Overdue / at-risk | Invoices past due date |
| Equity portfolio | Manual field per client — operator inputs estimated valuation |
| Ongoing change requests | Count of `in_progress` change requests across all clients |
| Active clients by stage | Count per lifecycle stage |

### 8.2 Applications

- Table: all applications, sorted newest first
- Columns: name, idea, submitted date, AI score total, status
- Click → `/admin/applications/[id]` for full review + score adjustment + accept/reject

### 8.3 Clients

- Table: all active clients, lifecycle stage, MRR status, last activity
- Click → `/admin/clients/[id]` for full client management

**Per-client management pages:**

`/admin/clients/[id]/project`
- Edit: client name, contact email, repo URL, Vercel project ID
- Edit: scope document (up to 5 features)
- Edit: start date, estimated launch date
- Lifecycle stage selector (moves client through fixed stages)

`/admin/clients/[id]/milestones`
- Create / edit / complete / delete sub-milestones within current stage

`/admin/clients/[id]/messages`
- Full message thread — same Supabase Realtime view as client, operator side

`/admin/clients/[id]/requests`
- View all change requests
- Respond to client-submitted requests with a quote
- Create operator-initiated change requests

`/admin/clients/[id]/invoices`
- View all invoices
- Manually generate a per-request invoice (amount, description)
- See Stripe subscription status

`/admin/clients/[id]/contract`
- Upload signed contract PDF (stored in Supabase Storage)
- Record equity %, revenue share %, signed date
- Link to DocuSign/HelloSign document

### 8.4 Build Queue

- List of all clients currently in `BUILD` or `LAUNCH` stage
- Shows: client name, scope features, sub-milestones, estimated launch date
- Quick-link to update milestones

### 8.5 Reports

- Trigger manual analytics PDF generation for any client
- View history of all generated PDFs

---

## 9. Billing & Payments

### 9.1 Platform Fee ($50/mo)

- Stripe subscription created by operator manually after MVP launch
- Operator triggers via admin panel: "Start Subscription" button for a client
- Client receives email with payment setup link (Stripe Checkout)
- Once card on file, $50/mo auto-charged monthly

### 9.2 Per-Request Invoices

- Created by operator in admin panel (or via approved change request flow)
- Client notified by email
- Client pays via Stripe Checkout in `/dashboard/invoices`
- Webhook updates invoice status to `paid`

### 9.3 Overdue Handling

| Day | Action |
|-----|--------|
| Due date | Invoice marked `overdue`, reminder email sent to client |
| Day +30 | Second email + dashboard soft-locked (read-only, banner shown) |
| Day +90 | Operator manually decides (kill switch or extension) — no auto-action |

---

## 10. Email Notifications

All emails sent via **Resend**. Bilingual (EN/JP based on client's locale preference).

| Trigger | Recipients | Content |
|---------|-----------|---------|
| Application submitted | Operator | Application summary + AI score breakdown |
| Application accepted | Client | "You're in" — next steps + dashboard link |
| Application rejected | Client | Polite rejection + reapply timeline |
| New message | Other party | "New message from [name]" + thread link |
| Invoice created | Client | Invoice details + pay link |
| Invoice overdue (day 0) | Client | Payment reminder |
| Invoice overdue (day +30) | Client | Urgent reminder + dashboard lock notice |
| Invoice paid | Client | Confirmation |
| Subscription started | Client | Billing start confirmation |
| Monthly PDF ready | Client | "Your monthly report is ready" + dashboard link |

---

## 11. Analytics PDF Report

**Trigger:** Automated cron job — 1st of every month at 09:00 JST.

**Process:**
1. Cron iterates all clients with `status = 'active'` and `stage >= 'OPERATE'`
2. For each client: Claude Code generates a branded PDF report
3. PDF stored in Supabase Storage
4. Email sent to client with link + attachment
5. `/dashboard/analytics` updated with latest PDF link

**Report content (operator manually inputs monthly):**
- Month + client name
- Key stats: visitors, top pages, performance score (operator fills these in)
- Milestone summary: what shipped this month
- Next month: what's planned
- ZeroEn branding throughout

**Manual trigger:** Operator can also generate for any client on-demand from `/admin/reports`.

---

## 12. Contract & E-Signature

| Step | Flow |
|------|------|
| Operator prepares agreement | Equity %, revenue share % filled in admin panel |
| Client receives DocuSign/HelloSign request | Via third-party e-signature provider |
| Client signs | Provider handles signing flow |
| Signed doc stored | Uploaded to Supabase Storage + linked to client profile |
| Dashboard shows status | `Pending Signature` → `Signed` |

---

## 13. Internationalisation

**Full bilingual: English + Japanese throughout.**

| Surface | EN | JP |
|---------|----|----|
| Marketing site | ✓ | ✓ |
| Apply wizard | ✓ | ✓ |
| Blog | ✓ | ✓ (separate post versions) |
| Client dashboard | ✓ | ✓ |
| Admin panel | ✓ | ✓ |
| Email templates | ✓ | ✓ (locale-based) |

Locale detection via next-intl. URL-based routing (`/en/`, `/ja/`). Default: English.

---

## 14. Database Schema (Key Tables)

```sql
profiles          -- id, email, name, role, status, locale, created_at
applications      -- id, profile_id, idea_name, idea_desc, problem, target_users,
                  --   competitors, monetization, founder_bg, commitment, linkedin,
                  --   status, ai_score_viability, ai_score_commitment,
                  --   ai_score_feasibility, ai_score_market, ai_score_total,
                  --   ai_rationale, operator_notes, created_at
projects          -- id, profile_id, client_name, company, contact_email,
                  --   stage, scope_features (jsonb), start_date, estimated_launch,
                  --   repo_url, vercel_project_id, equity_pct, revenue_share_pct,
                  --   contract_signed_at, contract_url, equity_est_value, created_at
milestones        -- id, project_id, stage, title, description, status, due_date, order
messages          -- id, project_id, sender_id, content, created_at
change_requests   -- id, project_id, title, description, priority, initiator,
                  --   status, quote_amount, stripe_payment_intent, created_at
files             -- id, project_id, name, url, size, uploaded_by, created_at
invoices          -- id, project_id, type (subscription|per_request), amount,
                  --   description, status, stripe_invoice_id, due_date, paid_at
analytics_reports -- id, project_id, period_month, pdf_url, generated_at, delivered_at
newsletter_subs   -- id, email, locale, created_at
```

---

## 15. What's Already Built vs. What's New

### Already Built ✓

| Feature | Status |
|---------|--------|
| Marketing: Hero, How It Works, Pricing, Apply CTA, Footer | ✓ |
| Apply wizard (4 steps) + Supabase integration | ✓ |
| Auth (Google/GitHub OAuth + Supabase) | ✓ |
| Dashboard layout (sidebar + mobile bottom nav) | ✓ |
| Dashboard: messages, files, invoices, change requests, analytics stubs | ✓ |
| Stripe: checkout, webhook, invoice payment | ✓ |
| File upload (Supabase Storage) | ✓ |
| Resend email (newsletter + application submit) | ✓ |
| MDX blog (listing + post) | ✓ |
| SEO: metadata, OG image, sitemap, robots | ✓ |
| Loading skeletons for dashboard pages | ✓ |
| i18n (EN + JP) on marketing + dashboard | ✓ |

### New Features Required

| Feature | Priority |
|---------|----------|
| **Marketing: "Why ZeroEn" section** | High |
| **Marketing: Interactive terminal tech stack section** | High |
| **Marketing: Case studies preview (placeholder cards)** | High |
| **Marketing: Newsletter section (homepage + blog)** | Medium |
| **Marketing: /terms page (two-version layout)** | Medium |
| **AI auto-scoring on application submit** | High |
| **Admin panel: /admin/* routes (all)** | Critical |
| **Admin: Application review + score adjustment + accept/reject** | Critical |
| **Admin: Client management (project, milestones, messages, invoices, contract)** | Critical |
| **Admin: Revenue dashboard** | High |
| **Admin: Build queue** | Medium |
| **Admin: Manual PDF report trigger** | Medium |
| **Client dashboard: Scope document page** | High |
| **Client dashboard: Contract page (DocuSign/HelloSign view)** | High |
| **Client dashboard: Milestones page (hybrid stages + sub-milestones)** | High |
| **Change request: full flow (quote → approve → pay → track)** | High |
| **Change request: operator-initiated flow** | High |
| **Stripe subscription: operator-triggered start, auto-monthly billing** | High |
| **Dashboard overdue soft-lock (read-only + banner)** | Medium |
| **Blog: categories, tags, RSS feed, newsletter CTA** | Medium |
| **Blog: bilingual posts (EN + JP per post)** | Medium |
| **Blog: OG image auto-gen per post** | Low |
| **DocuSign/HelloSign e-signature integration** | Medium |
| **Monthly analytics PDF cron (auto-generate + email)** | Medium |
| **Email notifications: full set (accept/reject/messages/invoices)** | High |
| **i18n: admin panel (EN + JP)** | Low |

---

## 16. Out of Scope (This Version)

- Live analytics charts in client dashboard (PDF only)
- `/cases` dedicated case study page (homepage preview only)
- `/roadmap` or status page
- Live numbers on homepage
- Mobile-first bias (responsive, no preference)
- JP-only admin panel (EN first, JP later)

---

## 17. Success Metrics

| Metric | Target |
|--------|--------|
| Applications submitted | 10+ in first 30 days post-launch |
| Application → accepted rate | ~20% (selective, reinforces scarcity) |
| Client dashboard activation (signs in within 48h of approval) | >80% |
| $50/mo subscription setup rate | >90% of accepted clients |
| Monthly report delivery | 100% of active clients on the 1st |
