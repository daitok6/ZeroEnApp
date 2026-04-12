import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { z } from 'zod';

const bodySchema = z.object({
  plan_tier: z.enum(['basic', 'premium']),
});

function getAdminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const PRICE_IDS: Record<string, string | undefined> = {
  basic: process.env.STRIPE_BASIC_PRICE_ID,
  premium: process.env.STRIPE_PREMIUM_PRICE_ID,
};

export async function POST(request: NextRequest) {
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

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const priceId = PRICE_IDS[body.plan_tier];
  if (!priceId) {
    return NextResponse.json(
      { error: `STRIPE_${body.plan_tier.toUpperCase()}_PRICE_ID is not configured` },
      { status: 503 }
    );
  }

  // Create the Stripe Payment Link
  let paymentLink: { id: string; url: string };
  try {
    const pl = await stripe.paymentLinks.create({
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        plan_tier: body.plan_tier,
        generated_by: 'zeroen_admin',
      },
    });
    paymentLink = { id: pl.id, url: pl.url };
  } catch (err) {
    console.error('Stripe payment link creation error:', err);
    return NextResponse.json({ error: 'Failed to create Payment Link' }, { status: 500 });
  }

  const adminSupabase = getAdminSupabase();

  // Deactivate all prior active links for this plan tier
  const { error: deactivateErr } = await adminSupabase
    .from('payment_links')
    .update({ active: false })
    .eq('plan_tier', body.plan_tier)
    .eq('active', true);

  if (deactivateErr) {
    console.error('Deactivate prior payment links error:', deactivateErr);
    // Non-fatal — unique index will prevent conflicts on insert
  }

  // Insert the new active link
  const { data: row, error: insertErr } = await adminSupabase
    .from('payment_links')
    .insert({
      plan_tier: body.plan_tier,
      stripe_price_id: priceId,
      stripe_payment_link_id: paymentLink.id,
      url: paymentLink.url,
      active: true,
    })
    .select('id, plan_tier, url, stripe_payment_link_id, created_at')
    .single();

  if (insertErr) {
    console.error('Payment link insert error:', insertErr);
    return NextResponse.json({ error: 'Failed to save Payment Link' }, { status: 500 });
  }

  return NextResponse.json({ success: true, paymentLink: row });
}

/**
 * GET /api/admin/payment-links/sync
 * Returns current active Payment Link URLs for both plan tiers.
 */
export async function GET(request: NextRequest) {
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

  const adminSupabase = getAdminSupabase();

  const { data: links } = await adminSupabase
    .from('payment_links')
    .select('id, plan_tier, url, stripe_payment_link_id, created_at')
    .eq('active', true)
    .order('plan_tier');

  return NextResponse.json({ paymentLinks: links ?? [] });
}
