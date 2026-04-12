import { createServerClient } from '@supabase/ssr';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { computeCommitmentStatus } from '@/lib/billing/commitment';
import { PLAN_MONTHLY_JPY } from '@/lib/billing/plan-prices';

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const confirm = body?.confirm === true;

    if (!confirm) {
      return NextResponse.json({ error: 'Confirmation required' }, { status: 400 });
    }

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

    const { data: project } = await supabase
      .from('projects')
      .select('id, plan_tier, commitment_starts_at, stripe_subscription_id')
      .eq('client_id', user.id)
      .single();

    if (!project || !project.stripe_subscription_id) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 400 });
    }

    // Fetch stripe_customer_id from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: 'No Stripe customer found' }, { status: 400 });
    }

    const { withinCommitment, remainingMonths } = computeCommitmentStatus(
      project.commitment_starts_at
    );

    // Early termination: invoice and charge the full remaining commitment immediately
    if (withinCommitment && remainingMonths > 0 && project.plan_tier) {
      const planTier = project.plan_tier as 'basic' | 'premium';
      const monthlyPrice = PLAN_MONTHLY_JPY[planTier];
      const earlyTerminationAmount = remainingMonths * monthlyPrice;

      // Create a one-time invoice item for the remaining commitment
      await stripe.invoiceItems.create({
        customer: profile.stripe_customer_id,
        amount: earlyTerminationAmount,
        currency: 'jpy',
        description: `Early cancellation fee — ${remainingMonths} month(s) remaining on 6-month commitment`,
        metadata: { project_id: project.id, reason: 'early_termination' },
      });

      // Create a draft invoice
      const invoice = await stripe.invoices.create({
        customer: profile.stripe_customer_id,
        auto_advance: false,
        collection_method: 'charge_automatically',
        metadata: { project_id: project.id, reason: 'early_termination' },
      });

      // Finalize the invoice
      await stripe.invoices.finalizeInvoice(invoice.id, { auto_advance: false });

      // Attempt synchronous payment — throws if card declines
      let paidInvoice;
      try {
        paidInvoice = await stripe.invoices.pay(invoice.id);
      } catch {
        // Payment failed — do not cancel subscription, return invoice URL
        const failedInvoice = await stripe.invoices.retrieve(invoice.id);
        return NextResponse.json(
          {
            error: 'payment_failed',
            invoice_url: failedInvoice.hosted_invoice_url ?? null,
          },
          { status: 402 }
        );
      }

      // Record the early-termination invoice in Supabase
      const earlyTermAdminSupabase = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      await earlyTermAdminSupabase.from('invoices').insert({
        project_id: project.id,
        client_id: user.id,
        stripe_invoice_id: paidInvoice.id,
        amount_cents: earlyTerminationAmount,
        currency: 'jpy',
        description: `Early cancellation — ${remainingMonths} month(s) remaining`,
        type: 'subscription',
        status: 'paid',
        paid_at: new Date().toISOString(),
      });
    }

    // Cancel at period end (service continues until current billing period ends)
    await stripe.subscriptions.update(project.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    // Update project status via service role (RLS bypass)
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    await adminSupabase
      .from('projects')
      .update({ status: 'paused' })
      .eq('client_id', user.id);

    return NextResponse.json({
      success: true,
      earlyTermination: withinCommitment,
      remainingMonths,
    });
  } catch (err) {
    console.error('Cancel subscription error:', err);
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
  }
}
