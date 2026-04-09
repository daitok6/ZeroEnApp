'use client';

import { useState } from 'react';
import { step1Schema } from '@/lib/validations/application';
import type { ApplicationFormData } from '@/lib/validations/application';
import { z } from 'zod';

interface Step1Props {
  data: Partial<ApplicationFormData>;
  onNext: (data: Pick<ApplicationFormData, 'idea_name' | 'idea_description' | 'problem_solved'>) => void;
  locale: string;
}

const inputClass = 'w-full bg-[#111827] border border-[#374151] text-[#F4F4F2] text-sm font-mono px-4 py-3 rounded focus:outline-none focus:border-[#00E87A] placeholder:text-[#6B7280] resize-none';
const labelClass = 'block text-[#F4F4F2] text-xs font-bold uppercase tracking-widest mb-2';
const errorClass = 'mt-1 text-red-400 text-xs font-mono';

export function Step1Idea({ data, onNext, locale }: Step1Props) {
  const [formData, setFormData] = useState({
    idea_name: data.idea_name || '',
    idea_description: data.idea_description || '',
    problem_solved: data.problem_solved || '',
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

  const isJa = locale === 'ja';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold font-mono text-[#F4F4F2] mb-6">
        {isJa ? 'あなたのアイデア' : 'Your Idea'}
      </h2>

      <div>
        <label className={labelClass}>
          {isJa ? '何を構築しますか？' : 'What are you building?'}
        </label>
        <input
          type="text"
          value={formData.idea_name}
          onChange={(e) => setFormData({ ...formData, idea_name: e.target.value })}
          placeholder={isJa ? 'アプリ名やプロジェクト名' : 'App name or project name'}
          className={inputClass}
        />
        {errors.idea_name && <p className={errorClass}>{errors.idea_name}</p>}
      </div>

      <div>
        <label className={labelClass}>
          {isJa ? 'アイデアを詳しく説明してください' : 'Describe your idea in detail'}
        </label>
        <textarea
          rows={4}
          value={formData.idea_description}
          onChange={(e) => setFormData({ ...formData, idea_description: e.target.value })}
          placeholder={isJa ? 'あなたのプロダクトが何をするか教えてください...' : 'Tell us what your product does...'}
          className={inputClass}
        />
        {errors.idea_description && <p className={errorClass}>{errors.idea_description}</p>}
      </div>

      <div>
        <label className={labelClass}>
          {isJa ? 'どんな問題を解決しますか？' : 'What problem does it solve?'}
        </label>
        <textarea
          rows={4}
          value={formData.problem_solved}
          onChange={(e) => setFormData({ ...formData, problem_solved: e.target.value })}
          placeholder={isJa ? '解決する具体的な問題を説明してください...' : 'Explain the specific problem you are solving...'}
          className={inputClass}
        />
        {errors.problem_solved && <p className={errorClass}>{errors.problem_solved}</p>}
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
