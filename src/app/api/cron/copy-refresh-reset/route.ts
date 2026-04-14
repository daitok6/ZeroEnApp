import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Quarterly copy-refresh credit reset.
 *
 * Runs daily. For each Premium project whose copy_refresh_cycle_start is
 * 3+ months in the past, resets copy_refresh_credits_remaining to 1 and
 * advances copy_refresh_cycle_start by one 3-month period (preserving the
 * original cadence rather than drifting to the cron fire date).
 *
 * If a project missed multiple quarters (e.g. was paused and re-activated),
 * the loop advances the cycle_start until it's in the future, granting only
 * 1 credit regardless of how many quarters were skipped.
 */
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const auth = req.headers.get('authorization');
  if (!cronSecret || auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date();
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  // Find Premium projects whose cycle is due for a reset
  const { data: projects, error: fetchError } = await supabase
    .from('projects')
    .select('id, copy_refresh_cycle_start')
    .eq('plan_tier', 'premium')
    .eq('status', 'operating')
    .not('copy_refresh_cycle_start', 'is', null)
    .lte('copy_refresh_cycle_start', threeMonthsAgo.toISOString());

  if (fetchError) {
    console.error('[copy-refresh-reset] fetch error:', fetchError);
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!projects?.length) {
    return NextResponse.json({ message: 'No projects due for reset', count: 0 });
  }

  const results: { projectId: string; ok: boolean; nextCycleStart?: string; error?: string }[] = [];

  for (const project of projects) {
    try {
      // Advance cycle_start by 3-month increments until it's in the future
      const cycleStart = new Date(project.copy_refresh_cycle_start as string);
      while (cycleStart <= now) {
        cycleStart.setMonth(cycleStart.getMonth() + 3);
      }
      const nextCycleStart = cycleStart.toISOString();

      const { error: updateError } = await supabase
        .from('projects')
        .update({
          copy_refresh_credits_remaining: 1,
          copy_refresh_cycle_start: nextCycleStart,
        })
        .eq('id', project.id);

      if (updateError) throw new Error(updateError.message);

      console.log(`[copy-refresh-reset] reset project ${project.id} → next cycle ${nextCycleStart}`);
      results.push({ projectId: project.id, ok: true, nextCycleStart });
    } catch (err) {
      console.error(`[copy-refresh-reset] project ${project.id} error:`, err);
      results.push({ projectId: project.id, ok: false, error: String(err) });
    }
  }

  return NextResponse.json({ results, count: results.length });
}
