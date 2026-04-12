'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { addMonths, formatDate } from '@/lib/date-utils';

interface PlanChangeModalProps {
  currentPlan: 'basic' | 'premium';
  commitmentStartsAt: string;
  locale: string;
  open: boolean;
  onClose: () => void;
}

type ModalState = 'idle' | 'loading' | 'success' | 'error' | 'downgrade_locked';

const PLAN_PRICES: Record<'basic' | 'premium', string> = {
  basic: '¥5,000/mo',
  premium: '¥10,000/mo',
};

export function PlanChangeModal({
  currentPlan,
  commitmentStartsAt,
  locale,
  open,
  onClose,
}: PlanChangeModalProps) {
  const t = useTranslations('plan');
  const tBilling = useTranslations('billing');
  const tCommon = useTranslations('common');
  const [state, setState] = useState<ModalState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [earliestDowngradeDate, setEarliestDowngradeDate] = useState<string>('');

  const targetPlan = currentPlan === 'basic' ? 'premium' : 'basic';
  const isUpgrade = targetPlan === 'premium';

  // Check downgrade lock on the client side as well
  const commitmentEnd = addMonths(commitmentStartsAt, 6);
  const isDowngradeLocked = !isUpgrade && commitmentEnd > new Date();

  const targetFeatures: string[] = isUpgrade ? [
    tBilling('hostingIncluded'),
    tBilling('twoChangesPerMonth'),
    tBilling('fullYearAnalytics'),
    tBilling('quarterlyAudits'),
  ] : [
    tBilling('hostingIncluded'),
    tBilling('oneChangePerMonth'),
    tBilling('pdfAnalytics'),
  ];

  const handleClose = () => {
    setState('idle');
    setErrorMessage('');
    setEarliestDowngradeDate('');
    onClose();
  };

  const handleConfirm = async () => {
    setState('loading');
    try {
      const res = await fetch('/api/stripe/change-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetPlan }),
      });

      const data = await res.json();

      if (res.status === 403 && data.error === 'downgrade_locked') {
        setEarliestDowngradeDate(data.earliest_downgrade_date);
        setState('downgrade_locked');
        return;
      }

      if (!res.ok) {
        setErrorMessage(data.error ?? tCommon('error'));
        setState('error');
        return;
      }

      setState('success');
    } catch {
      setErrorMessage(t('unexpectedError'));
      setState('error');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose(); }}>
      <DialogContent
        className="bg-[#111827] border border-[#374151] text-[#F4F4F2] font-mono max-w-md"
        showCloseButton={true}
      >
        <DialogHeader>
          <DialogTitle className="text-[#F4F4F2] font-mono font-bold text-base">
            {isUpgrade ? t('upgradeTo') : t('downgradeTo')}
          </DialogTitle>
          <DialogDescription className="text-[#9CA3AF] font-mono text-xs">
            {isUpgrade ? t('upgradeNote') : t('downgradeNote2')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Success state */}
          {state === 'success' && (
            <div className="border border-[#00E87A]/30 bg-[#00E87A]/10 rounded-lg p-4">
              <p className="text-[#00E87A] text-sm font-mono font-bold">
                {t('planChangedSuccess')}
              </p>
              <p className="text-[#9CA3AF] text-xs font-mono mt-1">
                {t('successMessage')}
              </p>
            </div>
          )}

          {/* Error state */}
          {state === 'error' && (
            <div className="border border-red-400/30 bg-red-400/10 rounded-lg p-4">
              <p className="text-red-400 text-sm font-mono font-bold">
                {t('anErrorOccurred')}
              </p>
              <p className="text-[#9CA3AF] text-xs font-mono mt-1">{errorMessage}</p>
            </div>
          )}

          {/* Downgrade locked (from API response) */}
          {state === 'downgrade_locked' && earliestDowngradeDate && (
            <div className="border border-orange-400/30 bg-orange-400/10 rounded-lg p-4">
              <p className="text-orange-400 text-sm font-mono font-bold">
                {t('downgradeLocked')}
              </p>
              <p className="text-[#9CA3AF] text-xs font-mono mt-1">
                {t('downgradeLockedAfterDate', { date: formatDate(earliestDowngradeDate, locale) })}
              </p>
            </div>
          )}

          {/* Client-side downgrade lock warning */}
          {isDowngradeLocked && state === 'idle' && (
            <div className="border border-orange-400/30 bg-orange-400/10 rounded-lg p-4">
              <p className="text-orange-400 text-sm font-mono font-bold">
                {t('downgradeLocked')}
              </p>
              <p className="text-[#9CA3AF] text-xs font-mono mt-1">
                {t('downgradeLockedAfterDate', { date: formatDate(commitmentEnd.toISOString(), locale) })}
              </p>
            </div>
          )}

          {/* Target plan details */}
          {state === 'idle' && !isDowngradeLocked && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                      targetPlan === 'premium'
                        ? 'text-[#00E87A] bg-[#00E87A]/10 border-[#00E87A]/30'
                        : 'text-[#9CA3AF] bg-[#374151]/50 border-[#374151]'
                    }`}
                  >
                    {targetPlan === 'premium' ? t('premiumName') : t('basicName')}
                  </span>
                </div>
                <span className="text-[#F4F4F2] font-mono font-bold text-sm">
                  {PLAN_PRICES[targetPlan]}
                </span>
              </div>

              <ul className="space-y-1">
                {targetFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs font-mono text-[#9CA3AF]">
                    <span className={targetPlan === 'premium' ? 'text-[#00E87A]' : 'text-[#6B7280]'}>
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              {!isUpgrade && (
                <div className="border border-[#374151] rounded-lg p-3 bg-[#0D0D0D]">
                  <p className="text-[#6B7280] text-xs font-mono">
                    {t('downgradeRemovedFeatures')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-[#374151] bg-[#0D0D0D] -mx-4 -mb-4 px-4 py-3 rounded-b-xl">
          {state === 'success' ? (
            <button
              onClick={handleClose}
              className="px-4 py-2 text-xs font-mono font-bold text-[#F4F4F2] bg-[#374151] hover:bg-[#4B5563] rounded-lg transition-colors"
            >
              {tCommon('close')}
            </button>
          ) : state === 'idle' && !isDowngradeLocked ? (
            <>
              <button
                onClick={handleClose}
                className="px-4 py-2 text-xs font-mono text-[#9CA3AF] hover:text-[#F4F4F2] transition-colors"
              >
                {tCommon('cancel')}
              </button>
              <button
                onClick={handleConfirm}
                disabled={state !== 'idle'}
                className={`px-4 py-2 text-xs font-mono font-bold rounded-lg transition-colors ${
                  isUpgrade
                    ? 'bg-[#00E87A] text-[#0D0D0D] hover:bg-[#00E87A]/90'
                    : 'bg-[#374151] text-[#F4F4F2] hover:bg-[#4B5563]'
                }`}
              >
                {isUpgrade ? t('upgradeTo') : t('downgradeTo')}
              </button>
            </>
          ) : state === 'loading' ? (
            <button
              disabled
              className="px-4 py-2 text-xs font-mono font-bold text-[#6B7280] bg-[#374151] rounded-lg cursor-not-allowed"
            >
              {tCommon('processing')}
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="px-4 py-2 text-xs font-mono font-bold text-[#F4F4F2] bg-[#374151] hover:bg-[#4B5563] rounded-lg transition-colors"
            >
              {tCommon('close')}
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
