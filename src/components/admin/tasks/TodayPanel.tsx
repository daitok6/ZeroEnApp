'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { TaskRow } from './TaskRow';
import { TaskQuickAdd } from './TaskQuickAdd';
import { TaskEditDialog } from './TaskEditDialog';
import type { TaskWithMeta, TaskUrgency } from '@/lib/tasks/types';

interface Props {
  tasks: TaskWithMeta[];
}

const URGENCY_ORDER: TaskUrgency[] = ['critical', 'high', 'normal', 'low'];

const SECTION_LABELS: Record<TaskUrgency, string> = {
  critical: 'Critical',
  high:     'High',
  normal:   'Normal',
  low:      'Low',
};

const SECTION_COLORS: Record<TaskUrgency, string> = {
  critical: '#EF4444',
  high:     '#F59E0B',
  normal:   '#6B7280',
  low:      '#374151',
};

export function TodayPanel({ tasks }: Props) {
  const [collapsed, setCollapsed] = useState<Partial<Record<TaskUrgency, boolean>>>({});
  const [editTask, setEditTask] = useState<TaskWithMeta | null>(null);
  const [rescheduleTask, setRescheduleTask] = useState<TaskWithMeta | null>(null);

  const byUrgency = URGENCY_ORDER.reduce<Record<TaskUrgency, TaskWithMeta[]>>(
    (acc, u) => {
      acc[u] = tasks.filter((t) => t.urgency === u);
      return acc;
    },
    { critical: [], high: [], normal: [], low: [] }
  );

  const hasAny = tasks.length > 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest">
          Today — {tasks.length} open
        </p>
      </div>

      {!hasAny && (
        <p className="text-[#4B5563] text-sm font-mono px-1">No tasks due today.</p>
      )}

      {URGENCY_ORDER.map((urgency) => {
        const group = byUrgency[urgency];
        if (group.length === 0) return null;
        const isCollapsed = collapsed[urgency];
        const color = SECTION_COLORS[urgency];

        return (
          <div key={urgency} className="rounded-md border border-[#1F2937] overflow-hidden">
            <button
              onClick={() => setCollapsed((c) => ({ ...c, [urgency]: !c[urgency] }))}
              className="w-full flex items-center gap-2 px-3 py-2 bg-[#0F1318] hover:bg-[#111827] transition-colors"
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: color }}
              />
              <span className="text-xs font-mono uppercase tracking-widest" style={{ color }}>
                {SECTION_LABELS[urgency]}
              </span>
              <span className="text-[#4B5563] text-xs font-mono ml-1">{group.length}</span>
              <span className="ml-auto text-[#4B5563]">
                {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </span>
            </button>

            {!isCollapsed && (
              <div className="divide-y divide-[#1F2937]">
                {group.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onEdit={setEditTask}
                    onReschedule={setRescheduleTask}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="mt-2">
        <TaskQuickAdd defaultDate={new Date().toISOString().split('T')[0]} />
      </div>

      {editTask && (
        <TaskEditDialog
          task={editTask}
          mode="edit"
          onClose={() => setEditTask(null)}
        />
      )}
      {rescheduleTask && (
        <TaskEditDialog
          task={rescheduleTask}
          mode="reschedule"
          onClose={() => setRescheduleTask(null)}
        />
      )}
    </div>
  );
}
