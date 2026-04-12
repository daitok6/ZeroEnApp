import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { voidStripeInvoice } from '@/lib/stripe/invoices';
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

  // Verify ownership via user's RLS client
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
    .select('id, amount_cents, stripe_invoice_id, stripe_hosted_invoice_url, status')
    .eq('change_request_id', id)
    .eq('client_id', user.id)
    .eq('status', 'pending')
    .single();

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  const adminSupabase = getAdminSupabase();

  // ── Accept ──────────────────────────────────────────────────────────────────

  if (body.action === 'accept' && invoice.amount_cents === 0) {
    // ¥0 — auto-approve, no Stripe needed
    const { error: invErr } = await adminSupabase
      .from('invoices')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', invoice.id);

    if (invErr) return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });

    const { error: crErr } = await adminSupabase
      .from('change_requests')
      .update({ status: 'approved' })
      .eq('id', id);

    if (crErr) return NextResponse.json({ error: 'Failed to approve request' }, { status: 500 });

    return NextResponse.json({ approved: true });
  }

  if (body.action === 'accept') {
    // Amount > ¥0 — return the stored Stripe hosted invoice URL (created at quote time)
    if (!invoice.stripe_hosted_invoice_url) {
      return NextResponse.json({ error: 'Payment link not available' }, { status: 500 });
    }
    return NextResponse.json({ url: invoice.stripe_hosted_invoice_url });
  }

  // ── Decline ─────────────────────────────────────────────────────────────────

  // Void the Stripe invoice so the hosted URL can no longer be paid
  if (invoice.stripe_invoice_id) {
    try {
      await voidStripeInvoice(invoice.stripe_invoice_id);
    } catch (err) {
      console.error('Failed to void Stripe invoice:', err);
      // Non-fatal — continue with local status update
    }
  }

  const { error: invErr } = await adminSupabase
    .from('invoices')
    .update({ status: 'declined' })
    .eq('id', invoice.id);

  if (invErr) return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });

  const { error: crErr } = await adminSupabase
    .from('change_requests')
    .update({ status: 'reviewing' })
    .eq('id', id);

  if (crErr) return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });

  if (body.reason?.trim()) {
    await adminSupabase.from('request_comments').insert({
      change_request_id: id,
      author_id: user.id,
      content: body.reason.trim(),
    });
  }

  return NextResponse.json({ declined: true });
}
