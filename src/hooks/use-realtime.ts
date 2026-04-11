'use client';

import { useEffect, useRef, useId } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface UseRealtimeOptions {
  table: string;
  filter?: string; // e.g. "project_id=eq.abc123"
  onInsert?: (record: Record<string, unknown>) => void;
  onUpdate?: (record: Record<string, unknown>) => void;
  onDelete?: (record: Record<string, unknown>) => void;
}

export function useRealtime({ table, filter, onInsert, onUpdate, onDelete }: UseRealtimeOptions) {
  // Stable supabase client — never recreated between renders
  const supabaseRef = useRef(createClient());
  const uid = useId();
  // Store callbacks in refs so they don't trigger effect re-runs
  const onInsertRef = useRef(onInsert);
  const onUpdateRef = useRef(onUpdate);
  const onDeleteRef = useRef(onDelete);

  useEffect(() => { onInsertRef.current = onInsert; }, [onInsert]);
  useEffect(() => { onUpdateRef.current = onUpdate; }, [onUpdate]);
  useEffect(() => { onDeleteRef.current = onDelete; }, [onDelete]);

  useEffect(() => {
    const supabase = supabaseRef.current;
    // Unique channel name per hook instance prevents strict-mode collisions
    const channelName = `${table}-${uid.replace(/:/g, '')}-${filter ?? 'all'}`;
    let channel: RealtimeChannel;

    channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table, filter },
        (payload) => {
          if (payload.eventType === 'INSERT' && onInsertRef.current) {
            onInsertRef.current(payload.new as Record<string, unknown>);
          }
          if (payload.eventType === 'UPDATE' && onUpdateRef.current) {
            onUpdateRef.current(payload.new as Record<string, unknown>);
          }
          if (payload.eventType === 'DELETE' && onDeleteRef.current) {
            onDeleteRef.current(payload.old as Record<string, unknown>);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // Only re-subscribe if the table/filter change — callbacks are handled via refs
  }, [table, filter, uid]);
}
