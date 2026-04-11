'use client';

import { useState } from 'react';
import { PlanChangeModal } from './plan-change-modal';

interface PlanChangeTriggerProps {
  currentPlan: 'basic' | 'premium';
  commitmentStartsAt: string;
  locale: string;
}

export function PlanChangeTrigger({ currentPlan, commitmentStartsAt, locale }: PlanChangeTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-mono text-[#9CA3AF] hover:text-[#00E87A] transition-colors underline underline-offset-2"
      >
        {locale === 'ja' ? 'プランを変更する' : 'Change Plan'}
      </button>
      <PlanChangeModal
        currentPlan={currentPlan}
        commitmentStartsAt={commitmentStartsAt}
        locale={locale}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
