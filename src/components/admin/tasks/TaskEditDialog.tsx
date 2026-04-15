'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { updateTask, rescheduleTask } from '@/lib/tasks/actions';
import type { TaskWithMeta, TaskCategory, TaskUrgency } from '@/lib/tasks/types';

interface Props {
  task: TaskWithMeta;
  mode: 'edit' | 'reschedule';
  onClose: () => void;
}

export function TaskEditDialog({ task, mode, onClose }: Props) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [date, setDate] = useState(task.due_date);
  const [urgency, setUrgency] = useState<TaskUrgency>(task.urgency);
  const [category, setCategory] = useState<TaskCategory>(task.category);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = mode === 'reschedule'
        ? await rescheduleTask(task.id, date)
        : await updateTask(task.id, { title, description: description || null, due_date: date, urgency, category });

      if (result.success) {
        router.refresh();
        onClose();
      }
    });
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="bg-[#111827] border-[#374151] text-[#F4F4F2] max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono text-[#F4F4F2]">
            {mode === 'reschedule' ? 'Reschedule task' : 'Edit task'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-3 mt-2">
          {mode === 'edit' && (
            <>
              <div>
                <label className="text-[#6B7280] text-xs font-mono uppercase tracking-wider block mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#374151] rounded px-3 py-2 text-sm font-mono text-[#F4F4F2] outline-none focus:border-[#00E87A]"
                  required
                />
              </div>
              <div>
                <label className="text-[#6B7280] text-xs font-mono uppercase tracking-wider block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-[#0D0D0D] border border-[#374151] rounded px-3 py-2 text-sm font-mono text-[#F4F4F2] outline-none focus:border-[#00E87A] resize-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-[#6B7280] text-xs font-mono uppercase tracking-wider block mb-1">Due date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-[#374151] rounded px-3 py-2 text-sm font-mono text-[#F4F4F2] outline-none focus:border-[#00E87A]"
              required
            />
          </div>

          {mode === 'edit' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#6B7280] text-xs font-mono uppercase tracking-wider block mb-1">Urgency</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as TaskUrgency)}
                  className="w-full bg-[#0D0D0D] border border-[#374151] rounded px-3 py-2 text-sm font-mono text-[#F4F4F2] outline-none focus:border-[#00E87A]"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="text-[#6B7280] text-xs font-mono uppercase tracking-wider block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="w-full bg-[#0D0D0D] border border-[#374151] rounded px-3 py-2 text-sm font-mono text-[#F4F4F2] outline-none focus:border-[#00E87A]"
                >
                  <option value="admin">Admin</option>
                  <option value="client_ops">Client Ops</option>
                  <option value="billing">Billing</option>
                  <option value="marketing">Marketing</option>
                  <option value="content">Content</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm font-mono text-[#6B7280] hover:text-[#9CA3AF]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-3 py-1.5 text-sm font-mono bg-[#00E87A] text-[#0D0D0D] font-bold rounded disabled:opacity-40"
            >
              {isPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
