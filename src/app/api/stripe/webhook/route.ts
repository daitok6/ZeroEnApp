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

  const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
  const missingSecret =
    !process.env.STRIPE_WEBHOOK_SECRET ||
    process.env.STRIPE_WEBHOOK_SECRET === 'whsec_placeholder';

  if (!signature || missingSecret) {
    if (isProduction) {
      // In production a missing/invalid secret is a configuration error — fail loudly
      // so Stripe retries and Vercel logs surface the problem.
      console.error('STRIPE_WEBHOOK_SECRET is not configured in production');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }
    // In development without a real webhook secret, skip verification
    return NextResponse.json({ received: true });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
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
            // Premium grants 1 copy-refresh credit, cycle starting now.
            // Basic stays at 0. Quarterly reset is handled by a separate cron (TODO: implement).
            const copyRefreshUpdates = planTier === 'premium'
              ? { copy_refresh_credits_remaining: 1, copy_refresh_cycle_start: new Date().toISOString() }
              : { copy_refresh_credits_remaining: 0, copy_refresh_cycle_start: null };

            const { data: updatedProjects, error: updateError } = await supabase
              .from('projects')
              .update({
                plan_tier: planTier,
                commitment_starts_at: new Date().toISOString(),
                stripe_subscription_id: subscriptionId,
                status: 'operating',
                checkout_pending_at: null,
                ...copyRefreshUpdates,
              })
              .eq('client_id', userId)
              .select('id');

            if (updateError) {
              console.error(
                `[webhook] projects update error for user ${userId}:`,
                updateError
              );
              return NextResponse.json({ error: 'db_update_failed' }, { status: 500 });
            }

            if (!updatedProjects || updatedProjects.length === 0) {
              console.error(
                `[webhook] projects update matched 0 rows for client_id=${userId} ` +
                  `(subscription ${subscriptionId}, tier ${planTier}). ` +
                  'No projects row exists for this user — manual backfill required.'
              );
              // Return 500 so Stripe retries; also surfaces in Vercel logs
              return NextResponse.json({ error: 'project_not_found' }, { status: 500 });
            }

            console.log(
              `[webhook] Subscription setup complete for user ${userId}: ` +
                `tier=${planTier}, subscription=${subscriptionId}`
            );
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

      case 'invoice.paid': {
        const stripeInvoice = event.data.object as Stripe.Invoice;

        // Only handle per_request invoices — subscription invoices are handled via checkout.session.completed
        const changeRequestId = stripeInvoice.metadata?.change_request_id;
        if (!changeRequestId) break;

        const { data: existingInvoice } = await supabase
          .from('invoices')
          .select('id, change_request_id')
          .eq('stripe_invoice_id', stripeInvoice.id)
          .maybeSingle();

        if (!existingInvoice) break;

        const { data: updated } = await supabase
          .from('invoices')
          .update({
            status: 'paid',
            paid_at: new Date().toISOString(),
          })
          .eq('id', existingInvoice.id)
          .eq('status', 'pending')
          .select('id');

        if (updated && updated.length > 0 && existingInvoice.change_request_id) {
          await supabase
            .from('change_requests')
            .update({ status: 'approved' })
            .eq('id', existingInvoice.change_request_id)
            .eq('status', 'quoted');
        }
        break;
      }

      case 'invoice.payment_failed': {
        const stripeInvoice = event.data.object as Stripe.Invoice;

        // Per-request invoice payment failed — mark overdue
        const changeRequestId = stripeInvoice.metadata?.change_request_id;
        if (changeRequestId) {
          await supabase
            .from('invoices')
            .update({ status: 'overdue' })
            .eq('stripe_invoice_id', stripeInvoice.id)
            .eq('status', 'pending');
          break;
        }

        // Subscription invoice payment failed — existing behavior
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

      case 'invoice.voided': {
        const stripeInvoice = event.data.object as Stripe.Invoice;

        await supabase
          .from('invoices')
          .update({ status: 'declined' })
          .eq('stripe_invoice_id', stripeInvoice.id)
          .eq('status', 'pending');
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
          // Fetch current project state to determine how to handle this change
          const { data: currentProject } = await supabase
            .from('projects')
            .select('plan_tier, pending_plan_tier')
            .eq('client_id', profile.id)
            .single();

          const planActuallyChanged = currentProject?.plan_tier !== newPlanTier;

          const updates: {
            plan_tier: 'basic' | 'premium';
            commitment_starts_at?: string;
            stripe_subscription_id: string;
            pending_plan_tier?: null;
            pending_plan_effective_at?: null;
            stripe_subscription_schedule_id?: null;
            copy_refresh_credits_remaining?: number;
            copy_refresh_cycle_start?: string | null;
          } = {
            plan_tier: newPlanTier,
            stripe_subscription_id: subscription.id,
          };

          if (planActuallyChanged) {
            const isScheduledDowngrade = currentProject?.pending_plan_tier === newPlanTier;
            if (isScheduledDowngrade) {
              // Downgrade completed via schedule — clear pending fields, don't reset commitment clock
              updates.pending_plan_tier = null;
              updates.pending_plan_effective_at = null;
              updates.stripe_subscription_schedule_id = null;
              // Clear copy-refresh credits on downgrade to Basic
              if (newPlanTier === 'basic') {
                updates.copy_refresh_credits_remaining = 0;
                updates.copy_refresh_cycle_start = null;
              }
            } else {
              // Upgrade or immediate change — reset the 6-month commitment clock
              updates.commitment_starts_at = new Date().toISOString();
              // Grant 1 copy-refresh credit when activating Premium
              if (newPlanTier === 'premium') {
                updates.copy_refresh_credits_remaining = 1;
                updates.copy_refresh_cycle_start = new Date().toISOString();
              }
            }
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
    console.error('[webhook] Unhandled handler error:', err);
    return NextResponse.json({ error: 'handler_error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
