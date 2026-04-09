import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { z } from 'zod';

const checkoutSchema = z.object({
  type: z.enum(['subscription', 'per_request']),
  invoiceId: z.string().uuid().optional(),
  locale: z.enum(['en', 'ja']).default('en'),
});

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { type, invoiceId, locale } = checkoutSchema.parse(body);

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
    const successUrl = `${appUrl}/${locale}/dashboard/invoices?success=true`;
    const cancelUrl = `${appUrl}/${locale}/dashboard/invoices`;

    let session;

    if (type === 'subscription') {
      const PLATFORM_PRICE_ID = process.env.STRIPE_PLATFORM_PRICE_ID;

      if (!PLATFORM_PRICE_ID) {
        session = await stripe.checkout.sessions.create({
          customer: customerId,
          mode: 'subscription',
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'ZeroEn Platform',
                  description: 'Monthly hosting, 1 fix/mo, analytics PDF',
                },
                unit_amount: 5000,
                recurring: { interval: 'month' },
              },
              quantity: 1,
            },
          ],
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata: { supabase_user_id: user.id, type: 'subscription' },
        });
      } else {
        session = await stripe.checkout.sessions.create({
          customer: customerId,
          mode: 'subscription',
          line_items: [{ price: PLATFORM_PRICE_ID, quantity: 1 }],
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata: { supabase_user_id: user.id, type: 'subscription' },
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
