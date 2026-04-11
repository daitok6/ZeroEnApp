# Request Tracking & Invoicing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an admin requests dashboard where admins can track all client change requests, send invoices tied to requests, and clients can accept (Stripe or $0 auto-approve), discuss inline, or decline — all from the requests page.

**Architecture:** Extend the existing `change_requests` and `invoices` tables with a FK link and new `declined` status. Add admin RLS policies and a `request_comments` table. Build server-rendered pages backed by client components for interactive actions. Reuse the existing Stripe checkout flow from the respond endpoint.

**Tech Stack:** Next.js App Router, Supabase (RLS, admin client), Stripe, Tailwind CSS, Zod, Lucide React, `next/navigation`

> **Note:** This codebase has no test infrastructure. TDD steps are replaced with `npm run build && npm run lint` verification gates. Run these after every task.

---

## File Map

**New files:**
- `supabase/migrations/0021_invoice_request_fk.sql` — FK, admin RLS for change_requests + invoices
- `supabase/migrations/0022_request_comments.sql` — request_comments table + RLS
- `supabase/migrations/0023_invoice_status_declined.sql` — add `declined` to invoice status check
- `src/lib/admin/requests.ts` — `getAdminRequests()` query + `RequestRow` type
- `src/app/api/admin/requests/route.ts` — GET all requests (admin)
- `src/app/api/admin/requests/[id]/status/route.ts` — PATCH status (admin)
- `src/app/api/admin/requests/[id]/invoice/route.ts` — POST send invoice (admin)
- `src/app/api/requests/[id]/respond/route.ts` — POST accept/decline (client)
- `src/app/api/requests/[id]/comments/route.ts` — GET + POST comments (both)
- `src/components/shared/comment-thread.tsx` — inline comment thread (client component)
- `src/components/admin/send-invoice-panel.tsx` — slide-out invoice form (client component)
- `src/components/admin/request-table.tsx` — requests table + actions (client component)
- `src/app/[locale]/admin/requests/page.tsx` — admin requests page (server component)
- `src/components/dashboard/invoice-panel.tsx` — accept/discuss/decline (client component)
- `src/components/dashboard/request-card.tsx` — expandable request card (client component)

**Modified files:**
- `src/components/dashboard/nav-items.ts` — add Requests to `adminNavItems`
- `src/app/api/stripe/webhook/route.ts` — update change_request on payment success
- `src/app/[locale]/dashboard/requests/page.tsx` — fetch invoices, use request cards

---

## Task 1: Database migrations

**Files:**
- Create: `supabase/migrations/0021_invoice_request_fk.sql`
- Create: `supabase/migrations/0022_request_comments.sql`
- Create: `supabase/migrations/0023_invoice_status_declined.sql`

- [ ] **Step 1: Write migration 0021 — invoice FK + admin RLS**

```sql
-- supabase/migrations/0021_invoice_request_fk.sql

-- Link invoices to the change request they were created for
ALTER TABLE public.invoices
  ADD COLUMN change_request_id UUID REFERENCES public.change_requests(id) ON DELETE SET NULL;

-- Admin RLS: change_requests
CREATE POLICY "Admins can view all change requests"
  ON public.change_requests FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update change requests"
  ON public.change_requests FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin RLS: invoices (insert + select all)
CREATE POLICY "Admins can view all invoices"
  ON public.invoices FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can insert invoices"
  ON public.invoices FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

- [ ] **Step 2: Write migration 0022 — request_comments**

```sql
-- supabase/migrations/0022_request_comments.sql

CREATE TABLE public.request_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  change_request_id UUID NOT NULL REFERENCES public.change_requests(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.request_comments ENABLE ROW LEVEL SECURITY;

-- Clients can read comments on their own requests
CREATE POLICY "Clients can view comments on their requests"
  ON public.request_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.change_requests cr
      WHERE cr.id = change_request_id AND cr.client_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Clients and admins can post comments (must be own author_id)
CREATE POLICY "Users can insert comments on accessible requests"
  ON public.request_comments FOR INSERT
  WITH CHECK (
    author_id = auth.uid()
    AND (
      EXISTS (
        SELECT 1 FROM public.change_requests cr
        WHERE cr.id = change_request_id AND cr.client_id = auth.uid()
      )
      OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    )
  );
```

- [ ] **Step 3: Write migration 0023 — invoice status declined**

```sql
-- supabase/migrations/0023_invoice_status_declined.sql

-- Drop and recreate the status check constraint to include 'declined'
ALTER TABLE public.invoices DROP CONSTRAINT invoices_status_check;

ALTER TABLE public.invoices
  ADD CONSTRAINT invoices_status_check
  CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled', 'declined'));
```

- [ ] **Step 4: Apply migrations to local Supabase**

```bash
cd HQ/platform
npx supabase db reset
# OR if running migrations incrementally:
npx supabase migration up
```

Expected: migrations apply without errors.

- [ ] **Step 5: Regenerate TypeScript types**

```bash
npx supabase gen types typescript --local > src/types/database.ts
```

Expected: `src/types/database.ts` updated with `change_request_id` on invoices, `request_comments` table, and `declined` in invoice status.

- [ ] **Step 6: Verify build passes**

```bash
npm run build
```

Expected: no TypeScript errors.

- [ ] **Step 7: Commit**

```bash
git add supabase/migrations/0021_invoice_request_fk.sql \
        supabase/migrations/0022_request_comments.sql \
        supabase/migrations/0023_invoice_status_declined.sql \
        src/types/database.ts
git commit -m "feat: add invoice-request FK, request_comments table, declined status"
```

---

## Task 2: Add Requests to admin nav

**Files:**
- Modify: `src/components/dashboard/nav-items.ts`

- [ ] **Step 1: Add the import and nav item**

In `src/components/dashboard/nav-items.ts`, update the import line and `adminNavItems`:

```typescript
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, MessageSquare, FileText, Receipt, PlusCircle, Users, ClipboardList, Send, Rocket, Inbox } from 'lucide-react';

