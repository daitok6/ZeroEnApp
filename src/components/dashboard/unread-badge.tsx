'use client';

import { useState, useEffect, useRef, useId } from 'react';
import { createClient } from '@/lib/supabase/client';

interface UnreadBadgeProps {
  initialCount: number;
  projectIds: string[];
  userId: string;
  /** If provided, only count messages in this specific project */
  filterProjectId?: string;
}

/**
 * Real-time unread message count badge.
 * Increments when new messages arrive from other senders.
 * Place next to nav items to show pending messages.
 */
export function UnreadBadge({ initialCount, projectIds, userId, filterProjectId }: UnreadBadgeProps) {
  const [count, setCount] = useState(initialCount);
  const supabaseRef = useRef(createClient());
  const uid = useId();

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    if (projectIds.length === 0) return;
    const supabase = supabaseRef.current;
    const channelName = `unread-badge-${uid.replace(/:/g, '')}`;

    const filter = filterProjectId
      ? `project_id=eq.${filterProjectId}`
      : projectIds.length === 1
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
        // Only count messages from others, in the watched projects
        if (msg.sender_id !== userId && projectIds.includes(msg.project_id)) {
          setCount((prev) => prev + 1);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [projectIds, userId, filterProjectId, uid]);

  if (count === 0) return null;

  return (
    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#00E87A] text-[#0D0D0D] text-[10px] font-bold font-mono leading-none">
      {count > 99 ? '99+' : count}
    </span>
  );
}
