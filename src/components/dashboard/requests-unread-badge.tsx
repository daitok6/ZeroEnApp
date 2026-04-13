'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

interface RequestsUnreadBadgeProps {
  /** Per-request initial unread counts from SSR */
  initialByRequest: Record<string, number>;
  /** All request IDs this user can see */
  requestIds: string[];
  userId: string;
}

/**
 * Real-time unread activity badge for Change Requests nav item.
 * Mirrors UnreadBadge (messages) but tracks request_comments, invoices,
 * and change_requests activity instead of messages.
 *
 * - Re-fetches on mount to bypass stale router-cached layout counts.
 * - Subscribes to INSERT on request_comments and UPDATE on invoices + change_requests.
 * - Zeros out the specific request's contribution when 'zeroen:request-read' CustomEvent
 *   fires with { requestId }, fixing the one-at-a-time decrement bug.
 */
export function RequestsUnreadBadge({ initialByRequest, requestIds, userId }: RequestsUnreadBadgeProps) {
  const [byRequest, setByRequest] = useState<Record<string, number>>(initialByRequest);
  const supabaseRef = useRef(createClient());
  const requestKey = requestIds.join(',');

  // Re-fetch on mount so stale SSR counts don't linger
  useEffect(() => {
    if (requestIds.length === 0) return;
    const supabase = supabaseRef.current;

    async function fetchCounts() {
      const { data: readRows } = await supabase
        .from('request_read_status')
        .select('change_request_id, last_read_at')
        .eq('user_id', userId)
        .in('change_request_id', requestIds);

      const readMap = new Map<string, string>();
      for (const row of readRows ?? []) {
        readMap.set(row.change_request_id, row.last_read_at);
      }

      const fresh: Record<string, number> = {};

      const { data: comments } = await supabase
        .from('request_comments')
        .select('change_request_id, created_at')
        .in('change_request_id', requestIds)
        .neq('author_id', userId);

      for (const c of comments ?? []) {
        if (!c.change_request_id) continue;
        const lastRead = readMap.get(c.change_request_id);
        if (!lastRead || c.created_at > lastRead) {
          fresh[c.change_request_id] = (fresh[c.change_request_id] ?? 0) + 1;
        }
      }

      const { data: invoices } = await supabase
        .from('invoices')
        .select('change_request_id, updated_at')
        .in('change_request_id', requestIds);

      for (const inv of invoices ?? []) {
        if (!inv.change_request_id || !inv.updated_at) continue;
        const lastRead = readMap.get(inv.change_request_id);
        if (!lastRead || inv.updated_at > lastRead) {
          fresh[inv.change_request_id] = (fresh[inv.change_request_id] ?? 0) + 1;
        }
      }

      setByRequest(fresh);
    }

    fetchCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey, userId]);

  // Realtime subscriptions — one channel for comments, one for invoices, one for CR updates
  useEffect(() => {
    if (requestIds.length === 0) return;
    const supabase = supabaseRef.current;
    const suffix = Math.random().toString(36).slice(2, 10);

    const commentChannel = supabase
      .channel(`req-comments-${suffix}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'request_comments' }, (payload) => {
        const row = payload.new as { author_id: string; change_request_id: string };
        if (row.author_id !== userId && requestIds.includes(row.change_request_id)) {
          setByRequest((prev) => ({
            ...prev,
            [row.change_request_id]: (prev[row.change_request_id] ?? 0) + 1,
          }));
        }
      })
      .subscribe();

    const invoiceChannel = supabase
      .channel(`req-invoices-${suffix}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'invoices' }, (payload) => {
        const row = payload.new as { change_request_id: string | null };
        if (row.change_request_id && requestIds.includes(row.change_request_id)) {
          setByRequest((prev) => ({
            ...prev,
            [row.change_request_id!]: (prev[row.change_request_id!] ?? 0) + 1,
          }));
        }
      })
      .subscribe();

    const crChannel = supabase
      .channel(`req-cr-${suffix}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'change_requests' }, (payload) => {
        const row = payload.new as { id: string };
        if (requestIds.includes(row.id)) {
          setByRequest((prev) => ({
            ...prev,
            [row.id]: (prev[row.id] ?? 0) + 1,
          }));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(commentChannel);
      supabase.removeChannel(invoiceChannel);
      supabase.removeChannel(crChannel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey, userId]);

  // Zero out the specific request's contribution when user opens it
  useEffect(() => {
    const handler = (e: Event) => {
      const { requestId } = (e as CustomEvent<{ requestId: string }>).detail;
      setByRequest((prev) => ({ ...prev, [requestId]: 0 }));
    };
    window.addEventListener('zeroen:request-read', handler);
    return () => window.removeEventListener('zeroen:request-read', handler);
  }, []);

  const total = Object.values(byRequest).reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  return (
    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#00E87A] text-[#0D0D0D] text-[10px] font-bold font-mono leading-none">
      {total > 99 ? '99+' : total}
    </span>
  );
}
