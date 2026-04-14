import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { z } from 'zod';
import { computeCommitmentStatus } from '@/lib/billing/commitment';

const changePlanSchema = z.object({
  targetPlan: z.enum(['basic', 'premium']),
});

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { targetPlan } = changePlanSchema.parse(body);

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

    // Fetch user's project
    const { data: project } = await supabase
      .from('projects')
      .select('id, plan_tier, commitment_starts_at, stripe_subscription_id')
      .eq('client_id', user.id)
      .single();

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (!project.stripe_subscription_id) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 400 });
    }

    // Must be different from current plan
    if (project.plan_tier === targetPlan) {
      return NextResponse.json(
        { error: 'Target plan is the same as current plan' },
        { status: 400 }
      );
    }

    const basicPriceId = process.env.STRIPE_BASIC_PRICE_ID;
    const premiumPriceId = process.env.STRIPE_PREMIUM_PRICE_ID;
    const newPriceId = targetPlan === 'premium' ? premiumPriceId : basicPriceId;

    if (!newPriceId) {
      return NextResponse.json(
        { error: `STRIPE_${targetPlan.toUpperCase()}_PRICE_ID is not configured` },
        { status: 503 }
      );
    }

    // Downgrade Premium → Basic within commitment: schedule it at commitment end
    const { withinCommitment, end: commitmentEnd } = computeCommitmentStatus(
      project.commitment_starts_at
    );

    if (targetPlan === 'basic' && project.plan_tier === 'premium' && withinCommitment && commitmentEnd) {
      // Create a subscription schedule from the current subscription
      const schedule = await stripe.subscriptionSchedules.create({
        from_subscription: project.stripe_subscription_id,
      });

      // The first phase start_date mirrors the current subscription's current period
      const currentPhaseStart = schedule.phases[0].start_date;
      const commitmentEndUnix = Math.floor(commitmentEnd.getTime() / 1000);

      await stripe.subscriptionSchedules.update(schedule.id, {
        end_behavior: 'release',
        phases: [
          {
            items: [{ price: premiumPriceId!, quantity: 1 }],
            start_date: currentPhaseStart,
            end_date: commitmentEndUnix,
            proration_behavior: 'none',
          },
          {
            items: [{ price: basicPriceId!, quantity: 1 }],
            proration_behavior: 'none',
          },
        ],
      });

      // Persist pending downgrade state
      await supabase
        .from('projects')
        .update({
          pending_plan_tier: 'basic',
          pending_plan_effective_at: commitmentEnd.toISOString(),
          stripe_subscription_schedule_id: schedule.id,
        })
        .eq('client_id', user.id);

      return NextResponse.json({
        success: true,
        scheduled: true,
        effectiveAt: commitmentEnd.toISOString(),
      });
    }

    // Immediate plan change (upgrade, or downgrade after commitment ended)
    const subscription = await stripe.subscriptions.retrieve(project.stripe_subscription_id);
    const subscriptionItemId = subscription.items.data[0]?.id;

    if (!subscriptionItemId) {
      return NextResponse.json({ error: 'Subscription item not found' }, { status: 500 });
    }

    await stripe.subscriptions.update(project.stripe_subscription_id, {
      items: [
        {
          id: subscriptionItemId,
          price: newPriceId,
        },
      ],
      proration_behavior: 'create_prorations',
    });

    // Only reset commitment clock on upgrades — downgrades after commitment don't restart the clock
    const updates: Record<string, string | number | null> = { plan_tier: targetPlan };
    if (targetPlan === 'premium') {
      updates.commitment_starts_at = new Date().toISOString();
      // Grant 1 copy-refresh credit for the new Premium cycle. Quarterly reset is handled elsewhere (TODO).
      updates.copy_refresh_credits_remaining = 1;
      updates.copy_refresh_cycle_start = new Date().toISOString();
    } else {
      // Downgrade to Basic — clear any remaining copy-refresh credits.
      updates.copy_refresh_credits_remaining = 0;
      updates.copy_refresh_cycle_start = null;
    }

    await supabase
      .from('projects')
      .update(updates)
      .eq('client_id', user.id);

    return NextResponse.json({ success: true, newPlan: targetPlan });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    console.error('Change plan error:', err);
    return NextResponse.json({ error: 'Failed to change plan' }, { status: 500 });
  }
}
