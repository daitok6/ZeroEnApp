# Request Tracking & Invoicing — Design Spec
**Date:** 2026-04-11  
**Status:** Approved — Revised 2026-04-12 (Stripe Invoices)

---

## Overview

Expand the change request system so admins can track all client requests in one place, send invoices tied to specific requests, and clients can accept (triggering Stripe payment or auto-approval for $0), discuss inline, or decline — all without leaving the requests page.

---

## Architecture

### Option Selected: Minimal Schema Extension (Option A)

Extend the existing `invoices` and `change_requests` tables rather than introducing new concepts. The existing `quoted` status on `change_requests` maps directly to "admin has sent an invoice." The existing Stripe checkout flow handles payment on acceptance.

---

## Database Changes

### Migration A — Link invoices to requests
```sql
ALTER TABLE invoices 
ADD COLUMN change_request_id UUID REFERENCES change_requests(id) ON DELETE SET NULL;
```

### Migration B — Request comments table
```sql
CREATE TABLE request_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  change_request_id UUID NOT NULL REFERENCES change_requests(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**RLS policies for `request_comments`:**
- Clients: SELECT/INSERT on comments where `change_request_id` belongs to their project
- Admins: SELECT/INSERT on all comments

### Migration C — Expand invoice status enum
Add `declined` to `invoices.status`:
```sql
ALTER TYPE invoice_status ADD VALUE 'declined';
```

### Change Request Status Flow (unchanged)
```
submitted → reviewing → quoted → approved → in_progress → completed
                                          ↘ rejected
```
- `quoted` = admin has sent an invoice, waiting on client response
- Client accept → `approved`
- Client decline → back to `reviewing` (invoice marked `declined`)
- Client discuss → status stays `quoted`, comment thread visible

---

## Admin Side

### New Route: `/[locale]/admin/requests`

Full-width table of all change requests across all clients.

**Columns:** Client name, Project, Request title, Tier, Status, Submitted date, Quoted amount

**Status filter tabs:** All / Needs Review / Quoted / In Progress / Completed
- "Needs Review" = `submitted` + `reviewing` combined

**Row actions (context-sensitive):**
| Current Status | Available Action |
|---|---|
| `submitted` | "Mark Reviewing" |
| `reviewing` | "Send Invoice" (opens slide-out panel) |
| `quoted` | Shows sent amount, greyed out |
| `approved` | "Mark In Progress" |
| `in_progress` | "Mark Complete" |

**Send Invoice Slide-Out Panel:**
- Request title + description (read-only reference)
- Amount field (pre-filled from `estimated_cost_cents`, editable, can be $0)
- Description field (defaults to request title, editable)
- Due date picker (optional)
- "Send Invoice" button → creates `invoices` record with `change_request_id` set, updates `change_requests.status` to `quoted`

**Comment Thread:**
- Collapsible section per row, expands inline
- Shows full `request_comments` thread for that request
- Admin can reply without leaving the page

---

## Client Side

### Expanded Route: `/[locale]/dashboard/requests`

Request cards replace the flat list. Submission form stays at top, unchanged.

**Request card states:**
- Default: title, tier badge, status badge, submitted date
- When `status = quoted`: expands to show inline invoice panel

**Inline Invoice Panel (quoted status only):**
- Amount due, description, due date
- Three action buttons:

| Action | Behavior |
|---|---|
| **Accept** (amount > ¥0) | Redirect to Stripe hosted invoice URL (stored at quote time); on `invoice.paid` webhook → invoice `paid`, request `approved` |
| **Accept** (amount = ¥0) | Direct API call → invoice `paid`, request `approved` (no Stripe) |
| **Decline** | Modal with optional reason field → invoice `declined`, request back to `reviewing` |
| **Discuss** | Expands inline comment thread; status stays `quoted` |

**Inline Comment Thread:**
- Visible when discuss is clicked or comments already exist
- Shows all comments (client + admin) in chronological order
- Textarea + send button at the bottom
- New client comment adds a comment badge to the request row in the admin "Quoted" tab so the admin knows a reply is waiting

---

## API Routes

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/admin/requests` | GET | Admin | Fetch all requests with status filter |
| `/api/admin/requests/[id]/status` | PATCH | Admin | Transition status (reviewing → in_progress → completed) |
| `/api/admin/requests/[id]/invoice` | POST | Admin | Create invoice + set request to `quoted` |
| `/api/requests/[id]/respond` | POST | Client | Accept (returns Stripe URL or auto-approves) or Decline |
| `/api/requests/[id]/comments` | GET | Both | Fetch comments for a request |
| `/api/requests/[id]/comments` | POST | Both | Add a comment to a request |

**Stripe flow on accept:**
1. Admin POSTs `/api/admin/requests/[id]/invoice` → server creates + finalizes a Stripe Invoice, stores `stripe_hosted_invoice_url` on the invoice row, sets `change_requests.status = 'quoted'`
2. Client hits `/api/requests/[id]/respond` with `{ action: 'accept' }` → server returns stored `{ url: stripe_hosted_invoice_url }`
3. Client redirects to Stripe-hosted invoice page (shows PDF, accepts payment)
4. Stripe fires `invoice.paid` webhook → sets `invoices.status = 'paid'` and `change_requests.status = 'approved'`

**Decline flow:**
1. Client hits `/api/requests/[id]/respond` with `{ action: 'decline', reason?: string }`
2. Server sets `invoices.status = 'declined'`, `change_requests.status = 'reviewing'`
3. Admin "Needs Review" count increments

**RLS enforcement:**
- All client-facing routes verify the request belongs to the authenticated user's project
- Admin routes check `profiles.role = 'admin'`

---

## File Impact

| File | Change |
|---|---|
| `supabase/migrations/` | 3 new migrations (invoice FK, request_comments, status enum) |
| `src/types/database.ts` | Regenerate after migrations |
| `src/app/[locale]/admin/requests/page.tsx` | New — admin requests table |
| `src/app/[locale]/dashboard/requests/page.tsx` | Expand — request cards + invoice panel |
| `src/components/admin/request-table.tsx` | New — request table with actions |
| `src/components/admin/send-invoice-panel.tsx` | New — slide-out invoice form |
| `src/components/dashboard/request-card.tsx` | New — expandable request card |
| `src/components/dashboard/invoice-panel.tsx` | New — accept/discuss/decline UI |
| `src/components/shared/comment-thread.tsx` | New — inline comment thread (shared) |
| `src/app/api/admin/requests/route.ts` | New — GET all requests |
| `src/app/api/admin/requests/[id]/status/route.ts` | New — PATCH status |
| `src/app/api/admin/requests/[id]/invoice/route.ts` | New — POST send invoice |
| `src/app/api/requests/[id]/respond/route.ts` | New — POST accept/decline |
| `src/app/api/requests/[id]/comments/route.ts` | New — GET/POST comments |
| `src/lib/admin/queries.ts` | Extend — add requests query |
| `src/app/api/stripe/webhook/route.ts` | Extend — handle invoice+request update on payment |
