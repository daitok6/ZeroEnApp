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
          // Fetch change_request_id before updating
          const { data: existingInvoice } = await supabase
            .from('invoices')
            .select('change_request_id')
            .eq('id', invoiceId)
            .single();

          const { data: updatedInvoices } = await supabase
            .from('invoices')
            .update({
              status: 'paid',
              paid_at: new Date().toISOString(),
              stripe_payment_intent_id: session.payment_intent ? (session.payment_intent as string) : null,
            })
            .eq('id', invoiceId)
            .eq('status', 'pending')
            .select('id');

          if (existingInvoice?.change_request_id && updatedInvoices && updatedInvoices.length > 0) {
            await supabase
              .from('change_requests')
              .update({ status: 'approved' })
              .eq('id', existingInvoice.change_request_id);
          }
        }

        if (type === 'subscription') {
          const planTier = session.metadata?.plan_tier as 'basic' | 'premium' | undefined;
          const subscriptionId = session.subscription as string | undefined;

          const { data: project } = await supabase
            .from('projects')
            .select('id')
            .eq('client_id', userId)
            .single();

          if (planTier && subscriptionId) {
            await supabase
              .from('projects')
              .update({
                plan_tier: planTier,
                commitment_starts_at: new Date().toISOString(),
                stripe_subscription_id: subscriptionId,
                status: 'operating',
              })
              .eq('client_id', userId);
          }

          if (project) {
            // Idempotency: don't insert a duplicate invoice for the same checkout session
            const { data: existingInvoice } = await supabase
              .from('invoices')
              .select('id')
              .eq('stripe_invoice_id', session.id)
              .single();

            if (!existingInvoice) {
              // JPY zero-decimal: store 5000 or 10000 directly
              const amountJpy = planTier === 'premium' ? 10000 : 5000;
              const tierLabel = planTier === 'premium' ? 'Premium' : 'Basic';
              await supabase.from('invoices').insert({
                project_id: project.id,
                client_id: userId,
                stripe_invoice_id: session.id,
                amount_cents: planTier ? amountJpy : (session.amount_total || 5000),
                currency: planTier ? 'jpy' : (session.currency || 'usd'),
                description: planTier
                  ? `ZeroEn ${tierLabel} — Monthly`
                  : 'ZeroEn Platform — Monthly',
                type: 'subscription',
                status: 'paid',
                paid_at: new Date().toISOString(),
              });
            }
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

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (!profile) break;

        const priceId = subscription.items.data[0]?.price?.id;
        const basicPriceId = process.env.STRIPE_BASIC_PRICE_ID;
        const premiumPriceId = process.env.STRIPE_PREMIUM_PRICE_ID;

        let newPlanTier: 'basic' | 'premium' | null = null;
        if (priceId === basicPriceId) newPlanTier = 'basic';
        else if (priceId === premiumPriceId) newPlanTier = 'premium';

        if (newPlanTier) {
          // Fetch current plan_tier to check if it's actually changing
          const { data: currentProject } = await supabase
            .from('projects')
            .select('plan_tier')
            .eq('client_id', profile.id)
            .single();

          const updates: { plan_tier: 'basic' | 'premium'; commitment_starts_at?: string; stripe_subscription_id: string } = {
            plan_tier: newPlanTier,
            stripe_subscription_id: subscription.id,
          };

          // Only reset the 6-month commitment clock when the plan tier actually changes
          if (currentProject?.plan_tier !== newPlanTier) {
            updates.commitment_starts_at = new Date().toISOString();
          }

          await supabase
            .from('projects')
            .update(updates)
            .eq('client_id', profile.id);
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
