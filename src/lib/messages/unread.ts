import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Returns unread message counts per project for a given user.
 * "Unread" = messages created after the user's last_read_at for that project,
 * sent by someone other than the user.
 */
export async function getUnreadCounts(
  supabase: SupabaseClient,
  userId: string,
  projectIds: string[]
): Promise<Record<string, number>> {
  if (projectIds.length === 0) return {};

  // Get last_read_at per project for this user
  const { data: readStatus } = await supabase
    .from('message_read_status')
    .select('project_id, last_read_at')
    .eq('user_id', userId)
    .in('project_id', projectIds);

  const readMap = new Map<string, string>();
  for (const row of readStatus ?? []) {
    readMap.set(row.project_id, row.last_read_at);
  }

  // Fetch messages for all projects sent by others
  const { data: messages } = await supabase
    .from('messages')
    .select('project_id, created_at, sender_id')
    .in('project_id', projectIds)
    .neq('sender_id', userId);

  const counts: Record<string, number> = {};
  for (const msg of messages ?? []) {
    const lastRead = readMap.get(msg.project_id);
    if (!lastRead || msg.created_at > lastRead) {
      counts[msg.project_id] = (counts[msg.project_id] ?? 0) + 1;
    }
  }

  return counts;
}

export function getTotalUnread(counts: Record<string, number>): number {
  return Object.values(counts).reduce((sum, n) => sum + n, 0);
}
