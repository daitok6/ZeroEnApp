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
      const customer = await stripe.customers.create(
        {
          email: profile?.email ?? user.email,
          name: profile?.full_name ?? undefined,
          metadata: { supabase_user_id: user.id },
        },
        { idempotencyKey: `customer-${user.id}` }
      );
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

  if (body.reason && body.reason.trim()) {
    await adminSupabase.from('request_comments').insert({
      change_request_id: id,
      author_id: user.id,
      content: body.reason.trim(),
    });
  }

  return NextResponse.json({ declined: true });
}
