import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon: LucideIcon;
  locale: string;
  titleEn: string;
  titleJa: string;
  bodyEn: string;
  bodyJa: string;
  cta?: {
    labelEn: string;
    labelJa: string;
    href: string;
  };
}

export function EmptyState({
  icon: Icon,
  locale,
  titleEn,
  titleJa,
  bodyEn,
  bodyJa,
  cta,
}: EmptyStateProps) {
  const isJa = locale === 'ja';

  return (
    <div className="border border-[#374151] rounded-lg p-8 bg-[#111827] text-center">
      <Icon size={32} className="mx-auto text-[#374151] mb-4" />
      <p className="text-[#9CA3AF] font-mono text-sm mb-2">
        {isJa ? titleJa : titleEn}
      </p>
      <p className="text-[#6B7280] font-mono text-xs leading-relaxed mb-6">
        {isJa ? bodyJa : bodyEn}
      </p>
      {cta && (
        <Link
          href={cta.href}
          className="inline-flex items-center gap-2 text-xs font-mono text-[#00E87A] border border-[#00E87A]/30 hover:border-[#00E87A]/60 hover:bg-[#00E87A]/5 px-4 py-2 rounded transition-all"
        >
          {isJa ? cta.labelJa : cta.labelEn}
        </Link>
      )}
    </div>
  );
}
