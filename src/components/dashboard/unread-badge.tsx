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
 * - Increments when new messages arrive from other senders.
 * - Decrements to 0 for a project when a 'zeroen:message-read' CustomEvent fires.
 */
export function UnreadBadge({ initialCounts, projectIds, userId }: UnreadBadgeProps) {
  const [counts, setCounts] = useState<Record<string, number>>(initialCounts);
  const supabaseRef = useRef(createClient());

  // Sync if server re-renders with new initial values
  useEffect(() => {
    setCounts(initialCounts);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialCounts)]);

  // Increment on incoming messages from other senders
  useEffect(() => {
    if (projectIds.length === 0) return;
    const supabase = supabaseRef.current;
    const suffix = Math.random().toString(36).slice(2, 10);
    const channelName = `unread-badge-${suffix}`;

    const filter = projectIds.length === 1
      ? `project_id=eq.${projectIds[0]}`
      : undefined;

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        ...(filter ? { filter } : {}),
      }, (payload) => {
        const msg = payload.new as { sender_id: string; project_id: string };
        if (msg.sender_id !== userId && projectIds.includes(msg.project_id)) {
          setCounts((prev) => ({
            ...prev,
            [msg.project_id]: (prev[msg.project_id] ?? 0) + 1,
          }));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [projectIds, userId]);

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
