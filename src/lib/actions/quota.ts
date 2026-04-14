'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { getMonthlyQuotaUsage, TIER_PRICE_CENTS, TIER_UNIT_COST } from '@/lib/billing/overage';

export interface ProjectQuota {
  planTier: string;
  usedUnits: number;
  capacityUnits: number;
  remainingUnits: number;
  tierPriceCents: Record<string, number>;
  tierUnitCost: Record<string, number>;
}

/**
 * Server action: returns monthly quota usage for a project.
 * Verifies the authenticated user owns the project before returning data.
 */
export async function getProjectQuota(projectId: string): Promise<ProjectQuota> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Verify user owns this project
  const { data: project } = await adminSupabase
    .from('projects')
    .select('client_id')
    .eq('id', projectId)
    .single();

  if (!project || project.client_id !== user.id) throw new Error('Forbidden');

  const quota = await getMonthlyQuotaUsage(projectId, adminSupabase);

  return {
    planTier: quota.planTier,
    usedUnits: quota.usedUnits,
    capacityUnits: quota.capacityUnits,
    remainingUnits: quota.remainingUnits,
    tierPriceCents: TIER_PRICE_CENTS,
    tierUnitCost: TIER_UNIT_COST,
  };
}
