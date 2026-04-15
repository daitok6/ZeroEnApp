import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';

export async function POST() {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured' }, { status: 503 });
  }

  try {
    // No request body needed
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
      .select('id, stripe_subscription_schedule_id, pending_plan_tier')
      .eq('client_id', user.id)
      .single();

    if (!project || !project.stripe_subscription_schedule_id) {
      return NextResponse.json({ error: 'No pending plan change found' }, { status: 400 });
    }

    // Release the schedule — subscription continues on current plan
    await stripe.subscriptionSchedules.release(project.stripe_subscription_schedule_id);

    // Clear pending fields
    await supabase
      .from('projects')
      .update({
        pending_plan_tier: null,
        pending_plan_effective_at: null,
        stripe_subscription_schedule_id: null,
      })
      .eq('client_id', user.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Cancel pending change error:', err);
    return NextResponse.json({ error: 'Failed to cancel pending plan change' }, { status: 500 });
  }
}
