import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { voidStripeInvoice } from '@/lib/stripe/invoices';
import { z } from 'zod';

const bodySchema = z.object({
  reason: z.string().max(2000).optional(),
});

function getAdminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const CANCELLABLE_STATUSES = ['submitted', 'reviewing', 'quoted'] as const;

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json().catch(() => ({})));
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Verify ownership via user's RLS client
  const { data: changeRequest } = await supabase
    .from('change_requests')
    .select('id, status, client_id')
    .eq('id', id)
    .eq('client_id', user.id)
    .single();

  if (!changeRequest) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  }

  if (!CANCELLABLE_STATUSES.includes(changeRequest.status as typeof CANCELLABLE_STATUSES[number])) {
    return NextResponse.json(
      { error: 'Request cannot be cancelled at this stage' },
      { status: 400 }
    );
  }

  const adminSupabase = getAdminSupabase();

  // If a pending invoice exists, void the Stripe invoice and mark it cancelled
  const { data: pendingInvoice } = await adminSupabase
    .from('invoices')
    .select('id, stripe_invoice_id')
    .eq('change_request_id', id)
    .eq('status', 'pending')
    .maybeSingle();

  if (pendingInvoice) {
    if (pendingInvoice.stripe_invoice_id) {
      try {
        await voidStripeInvoice(pendingInvoice.stripe_invoice_id);
      } catch (err) {
        console.error('Failed to void Stripe invoice:', err);
        // Non-fatal — continue with local state update
      }
    }

    const { error: invErr } = await adminSupabase
      .from('invoices')
      .update({ status: 'cancelled' })
      .eq('id', pendingInvoice.id);

    if (invErr) {
      return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
    }
  }

  const { error: crErr } = await adminSupabase
    .from('change_requests')
    .update({ status: 'rejected' })
    .eq('id', id);

  if (crErr) {
    return NextResponse.json({ error: 'Failed to cancel request' }, { status: 500 });
  }

  // Post an audit comment so the admin sees why this was cancelled
  const commentContent = body.reason?.trim()
    ? `[Cancelled by client] ${body.reason.trim()}`
    : '[Cancelled by client]';

  await adminSupabase.from('request_comments').insert({
    change_request_id: id,
    author_id: user.id,
    content: commentContent,
  });

  return NextResponse.json({ cancelled: true });
}
