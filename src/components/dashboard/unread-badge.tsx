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

  // Sync if server re-renders with different initial values
  useEffect(() => {
    setCounts(initialCounts);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectKey]);

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