export const navItems = [
  { key: 'overview', icon: LayoutDashboard, labelEn: 'Overview', labelJa: '概要', path: '/dashboard' },
  { key: 'messages', icon: MessageSquare, labelEn: 'Messages', labelJa: 'メッセージ', path: '/dashboard/messages' },
  { key: 'documents', icon: FileText, labelEn: 'Documents', labelJa: '書類', path: '/dashboard/documents' },
  { key: 'invoices', icon: Receipt, labelEn: 'Invoices', labelJa: '請求書', path: '/dashboard/invoices' },
  { key: 'requests', icon: PlusCircle, labelEn: 'Requests', labelJa: 'リクエスト', path: '/dashboard/requests' },
] as const;

export type NavItem = {
  readonly key: string;
  readonly icon: LucideIcon;
  readonly labelEn: string;
  readonly labelJa: string;
  readonly path: string;
};

export const pendingNavItems = [
  { key: 'apply', icon: Send, labelEn: 'Apply', labelJa: '応募', path: '/dashboard/apply' },
  { key: 'application-status', icon: ClipboardList, labelEn: 'Application Status', labelJa: '応募状況', path: '/dashboard/application-status' },
] as const;

export const onboardingNavItems = [
  { key: 'onboarding', icon: Rocket, labelEn: 'Get Started', labelJa: 'はじめましょう', path: '/dashboard/onboarding' },
] as const;

export const adminNavItems = [
  { key: 'overview', icon: LayoutDashboard, labelEn: 'Overview', labelJa: '概要', path: '/admin' },
  { key: 'clients', icon: Users, labelEn: 'Clients', labelJa: 'クライアント', path: '/admin/clients' },
  { key: 'applications', icon: ClipboardList, labelEn: 'Applications', labelJa: '応募', path: '/admin/applications' },
  { key: 'requests', icon: Inbox, labelEn: 'Requests', labelJa: 'リクエスト', path: '/admin/requests' },
  { key: 'messages', icon: MessageSquare, labelEn: 'Messages', labelJa: 'メッセージ', path: '/admin/messages' },
  { key: 'documents', icon: FileText, labelEn: 'Documents', labelJa: '書類', path: '/admin/documents' },
] as const;
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/dashboard/nav-items.ts
git commit -m "feat: add Requests to admin nav"
```

---

## Task 3: Admin requests query

**Files:**
- Create: `src/lib/admin/requests.ts`

- [ ] **Step 1: Write the query file**

```typescript
// src/lib/admin/requests.ts
import type { SupabaseClient } from '@supabase/supabase-js';

export interface RequestRow {
  id: string;
  title: string;
  description: string;
  tier: string | null;
  estimatedCostCents: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  clientName: string | null;
  clientEmail: string;
  projectId: string;
  projectName: string;
  invoiceId: string | null;
  invoicedAmountCents: number | null;
  commentCount: number;
}

export async function getAdminRequests(supabase: SupabaseClient): Promise<RequestRow[]> {
  const { data: requests } = await supabase
    .from('change_requests')
    .select('id, title, description, tier, estimated_cost_cents, status, created_at, updated_at, client_id, project_id')
    .order('created_at', { ascending: false });

  if (!requests || requests.length === 0) return [];

  const requestIds = requests.map((r: { id: string }) => r.id);
  const clientIds = [...new Set(requests.map((r: { client_id: string }) => r.client_id))];
  const projectIds = [...new Set(requests.map((r: { project_id: string }) => r.project_id))];

  const [profilesResult, projectsResult, invoicesResult, commentsResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', clientIds),
    supabase
      .from('projects')
      .select('id, name')
      .in('id', projectIds),
    supabase
      .from('invoices')
      .select('id, change_request_id, amount_cents')
      .in('change_request_id', requestIds),
    supabase
      .from('request_comments')
      .select('change_request_id')
      .in('change_request_id', requestIds),
  ]);

  const profileMap = new Map<string, { full_name: string | null; email: string }>();
  for (const p of profilesResult.data ?? []) {
    profileMap.set(p.id, { full_name: p.full_name, email: p.email });
  }

  const projectMap = new Map<string, { name: string }>();
  for (const p of projectsResult.data ?? []) {
    projectMap.set(p.id, { name: p.name });
  }

  const invoiceMap = new Map<string, { id: string; amount_cents: number }>();
  for (const inv of invoicesResult.data ?? []) {
    if (inv.change_request_id) {
      invoiceMap.set(inv.change_request_id, { id: inv.id, amount_cents: inv.amount_cents });
    }
  }

  const commentCountMap = new Map<string, number>();
  for (const c of commentsResult.data ?? []) {
    commentCountMap.set(c.change_request_id, (commentCountMap.get(c.change_request_id) ?? 0) + 1);
  }

  return requests.map((r: {
    id: string; title: string; description: string; tier: string | null;
    estimated_cost_cents: number | null; status: string; created_at: string;
    updated_at: string; client_id: string; project_id: string;
  }) => {
    const profile = profileMap.get(r.client_id);
    const project = projectMap.get(r.project_id);
    const invoice = invoiceMap.get(r.id) ?? null;
    return {
      id: r.id,
      title: r.title,
      description: r.description,
      tier: r.tier,
      estimatedCostCents: r.estimated_cost_cents,
      status: r.status,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      clientId: r.client_id,
      clientName: profile?.full_name ?? null,
      clientEmail: profile?.email ?? '',
      projectId: r.project_id,
      projectName: project?.name ?? '—',
      invoiceId: invoice?.id ?? null,
      invoicedAmountCents: invoice?.amount_cents ?? null,
      commentCount: commentCountMap.get(r.id) ?? 0,
    };
  });
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/admin/requests.ts
git commit -m "feat: add getAdminRequests query"
```

---

## Task 4: Admin API — GET requests & PATCH status

**Files:**
- Create: `src/app/api/admin/requests/route.ts`
- Create: `src/app/api/admin/requests/[id]/status/route.ts`

- [ ] **Step 1: Write GET /api/admin/requests**

```typescript
// src/app/api/admin/requests/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getAdminRequests } from '@/lib/admin/requests';

export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const requests = await getAdminRequests(supabase);
  return NextResponse.json(requests);
}
```

- [ ] **Step 2: Write PATCH /api/admin/requests/[id]/status**

```typescript
// src/app/api/admin/requests/[id]/status/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

