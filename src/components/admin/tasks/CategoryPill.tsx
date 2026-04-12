import { CATEGORY_COLORS, CATEGORY_LABELS, type TaskCategory } from '@/lib/tasks/types';

export function CategoryPill({ category }: { category: TaskCategory }) {
  const color = CATEGORY_COLORS[category];
  return (
    <span
      style={{
        background: `${color}22`,
        color,
        border: `1px solid ${color}44`,
      }}
      className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wide whitespace-nowrap"
    >
      {CATEGORY_LABELS[category]}
    </span>
  );
}
