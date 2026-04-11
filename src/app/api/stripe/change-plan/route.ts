import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { z } from 'zod';

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

    // Downgrade check: premium → basic requires 6-month minimum on Premium
    if (targetPlan === 'basic' && project.plan_tier === 'premium') {
      if (project.commitment_starts_at) {
        const commitmentStart = new Date(project.commitment_starts_at);
        const earliestDowngrade = new Date(commitmentStart);
        earliestDowngrade.setMonth(earliestDowngrade.getMonth() + 6);

        if (earliestDowngrade > new Date()) {
          return NextResponse.json(
            {
              error: 'downgrade_locked',
              earliest_downgrade_date: earliestDowngrade.toISOString(),
            },
            { status: 403 }
          );
        }
      }
    }

    // Resolve new price ID
    const basicPriceId = process.env.STRIPE_BASIC_PRICE_ID;
    const premiumPriceId = process.env.STRIPE_PREMIUM_PRICE_ID;
    const newPriceId = targetPlan === 'premium' ? premiumPriceId : basicPriceId;

    if (!newPriceId) {
      return NextResponse.json(
        { error: `STRIPE_${targetPlan.toUpperCase()}_PRICE_ID is not configured` },
        { status: 503 }
      );
    }

    // Fetch and update the Stripe subscription
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

    // Update project in DB
    await supabase
      .from('projects')
      .update({
        plan_tier: targetPlan,
        commitment_starts_at: new Date().toISOString(),
      })
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
