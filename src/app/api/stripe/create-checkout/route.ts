import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { z } from 'zod';

const checkoutSchema = z.object({
  type: z.enum(['subscription', 'per_request']),
  invoiceId: z.string().uuid().optional(),
  planTier: z.enum(['basic', 'premium']).optional(),
  projectId: z.string().uuid().optional(),
  locale: z.enum(['en', 'ja']).default('en'),
});

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { type, invoiceId, planTier, projectId, locale } = checkoutSchema.parse(body);

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email, full_name')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email || user.email,
        name: profile?.full_name || undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const subscriptionSuccessUrl = `${appUrl}/${locale}/dashboard?subscribed=true`;
    const successUrl = type === 'subscription'
      ? subscriptionSuccessUrl
      : `${appUrl}/${locale}/dashboard/invoices?success=true`;
    const cancelUrl = type === 'subscription'
      ? `${appUrl}/${locale}/dashboard`
      : `${appUrl}/${locale}/dashboard/invoices`;

    let session;

    if (type === 'subscription' && planTier) {
      // JPY tier-specific price IDs
      const BASIC_PRICE_ID = process.env.STRIPE_BASIC_PRICE_ID;
      const PREMIUM_PRICE_ID = process.env.STRIPE_PREMIUM_PRICE_ID;
      const priceId = planTier === 'premium' ? PREMIUM_PRICE_ID : BASIC_PRICE_ID;

      const subscriptionMeta = {
        supabase_user_id: user.id,
        type: 'subscription',
        plan_tier: planTier,
        ...(projectId ? { project_id: projectId } : {}),
      };

      if (priceId) {
        session = await stripe.checkout.sessions.create({
          customer: customerId,
          mode: 'subscription',
          line_items: [{ price: priceId, quantity: 1 }],
          allow_promotion_codes: true,
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata: subscriptionMeta,
        });
      } else {
        // Fallback: inline JPY price_data (zero-decimal: ¥10,000 = 10000, ¥20,000 = 20000)
        const tierName = planTier === 'premium' ? 'ZeroEn Premium' : 'ZeroEn Basic';
        const tierDesc = planTier === 'premium'
          ? 'Monthly hosting, 2 small changes OR 1 medium, full-year analytics, quarterly audits'
          : 'Monthly hosting, 1 small change/mo, analytics PDF';
        const unitAmount = planTier === 'premium' ? 20000 : 10000;

        session = await stripe.checkout.sessions.create({
          customer: customerId,
          mode: 'subscription',
          line_items: [
            {
              price_data: {
                currency: 'jpy',
                product_data: {
                  name: tierName,
                  description: tierDesc,
                },
                unit_amount: unitAmount,
                recurring: { interval: 'month' },
              },
              quantity: 1,
            },
          ],
          allow_promotion_codes: true,
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata: subscriptionMeta,
        });
      }
    } else if (type === 'subscription' && !planTier) {
      // Backward-compat: no planTier — keep old USD fallback path
      const PLATFORM_PRICE_ID = process.env.STRIPE_PLATFORM_PRICE_ID;

      const subscriptionMeta = {
        supabase_user_id: user.id,
        type: 'subscription',
        ...(projectId ? { project_id: projectId } : {}),
      };

      if (PLATFORM_PRICE_ID) {
        session = await stripe.checkout.sessions.create({
          customer: customerId,
          mode: 'subscription',
          line_items: [{ price: PLATFORM_PRICE_ID, quantity: 1 }],
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata: subscriptionMeta,
        });
      } else {
        session = await stripe.checkout.sessions.create({
          customer: customerId,
          mode: 'subscription',
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: { name: 'ZeroEn Platform' },
                unit_amount: 5000,
                recurring: { interval: 'month' },
              },
              quantity: 1,
            },
          ],
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata: subscriptionMeta,
        });
      }
    } else {
      if (!invoiceId) {
        return NextResponse.json(
          { error: 'invoiceId required for per_request' },
          { status: 400 }
        );
      }

      const { data: invoice } = await supabase
        .from('invoices')
        .select('amount_cents, description, client_id')
        .eq('id', invoiceId)
        .eq('client_id', user.id)
        .single();

      if (!invoice) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      }

      session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
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
          invoice_id: invoiceId,
          type: 'per_request',
        },
      });
    }

    // For subscription checkouts, stamp the project so the dashboard can show
    // the pending UI even after the user refreshes (losing ?subscribed=true).
    // The webhook clears this to null once checkout.session.completed is handled.
    if (type === 'subscription' && session) {
      await supabase
        .from('projects')
        .update({ checkout_pending_at: new Date().toISOString() })
        .eq('client_id', user.id);
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    console.error('Stripe checkout error:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
