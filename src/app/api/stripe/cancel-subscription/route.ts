import { createServerClient } from '@supabase/ssr';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe/client';

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

    // Check commitment period — cancellation within 6 months requires buyout
    let earlyTermination = false;
    let remainingMonths = 0;
    if (project.commitment_starts_at) {
      const commitmentStart = new Date(project.commitment_starts_at);
      const commitmentEnd = new Date(commitmentStart);
      commitmentEnd.setMonth(commitmentEnd.getMonth() + 6);

      if (commitmentEnd > new Date()) {
        earlyTermination = true;
        const now = new Date();
        remainingMonths = Math.ceil(
          (commitmentEnd.getTime() - now.getTime()) / (30 * 24 * 60 * 60 * 1000)
        );
      }
    }

    // Cancel at period end (Stripe continues service until current billing period ends)
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
      earlyTermination,
      remainingMonths,
    });
  } catch (err) {
    console.error('Cancel subscription error:', err);
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
  }
}
