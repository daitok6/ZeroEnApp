'use client';

import { useEffect } from 'react';
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
  useEffect(() => {
    const supabase = createClient();
    let channel: RealtimeChannel;

    const setup = () => {
      channel = supabase
        .channel(`${table}-changes`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table,
            filter,
          },
          (payload) => {
            if (payload.eventType === 'INSERT' && onInsert) {
              onInsert(payload.new as Record<string, unknown>);
            }
            if (payload.eventType === 'UPDATE' && onUpdate) {
              onUpdate(payload.new as Record<string, unknown>);
            }
            if (payload.eventType === 'DELETE' && onDelete) {
              onDelete(payload.old as Record<string, unknown>);
            }
          }
        )
        .subscribe();
    };

    setup();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table, filter, onInsert, onUpdate, onDelete]);
}
