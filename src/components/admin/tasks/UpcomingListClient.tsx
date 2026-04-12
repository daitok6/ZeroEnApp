'use client';

import { useState, useMemo } from 'react';
import { TaskRow } from './TaskRow';
import { TaskQuickAdd } from './TaskQuickAdd';
import { TaskEditDialog } from './TaskEditDialog';
import type { TaskWithMeta, TaskCategory, TaskUrgency } from '@/lib/tasks/types';

interface Props {
  tasks: TaskWithMeta[];
}

type Group = { label: string; dateKey: string; tasks: TaskWithMeta[] };

function groupByDate(tasks: TaskWithMeta[]): Group[] {
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const weekEnd = new Date(today); weekEnd.setDate(today.getDate() + 7);
  const nextWeekEnd = new Date(today); nextWeekEnd.setDate(today.getDate() + 14);

  const toDate = (s: string) => new Date(s + 'T00:00:00');
  const fmt = (d: Date) => d.toISOString().split('T')[0];

  const buckets: Record<string, { label: string; tasks: TaskWithMeta[] }> = {
    today:     { label: 'Today',     tasks: [] },
    tomorrow:  { label: 'Tomorrow',  tasks: [] },
    this_week: { label: 'This week', tasks: [] },
    next_week: { label: 'Next week', tasks: [] },
    later:     { label: 'Later',     tasks: [] },
  };

  for (const task of tasks) {
    const d = toDate(task.due_date);
    if (task.due_date === fmt(today)) buckets.today.tasks.push(task);
    else if (task.due_date === fmt(tomorrow)) buckets.tomorrow.tasks.push(task);
    else if (d <= weekEnd) buckets.this_week.tasks.push(task);
    else if (d <= nextWeekEnd) buckets.next_week.tasks.push(task);
    else buckets.later.tasks.push(task);
  }

  return Object.entries(buckets)
    .filter(([, v]) => v.tasks.length > 0)
    .map(([k, v]) => ({ label: v.label, dateKey: k, tasks: v.tasks }));
}

export function UpcomingListClient({ tasks }: Props) {
  const [editTask, setEditTask] = useState<TaskWithMeta | null>(null);
  const [rescheduleTask, setRescheduleTask] = useState<TaskWithMeta | null>(null);
  const [filterCategory, setFilterCategory] = useState<TaskCategory | 'all'>('all');
  const [filterUrgency, setFilterUrgency] = useState<TaskUrgency | 'all'>('all');
  const [showDone, setShowDone] = useState(false);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (!showDone && t.status !== 'open') return false;
      if (filterCategory !== 'all' && t.category !== filterCategory) return false;
      if (filterUrgency !== 'all' && t.urgency !== filterUrgency) return false;
      return true;
    });
  }, [tasks, filterCategory, filterUrgency, showDone]);

  const groups = useMemo(() => groupByDate(filtered), [filtered]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as TaskCategory | 'all')}
          className="bg-[#111827] border border-[#374151] rounded px-2 py-1 text-[#9CA3AF] text-xs font-mono outline-none focus:border-[#00E87A]"
        >
          <option value="all">All categories</option>
          <option value="client_ops">Client Ops</option>
          <option value="billing">Billing</option>
          <option value="marketing">Marketing</option>
          <option value="content">Content</option>
          <option value="admin">Admin</option>
          <option value="personal">Personal</option>
        </select>
        <select
          value={filterUrgency}
          onChange={(e) => setFilterUrgency(e.target.value as TaskUrgency | 'all')}
          className="bg-[#111827] border border-[#374151] rounded px-2 py-1 text-[#9CA3AF] text-xs font-mono outline-none focus:border-[#00E87A]"
        >
          <option value="all">All urgency</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>
        <label className="flex items-center gap-1.5 text-xs font-mono text-[#6B7280] cursor-pointer">
          <input
            type="checkbox"
            checked={showDone}
            onChange={(e) => setShowDone(e.target.checked)}
            className="accent-[#00E87A]"
          />
          Show completed
        </label>
      </div>

      {/* Quick add */}
      <TaskQuickAdd />

      {/* Grouped list */}
      {groups.length === 0 ? (
        <p className="text-[#4B5563] text-sm font-mono">No tasks match the current filters.</p>
      ) : (
        groups.map((group) => (
          <div key={group.dateKey}>
            <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-1.5">
              {group.label}
            </p>
            <div className="border border-[#1F2937] rounded-md divide-y divide-[#1F2937] overflow-hidden">
              {group.tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onEdit={setEditTask}
                  onReschedule={setRescheduleTask}
                />
              ))}
            </div>
          </div>
        ))
      )}

      {editTask && (
        <TaskEditDialog task={editTask} mode="edit" onClose={() => setEditTask(null)} />
      )}
      {rescheduleTask && (
        <TaskEditDialog task={rescheduleTask} mode="reschedule" onClose={() => setRescheduleTask(null)} />
      )}
    </div>
  );
}
