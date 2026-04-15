'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Check } from 'lucide-react';
import { CategoryPill } from './CategoryPill';
import { UrgencyBadge } from './UrgencyBadge';
import { LooksDoneBadge } from './LooksDoneBadge';
import { completeTask, dismissTask, deleteTask } from '@/lib/tasks/actions';
import type { TaskWithMeta } from '@/lib/tasks/types';

interface Props {
  task: TaskWithMeta;
  onEdit?: (task: TaskWithMeta) => void;
  onReschedule?: (task: TaskWithMeta) => void;
}

export function TaskRow({ task, onEdit, onReschedule }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function act(fn: () => Promise<{ success: boolean; error?: string }>) {
    startTransition(async () => {
      const result = await fn();
      if (!result.success) console.error('[TaskRow]', result.error);
      router.refresh();
      setMenuOpen(false);
    });
  }

  const urgencyBorder =
    task.urgency === 'critical'
      ? 'border-l-2 border-l-[#EF4444]'
      : task.urgency === 'high'
      ? 'border-l-2 border-l-[#F59E0B]'
      : 'border-l-2 border-l-transparent';

  return (
    <div
      className={`relative flex items-start gap-3 px-3 py-2.5 rounded-md hover:bg-[#111827] transition-colors group ${urgencyBorder} ${isPending ? 'opacity-50' : ''}`}
    >
      {/* Checkbox */}
      <button
        onClick={() => act(() => completeTask(task.id))}
        disabled={isPending}
        className="mt-0.5 shrink-0 w-4 h-4 rounded border border-[#374151] flex items-center justify-center hover:border-[#00E87A] transition-colors"
        aria-label="Mark done"
      >
        <Check size={10} className="text-[#00E87A] opacity-0 group-hover:opacity-60" />
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
          <span className="text-[#F4F4F2] text-sm font-mono truncate">{task.title}</span>
          <CategoryPill category={task.category} />
          <UrgencyBadge urgency={task.urgency} />
          {task.looks_done && <LooksDoneBadge />}
        </div>
        {task.client_name && (
          <p className="text-[#4B5563] text-xs font-mono mt-0.5 truncate">{task.client_name}</p>
        )}
      </div>

      {/* Overflow menu */}
      <div className="relative shrink-0">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="p-1 rounded text-[#4B5563] hover:text-[#9CA3AF] hover:bg-[#1F2937] transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Task options"
        >
          <MoreHorizontal size={14} />
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-6 z-20 w-36 rounded-md border border-[#374151] bg-[#111827] shadow-lg py-1 text-xs font-mono">
              {onEdit && (
                <button
                  onClick={() => { onEdit(task); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#F4F4F2]"
                >
                  Edit
                </button>
              )}
              {onReschedule && (
                <button
                  onClick={() => { onReschedule(task); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#F4F4F2]"
                >
                  Reschedule
                </button>
              )}
              {task.looks_done && (
                <button
                  onClick={() => act(() => dismissTask(task.id))}
                  className="w-full text-left px-3 py-1.5 text-[#00E87A] hover:bg-[#1F2937]"
                >
                  Dismiss (done)
                </button>
              )}
              <button
                onClick={() => act(() => dismissTask(task.id))}
                className="w-full text-left px-3 py-1.5 text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#F4F4F2]"
              >
                Dismiss
              </button>
              <div className="border-t border-[#1F2937] my-1" />
              <button
                onClick={() => act(() => deleteTask(task.id))}
                className="w-full text-left px-3 py-1.5 text-[#EF4444] hover:bg-[#1F2937]"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
