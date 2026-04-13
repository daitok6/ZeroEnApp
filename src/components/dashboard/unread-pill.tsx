interface UnreadPillProps {
  count: number;
}

/**
 * Small green count pill — consistent with the nav UnreadBadge style.
 * Renders nothing when count is 0.
 */
export function UnreadPill({ count }: UnreadPillProps) {
  if (count <= 0) return null;
  return (
    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#00E87A] text-[#0D0D0D] text-[10px] font-bold font-mono leading-none">
      {count > 99 ? '99+' : count}
    </span>
  );
}
