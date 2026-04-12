'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';

interface SubscriptionPendingProps {
  locale: string;
}

const MAX_ATTEMPTS = 8;
const DELAYS = [2000, 3000, 4000, 5000, 6000, 5000, 5000, 5000];

export function SubscriptionPending({ locale }: SubscriptionPendingProps) {
  const router = useRouter();
  const t = useTranslations('billing');
  const attemptRef = useRef(0);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    attemptRef.current = 0;

    const scheduleNext = () => {
      if (attemptRef.current >= MAX_ATTEMPTS) {
        setTimedOut(true);
        return;
      }

      const delay = DELAYS[attemptRef.current];
      const timer = setTimeout(() => {
        attemptRef.current += 1;
        router.refresh();
        scheduleNext();
      }, delay);

      return () => clearTimeout(timer);
    };

    return scheduleNext();
  }, [router]);

  if (timedOut) {
    return (
      <div className="border border-[#374151] rounded-lg bg-[#111827] p-6 space-y-3">
        <p className="text-[#F4F4F2] font-mono font-bold text-sm">
          {t('pendingTakingLong')}
        </p>
        <p className="text-[#6B7280] text-xs font-mono leading-relaxed">
          {t('pendingTakingLongDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className="border border-[#374151] rounded-lg bg-[#111827] p-6 space-y-3">
      <div className="flex items-center gap-3">
        <Loader2 size={18} className="text-[#00E87A] animate-spin shrink-0" />
        <p className="text-[#F4F4F2] font-mono font-bold text-sm">
          {t('pendingTitle')}
        </p>
      </div>
      <p className="text-[#6B7280] text-xs font-mono leading-relaxed">
        {t('pendingDesc')}
      </p>
    </div>
  );
}
