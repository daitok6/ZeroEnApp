import { createClient } from '@/lib/supabase/server';
import { getUpcomingTasks } from '@/lib/tasks/queries';
import { UpcomingListClient } from '@/components/admin/tasks/UpcomingListClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tasks — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

export default async function TasksPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();
  const tasks = await getUpcomingTasks(supabase);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">Tasks</h1>
          <p className="text-[#6B7280] text-sm font-mono mt-1">
            {tasks.length} open
          </p>
        </div>
        <a
          href={`/${locale}/admin/tasks/calendar`}
          className="text-xs font-mono text-[#00E87A] hover:underline"
        >
          Calendar view →
        </a>
      </div>

      <UpcomingListClient tasks={tasks} />
    </div>
  );
}
