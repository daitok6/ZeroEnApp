import { useTranslations } from 'next-intl';
import { Database } from '@/types/database';
import { CheckCircle, Circle, Clock } from 'lucide-react';

type Milestone = Database['public']['Tables']['milestones']['Row'];

interface MilestoneTrackerProps {
  milestones: Milestone[];
  locale: string;
}

const STATUS_ICONS = {
  completed: CheckCircle,
  in_progress: Clock,
  pending: Circle,
};

const STATUS_COLORS = {
  completed: 'text-[#00E87A]',
  in_progress: 'text-blue-400',
  pending: 'text-[#6B7280]',
};

export function MilestoneTracker({ milestones, locale }: MilestoneTrackerProps) {
  const t = useTranslations('dashboard.milestones');

  const completed = milestones.filter((m) => m.status === 'completed').length;
  const total = milestones.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="border border-[#374151] rounded-lg p-6 bg-[#111827]">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[#00E87A] text-xs font-mono uppercase tracking-widest">
          {t('title')}
        </p>
        <span className="text-[#9CA3AF] text-xs font-mono">
          {completed}/{total}
        </span>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="h-1.5 bg-[#374151] rounded-full mb-5 overflow-hidden">
          <div
            className="h-full bg-[#00E87A] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {milestones.length === 0 ? (
        <p className="text-[#6B7280] text-sm font-mono">
          {t('empty')}
        </p>
      ) : (
        <div className="space-y-3">
          {milestones
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((milestone) => {
              const status = milestone.status as keyof typeof STATUS_ICONS;
              const Icon = STATUS_ICONS[status] ?? Circle;
              const color = STATUS_COLORS[status] ?? 'text-[#6B7280]';
              const label =
                status === 'completed' ? t('done') :
                status === 'in_progress' ? t('inProgress') :
                t('pending');

              return (
                <div key={milestone.id} className="flex items-start gap-3">
                  <Icon size={16} className={`shrink-0 mt-0.5 ${color}`} />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-mono ${
                        milestone.status === 'completed'
                          ? 'text-[#6B7280] line-through'
                          : 'text-[#F4F4F2]'
                      }`}
                    >
                      {milestone.title}
                    </p>
                    {milestone.due_date && milestone.status !== 'completed' && (
                      <p className="text-[#6B7280] text-xs font-mono mt-0.5">
                        {t('due')}{' '}
                        {new Date(milestone.due_date).toLocaleDateString(
                          locale === 'ja' ? 'ja-JP' : 'en-US'
                        )}
                      </p>
                    )}
                  </div>
                  <span className={`shrink-0 text-xs font-mono ${color}`}>
                    {label}
                  </span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
