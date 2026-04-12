'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { TaskQuickAdd } from './TaskQuickAdd';
import { TaskRow } from './TaskRow';
import { TaskEditDialog } from './TaskEditDialog';
import { CATEGORY_COLORS } from '@/lib/tasks/types';
import type { TaskWithMeta } from '@/lib/tasks/types';

interface Props {
  tasks: TaskWithMeta[];
  month: string; // YYYY-MM
  locale: string;
}

export function CalendarClient({ tasks, month, locale }: Props) {
  const [sheetDate, setSheetDate] = useState<string | null>(null);
  const [editTask, setEditTask] = useState<TaskWithMeta | null>(null);
  const [rescheduleTask, setRescheduleTask] = useState<TaskWithMeta | null>(null);
  const router = useRouter();

  const [year, mon] = month.split('-').map(Number);
  const today = new Date().toISOString().split('T')[0];

  // Calendar grid
  const firstDay = new Date(year, mon - 1, 1);
  const lastDay = new Date(year, mon, 0);
  const startDow = firstDay.getDay(); // 0 = Sun
  const totalDays = lastDay.getDate();

  // Group tasks by date
  const tasksByDate = new Map<string, TaskWithMeta[]>();
  for (const task of tasks) {
    const existing = tasksByDate.get(task.due_date) ?? [];
    existing.push(task);
    tasksByDate.set(task.due_date, existing);
  }

  function navigate(delta: number) {
    const d = new Date(year, mon - 1 + delta, 1);
    const newMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    router.push(`/${locale}/admin/tasks/calendar?month=${newMonth}`);
  }

  function jumpToToday() {
    const d = new Date();
    const newMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    router.push(`/${locale}/admin/tasks/calendar?month=${newMonth}`);
  }

  const monthLabel = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const sheetTasks = sheetDate ? (tasksByDate.get(sheetDate) ?? []) : [];
  const sheetLabel = sheetDate
    ? new Date(sheetDate + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric',
      })
    : '';

  return (
    <div>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded text-[#6B7280] hover:text-[#F4F4F2] hover:bg-[#1F2937] transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <h2 className="text-[#F4F4F2] text-base font-mono font-bold w-44 text-center">
            {monthLabel}
          </h2>
          <button
            onClick={() => navigate(1)}
            className="p-1.5 rounded text-[#6B7280] hover:text-[#F4F4F2] hover:bg-[#1F2937] transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <button
          onClick={jumpToToday}
          className="text-xs font-mono text-[#00E87A] hover:underline"
        >
          Today
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="text-center text-[#4B5563] text-[10px] font-mono uppercase tracking-wider py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-[#1F2937] rounded-lg overflow-hidden border border-[#1F2937]">
        {/* Empty cells before month start */}
        {Array.from({ length: startDow }).map((_, i) => (
          <div key={`pre-${i}`} className="bg-[#0D0D0D] min-h-[72px] md:min-h-[88px]" />
        ))}

        {/* Day cells */}
        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(mon).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayTasks = tasksByDate.get(dateStr) ?? [];
          const isToday = dateStr === today;
          const hasCritical = dayTasks.some((t) => t.urgency === 'critical');
          const visible = dayTasks.slice(0, 3);
          const overflow = dayTasks.length - visible.length;

          return (
            <button
              key={dateStr}
              onClick={() => setSheetDate(dateStr)}
              className={`bg-[#0D0D0D] min-h-[72px] md:min-h-[88px] p-1.5 text-left hover:bg-[#111827] transition-colors group relative`}
            >
              {/* Day number */}
              <div className="flex items-center gap-1 mb-1">
                <span
                  className={`text-xs font-mono w-5 h-5 flex items-center justify-center rounded-full ${
                    isToday
                      ? 'bg-[#00E87A] text-[#0D0D0D] font-bold'
                      : 'text-[#6B7280]'
                  }`}
                >
                  {day}
                </span>
                {hasCritical && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] shrink-0" />
                )}
              </div>

              {/* Task chips */}
              <div className="space-y-0.5">
                {visible.map((t) => (
                  <div
                    key={t.id}
                    className="truncate text-[10px] font-mono rounded px-1 py-px"
                    style={{
                      background: `${CATEGORY_COLORS[t.category]}22`,
                      color: CATEGORY_COLORS[t.category],
                    }}
                  >
                    {t.title}
                  </div>
                ))}
                {overflow > 0 && (
                  <div className="text-[#4B5563] text-[10px] font-mono px-1">
                    +{overflow} more
                  </div>
                )}
              </div>
            </button>
          );
        })}

        {/* Trailing empty cells to complete last row */}
        {(() => {
          const filledCells = startDow + totalDays;
          const trailing = (7 - (filledCells % 7)) % 7;
          return Array.from({ length: trailing }).map((_, i) => (
            <div key={`post-${i}`} className="bg-[#0D0D0D] min-h-[72px] md:min-h-[88px]" />
          ));
        })()}
      </div>

      {/* Day detail sheet */}
      <Sheet open={!!sheetDate} onOpenChange={(open) => { if (!open) setSheetDate(null); }}>
        <SheetContent
          side="right"
          className="bg-[#111827] border-[#374151] text-[#F4F4F2] w-full sm:max-w-md overflow-y-auto"
        >
          <SheetHeader className="mb-4">
            <SheetTitle className="font-mono text-[#F4F4F2] text-base">{sheetLabel}</SheetTitle>
          </SheetHeader>

          <div className="space-y-1">
            {sheetTasks.length === 0 ? (
              <p className="text-[#4B5563] text-sm font-mono">No tasks on this day.</p>
            ) : (
              sheetTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onEdit={setEditTask}
                  onReschedule={setRescheduleTask}
                />
              ))
            )}
          </div>

          <div className="mt-4">
            <TaskQuickAdd defaultDate={sheetDate ?? undefined} />
          </div>
        </SheetContent>
      </Sheet>

      {editTask && (
        <TaskEditDialog task={editTask} mode="edit" onClose={() => setEditTask(null)} />
      )}
      {rescheduleTask && (
        <TaskEditDialog task={rescheduleTask} mode="reschedule" onClose={() => setRescheduleTask(null)} />
      )}
    </div>
  );
}
