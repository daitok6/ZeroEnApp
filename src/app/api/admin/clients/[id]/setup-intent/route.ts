import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { getOrCreateStripeCustomer } from '@/lib/stripe/customer';

function getAdminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

type Params = { params: Promise<{ id: string }> };

/**
 * POST /api/admin/clients/[id]/setup-intent
 *
 * Creates a Stripe Checkout Session in "setup" mode for the given client.
 * Returns a hosted URL the admin can copy and share with the client to save
 * their payment method on file.
 *
 * No card is charged immediately. Once the client completes the setup flow,
 * their card is attached to their Stripe customer and can be used for future
 * auto-charged invoices or off-session PaymentIntents.
 */
export async function POST(_request: NextRequest, { params }: Params) {
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

  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 });
  }

  const adminSupabase = getAdminSupabase();

  // Verify client exists
  const { data: clientProfile } = await adminSupabase
    .from('profiles')
    .select('id, email')
    .eq('id', id)
    .single();

  if (!clientProfile) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  }

  let customerId: string;
  try {
    customerId = await getOrCreateStripeCustomer(id, adminSupabase);
  } catch (err) {
    console.error('Stripe customer creation error:', err);
    return NextResponse.json({ error: 'Failed to get Stripe customer' }, { status: 500 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://zeroen.dev';

  let sessionUrl: string | null;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'setup',
      customer: customerId,
      payment_method_types: ['card'],
      success_url: `${appUrl}/admin/clients/${id}?setup=success`,
      cancel_url: `${appUrl}/admin/clients/${id}?setup=cancelled`,
      metadata: {
        supabase_client_id: id,
        created_by_admin: user.id,
      },
    });
    sessionUrl = session.url;
  } catch (err) {
    console.error('Stripe Checkout Session creation error:', err);
    return NextResponse.json({ error: 'Failed to create setup session' }, { status: 500 });
  }

  if (!sessionUrl) {
    return NextResponse.json({ error: 'No session URL returned from Stripe' }, { status: 500 });
  }

  return NextResponse.json({ url: sessionUrl });
}
