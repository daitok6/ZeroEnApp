import type { SupabaseClient } from '@supabase/supabase-js';

export async function markConversationRead(
  supabase: SupabaseClient,
  userId: string,
  projectId: string
): Promise<void> {
  await supabase.from('message_read_status').upsert(
    { user_id: userId, project_id: projectId, last_read_at: new Date().toISOString() },
    { onConflict: 'user_id,project_id' }
  );
}
