import { stripe } from '@/lib/stripe/client';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Return the existing Stripe customer ID for a user, or create one and persist it.
 * Pass an admin-role Supabase client so the UPDATE bypasses RLS.
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adminSupabase: SupabaseClient<any>
): Promise<string> {
  if (!stripe) throw new Error('Stripe is not configured');

  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('stripe_customer_id, email, full_name')
    .eq('id', userId)
    .single();

  if (profile?.stripe_customer_id) return profile.stripe_customer_id;

  const customer = await stripe.customers.create(
    {
      email: profile?.email ?? undefined,
      name: profile?.full_name ?? undefined,
      metadata: { supabase_user_id: userId },
    },
    { idempotencyKey: `customer-${userId}` }
  );

  await adminSupabase
    .from('profiles')
    .update({ stripe_customer_id: customer.id })
    .eq('id', userId);

  return customer.id;
}
