'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

interface NotificationsBadgeProps {
  /** Initial unread count from SSR */
  initialCount: number;
  userId: string;
}

/**
 * Real-time unread badge for the Notifications nav item.
 * Subscribes to INSERT on the notifications table filtered by user_id.
 * Zeroes when 'zeroen:notifications-read' CustomEvent fires.
 */
export function NotificationsBadge({ initialCount, userId }: NotificationsBadgeProps) {
  const [count, setCount] = useState(initialCount);
  const supabaseRef = useRef(createClient());

  // Re-fetch on mount to bypass stale SSR layout counts
  useEffect(() => {
    const supabase = supabaseRef.current;
    supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .is('read_at', null)
      .is('dismissed_at', null)
      .then(({ count: fresh }) => {
        if (fresh !== null) setCount(fresh);
      });
  }, [userId]);

  // Subscribe to new notifications for this user
  useEffect(() => {
    const supabase = supabaseRef.current;
    const suffix = Math.random().toString(36).slice(2, 10);

    const channel = supabase
      .channel(`notifications-${userId}-${suffix}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          setCount((n) => n + 1);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  // Zero out when user visits the notifications page
  useEffect(() => {
    const handler = () => setCount(0);
    window.addEventListener('zeroen:notifications-read', handler);
    return () => window.removeEventListener('zeroen:notifications-read', handler);
  }, []);

  if (count === 0) return null;

  return (
    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#00E87A] text-[#0D0D0D] text-[10px] font-bold font-mono leading-none">
      {count > 99 ? '99+' : count}
    </span>
  );
}
