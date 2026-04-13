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
const PLAN_CAPACITY: Record<string, number> = {
  basic: 1,
  premium: 2,
};

const TIER_UNIT_COST: Record<string, number> = {
  small: 1,
  medium: 2,
};

const TIER_PRICE_CENTS: Record<string, number> = {
  small: 4000,   // ¥4,000
  medium: 10000, // ¥10,000
  large: 25000,  // ¥25,000 minimum (quoted individually in practice)
};

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
  // 1. Load project to get plan_tier
  const { data: project } = await adminSupabase
    .from('projects')
    .select('plan_tier')
    .eq('id', projectId)
    .single();

  const planTier = project?.plan_tier ?? 'basic';
  const capacity = PLAN_CAPACITY[planTier] ?? 1;

  // 2. Compute current UTC month boundaries (displayed as JST to operator)
  const now = new Date();
  const cycleStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const cycleEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));
  const cycleStartIso = cycleStart.toISOString().split('T')[0];
  const cycleEndIso = cycleEnd.toISOString().split('T')[0];

  // 3. Fetch all completed change_requests for this project in the current cycle
  const { data: completed } = await adminSupabase
    .from('change_requests')
    .select('id, tier')
    .eq('project_id', projectId)
    .eq('status', 'completed')
    .gte('updated_at', cycleStart.toISOString())
    .lte('updated_at', new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)).toISOString());

  if (!completed || completed.length === 0) return null;

  // 4. Find the current request in the list
  const currentRequest = completed.find((r) => r.id === requestId);
  if (!currentRequest) return null;

  const currentTier = currentRequest.tier ?? 'small';

  // Large changes are always overage, never included
  if (currentTier === 'large') {
    return {
      isOverage: true,
      tier: 'large',
      amountCents: TIER_PRICE_CENTS.large,
      cycleStart: cycleStartIso,
      cycleEnd: cycleEndIso,
    };
  }

  // 5. Compute total capacity used by all non-large completed requests this cycle
  const totalUsed = completed.reduce((sum, r) => {
    const tier = r.tier ?? 'small';
    if (tier === 'large') return sum; // large handled above
    return sum + (TIER_UNIT_COST[tier] ?? 1);
  }, 0);

  // 6. If total capacity exceeds plan, this request contributes to overage
  if (totalUsed <= capacity) return null;

  return {
    isOverage: true,
    tier: currentTier,
    amountCents: TIER_PRICE_CENTS[currentTier] ?? 4000,
    cycleStart: cycleStartIso,
    cycleEnd: cycleEndIso,
  };
}
