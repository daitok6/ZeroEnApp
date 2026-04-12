'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Cal from '@calcom/embed-react';
import { step4Schema } from '@/lib/validations/onboarding';
import type { OnboardingFormData } from '@/lib/validations/onboarding';

interface Props {
  data: Partial<OnboardingFormData>;
  onSubmit: (data: Partial<OnboardingFormData>) => void;
  onBack: () => void;
  isSubmitting: boolean;
  locale: string;
}

const labelClass = 'block text-[#F4F4F2] text-xs font-bold uppercase tracking-widest mb-2';
const selectClass = 'w-full bg-[#111827] border border-[#374151] text-[#F4F4F2] text-sm font-mono px-4 py-3 rounded focus:outline-none focus:border-[#00E87A]';
const errorClass = 'mt-1 text-red-400 text-xs font-mono';

const TIMEZONES = [
  'Pacific/Honolulu',
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Africa/Cairo',
  'Asia/Dubai',
  'Asia/Karachi',
  'Asia/Kolkata',
  'Asia/Bangkok',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Australia/Sydney',
  'Pacific/Auckland',
];

export function Step4Kickoff({ data, onSubmit, onBack, isSubmitting, locale: _locale }: Props) {
  const t = useTranslations('onboarding.step4');
  const tCommon = useTranslations('common');
  const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK;

  const [formData, setFormData] = useState({
    timezone: data.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    preferred_channel: data.preferred_channel ?? ('' as OnboardingFormData['preferred_channel']),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const channelOptions = [
    { value: 'email', label: t('channelEmail') },
    { value: 'slack', label: t('channelSlack') },
    { value: 'discord', label: t('channelDiscord') },
    { value: 'whatsapp', label: t('channelWhatsApp') },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = step4Schema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    onSubmit(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold font-mono text-[#F4F4F2] mb-2">
        {t('title')}
      </h2>
      <p className="text-[#9CA3AF] text-sm font-mono mb-6">
        {t('desc')}
      </p>

      {/* Cal.com embed — only renders when NEXT_PUBLIC_CALCOM_LINK is set */}
      {calLink ? (
        <div className="rounded border border-[#374151] overflow-hidden">
          <Cal
            calLink={calLink}
            style={{ width: '100%', height: '500px' }}
            config={{ theme: 'dark' }}
          />
        </div>
      ) : (
        <div className="rounded border border-[#374151] bg-[#111827] p-6 text-center space-y-2">
          <p className="text-[#6B7280] text-sm font-mono">
            {t('calFallback')}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
        <div>
          <label className={labelClass}>
            {t('timezone')}
          </label>
          <select
            value={formData.timezone}
            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
            className={selectClass}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
            ))}
          </select>
          {errors.timezone && <p className={errorClass}>{errors.timezone}</p>}
        </div>

        <div>
          <label className={labelClass}>
            {t('preferredChannel')}
          </label>
          <select
            value={formData.preferred_channel}
            onChange={(e) => setFormData({ ...formData, preferred_channel: e.target.value as OnboardingFormData['preferred_channel'] })}
            className={selectClass}
          >
            <option value="" disabled>
              {t('channelPlaceholder')}
            </option>
            {channelOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.preferred_channel && <p className={errorClass}>{errors.preferred_channel}</p>}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="text-[#9CA3AF] font-mono text-sm px-6 py-3 rounded border border-[#374151] hover:border-[#6B7280] transition-colors disabled:opacity-40"
        >
          {tCommon('back')}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#00E87A] text-[#0D0D0D] font-bold font-mono px-8 py-3 rounded hover:bg-[#00d070] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? tCommon('submitting') : t('completeButton')}
        </button>
      </div>
    </form>
  );
}