const bodySchema = z.object({
  status: z.enum(['reviewing', 'in_progress', 'completed']),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: { status: string };
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { error } = await supabase
    .from('change_requests')
    .update({ status: body.status })
    .eq('id', id);

  if (error) {
    console.error('status update error:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/admin/requests/route.ts \
        src/app/api/admin/requests/[id]/status/route.ts
git commit -m "feat: add admin GET requests and PATCH status routes"
```

---

## Task 5: Admin API — POST send invoice

**Files:**
- Create: `src/app/api/admin/requests/[id]/invoice/route.ts`

- [ ] **Step 1: Write the route**

```typescript
// src/app/api/admin/requests/[id]/invoice/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

const bodySchema = z.object({
  amount_cents: z.number().int().min(0),
  description: z.string().min(1),
  due_date: z.string().nullable().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Fetch the change request to get project_id and client_id
  const { data: changeRequest } = await supabase
    .from('change_requests')
    .select('id, project_id, client_id, status')
    .eq('id', id)
    .single();

  if (!changeRequest) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  }

  if (changeRequest.status !== 'reviewing') {
    return NextResponse.json({ error: 'Request is not in reviewing status' }, { status: 400 });
  }

  // Create invoice tied to the change request
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .insert({
      project_id: changeRequest.project_id,
      client_id: changeRequest.client_id,
      change_request_id: id,
      amount_cents: body.amount_cents,
      currency: 'usd',
      description: body.description,
      type: 'per_request',
      status: 'pending',
      due_date: body.due_date ?? null,
    })
    .select('id')
    .single();

  if (invoiceError) {
    console.error('invoice insert error:', invoiceError);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }

  // Move request to quoted
  const { error: updateError } = await supabase
    .from('change_requests')
    .update({ status: 'quoted' })
    .eq('id', id);

  if (updateError) {
    console.error('status update error:', updateError);
    return NextResponse.json({ error: 'Failed to update request status' }, { status: 500 });
  }

  return NextResponse.json({ success: true, invoiceId: invoice.id });
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/requests/[id]/invoice/route.ts
git commit -m "feat: add admin POST send-invoice route"
```

---

## Task 6: Client API — respond (accept / decline)

**Files:**
- Create: `src/app/api/requests/[id]/respond/route.ts`

- [ ] **Step 1: Write the route**

```typescript
// src/app/api/requests/[id]/respond/route.ts
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { z } from 'zod';

const bodySchema = z.object({
  action: z.enum(['accept', 'decline']),
  locale: z.enum(['en', 'ja']).default('en'),
  reason: z.string().optional(),
});

function getAdminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Verify ownership — user's RLS client
  const { data: changeRequest } = await supabase
    .from('change_requests')
    .select('id, status, client_id')
    .eq('id', id)
    .eq('client_id', user.id)
    .single();

  if (!changeRequest || changeRequest.status !== 'quoted') {
    return NextResponse.json({ error: 'Request not found or not in quoted status' }, { status: 404 });
  }

  // Fetch linked invoice — user's RLS client
  const { data: invoice } = await supabase
    .from('invoices')
    .select('id, amount_cents, description, currency, status')
    .eq('change_request_id', id)
    .eq('client_id', user.id)
    .eq('status', 'pending')
    .single();

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  const adminSupabase = getAdminSupabase();

  if (body.action === 'accept' && invoice.amount_cents === 0) {
    // $0 — auto-approve, no Stripe needed
    await adminSupabase
      .from('invoices')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', invoice.id);

    await adminSupabase
      .from('change_requests')
      .update({ status: 'approved' })
      .eq('id', id);

    return NextResponse.json({ approved: true });
  }

  if (body.action === 'accept') {
    // Amount > $0 — create Stripe checkout session
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email, full_name')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email ?? user.email,
        name: profile?.full_name ?? undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      await adminSupabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const successUrl = `${appUrl}/${body.locale}/dashboard/requests?success=true`;
    const cancelUrl = `${appUrl}/${body.locale}/dashboard/requests`;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: invoice.currency,
            product_data: { name: invoice.description },
            unit_amount: invoice.amount_cents,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        supabase_user_id: user.id,
        invoice_id: invoice.id,
        type: 'per_request',
      },
    });

    return NextResponse.json({ url: session.url });
  }

  // action === 'decline'
  await adminSupabase
    .from('invoices')
    .update({ status: 'declined' })
    .eq('id', invoice.id);

  await adminSupabase
    .from('change_requests')
    .update({ status: 'reviewing' })
    .eq('id', id);

  return NextResponse.json({ declined: true });
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/requests/[id]/respond/route.ts
git commit -m "feat: add client respond route (accept/decline)"
```

---

## Task 7: Client API — comments

**Files:**
- Create: `src/app/api/requests/[id]/comments/route.ts`

- [ ] **Step 1: Write the route**

```typescript
// src/app/api/requests/[id]/comments/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: comments, error } = await supabase
    .from('request_comments')
    .select('id, content, created_at, author_id, author:profiles!request_comments_author_id_fkey(full_name, role)')
    .eq('change_request_id', id)
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }

  return NextResponse.json(comments ?? []);
}

const postSchema = z.object({
  content: z.string().min(1).max(2000),
});

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: z.infer<typeof postSchema>;
  try {
    body = postSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { data: comment, error } = await supabase
    .from('request_comments')
    .insert({
      change_request_id: id,
      author_id: user.id,
      content: body.content,
    })
    .select('id, content, created_at, author_id')
    .single();

  if (error) {
    console.error('comment insert error:', error);
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }

  return NextResponse.json(comment);
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/requests/[id]/comments/route.ts
git commit -m "feat: add comments GET/POST route"
```

---

## Task 8: Extend Stripe webhook — approve change request on payment

**Files:**
- Modify: `src/app/api/stripe/webhook/route.ts`

- [ ] **Step 1: Update the `checkout.session.completed` handler**

Replace the `per_request` block (lines 61–70) in `src/app/api/stripe/webhook/route.ts`:

```typescript
        if (type === 'per_request' && invoiceId) {
          // Fetch change_request_id before updating
          const { data: existingInvoice } = await supabase
            .from('invoices')
            .select('change_request_id')
            .eq('id', invoiceId)
            .single();

          await supabase
            .from('invoices')
            .update({
              status: 'paid',
              paid_at: new Date().toISOString(),
              stripe_payment_intent_id: session.payment_intent as string,
            })
            .eq('id', invoiceId);

          if (existingInvoice?.change_request_id) {
            await supabase
              .from('change_requests')
              .update({ status: 'approved' })
              .eq('id', existingInvoice.change_request_id);
          }
        }
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/stripe/webhook/route.ts
git commit -m "feat: approve change request when linked invoice is paid via Stripe"
```

---

## Task 9: Shared CommentThread component

**Files:**
- Create: `src/components/shared/comment-thread.tsx`

- [ ] **Step 1: Write the component**

```typescript
// src/components/shared/comment-thread.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Send } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  author: { full_name: string | null; role: string } | null;
}

