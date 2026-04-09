import { NextResponse, type NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (
    !signature ||
    !process.env.STRIPE_WEBHOOK_SECRET ||
    process.env.STRIPE_WEBHOOK_SECRET === 'whsec_placeholder'
  ) {
    // In development without real webhook secret, return OK
    return NextResponse.json({ received: true });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = getAdminClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        const invoiceId = session.metadata?.invoice_id;
        const type = session.metadata?.type;

        if (!userId) break;

        if (session.customer) {
          await supabase
            .from('profiles')
            .update({ stripe_customer_id: session.customer as string })
            .eq('id', userId);
        }

        if (type === 'per_request' && invoiceId) {
          await supabase
            .from('invoices')
            .update({
              status: 'paid',
              paid_at: new Date().toISOString(),
              stripe_payment_intent_id: session.payment_intent as string,
            })
            .eq('id', invoiceId);
        }

        if (type === 'subscription') {
          const { data: project } = await supabase
            .from('projects')
            .select('id')
            .eq('client_id', userId)
            .single();

          if (project) {
            await supabase.from('invoices').insert({
              project_id: project.id,
              client_id: userId,
              stripe_invoice_id: session.id,
              amount_cents: session.amount_total || 5000,
              currency: session.currency || 'usd',
              description: 'ZeroEn Platform — Monthly',
              type: 'subscription',
              status: 'paid',
              paid_at: new Date().toISOString(),
            });
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const stripeInvoice = event.data.object as Stripe.Invoice;
        const customerId = stripeInvoice.customer as string;

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (profile) {
          await supabase
            .from('invoices')
            .update({ status: 'overdue' })
            .eq('client_id', profile.id)
            .eq('stripe_invoice_id', stripeInvoice.id);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (profile) {
          const { data: project } = await supabase
            .from('projects')
            .select('id')
            .eq('client_id', profile.id)
            .single();

          if (project) {
            await supabase
              .from('projects')
              .update({ status: 'paused' })
              .eq('id', project.id);
          }
        }
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ received: true, error: 'Handler error' });
  }

  return NextResponse.json({ received: true });
}
