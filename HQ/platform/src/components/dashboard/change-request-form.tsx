'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ChangeRequestFormProps {
  projectId: string;
  locale: string;
}

export function ChangeRequestForm({ projectId, locale }: ChangeRequestFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tier, setTier] = useState<'small' | 'medium' | 'large' | ''>('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !tier) return;
    setStatus('submitting');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setStatus('error'); return; }

    const { error } = await supabase.from('change_requests').insert({
      project_id: projectId,
      client_id: user.id,
      title: title.trim(),
      description: description.trim(),
      tier,
    });

    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setTitle('');
      setDescription('');
      setTier('');
      // Reset after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const inputClass = "w-full bg-[#0D0D0D] border border-[#374151] text-[#F4F4F2] text-sm font-mono px-3 py-2.5 rounded focus:outline-none focus:border-[#00E87A] placeholder:text-[#6B7280]";
  const labelClass = "block text-[#9CA3AF] text-xs font-mono uppercase tracking-widest mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="border border-[#374151] rounded-lg p-5 bg-[#111827] space-y-4">
      <p className="text-[#F4F4F2] text-sm font-mono font-bold">
        {locale === 'ja' ? '新しいリクエスト' : 'New Request'}
      </p>

      <div>
        <label className={labelClass}>{locale === 'ja' ? 'タイトル' : 'Title'}</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={locale === 'ja' ? '変更内容を簡潔に' : 'Brief description of the change'}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>{locale === 'ja' ? '詳細' : 'Description'}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={locale === 'ja' ? '変更内容の詳細を記入してください' : 'Describe the change in detail'}
          rows={3}
          required
          className={`${inputClass} resize-none`}
        />
      </div>

      <div>
        <label className={labelClass}>{locale === 'ja' ? '規模' : 'Estimated Size'}</label>
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value as 'small' | 'medium' | 'large')}
          required
          className={inputClass}
        >
          <option value="" disabled>{locale === 'ja' ? '規模を選択' : 'Select size'}</option>
          <option value="small">{locale === 'ja' ? 'スモール ($50-100)' : 'Small ($50-100)'}</option>
          <option value="medium">{locale === 'ja' ? 'ミディアム ($200-500)' : 'Medium ($200-500)'}</option>
          <option value="large">{locale === 'ja' ? 'ラージ ($500-2,000)' : 'Large ($500-2,000)'}</option>
        </select>
      </div>

      {status === 'error' && (
        <p className="text-red-400 text-xs font-mono">
          {locale === 'ja' ? '送信に失敗しました。もう一度お試しください。' : 'Failed to submit. Please try again.'}
        </p>
      )}

      {status === 'success' && (
        <p className="text-[#00E87A] text-xs font-mono">
          {locale === 'ja' ? 'リクエストを送信しました！' : 'Request submitted!'}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting' || !title.trim() || !description.trim() || !tier}
        className="w-full bg-[#00E87A] text-[#0D0D0D] text-xs font-bold py-2.5 rounded tracking-widest uppercase hover:bg-[#00E87A]/90 transition-colors disabled:opacity-50"
      >
        {status === 'submitting'
          ? (locale === 'ja' ? '送信中...' : 'Submitting...')
          : (locale === 'ja' ? 'リクエストを送信' : 'Submit Request')}
      </button>
    </form>
  );
}
