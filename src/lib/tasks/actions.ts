'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import type { TaskCategory, TaskUrgency } from './types';

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') throw new Error('Forbidden');
}

function revalidateTaskPages() {
  revalidatePath('/en/admin');
  revalidatePath('/en/admin/tasks');
  revalidatePath('/en/admin/tasks/calendar');
  revalidatePath('/ja/admin');
  revalidatePath('/ja/admin/tasks');
  revalidatePath('/ja/admin/tasks/calendar');
}

// ── Create manual task ────────────────────────────────────────────────────────
export async function createTask(data: {
  title: string;
  description?: string;
  due_date: string;
  due_time?: string;
  urgency: TaskUrgency;
  category: TaskCategory;
  client_id?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    const db = createAdminClient();

    const { error } = await db.from('tasks').insert({
      title: data.title.trim(),
      description: data.description?.trim() || null,
      kind: 'manual',
      due_date: data.due_date,
      due_time: data.due_time || null,
      urgency: data.urgency,
      category: data.category,
      client_id: data.client_id || null,
      status: 'open',
    });

    if (error) return { success: false, error: error.message };

    revalidateTaskPages();
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ── Update task fields ────────────────────────────────────────────────────────
export async function updateTask(
  id: string,
  data: Partial<{
    title: string;
    description: string | null;
    due_date: string;
    due_time: string | null;
    urgency: TaskUrgency;
    category: TaskCategory;
  }>
): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    const db = createAdminClient();

    const { error } = await db
      .from('tasks')
      .update(data)
      .eq('id', id);

    if (error) return { success: false, error: error.message };

    revalidateTaskPages();
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ── Complete task ─────────────────────────────────────────────────────────────
export async function completeTask(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    const db = createAdminClient();

    const { error } = await db
      .from('tasks')
      .update({ status: 'done', completed_at: new Date().toISOString() })
      .eq('id', id);

    if (error) return { success: false, error: error.message };

    revalidateTaskPages();
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ── Dismiss task ──────────────────────────────────────────────────────────────
export async function dismissTask(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    const db = createAdminClient();

    const { error } = await db
      .from('tasks')
      .update({ status: 'dismissed' })
      .eq('id', id);

    if (error) return { success: false, error: error.message };

    revalidateTaskPages();
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ── Reschedule task ───────────────────────────────────────────────────────────
export async function rescheduleTask(
  id: string,
  due_date: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    const db = createAdminClient();

    const { error } = await db
      .from('tasks')
      .update({ due_date })
      .eq('id', id);

    if (error) return { success: false, error: error.message };

    revalidateTaskPages();
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ── Delete task ───────────────────────────────────────────────────────────────
export async function deleteTask(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    const db = createAdminClient();

    const { error } = await db.from('tasks').delete().eq('id', id);

    if (error) return { success: false, error: error.message };

    revalidateTaskPages();
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ── Reopen task ───────────────────────────────────────────────────────────────
export async function reopenTask(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    const db = createAdminClient();

    const { error } = await db
      .from('tasks')
      .update({ status: 'open', completed_at: null })
      .eq('id', id);

    if (error) return { success: false, error: error.message };

    revalidateTaskPages();
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
