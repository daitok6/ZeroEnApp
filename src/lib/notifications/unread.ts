import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Returns the total unread (not read, not dismissed) notification count for a user.
 */
export async function getUnreadNotificationCount(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const { count } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .is('read_at', null)
    .is('dismissed_at', null);

  return count ?? 0;
}
