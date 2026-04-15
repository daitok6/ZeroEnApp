'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

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
  // Store callbacks in refs so they don't trigger effect re-runs
  const onInsertRef = useRef(onInsert);
  const onUpdateRef = useRef(onUpdate);
  const onDeleteRef = useRef(onDelete);

  useEffect(() => { onInsertRef.current = onInsert; }, [onInsert]);
  useEffect(() => { onUpdateRef.current = onUpdate; }, [onUpdate]);
  useEffect(() => { onDeleteRef.current = onDelete; }, [onDelete]);

  useEffect(() => {
    const supabase = supabaseRef.current;
    // Suffix generated inside effect so each invocation (including strict-mode
    // double-mount) gets a unique channel name and never collides.
    const suffix = Math.random().toString(36).slice(2, 10);
    const channelName = `${table}-${suffix}-${filter ?? 'all'}`;

    const channel = supabase
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
  }, [table, filter]);
}