interface CommentThreadProps {
  requestId: string;
  currentUserId: string;
  locale: string;
}

export function CommentThread({ requestId, currentUserId, locale }: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    const res = await fetch(`/api/requests/${requestId}/comments`);
    if (res.ok) {
      setComments(await res.json());
    }
    setLoading(false);
  }, [requestId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    const res = await fetch(`/api/requests/${requestId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: content.trim() }),
    });
    if (res.ok) {
      setContent('');
      await fetchComments();
    }
    setSubmitting(false);
  }

  const isJa = locale === 'ja';

  return (
    <div className="space-y-3">
      {loading ? (
        <p className="text-[#6B7280] text-xs font-mono">
          {isJa ? '読み込み中…' : 'Loading…'}
        </p>
      ) : (
        <>
          {comments.length === 0 && (
            <p className="text-[#6B7280] text-xs font-mono">
              {isJa ? 'コメントはまだありません' : 'No comments yet'}
            </p>
          )}
          <div className="space-y-2">
            {comments.map((c) => {
              const isOwn = c.author_id === currentUserId;
              const isAdmin = c.author?.role === 'admin';
              return (
                <div
                  key={c.id}
                  className={`rounded-lg px-3 py-2 ${
                    isAdmin
                      ? 'bg-[#1a2433] border border-[#00E87A]/20'
                      : 'bg-[#111827] border border-[#374151]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#6B7280] text-[10px] font-mono">
                      {isAdmin
                        ? 'ZeroEn'
                        : (c.author?.full_name ?? (isJa ? 'あなた' : 'You'))}
                    </span>
                    {isOwn && !isAdmin && (
                      <span className="text-[#374151] text-[10px] font-mono">
                        ({isJa ? 'あなた' : 'you'})
                      </span>
                    )}
                    <span className="text-[#374151] text-[10px] font-mono ml-auto">
                      {new Date(c.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[#F4F4F2] text-xs font-mono whitespace-pre-wrap">
                    {c.content}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isJa ? 'コメントを入力…' : 'Add a comment…'}
          className="flex-1 bg-[#0D0D0D] border border-[#374151] rounded px-3 py-2 text-xs font-mono text-[#F4F4F2] placeholder-[#6B7280] focus:outline-none focus:border-[#00E87A]/50 min-w-0"
        />
        <button
          type="submit"
          disabled={!content.trim() || submitting}
          className="shrink-0 p-2 rounded bg-[#00E87A]/10 border border-[#00E87A]/30 text-[#00E87A] hover:bg-[#00E87A]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label={isJa ? '送信' : 'Send'}
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/comment-thread.tsx
git commit -m "feat: add shared CommentThread component"
```

---

## Task 10: Admin SendInvoicePanel component

**Files:**
- Create: `src/components/admin/send-invoice-panel.tsx`

- [ ] **Step 1: Write the component**

```typescript
// src/components/admin/send-invoice-panel.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import type { RequestRow } from '@/lib/admin/requests';

interface SendInvoicePanelProps {
  request: RequestRow;
  locale: string;
  onClose: () => void;
}

export function SendInvoicePanel({ request, locale, onClose }: SendInvoicePanelProps) {
  const router = useRouter();
  const isJa = locale === 'ja';

  const defaultAmount = request.estimatedCostCents !== null
    ? String(request.estimatedCostCents / 100)
    : '';

  const [amountDollars, setAmountDollars] = useState(defaultAmount);
  const [description, setDescription] = useState(request.title);
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const amountCents = Math.round(parseFloat(amountDollars || '0') * 100);
    if (isNaN(amountCents) || amountCents < 0) {
      setError(isJa ? '有効な金額を入力してください' : 'Enter a valid amount');
      return;
    }
    if (!description.trim()) {
      setError(isJa ? '説明を入力してください' : 'Enter a description');
      return;
    }
    setSubmitting(true);
    const res = await fetch(`/api/admin/requests/${request.id}/invoice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount_cents: amountCents,
        description: description.trim(),
        due_date: dueDate || null,
      }),
    });
    if (res.ok) {
      onClose();
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? (isJa ? 'エラーが発生しました' : 'Something went wrong'));
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div className="relative w-full max-w-md bg-[#111827] border border-[#374151] rounded-xl p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[#F4F4F2] text-sm font-bold font-heading">
              {isJa ? '請求書を送信' : 'Send Invoice'}
            </h2>
            <p className="text-[#6B7280] text-xs font-mono mt-0.5 line-clamp-1">
              {request.title}
            </p>
          </div>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#F4F4F2] transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Request description for reference */}
        <div className="bg-[#0D0D0D] rounded-lg p-3 border border-[#374151]">
          <p className="text-[#9CA3AF] text-xs font-mono line-clamp-3">{request.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#6B7280] text-xs font-mono uppercase tracking-wider mb-1.5">
              {isJa ? '金額 (USD)' : 'Amount (USD)'}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[#6B7280] font-mono text-sm">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amountDollars}
                onChange={(e) => setAmountDollars(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-[#0D0D0D] border border-[#374151] rounded px-3 py-2 text-sm font-mono text-[#F4F4F2] placeholder-[#6B7280] focus:outline-none focus:border-[#00E87A]/50"
              />
            </div>
            <p className="text-[#374151] text-[10px] font-mono mt-1">
              {isJa ? '$0 = 無料（プランに含む）' : '$0 = included in plan, no payment required'}
            </p>
          </div>

          <div>
            <label className="block text-[#6B7280] text-xs font-mono uppercase tracking-wider mb-1.5">
              {isJa ? '説明' : 'Description'}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-[#374151] rounded px-3 py-2 text-sm font-mono text-[#F4F4F2] placeholder-[#6B7280] focus:outline-none focus:border-[#00E87A]/50"
            />
          </div>

          <div>
            <label className="block text-[#6B7280] text-xs font-mono uppercase tracking-wider mb-1.5">
              {isJa ? '期日（任意）' : 'Due Date (optional)'}
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-[#374151] rounded px-3 py-2 text-sm font-mono text-[#F4F4F2] focus:outline-none focus:border-[#00E87A]/50"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs font-mono">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-lg bg-[#00E87A] text-[#0D0D0D] text-sm font-mono font-bold hover:bg-[#00E87A]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting
              ? (isJa ? '送信中…' : 'Sending…')
              : (isJa ? '請求書を送信する' : 'Send Invoice')}
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/send-invoice-panel.tsx
git commit -m "feat: add SendInvoicePanel admin component"
```

---

## Task 11: Admin RequestTable component + requests page

**Files:**
- Create: `src/components/admin/request-table.tsx`
- Create: `src/app/[locale]/admin/requests/page.tsx`

- [ ] **Step 1: Write the RequestTable client component**

```typescript
// src/components/admin/request-table.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { SendInvoicePanel } from './send-invoice-panel';
import { CommentThread } from '@/components/shared/comment-thread';
import type { RequestRow } from '@/lib/admin/requests';

type Tab = 'all' | 'needs_review' | 'quoted' | 'in_progress' | 'completed';

const TABS: { key: Tab; labelEn: string; labelJa: string }[] = [
  { key: 'all', labelEn: 'All', labelJa: 'すべて' },
  { key: 'needs_review', labelEn: 'Needs Review', labelJa: '要確認' },
  { key: 'quoted', labelEn: 'Quoted', labelJa: '見積済み' },
  { key: 'in_progress', labelEn: 'In Progress', labelJa: '進行中' },
  { key: 'completed', labelEn: 'Completed', labelJa: '完了' },
];

const STATUS_COLORS: Record<string, string> = {
  submitted: 'text-blue-400 border-blue-400/30',
  reviewing: 'text-yellow-400 border-yellow-400/30',
  quoted: 'text-orange-400 border-orange-400/30',
  approved: 'text-[#00E87A] border-[#00E87A]/30',
  in_progress: 'text-[#00E87A] border-[#00E87A]/30',
  completed: 'text-[#6B7280] border-[#6B7280]/30',
  rejected: 'text-red-400 border-red-400/30',
};

const STATUS_LABELS: Record<string, { en: string; ja: string }> = {
  submitted: { en: 'Submitted', ja: '送信済み' },
  reviewing: { en: 'Reviewing', ja: '確認中' },
  quoted: { en: 'Quoted', ja: '見積済み' },
  approved: { en: 'Approved', ja: '承認済み' },
  in_progress: { en: 'In Progress', ja: '進行中' },
  completed: { en: 'Completed', ja: '完了' },
  rejected: { en: 'Rejected', ja: '却下' },
};

function tabFilter(tab: Tab, status: string): boolean {
  if (tab === 'all') return true;
  if (tab === 'needs_review') return status === 'submitted' || status === 'reviewing';
  if (tab === 'quoted') return status === 'quoted';
  if (tab === 'in_progress') return status === 'approved' || status === 'in_progress';
  if (tab === 'completed') return status === 'completed' || status === 'rejected';
  return false;
}

interface RequestTableProps {
  requests: RequestRow[];
  locale: string;
  adminUserId: string;
}

export function RequestTable({ requests, locale, adminUserId }: RequestTableProps) {
  const router = useRouter();
  const isJa = locale === 'ja';
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [panelRequest, setPanelRequest] = useState<RequestRow | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [statusLoading, setStatusLoading] = useState<string | null>(null);

  const filtered = requests.filter((r) => tabFilter(activeTab, r.status));

  function toggleComments(id: string) {
    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function updateStatus(requestId: string, status: string) {
    setStatusLoading(requestId);
    await fetch(`/api/admin/requests/${requestId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setStatusLoading(null);
    router.refresh();
  }

  const tabCounts: Record<Tab, number> = {
    all: requests.length,
    needs_review: requests.filter((r) => r.status === 'submitted' || r.status === 'reviewing').length,
    quoted: requests.filter((r) => r.status === 'quoted').length,
    in_progress: requests.filter((r) => r.status === 'approved' || r.status === 'in_progress').length,
    completed: requests.filter((r) => r.status === 'completed' || r.status === 'rejected').length,
  };

  return (
    <>
      {/* Filter tabs */}
      <div className="flex gap-1 flex-wrap mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              activeTab === tab.key
                ? 'bg-[#00E87A]/10 text-[#00E87A] border border-[#00E87A]/30'
                : 'text-[#6B7280] border border-[#374151] hover:border-[#6B7280]'
            }`}
          >
            {isJa ? tab.labelJa : tab.labelEn}
            {tabCounts[tab.key] > 0 && (
              <span className="ml-1.5 opacity-70">{tabCounts[tab.key]}</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="border border-[#374151] rounded-lg bg-[#111827] p-8 text-center">
          <p className="text-[#6B7280] font-mono text-sm">
            {isJa ? 'リクエストはありません' : 'No requests'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((req) => {
            const statusInfo = STATUS_LABELS[req.status] ?? { en: req.status, ja: req.status };
            const statusColor = STATUS_COLORS[req.status] ?? 'text-[#6B7280] border-[#6B7280]/30';
            const commentsOpen = expandedComments.has(req.id);
            const isLoading = statusLoading === req.id;

            return (
              <div
                key={req.id}
                className="border border-[#374151] rounded-lg bg-[#111827] overflow-hidden"
              >
                {/* Main row */}
                <div className="p-4">
                  {/* Mobile layout */}
                  <div className="space-y-2 md:hidden">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[#F4F4F2] text-sm font-mono font-bold">{req.title}</p>
                      <span className={`shrink-0 text-[10px] font-mono border px-2 py-0.5 rounded ${statusColor}`}>
                        {isJa ? statusInfo.ja : statusInfo.en}
                      </span>
                    </div>
                    <p className="text-[#9CA3AF] text-xs font-mono">
                      {req.clientName ?? req.clientEmail} · {req.projectName}
                    </p>
                    <p className="text-[#6B7280] text-xs font-mono line-clamp-2">{req.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {req.invoicedAmountCents !== null && (
                        <span className="text-[#00E87A] text-xs font-mono">
                          ${(req.invoicedAmountCents / 100).toLocaleString()}
                        </span>
                      )}
                      <span className="text-[#374151] text-xs font-mono">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2 flex-wrap pt-1">
                      {ActionButton({ req, isJa, isLoading, updateStatus, setPanelRequest })}
                      <button
                        onClick={() => toggleComments(req.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-[#374151] text-[#9CA3AF] rounded hover:border-[#6B7280] transition-colors"
                      >
                        <MessageCircle className="w-3 h-3" />
                        {req.commentCount > 0 && (
                          <span className="text-[#00E87A]">{req.commentCount}</span>
                        )}
                        {commentsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden md:grid md:grid-cols-[2fr_1.5fr_2fr_1fr_1fr_auto] gap-4 items-start">
                    <div className="min-w-0">
                      <p className="text-[#F4F4F2] text-sm font-mono font-bold truncate">{req.title}</p>
                      <p className="text-[#9CA3AF] text-xs font-mono truncate mt-0.5">{req.clientName ?? req.clientEmail}</p>
                    </div>
                    <p className="text-[#9CA3AF] text-xs font-mono truncate self-center">{req.projectName}</p>
                    <p className="text-[#6B7280] text-xs font-mono line-clamp-2 self-center">{req.description}</p>
                    <div className="self-center">
                      <span className={`text-[10px] font-mono border px-2 py-0.5 rounded ${statusColor}`}>
                        {isJa ? statusInfo.ja : statusInfo.en}
                      </span>
                    </div>
                    <div className="self-center">
                      {req.invoicedAmountCents !== null ? (
                        <span className="text-[#00E87A] text-xs font-mono">
                          ${(req.invoicedAmountCents / 100).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-[#374151] text-xs font-mono">—</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 self-center">
                      {ActionButton({ req, isJa, isLoading, updateStatus, setPanelRequest })}
                      <button
                        onClick={() => toggleComments(req.id)}
                        className="flex items-center gap-1 p-1.5 text-[#6B7280] hover:text-[#9CA3AF] border border-transparent hover:border-[#374151] rounded transition-colors"
                        title={isJa ? 'コメント' : 'Comments'}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        {req.commentCount > 0 && (
                          <span className="text-[#00E87A] text-[10px] font-mono">{req.commentCount}</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comments panel */}
                {commentsOpen && (
                  <div className="border-t border-[#374151] bg-[#0D0D0D]/60 px-4 py-4">
                    <p className="text-[#6B7280] text-[10px] font-mono uppercase tracking-wider mb-3">
                      {isJa ? 'コメント' : 'Discussion'}
                    </p>
                    <CommentThread
                      requestId={req.id}
                      currentUserId={adminUserId}
                      locale={locale}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Send invoice slide-out */}
      {panelRequest && (
        <SendInvoicePanel
          request={panelRequest}
          locale={locale}
          onClose={() => setPanelRequest(null)}
        />
      )}
    </>
  );
}

// Extracted to avoid repetition in mobile/desktop layouts
function ActionButton({
  req,
  isJa,
  isLoading,
  updateStatus,
  setPanelRequest,
}: {
  req: RequestRow;
  isJa: boolean;
  isLoading: boolean;
  updateStatus: (id: string, status: string) => Promise<void>;
  setPanelRequest: (r: RequestRow) => void;
}) {
  if (req.status === 'submitted') {
    return (
      <button
        onClick={() => updateStatus(req.id, 'reviewing')}
        disabled={isLoading}
        className="px-3 py-1.5 text-xs font-mono rounded border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 disabled:opacity-50 transition-colors"
      >
        {isLoading ? '…' : (isJa ? '確認中にする' : 'Mark Reviewing')}
      </button>
    );
  }
  if (req.status === 'reviewing') {
    return (
      <button
        onClick={() => setPanelRequest(req)}
        className="px-3 py-1.5 text-xs font-mono rounded border border-[#00E87A]/30 text-[#00E87A] hover:bg-[#00E87A]/10 transition-colors"
      >
        {isJa ? '請求書を送信' : 'Send Invoice'}
      </button>
    );
  }
  if (req.status === 'approved') {
    return (
      <button
        onClick={() => updateStatus(req.id, 'in_progress')}
        disabled={isLoading}
        className="px-3 py-1.5 text-xs font-mono rounded border border-blue-400/30 text-blue-400 hover:bg-blue-400/10 disabled:opacity-50 transition-colors"
      >
        {isLoading ? '…' : (isJa ? '進行中にする' : 'Mark In Progress')}
      </button>
    );
  }
  if (req.status === 'in_progress') {
    return (
      <button
        onClick={() => updateStatus(req.id, 'completed')}
        disabled={isLoading}
        className="px-3 py-1.5 text-xs font-mono rounded border border-[#6B7280]/30 text-[#6B7280] hover:bg-[#6B7280]/10 disabled:opacity-50 transition-colors"
      >
        {isLoading ? '…' : (isJa ? '完了にする' : 'Mark Complete')}
      </button>
    );
  }
  return null;
}
```

- [ ] **Step 2: Write the admin requests page (server component)**

```typescript
// src/app/[locale]/admin/requests/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getAdminRequests } from '@/lib/admin/requests';
import { RequestTable } from '@/components/admin/request-table';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Requests — Admin — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

export default async function AdminRequestsPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect(`/${locale}/dashboard`);

  const requests = await getAdminRequests(supabase);
  const isJa = locale === 'ja';

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">
          {isJa ? 'クライアントリクエスト' : 'Client Requests'}
        </h1>
        <p className="text-[#6B7280] text-sm font-mono mt-1">
          {requests.length} {isJa ? '件' : 'total'}
        </p>
      </div>

      <RequestTable
        requests={requests}
        locale={locale}
        adminUserId={user.id}
      />
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: no TypeScript errors. The admin requests page renders.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/request-table.tsx \
        src/app/[locale]/admin/requests/page.tsx
git commit -m "feat: add admin RequestTable component and requests page"
```

---

## Task 12: Client InvoicePanel + RequestCard components

**Files:**
- Create: `src/components/dashboard/invoice-panel.tsx`
- Create: `src/components/dashboard/request-card.tsx`

- [ ] **Step 1: Write InvoicePanel**

```typescript
// src/components/dashboard/invoice-panel.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { CommentThread } from '@/components/shared/comment-thread';

interface InvoicePanelProps {
  requestId: string;
  invoice: {
    id: string;
    amount_cents: number;
    description: string;
    due_date: string | null;
    currency: string;
  };
  locale: string;
  userId: string;
}

export function InvoicePanel({ requestId, invoice, locale, userId }: InvoicePanelProps) {
  const router = useRouter();
  const isJa = locale === 'ja';
  const [loading, setLoading] = useState<'accept' | 'decline' | null>(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleAccept() {
    setLoading('accept');
    const res = await fetch(`/api/requests/${requestId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'accept', locale }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else if (data.approved) {
      setSuccess(true);
      router.refresh();
    } else {
      setLoading(null);
    }
  }

  async function handleDecline() {
    setLoading('decline');
    await fetch(`/api/requests/${requestId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'decline', locale, reason: declineReason }),
    });
    setShowDeclineModal(false);
    router.refresh();
  }

  if (success) {
    return (
      <div className="mt-3 rounded-lg bg-[#00E87A]/10 border border-[#00E87A]/30 px-4 py-3">
        <p className="text-[#00E87A] text-xs font-mono">
          {isJa ? '✓ 承認されました。作業を開始します。' : '✓ Approved. Work will begin shortly.'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-3 rounded-lg bg-[#1a2433] border border-[#00E87A]/20 p-4 space-y-3">
        <p className="text-[#6B7280] text-[10px] font-mono uppercase tracking-wider">
          {isJa ? '請求書' : 'Invoice'}
        </p>

        <div className="flex items-baseline gap-3">
          <span className="text-[#00E87A] text-xl font-bold font-mono">
            {invoice.amount_cents === 0
              ? (isJa ? '無料' : 'Free')
              : `$${(invoice.amount_cents / 100).toLocaleString()}`}
          </span>
          {invoice.amount_cents === 0 && (
            <span className="text-[#6B7280] text-xs font-mono">
              {isJa ? 'プランに含まれています' : 'Included in your plan'}
            </span>
          )}
        </div>

        <p className="text-[#9CA3AF] text-xs font-mono">{invoice.description}</p>

        {invoice.due_date && (
          <p className="text-[#6B7280] text-xs font-mono">
            {isJa ? '期日: ' : 'Due: '}
            {new Date(invoice.due_date).toLocaleDateString()}
          </p>
        )}

        <div className="flex gap-2 flex-wrap pt-1">
          <button
            onClick={handleAccept}
            disabled={loading !== null}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00E87A] text-[#0D0D0D] text-xs font-mono font-bold hover:bg-[#00E87A]/90 disabled:opacity-50 transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            {loading === 'accept'
              ? '…'
              : (isJa ? '承認する' : (invoice.amount_cents > 0 ? 'Accept & Pay' : 'Accept'))}
          </button>

          <button
            onClick={() => setShowComments((v) => !v)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#374151] text-[#9CA3AF] text-xs font-mono hover:border-[#6B7280] transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            {isJa ? '相談する' : 'Discuss'}
          </button>

          <button
            onClick={() => setShowDeclineModal(true)}
            disabled={loading !== null}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-400/30 text-red-400 text-xs font-mono hover:bg-red-400/10 disabled:opacity-50 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            {isJa ? '断る' : 'Decline'}
          </button>
        </div>

        {showComments && (
          <div className="pt-3 border-t border-[#374151]">
            <CommentThread
              requestId={requestId}
              currentUserId={userId}
              locale={locale}
            />
          </div>
        )}
      </div>

      {/* Decline modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowDeclineModal(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-sm bg-[#111827] border border-[#374151] rounded-xl p-5 space-y-4">
            <h3 className="text-[#F4F4F2] text-sm font-bold font-heading">
              {isJa ? '断りますか？' : 'Decline this invoice?'}
            </h3>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder={isJa ? '理由（任意）' : 'Reason (optional)'}
              rows={3}
              className="w-full bg-[#0D0D0D] border border-[#374151] rounded px-3 py-2 text-xs font-mono text-[#F4F4F2] placeholder-[#6B7280] focus:outline-none focus:border-[#00E87A]/50 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeclineModal(false)}
                className="flex-1 py-2 rounded-lg border border-[#374151] text-[#9CA3AF] text-xs font-mono hover:border-[#6B7280] transition-colors"
              >
                {isJa ? 'キャンセル' : 'Cancel'}
              </button>
              <button
                onClick={handleDecline}
                disabled={loading !== null}
                className="flex-1 py-2 rounded-lg bg-red-400/10 border border-red-400/30 text-red-400 text-xs font-mono hover:bg-red-400/20 disabled:opacity-50 transition-colors"
              >
                {loading === 'decline' ? '…' : (isJa ? '断る' : 'Decline')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Write RequestCard**

```typescript
// src/components/dashboard/request-card.tsx
'use client';

import { InvoicePanel } from './invoice-panel';

interface Invoice {
  id: string;
  amount_cents: number;
  description: string;
  due_date: string | null;
  currency: string;
  status: string;
}

interface RequestCardProps {
  request: {
    id: string;
    title: string;
    description: string;
    status: string;
    tier: string | null;
    estimated_cost_cents: number | null;
    created_at: string;
  };
  invoice: Invoice | null;
  locale: string;
  userId: string;
}

const STATUS_LABELS: Record<string, { en: string; ja: string; color: string }> = {
  submitted: { en: 'Submitted', ja: '送信済み', color: 'text-blue-400 border-blue-400/30' },
  reviewing: { en: 'Reviewing', ja: '確認中', color: 'text-yellow-400 border-yellow-400/30' },
  quoted: { en: 'Quoted', ja: '見積済み', color: 'text-orange-400 border-orange-400/30' },
  approved: { en: 'Approved', ja: '承認済み', color: 'text-[#00E87A] border-[#00E87A]/30' },
  in_progress: { en: 'In Progress', ja: '進行中', color: 'text-[#00E87A] border-[#00E87A]/30' },
  completed: { en: 'Completed', ja: '完了', color: 'text-[#6B7280] border-[#6B7280]/30' },
  rejected: { en: 'Rejected', ja: '却下', color: 'text-red-400 border-red-400/30' },
};

const TIER_LABELS = {
  small: { en: 'Small ($50-100)', ja: 'スモール ($50-100)' },
  medium: { en: 'Medium ($200-500)', ja: 'ミディアム ($200-500)' },
  large: { en: 'Large ($500-2,000)', ja: 'ラージ ($500-2,000)' },
};

export function RequestCard({ request, invoice, locale, userId }: RequestCardProps) {
  const isJa = locale === 'ja';
  const statusInfo = STATUS_LABELS[request.status] ?? STATUS_LABELS.submitted;
  const tierInfo = request.tier ? TIER_LABELS[request.tier as keyof typeof TIER_LABELS] : null;
  const showInvoicePanel =
    request.status === 'quoted' && invoice && invoice.status === 'pending';

  return (
    <div className="border border-[#374151] rounded-lg p-4 bg-[#111827]">
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-[#F4F4F2] text-sm font-mono font-bold">{request.title}</p>
        <span className={`shrink-0 text-xs font-mono border px-2 py-0.5 rounded ${statusInfo.color}`}>
          {isJa ? statusInfo.ja : statusInfo.en}
        </span>
      </div>
      <p className="text-[#9CA3AF] text-xs font-mono mb-2 line-clamp-2">{request.description}</p>
      <div className="flex items-center gap-3">
        {tierInfo && (
          <span className="text-[#6B7280] text-xs font-mono">
            {isJa ? tierInfo.ja : tierInfo.en}
          </span>
        )}
        {request.estimated_cost_cents && (
          <span className="text-[#00E87A] text-xs font-mono">
            ${(request.estimated_cost_cents / 100).toLocaleString()}
          </span>
        )}
        <span className="text-[#374151] text-xs font-mono ml-auto">
          {new Date(request.created_at).toLocaleDateString()}
        </span>
      </div>

      {showInvoicePanel && (
        <InvoicePanel
          requestId={request.id}
          invoice={invoice}
          locale={locale}
          userId={userId}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/dashboard/invoice-panel.tsx \
        src/components/dashboard/request-card.tsx
git commit -m "feat: add InvoicePanel and RequestCard client components"
```

---

## Task 13: Expand client requests page

**Files:**
- Modify: `src/app/[locale]/dashboard/requests/page.tsx`

- [ ] **Step 1: Replace with expanded version**

```typescript
// src/app/[locale]/dashboard/requests/page.tsx
import { requireApproved } from '@/lib/auth/require-approved';
import { ChangeRequestForm } from '@/components/dashboard/change-request-form';
import { RequestCard } from '@/components/dashboard/request-card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Requests — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

export default async function RequestsPage({ params }: Props) {
  const { locale } = await params;
  const { user, supabase } = await requireApproved(locale);

  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('client_id', user.id)
    .single();

  const requests = project
    ? (await supabase
        .from('change_requests')
        .select('id, title, description, status, tier, estimated_cost_cents, created_at')
        .eq('project_id', project.id)
        .order('created_at', { ascending: false })).data ?? []
    : [];

  // Fetch invoices linked to these requests
  const requestIds = requests.map((r) => r.id);

  const invoicesByRequestId = new Map<string, {
    id: string;
    amount_cents: number;
    description: string;
    due_date: string | null;
    currency: string;
    status: string;
  }>();

  if (requestIds.length > 0) {
    const { data: invoices } = await supabase
      .from('invoices')
      .select('id, change_request_id, amount_cents, description, due_date, currency, status')
      .in('change_request_id', requestIds)
      .eq('client_id', user.id);

    for (const inv of invoices ?? []) {
      if (inv.change_request_id) {
        invoicesByRequestId.set(inv.change_request_id, {
          id: inv.id,
          amount_cents: inv.amount_cents,
          description: inv.description,
          due_date: inv.due_date,
          currency: inv.currency,
          status: inv.status,
        });
      }
    }
  }

  const isJa = locale === 'ja';

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-xl font-bold font-heading text-[#F4F4F2]">
          {isJa ? '変更リクエスト' : 'Change Requests'}
        </h1>
        <p className="text-[#6B7280] text-xs font-mono mt-1">
          {isJa
            ? 'スコープ外の機能追加を依頼する'
            : 'Request new features beyond your original scope'}
        </p>
      </div>

      {project && (
        <ChangeRequestForm projectId={project.id} locale={locale} />
      )}

      {requests.length > 0 && (
        <div>
          <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-3">
            {isJa ? '過去のリクエスト' : 'Past Requests'}
          </p>
          <div className="space-y-3">
            {requests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                invoice={invoicesByRequestId.get(req.id) ?? null}
                locale={locale}
                userId={user.id}
              />
            ))}
          </div>
        </div>
      )}

      {!project && (
        <div className="border border-[#374151] rounded-lg p-8 bg-[#111827] text-center">
          <p className="text-[#9CA3AF] font-mono text-sm">
            {isJa
              ? 'プロジェクト開始後に変更リクエストが送れます'
              : 'Change requests are available once your project starts'}
          </p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build && npm run lint
```

Expected: clean build, no lint errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/dashboard/requests/page.tsx
git commit -m "feat: expand client requests page with invoice panels and request cards"
```

---

## Final Verification

- [ ] Start dev server and navigate to `/admin/requests` — confirm the table renders, tabs filter correctly, "Send Invoice" opens the panel
- [ ] Test Send Invoice form — submit with an amount, verify the request moves to `quoted` in the table
- [ ] Navigate to `/dashboard/requests` as a client with a `quoted` request — confirm the invoice panel appears
- [ ] Test Accept ($0) — verify request moves to `approved` without Stripe redirect
- [ ] Test Discuss — verify comment thread opens and a comment can be posted
- [ ] Test Decline — verify modal appears, request moves back to `reviewing` in admin
- [ ] Confirm admin comment badge shows for requests with comments
