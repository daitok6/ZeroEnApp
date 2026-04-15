import type { SupabaseClient } from '@supabase/supabase-js';
import { resolveLooksDone } from './resolvers';
import type { Task, TaskWithMeta } from './types';

const TASK_SELECT = `
  id, title, description, kind, rule_key, client_id, related_table, related_id,
  due_date, due_time, urgency, category, status, completed_at, dedupe_key,
  created_at, updated_at,
  client:profiles!tasks_client_id_fkey(full_name, email)
`;

type RawTask = Task & {
  client: { full_name: string | null; email: string } | { full_name: string | null; email: string }[] | null;
};

function hydrate(raw: RawTask, looksMap: Map<string, boolean>): TaskWithMeta {
  const clientRecord = Array.isArray(raw.client) ? raw.client[0] : raw.client;
  return {
    ...raw,
    client_name: clientRecord?.full_name ?? null,
    client_email: clientRecord?.email ?? null,
    looks_done: looksMap.get(raw.id) ?? false,
  };
}

// Today's open tasks, ordered by urgency desc then created_at asc
export async function getTodayTasks(supabase: SupabaseClient): Promise<TaskWithMeta[]> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('tasks')
    .select(TASK_SELECT)
    .eq('due_date', today)
    .eq('status', 'open')
    .order('urgency', { ascending: false })
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[tasks] getTodayTasks error:', error.message);
    return [];
  }

  const tasks = (data ?? []) as RawTask[];
  const looksMap = await resolveLooksDone(tasks as Task[], supabase);
  return tasks.map((t) => hydrate(t, looksMap));
}

// Upcoming tasks (today + future), grouped data returned flat — page groups them
export async function getUpcomingTasks(supabase: SupabaseClient, limit = 100): Promise<TaskWithMeta[]> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('tasks')
    .select(TASK_SELECT)
    .gte('due_date', today)
    .eq('status', 'open')
    .order('due_date', { ascending: true })
    .order('urgency', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[tasks] getUpcomingTasks error:', error.message);
    return [];
  }

  const tasks = (data ?? []) as RawTask[];
  const looksMap = await resolveLooksDone(tasks as Task[], supabase);
  return tasks.map((t) => hydrate(t, looksMap));
}

// All tasks for a given calendar month (YYYY-MM)
export async function getCalendarTasks(supabase: SupabaseClient, month: string): Promise<TaskWithMeta[]> {
  // month = 'YYYY-MM'
  const [year, mon] = month.split('-').map(Number);
  const from = `${month}-01`;
  const lastDay = new Date(year, mon, 0).getDate(); // day 0 of next month = last day of this month
  const to = `${month}-${String(lastDay).padStart(2, '0')}`;

  const { data, error } = await supabase
    .from('tasks')
    .select(TASK_SELECT)
    .gte('due_date', from)
    .lte('due_date', to)
    .neq('status', 'dismissed')
    .order('due_date', { ascending: true })
    .order('urgency', { ascending: false });

  if (error) {
    console.error('[tasks] getCalendarTasks error:', error.message);
    return [];
  }

  const tasks = (data ?? []) as RawTask[];
  // Skip looks_done resolution for calendar view — not displayed there
  return tasks.map((t) => hydrate(t, new Map()));
}

// Tasks due in a given date range (for digest)
export async function getTasksDueOn(supabase: SupabaseClient, date: string): Promise<TaskWithMeta[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select(TASK_SELECT)
    .eq('due_date', date)
    .eq('status', 'open')
    .order('urgency', { ascending: false });

  if (error) {
    console.error('[tasks] getTasksDueOn error:', error.message);
    return [];
  }

  const tasks = (data ?? []) as RawTask[];
  return tasks.map((t) => hydrate(t, new Map()));
}
