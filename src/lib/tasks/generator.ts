import { createAdminClient } from '@/lib/supabase/admin';
import { CADENCE_RULES } from './rules/cadence';
import { BACKFILL_DAYS } from './config';
import type { NewTask } from './types';

// Generates cadence tasks for a given date. Idempotent — safe to call on every
// admin page load. The task_generation_log guards against double-generation.
export async function generateForDate(date: Date): Promise<void> {
  const db = createAdminClient();
  const dateStr = toDateStr(date);

  // Early exit if already generated for this date
  const { data: existing } = await db
    .from('task_generation_log')
    .select('id')
    .eq('log_date', dateStr)
    .eq('scope', 'daily_cadence')
    .maybeSingle();

  if (existing) return;

  // Run all cadence rules
  const allTasks: NewTask[] = [];
  for (const rule of CADENCE_RULES) {
    try {
      const tasks = await rule(date, db);
      allTasks.push(...tasks);
    } catch (err) {
      console.error('[tasks] Cadence rule error:', err);
    }
  }

  // Upsert — ON CONFLICT on dedupe_key DO NOTHING (ignoreDuplicates)
  if (allTasks.length > 0) {
    const { error } = await db
      .from('tasks')
      .upsert(allTasks, { onConflict: 'dedupe_key', ignoreDuplicates: true });

    if (error) {
      console.error('[tasks] generator upsert error:', error.message);
    }
  }

  // Write log row — swallow unique constraint violations from concurrent calls
  try {
    await db
      .from('task_generation_log')
      .insert({ log_date: dateStr, scope: 'daily_cadence' });
  } catch {
    // Concurrent insert already wrote the row — that's fine
  }
}

// On first deployment, backfill past N days so existing domain state surfaces.
// Guarded by checking if ANY generation log rows exist (one-time operation).
export async function maybeBackfill(): Promise<void> {
  const db = createAdminClient();

  const { count } = await db
    .from('task_generation_log')
    .select('*', { count: 'exact', head: true });

  if ((count ?? 0) > 0) return; // Already ran at least once

  const today = new Date();
  for (let i = BACKFILL_DAYS; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    await generateForDate(date);
  }
}

function toDateStr(date: Date): string {
  return date.toISOString().split('T')[0];
}
