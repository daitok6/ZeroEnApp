'use client';

import { useState } from 'react';
import { step1Schema } from '@/lib/validations/onboarding';
import type { OnboardingFormData } from '@/lib/validations/onboarding';

interface Props {
  data: Partial<OnboardingFormData>;
  onNext: (data: Pick<OnboardingFormData, 'app_name' | 'app_description' | 'target_launch_date'>) => void;
  locale: string;
}

const inputClass = 'w-full bg-[#111827] border border-[#374151] text-[#F4F4F2] text-sm font-mono px-4 py-3 rounded focus:outline-none focus:border-[#00E87A] placeholder:text-[#6B7280] resize-none';
const labelClass = 'block text-[#F4F4F2] text-xs font-bold uppercase tracking-widest mb-2';
const errorClass = 'mt-1 text-red-400 text-xs font-mono';

export function Step1Project({ data, onNext, locale }: Props) {
  const isJa = locale === 'ja';
  const [formData, setFormData] = useState({
    app_name: data.app_name ?? '',
    app_description: data.app_description ?? '',
    target_launch_date: data.target_launch_date ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = step1Schema.safeParse(formData);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold font-mono text-[#F4F4F2] mb-6">
        {isJa ? 'プロジェクトの詳細' : 'Project Details'}
      </h2>

      <div>
        <label className={labelClass}>
          {isJa ? 'アプリ名' : 'App Name'}
        </label>
        <input
          type="text"
          value={formData.app_name}
          onChange={(e) => setFormData({ ...formData, app_name: e.target.value })}
          placeholder={isJa ? 'プロジェクト名' : 'Your project name'}
          className={inputClass}
        />
        {errors.app_name && <p className={errorClass}>{errors.app_name}</p>}
      </div>

      <div>
        <label className={labelClass}>
          {isJa ? 'アプリの説明' : 'App Description'}
        </label>
        <textarea
          rows={4}
          value={formData.app_description}
          onChange={(e) => setFormData({ ...formData, app_description: e.target.value })}
          placeholder={isJa ? 'あなたのアプリが何をするか詳しく教えてください...' : 'Describe in detail what your app does and who it serves...'}
          className={inputClass}
        />
        {errors.app_description && <p className={errorClass}>{errors.app_description}</p>}
      </div>

      <div>
        <label className={labelClass}>
          {isJa ? '目標ローンチ時期（任意）' : 'Target Launch Date (optional)'}
        </label>
        <input
          type="month"
          value={formData.target_launch_date}
          onChange={(e) => setFormData({ ...formData, target_launch_date: e.target.value })}
          className={inputClass}
          style={{ colorScheme: 'dark' }}
        />
        {errors.target_launch_date && <p className={errorClass}>{errors.target_launch_date}</p>}
      </div>

      <div className="flex justify-end pt-4">
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
