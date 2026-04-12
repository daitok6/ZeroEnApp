'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { createTask } from '@/lib/tasks/actions';
import type { TaskCategory, TaskUrgency } from '@/lib/tasks/types';

interface Props {
  defaultDate?: string; // YYYY-MM-DD
}

export function TaskQuickAdd({ defaultDate }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(defaultDate ?? new Date().toISOString().split('T')[0]);
  const [urgency, setUrgency] = useState<TaskUrgency>('normal');
  const [category, setCategory] = useState<TaskCategory>('admin');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    startTransition(async () => {
      const result = await createTask({ title, due_date: date, urgency, category });
      if (result.success) {
        setTitle('');
        setOpen(false);
        router.refresh();
      }
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-[#4B5563] hover:text-[#9CA3AF] hover:bg-[#111827] transition-colors text-sm font-mono"
      >
        <Plus size={14} />
        Add task
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="border border-[#374151] rounded-md p-3 bg-[#111827] space-y-2">
      <input
        autoFocus
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title..."
        className="w-full bg-transparent text-[#F4F4F2] text-sm font-mono placeholder-[#4B5563] outline-none"
      />
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-[#0D0D0D] border border-[#374151] rounded px-2 py-1 text-[#9CA3AF] text-xs font-mono outline-none focus:border-[#00E87A]"
        />
        <select
          value={urgency}
          onChange={(e) => setUrgency(e.target.value as TaskUrgency)}
          className="bg-[#0D0D0D] border border-[#374151] rounded px-2 py-1 text-[#9CA3AF] text-xs font-mono outline-none focus:border-[#00E87A]"
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as TaskCategory)}
          className="bg-[#0D0D0D] border border-[#374151] rounded px-2 py-1 text-[#9CA3AF] text-xs font-mono outline-none focus:border-[#00E87A]"
        >
          <option value="admin">Admin</option>
          <option value="client_ops">Client Ops</option>
          <option value="billing">Billing</option>
          <option value="marketing">Marketing</option>
          <option value="content">Content</option>
          <option value="personal">Personal</option>
        </select>
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-2.5 py-1 text-xs font-mono text-[#6B7280] hover:text-[#9CA3AF]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending || !title.trim()}
            className="px-2.5 py-1 text-xs font-mono bg-[#00E87A] text-[#0D0D0D] font-bold rounded disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </div>
    </form>
  );
}
