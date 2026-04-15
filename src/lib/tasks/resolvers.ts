import type { SupabaseClient } from '@supabase/supabase-js';
import type { Task } from './types';

// Returns a map of task.id → looks_done boolean.
// Batches queries by rule_key to avoid N+1.
export async function resolveLooksDone(
  tasks: Task[],
  db: SupabaseClient
): Promise<Map<string, boolean>> {
  const result = new Map<string, boolean>();

  // Only state_change + cadence tasks with a related_id are candidates
  const resolvable = tasks.filter((t) => t.rule_key && t.related_id);

  // Group by rule_key
  const byRuleKey = new Map<string, Task[]>();
  for (const task of resolvable) {
    const group = byRuleKey.get(task.rule_key!) ?? [];
    group.push(task);
    byRuleKey.set(task.rule_key!, group);
  }

  await Promise.all([
    resolveInvoiceVerify(byRuleKey, db, result),
    resolveInvoiceReminder(byRuleKey, db, result),
    resolveInvoicePause(byRuleKey, db, result),
    resolveApplicationScore(byRuleKey, db, result),
    resolveDraftScope(byRuleKey, db, result),
    resolveScheduleFirstReport(byRuleKey, db, result),
    resolveChangeRequestReview(byRuleKey, db, result),
  ]);

  return result;
}

async function resolveInvoiceVerify(
  byRuleKey: Map<string, Task[]>,
  db: SupabaseClient,
  result: Map<string, boolean>
) {
  const tasks = byRuleKey.get('invoice_verify') ?? [];
  if (!tasks.length) return;

  const ids = tasks.map((t) => t.related_id!);
  const { data } = await db.from('invoices').select('id, status').in('id', ids);
  const statusMap = new Map((data ?? []).map((r: { id: string; status: string }) => [r.id, r.status]));
  for (const task of tasks) {
    result.set(task.id, statusMap.get(task.related_id!) === 'paid');
  }
}

async function resolveInvoiceReminder(
  byRuleKey: Map<string, Task[]>,
  db: SupabaseClient,
  result: Map<string, boolean>
) {
  const tasks = byRuleKey.get('invoice_reminder') ?? [];
  if (!tasks.length) return;

  const ids = tasks.map((t) => t.related_id!);
  const { data } = await db.from('invoices').select('id, status').in('id', ids);
  const statusMap = new Map((data ?? []).map((r: { id: string; status: string }) => [r.id, r.status]));
  for (const task of tasks) {
    const status = statusMap.get(task.related_id!);
    result.set(task.id, status === 'paid' || status === 'cancelled');
  }
}

async function resolveInvoicePause(
  byRuleKey: Map<string, Task[]>,
  db: SupabaseClient,
  result: Map<string, boolean>
) {
  const tasks = byRuleKey.get('invoice_pause') ?? [];
  if (!tasks.length) return;

  const ids = tasks.map((t) => t.related_id!);
  const { data } = await db.from('projects').select('id, status').in('id', ids);
  const statusMap = new Map((data ?? []).map((r: { id: string; status: string }) => [r.id, r.status]));
  for (const task of tasks) {
    result.set(task.id, statusMap.get(task.related_id!) === 'paused');
  }
}

async function resolveApplicationScore(
  byRuleKey: Map<string, Task[]>,
  db: SupabaseClient,
  result: Map<string, boolean>
) {
  const tasks = byRuleKey.get('application_score') ?? [];
  if (!tasks.length) return;

  const ids = tasks.map((t) => t.related_id!);
  const { data } = await db.from('applications').select('id, status').in('id', ids);
  const statusMap = new Map((data ?? []).map((r: { id: string; status: string }) => [r.id, r.status]));
  for (const task of tasks) {
    result.set(task.id, (statusMap.get(task.related_id!) ?? 'pending') !== 'pending');
  }
}

async function resolveDraftScope(
  byRuleKey: Map<string, Task[]>,
  db: SupabaseClient,
  result: Map<string, boolean>
) {
  const tasks = byRuleKey.get('draft_scope') ?? [];
  if (!tasks.length) return;

  const ids = tasks.map((t) => t.related_id!);
  const { data } = await db.from('projects').select('id, status').in('id', ids);
  const statusMap = new Map((data ?? []).map((r: { id: string; status: string }) => [r.id, r.status]));
  for (const task of tasks) {
    const status = statusMap.get(task.related_id!);
    result.set(task.id, !!status && status !== 'onboarding');
  }
}

async function resolveScheduleFirstReport(
  byRuleKey: Map<string, Task[]>,
  db: SupabaseClient,
  result: Map<string, boolean>
) {
  const tasks = byRuleKey.get('schedule_first_report') ?? [];
  if (!tasks.length) return;

  const ids = tasks.map((t) => t.related_id!);
  const { data } = await db.from('projects').select('id, status').in('id', ids);
  const statusMap = new Map((data ?? []).map((r: { id: string; status: string }) => [r.id, r.status]));
  for (const task of tasks) {
    result.set(task.id, statusMap.get(task.related_id!) === 'operating');
  }
}

async function resolveChangeRequestReview(
  byRuleKey: Map<string, Task[]>,
  db: SupabaseClient,
  result: Map<string, boolean>
) {
  const tasks = byRuleKey.get('change_request_review') ?? [];
  if (!tasks.length) return;

  const ids = tasks.map((t) => t.related_id!);
  const { data } = await db.from('change_requests').select('id, status').in('id', ids);
  const statusMap = new Map((data ?? []).map((r: { id: string; status: string }) => [r.id, r.status]));
  for (const task of tasks) {
    result.set(task.id, (statusMap.get(task.related_id!) ?? 'reviewing') !== 'reviewing');
  }
}
