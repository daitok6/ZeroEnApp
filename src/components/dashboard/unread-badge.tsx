'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

interface UnreadBadgeProps {
  /** Per-project initial unread counts from server */
  initialCounts: Record<string, number>;
  /** All project IDs this badge should track */
  projectIds: string[];
  userId: string;
}

/**
 * Real-time unread message count badge.
 * - Fetches fresh counts on mount (server layout may be cached/stale).
 * - One Supabase channel per project with a project_id filter (reliable with RLS).
 * - Increments when new messages arrive from other senders.
 * - Decrements to 0 for a project when 'zeroen:message-read' CustomEvent fires.
 */
export function UnreadBadge({ initialCounts, projectIds, userId }: UnreadBadgeProps) {
  const [counts, setCounts] = useState<Record<string, number>>(initialCounts);
  const supabaseRef = useRef(createClient());
  // Stable string key so the effect doesn't re-run if the array reference changes
  // but the values haven't actually changed.
  const projectKey = projectIds.join(',');

  // Re-fetch on mount so stale router-cached layouts don't show a wrong count.
  useEffect(() => {
    if (projectIds.length === 0) return;
    const supabase = supabaseRef.current;

    async function fetchCounts() {
      const { data: readStatus } = await supabase
        .from('message_read_status')
        .select('project_id, last_read_at')
        .eq('user_id', userId)
        .in('project_id', projectIds);

      const readMap = new Map<string, string>();
      for (const row of readStatus ?? []) {
        readMap.set(row.project_id, row.last_read_at);
      }

      const { data: messages } = await supabase
        .from('messages')
        .select('project_id, created_at, sender_id')
        .in('project_id', projectIds)
        .neq('sender_id', userId);

      const fresh: Record<string, number> = {};
      for (const msg of messages ?? []) {
        const lastRead = readMap.get(msg.project_id);
        if (!lastRead || msg.created_at > lastRead) {
          fresh[msg.project_id] = (fresh[msg.project_id] ?? 0) + 1;
        }
      }
      setCounts(fresh);
    }

    fetchCounts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectKey, userId]);

  // One subscription per project with an explicit filter — avoids the no-filter
  // RLS evaluation issues with postgres_changes.
  useEffect(() => {
    if (projectIds.length === 0) return;
    const supabase = supabaseRef.current;
    const suffix = Math.random().toString(36).slice(2, 10);

    const channels = projectIds.map((projectId) =>
      supabase
        .channel(`unread-${projectId}-${suffix}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `project_id=eq.${projectId}`,
        }, (payload) => {
          const msg = payload.new as { sender_id: string };
          if (msg.sender_id !== userId) {
            setCounts((prev) => ({
              ...prev,
              [projectId]: (prev[projectId] ?? 0) + 1,
            }));
          }
        })
        .subscribe()
    );

    return () => { channels.forEach((ch) => supabase.removeChannel(ch)); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectKey, userId]);

  // Zero out a project's count when the user opens that conversation
  useEffect(() => {
    const handler = (e: Event) => {
      const { projectId } = (e as CustomEvent<{ projectId: string }>).detail;
      setCounts((prev) => ({ ...prev, [projectId]: 0 }));
    };
    window.addEventListener('zeroen:message-read', handler);
    return () => window.removeEventListener('zeroen:message-read', handler);
  }, []);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  return (
    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#00E87A] text-[#0D0D0D] text-[10px] font-bold font-mono leading-none">
      {total > 99 ? '99+' : total}
    </span>
  );
}
