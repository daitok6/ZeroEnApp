'use client';

import { useState } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';
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

// Curated list of common timezones
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

const CHANNEL_OPTIONS = [
  { value: 'email', labelEn: 'Email', labelJa: 'メール' },
  { value: 'slack', labelEn: 'Slack', labelJa: 'Slack' },
  { value: 'discord', labelEn: 'Discord', labelJa: 'Discord' },
  { value: 'whatsapp', labelEn: 'WhatsApp', labelJa: 'WhatsApp' },
];

export function Step4Kickoff({ data, onSubmit, onBack, isSubmitting, locale }: Props) {
  const isJa = locale === 'ja';
  const calLink = process.env.NEXT_PUBLIC_CALCOM_LINK ?? 'zeroen/kickoff';

  const [formData, setFormData] = useState({
    timezone: data.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    preferred_channel: data.preferred_channel ?? ('' as OnboardingFormData['preferred_channel']),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: 'kickoff' });
      cal('ui', { hideEventTypeDetails: false, layout: 'month_view' });
    })();
  }, []);

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
        {isJa ? 'キックオフを設定する' : 'Schedule Your Kickoff'}
      </h2>
      <p className="text-[#9CA3AF] text-sm font-mono mb-6">
        {isJa
          ? 'キックオフコールを予約してください。スケジュールはいつでも変更できます。'
          : 'Book your kickoff call below. You can reschedule anytime.'}
      </p>

      {/* Cal.com embed */}
      <div className="rounded border border-[#374151] overflow-hidden min-h-[400px]">
        <Cal
          namespace="kickoff"
          calLink={calLink}
          style={{ width: '100%', height: '100%', overflow: 'scroll' }}
          config={{ layout: 'month_view', theme: 'dark' }}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
        <div>
          <label className={labelClass}>
            {isJa ? 'タイムゾーン' : 'Timezone'}
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
            {isJa ? '希望の連絡手段' : 'Preferred Channel'}
          </label>
          <select
            value={formData.preferred_channel}
            onChange={(e) => setFormData({ ...formData, preferred_channel: e.target.value as OnboardingFormData['preferred_channel'] })}
            className={selectClass}
          >
            <option value="" disabled>
              {isJa ? '選択してください' : 'Select one'}
            </option>
            {CHANNEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {isJa ? opt.labelJa : opt.labelEn}
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
          ← {isJa ? '戻る' : 'Back'}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#00E87A] text-[#0D0D0D] font-bold font-mono px-8 py-3 rounded hover:bg-[#00d070] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? (isJa ? '送信中...' : 'Submitting...')
            : (isJa ? 'セットアップを完了する ✓' : 'Complete Setup ✓')}
        </button>
      </div>
    </form>
  );
}
