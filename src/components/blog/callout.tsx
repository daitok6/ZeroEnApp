import { Info, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type CalloutType = 'info' | 'warn' | 'tip' | 'success';

const config: Record<CalloutType, { icon: LucideIcon; borderColor: string; iconColor: string; bg: string }> = {
  info:    { icon: Info,          borderColor: 'border-[#00E87A]/40', iconColor: 'text-[#00E87A]',   bg: 'bg-[#00E87A]/5' },
  warn:    { icon: AlertTriangle, borderColor: 'border-[#F59E0B]/40', iconColor: 'text-[#F59E0B]',   bg: 'bg-[#F59E0B]/5' },
  tip:     { icon: Lightbulb,     borderColor: 'border-[#00E87A]/40', iconColor: 'text-[#00E87A]',   bg: 'bg-[#00E87A]/5' },
  success: { icon: CheckCircle2,  borderColor: 'border-[#10B981]/40', iconColor: 'text-[#10B981]',   bg: 'bg-[#10B981]/5' },
};

type Props = {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
};

export function Callout({ type = 'info', title, children }: Props) {
  const { icon: Icon, borderColor, iconColor, bg } = config[type];
  return (
    <aside className={`my-6 border-l-2 ${borderColor} ${bg} pl-4 pr-4 py-3 rounded-r`}>
      <div className="flex items-start gap-2.5">
        <Icon className={`${iconColor} w-4 h-4 mt-0.5 flex-shrink-0`} strokeWidth={2} />
        <div className="min-w-0">
          {title && (
            <p className={`${iconColor} font-mono text-xs font-bold uppercase tracking-widest mb-1`}>{title}</p>
          )}
          <div className="text-[#9CA3AF] font-mono text-sm leading-relaxed [&>p]:mb-0">{children}</div>
        </div>
      </div>
    </aside>
  );
}
