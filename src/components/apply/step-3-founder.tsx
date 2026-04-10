'use client';

import { useState } from 'react';
import { step3Schema } from '@/lib/validations/application';
import type { ApplicationFormData } from '@/lib/validations/application';

interface Step3Props {
  data: Partial<ApplicationFormData>;
  onNext: (data: Pick<ApplicationFormData, 'founder_name' | 'founder_background' | 'founder_commitment' | 'linkedin_url'>) => void;
  onBack: () => void;
  locale: string;
}

const inputClass = 'w-full bg-[#111827] border border-[#374151] text-[#F4F4F2] text-sm font-mono px-4 py-3 rounded focus:outline-none focus:border-[#00E87A] placeholder:text-[#6B7280] resize-none';
const labelClass = 'block text-[#F4F4F2] text-xs font-bold uppercase tracking-widest mb-2';
const errorClass = 'mt-1 text-red-400 text-xs font-mono';

export function Step3Founder({ data, onNext, onBack, locale }: Step3Props) {
  const [formData, setFormData] = useState({
    founder_name: data.founder_name || '',
    founder_background: data.founder_background || '',
    founder_commitment: data.founder_commitment || ('' as 'full-time' | 'part-time' | 'side-project' | ''),
    linkedin_url: data.linkedin_url || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = step3Schema.safeParse(formData);
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

  const isJa = locale === 'ja';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold font-mono text-[#F4F4F2] mb-6">
        {isJa ? 'あなたについて' : 'About You'}
      </h2>

      <div>
        <label className={labelClass}>
          {isJa ? 'お名前' : 'Your name'}
        </label>
        <input
          type="text"
          value={formData.founder_name}
          onChange={(e) => setFormData({ ...formData, founder_name: e.target.value })}
          placeholder={isJa ? '山田 太郎' : 'John Smith'}
          className={inputClass}
        />
        {errors.founder_name && <p className={errorClass}>{errors.founder_name}</p>}
      </div>

      <div>
        <label className={labelClass}>
          {isJa ? '経歴・バックグラウンド' : 'Your background'}
        </label>
        <textarea
          rows={4}
          value={formData.founder_background}
          onChange={(e) => setFormData({ ...formData, founder_background: e.target.value })}
          placeholder={isJa ? '職歴、スキル、関連する経験など...' : 'Work history, skills, relevant experience...'}
          className={inputClass}
        />
        {errors.founder_background && <p className={errorClass}>{errors.founder_background}</p>}
      </div>

      <div>
        <label className={labelClass}>
          {isJa ? '時間的なコミット' : 'Time commitment'}
        </label>
        <select
          value={formData.founder_commitment}
          onChange={(e) => setFormData({ ...formData, founder_commitment: e.target.value as 'full-time' | 'part-time' | 'side-project' })}
          className="w-full bg-[#111827] border border-[#374151] text-[#F4F4F2] text-sm font-mono px-4 py-3 rounded focus:outline-none focus:border-[#00E87A]"
        >
          <option value="" disabled>
            {isJa ? 'コミット時間を選択' : 'Select time commitment'}
          </option>
          <option value="full-time">{isJa ? 'フルタイム' : 'Full-time'}</option>
          <option value="part-time">{isJa ? 'パートタイム' : 'Part-time'}</option>
          <option value="side-project">{isJa ? 'サイドプロジェクト' : 'Side project'}</option>
        </select>
        {errors.founder_commitment && <p className={errorClass}>{errors.founder_commitment}</p>}
      </div>

      <div>
        <label className={labelClass}>
          {isJa ? 'LinkedIn URL（任意）' : 'LinkedIn URL (optional)'}
        </label>
        <input
          type="url"
          value={formData.linkedin_url}
          onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
          placeholder="https://linkedin.com/in/yourprofile"
          className={inputClass}
        />
        {errors.linkedin_url && <p className={errorClass}>{errors.linkedin_url}</p>}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="border border-[#374151] text-[#9CA3AF] font-mono px-8 py-3 rounded hover:border-[#6B7280] transition-colors"
        >
          {isJa ? '← 戻る' : '← Back'}
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
