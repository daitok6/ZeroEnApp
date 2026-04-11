'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface SubscriptionPendingProps {
  locale: string;
}

export function SubscriptionPending({ locale }: SubscriptionPendingProps) {
  const router = useRouter();
  const isJa = locale === 'ja';

  useEffect(() => {
    const timer = setTimeout(() => {
      router.refresh();
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="border border-[#374151] rounded-lg bg-[#111827] p-6 space-y-3">
      <div className="flex items-center gap-3">
        <Loader2 size={18} className="text-[#00E87A] animate-spin shrink-0" />
        <p className="text-[#F4F4F2] font-mono font-bold text-sm">
          {isJa ? 'サブスクリプションを設定中...' : 'Setting up your subscription...'}
        </p>
      </div>
      <p className="text-[#6B7280] text-xs font-mono leading-relaxed">
        {isJa
          ? 'サブスクリプションを設定しています。このページは自動的に更新されます。'
          : 'Your subscription is being set up. This page will refresh automatically.'}
      </p>
    </div>
  );
}
