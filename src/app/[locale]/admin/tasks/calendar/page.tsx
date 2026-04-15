import { createClient } from '@/lib/supabase/server';
import { getCalendarTasks } from '@/lib/tasks/queries';
import { CalendarClient } from '@/components/admin/tasks/CalendarClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calendar — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ month?: string }>;
};

export default async function CalendarPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { month: rawMonth } = await searchParams;

  // Default to current month; validate YYYY-MM format
  const currentMonth = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  })();

  const month = /^\d{4}-\d{2}$/.test(rawMonth ?? '') ? rawMonth! : currentMonth;

  const supabase = await createClient();
  const tasks = await getCalendarTasks(supabase, month);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">Calendar</h1>
          <p className="text-[#6B7280] text-sm font-mono mt-1">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} this month
          </p>
        </div>
        <a
          href={`/${locale}/admin/tasks`}
          className="text-xs font-mono text-[#00E87A] hover:underline"
        >
          ← List view
        </a>
      </div>

      <CalendarClient tasks={tasks} month={month} locale={locale} />
    </div>
  );
}
