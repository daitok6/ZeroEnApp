'use client';

import { useState } from 'react';
import { step2Schema } from '@/lib/validations/application';
import type { ApplicationFormData } from '@/lib/validations/application';

interface Step2Props {
  data: Partial<ApplicationFormData>;
  onNext: (data: Pick<ApplicationFormData, 'target_users' | 'competitors' | 'monetization_plan'>) => void;
  onBack: () => void;
  locale: string;
}

const inputClass = 'w-full bg-[#111827] border border-[#374151] text-[#F4F4F2] text-sm font-mono px-4 py-3 rounded focus:outline-none focus:border-[#00E87A] placeholder:text-[#6B7280] resize-none';
const labelClass = 'block text-[#F4F4F2] text-xs font-bold uppercase tracking-widest mb-2';
const errorClass = 'mt-1 text-red-400 text-xs font-mono';

export function Step2Market({ data, onNext, onBack, locale }: Step2Props) {
  const [formData, setFormData] = useState({
    target_users: data.target_users || '',
    competitors: data.competitors || '',
    monetization_plan: data.monetization_plan || '',
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

  const isJa = locale === 'ja';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold font-mono text-[#F4F4F2] mb-6">
        {isJa ? '市場' : 'Market'}
      </h2>

      <div>
        <label className={labelClass}>
          {isJa ? 'ターゲットユーザーは誰ですか？' : 'Who are your target users?'}
        </label>
        <textarea
          rows={3}
          value={formData.target_users}
          onChange={(e) => setFormData({ ...formData, target_users: e.target.value })}
          placeholder={isJa ? 'どんな人がこのプロダクトを使いますか？' : 'Who will use your product?'}
          className={inputClass}
        />
        {errors.target_users && <p className={errorClass}>{errors.target_users}</p>}
      </div>

      <div>
        <label className={labelClass}>
          {isJa ? '競合他社は誰ですか？（任意）' : 'Who are your competitors? (optional)'}
        </label>
        <textarea
          rows={3}
          value={formData.competitors}
          onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
          placeholder={isJa ? '既存のソリューションや競合他社...' : 'Existing solutions or competitors...'}
          className={inputClass}
        />
        {errors.competitors && <p className={errorClass}>{errors.competitors}</p>}
      </div>

      <div>
        <label className={labelClass}>
          {isJa ? 'どうやって収益を上げますか？' : 'How will you make money?'}
        </label>
        <textarea
          rows={3}
          value={formData.monetization_plan}
          onChange={(e) => setFormData({ ...formData, monetization_plan: e.target.value })}
          placeholder={isJa ? 'サブスクリプション、手数料、広告など...' : 'Subscription, transaction fees, advertising...'}
          className={inputClass}
        />
        {errors.monetization_plan && <p className={errorClass}>{errors.monetization_plan}</p>}
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
