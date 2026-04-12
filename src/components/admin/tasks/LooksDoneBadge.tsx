export function LooksDoneBadge() {
  return (
    <span
      title="Underlying state resolved — looks done"
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wide whitespace-nowrap"
      style={{ background: '#00E87A22', color: '#00E87A', border: '1px solid #00E87A44' }}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00E87A]" />
      looks done
    </span>
  );
}
