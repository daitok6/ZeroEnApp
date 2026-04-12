import { URGENCY_COLORS, URGENCY_LABELS, type TaskUrgency } from '@/lib/tasks/types';

export function UrgencyBadge({ urgency }: { urgency: TaskUrgency }) {
  const color = URGENCY_COLORS[urgency];
  if (urgency === 'normal' || urgency === 'low') return null; // only render for high/critical
  return (
    <span
      style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
      className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wide whitespace-nowrap"
    >
      {URGENCY_LABELS[urgency]}
    </span>
  );
}
