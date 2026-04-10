'use client';

import { useState } from 'react';
import { step2Schema } from '@/lib/validations/onboarding';
import type { OnboardingFormData } from '@/lib/validations/onboarding';

interface Props {
  data: Partial<OnboardingFormData>;
  onNext: (data: Pick<OnboardingFormData, 'auth_method' | 'key_features' | 'integrations' | 'design_references'>) => void;
  onBack: () => void;
  locale: string;
}

const inputClass = 'w-full bg-[#111827] border border-[#374151] text-[#F4F4F2] text-sm font-mono px-4 py-3 rounded focus:outline-none focus:border-[#00E87A] placeholder:text-[#6B7280] resize-none';
const labelClass = 'block text-[#F4F4F2] text-xs font-bold uppercase tracking-widest mb-2';
const errorClass = 'mt-1 text-red-400 text-xs font-mono';
const selectClass = 'w-full bg-[#111827] border border-[#374151] text-[#F4F4F2] text-sm font-mono px-4 py-3 rounded focus:outline-none focus:border-[#00E87A]';

export function Step2Technical({ data, onNext, onBack, locale }: Props) {
  const isJa = locale === 'ja';
  const [formData, setFormData] = useState({
    auth_method: data.auth_method ?? ('' as OnboardingFormData['auth_method']),
    key_features: data.key_features ?? '',
    integrations: data.integrations ?? '',
    design_references: data.design_references ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = step2Schema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    onNext(result.data);
  };

  const authOptions = isJa
    ? [
        { value: 'email-password', label: 'メール＋パスワード' },
        { value: 'google', label: 'Googleログイン' },
        { value: 'both', label: '両方' },
        { value: 'other', label: 'その他' },
      ]
    : [
        { value: 'email-password', label: 'Email + Password' },
        { value: 'google', label: 'Google OAuth' },
        { value: 'both', label: 'Both' },
        { value: 'other', label: 'Other' },
      ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold font-mono text-[#F4F4F2] mb-6">
        {isJa ? '技術的な環境設定' : 'Technical Preferences'}
      </h2>

      <div>
        <label className={labelClass}>
          {isJa ? '認証方法' : 'Authentication Method'}
        </label>
        <select
          value={formData.auth_method}
          onChange={(e) => setFormData({ ...formData, auth_method: e.target.value as OnboardingFormData['auth_method'] })}
          className={selectClass}
        >
          <option value="" disabled>
            {isJa ? '選択してください' : 'Select one'}
          </option>
          {authOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {errors.auth_method && <p className={errorClass}>{errors.auth_method}</p>}
      </div>

      <div>
        <label className={labelClass}>
          {isJa ? 'MVPの主要機能' : 'Key MVP Features'}
        </label>
        <textarea
          rows={4}
          value={formData.key_features}
          onChange={(e) => setFormData({ ...formData, key_features: e.target.value })}
          placeholder={isJa ? 'MVPに含めたい主要機能を説明してください...' : 'Describe the core features you want in the MVP...'}
          className={inputClass}
        />
        {errors.key_features && <p className={errorClass}>{errors.key_features}</p>}
      </div>

      <div>
        <label className={labelClass}>
          {isJa ? '必要な外部サービス（任意）' : 'Integrations Needed (optional)'}
        </label>
        <textarea
          rows={3}
          value={formData.integrations}
          onChange={(e) => setFormData({ ...formData, integrations: e.target.value })}
          placeholder={isJa ? '例：Stripe、SendGrid、Google Maps...' : 'e.g. Stripe, SendGrid, Google Maps...'}
          className={inputClass}
        />
        {errors.integrations && <p className={errorClass}>{errors.integrations}</p>}
      </div>

      <div>
        <label className={labelClass}>
          {isJa ? 'デザインの参考（任意）' : 'Design References (optional)'}
        </label>
        <textarea
          rows={3}
          value={formData.design_references}
          onChange={(e) => setFormData({ ...formData, design_references: e.target.value })}
          placeholder={isJa ? 'URLや参考にしたいサービスの名前...' : 'URLs or names of apps you like the look of...'}
          className={inputClass}
        />
        {errors.design_references && <p className={errorClass}>{errors.design_references}</p>}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="text-[#9CA3AF] font-mono text-sm px-6 py-3 rounded border border-[#374151] hover:border-[#6B7280] transition-colors"
        >
          ← {isJa ? '戻る' : 'Back'}
        </button>
        <button
          type="submit"
          className="bg-[#00E87A] text-[#0D0D0D] font-bold font-mono px-8 py-3 rounded hover:bg-[#00d070] transition-colors"
        >
          {isJa ? '次へ →' : 'Next →'}
        </button>
      </div>
    </form>
  );
}
