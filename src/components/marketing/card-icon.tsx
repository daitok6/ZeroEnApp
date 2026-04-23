import type { LucideIcon } from 'lucide-react';

export function CardIcon({ Icon }: { Icon: LucideIcon }) {
  return (
    <div className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-[#00E87A]/10 border border-[#00E87A]/20 mb-4">
      <Icon className="w-4 h-4 text-[#00E87A]" strokeWidth={1.5} />
    </div>
  );
}
