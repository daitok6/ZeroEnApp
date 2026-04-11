import Link from 'next/link';
import { Lock } from 'lucide-react';

interface SubscriptionRequiredProps {
  locale: string;
}

export function SubscriptionRequired({ locale }: SubscriptionRequiredProps) {
  const isJa = locale === 'ja';

  return (
    <div className="max-w-2xl">
      <div className="border border-[#374151] rounded-lg bg-[#111827] p-8 text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-[#374151]/40">
            <Lock size={24} className="text-[#6B7280]" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[#F4F4F2] font-mono font-bold text-sm">
            {isJa ? 'この機能にアクセスするには登録が必要です' : 'Subscribe to access this feature'}
          </p>
          <p className="text-[#6B7280] text-xs font-mono leading-relaxed">
            {isJa
              ? 'プランを選択してサブスクリプションを開始してください。'
              : 'Choose a plan and start your subscription to unlock this section.'}
          </p>
        </div>
        <Link
          href={`/${locale}/dashboard`}
          className="inline-block bg-[#00E87A] text-[#0D0D0D] font-bold font-mono uppercase tracking-widest text-xs px-6 py-2.5 rounded hover:bg-[#00E87A]/90 transition-colors"
        >
          {isJa ? 'プランを選択する' : 'Choose a Plan'}
        </Link>
      </div>
    </div>
  );
}
