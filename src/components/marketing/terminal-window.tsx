import { cn } from '@/lib/utils';

interface TerminalWindowProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  contentClassName?: string;
}

export function TerminalWindow({
  children,
  title = 'zeroen — bash',
  className = '',
  contentClassName = '',
}: TerminalWindowProps) {
  return (
    <div className={cn(
      'rounded-lg overflow-hidden border border-[#374151]',
      'shadow-[0_0_40px_rgba(0,232,122,0.15)]',
      className
    )}>
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#111827] border-b border-[#374151]">
        <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
        <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
        <span className="ml-auto text-[#6B7280] text-xs font-mono">{title}</span>
      </div>

      {/* Content */}
      <div className={cn(
        'bg-[#0D0D0D] p-6 font-mono text-[#F4F4F2]',
        contentClassName
      )}>
        {children}
      </div>
    </div>
  );
}
