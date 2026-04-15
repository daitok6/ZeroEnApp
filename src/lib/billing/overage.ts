import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Included capacity per plan tier, measured in "small-equivalents".
 *   small  = 1 unit
 *   medium = 2 units  (counts as 2 smalls toward the capacity)
 *   large  = ∞ (always billed regardless of plan)
 *
 * Basic plan:   1 small-equivalent/month
 * Premium plan: 2 small-equivalents/month (i.e. 2 smalls OR 1 medium)
 */
export const PLAN_CAPACITY: Record<string, number> = {
  basic: 1,
  premium: 2,
};

export const TIER_UNIT_COST: Record<string, number> = {
  small: 1,
  medium: 2,
};

export const TIER_PRICE_CENTS: Record<string, number> = {
  small: 4000,   // ¥4,000
  medium: 10000, // ¥10,000
  large: 25000,  // ¥25,000 minimum (quoted individually in practice)
};

export interface QuotaUsage {
  planTier: string;
  usedUnits: number;
  capacityUnits: number;
  remainingUnits: number;
}

/**
 * Returns the current month's quota usage for a project.
 * Counts requests in status approved|in_progress|completed — i.e. admin-committed work.
 */
export async function getMonthlyQuotaUsage(
  projectId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adminSupabase: SupabaseClient<any>
): Promise<QuotaUsage> {
  const { data: project } = await adminSupabase
    .from('projects')
    .select('plan_tier')
    .eq('id', projectId)
    .single();

  const planTier = project?.plan_tier ?? 'basic';
  const capacityUnits = PLAN_CAPACITY[planTier] ?? 1;

  const now = new Date();
  const cycleStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const cycleEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  const { data: committed } = await adminSupabase
    .from('change_requests')
    .select('tier')
    .eq('project_id', projectId)
    .in('status', ['approved', 'in_progress', 'completed'])
    .gte('updated_at', cycleStart.toISOString())
    .lt('updated_at', cycleEnd.toISOString());

  const usedUnits = (committed ?? []).reduce((sum, r) => {
    const tier = r.tier ?? 'small';
    if (tier === 'large') return sum;
    return sum + (TIER_UNIT_COST[tier] ?? 1);
  }, 0);

  return {
    planTier,
    usedUnits,
    capacityUnits,
    remainingUnits: Math.max(0, capacityUnits - usedUnits),
  };
}

export interface OverageResult {
  isOverage: boolean;
  tier: string;
  amountCents: number;
  cycleStart: string; // ISO date (YYYY-MM-DD)
  cycleEnd: string;   // ISO date (YYYY-MM-DD)
}

/**
 * Determine whether completing a specific change_request triggers an overage invoice.
 *
 * Call this AFTER the change_request has been marked `completed` so that the current
 * request is included in the month's completed count.
 *
 * @param projectId   UUID of the project
 * @param requestId   UUID of the change_request just completed
 * @param adminSupabase  Service-role Supabase client (bypasses RLS)
 * @returns OverageResult if an overage invoice should be created, null otherwise
 */
export async function computeOverage(
  projectId: string,
  requestId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adminSupabase: SupabaseClient<any>
): Promise<OverageResult | null> {
  // 1. Load the specific request to get its tier
  const { data: changeRequest } = await adminSupabase
    .from('change_requests')
    .select('tier')
    .eq('id', requestId)
    .single();

  if (!changeRequest) return null;
  const currentTier = changeRequest.tier ?? 'small';

  // Medium changes are Premium-only. A DB trigger blocks Basic+medium at insert, but
  // guard here too in case a project downgrades between request submission and completion.
  if (currentTier === 'medium') {
    const { data: project } = await adminSupabase
      .from('projects')
      .select('plan_tier')
      .eq('id', projectId)
      .single();
    if ((project?.plan_tier ?? 'basic') !== 'premium') {
      throw new Error('Medium change requests require a Premium plan');
    }
  }

  // 2. Compute cycle boundaries for the response metadata
  const now = new Date();
  const cycleStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const cycleEndDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));
  const cycleStartIso = cycleStart.toISOString().split('T')[0];
  const cycleEndIso = cycleEndDay.toISOString().split('T')[0];

  // 3. Large changes are always overage, never included
  if (currentTier === 'large') {
    return {
      isOverage: true,
      tier: 'large',
      amountCents: TIER_PRICE_CENTS.large,
      cycleStart: cycleStartIso,
      cycleEnd: cycleEndIso,
    };
  }

  // 4. Check quota — request is now completed so getMonthlyQuotaUsage includes it
  const quota = await getMonthlyQuotaUsage(projectId, adminSupabase);

  // If total committed units are within plan capacity → no overage
  if (quota.usedUnits <= quota.capacityUnits) return null;

  return {
    isOverage: true,
    tier: currentTier,
    amountCents: TIER_PRICE_CENTS[currentTier] ?? 4000,
    cycleStart: cycleStartIso,
    cycleEnd: cycleEndIso,
  };
}
