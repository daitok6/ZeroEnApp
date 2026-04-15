'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { getProjectQuota, type ProjectQuota } from '@/lib/actions/quota';

interface ChangeRequestFormProps {
  projectId: string;
  locale: string;
}

export function ChangeRequestForm({ projectId, locale: _locale }: ChangeRequestFormProps) {
  const t = useTranslations('requests');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tier, setTier] = useState<'small' | 'medium' | 'large' | ''>('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [quota, setQuota] = useState<ProjectQuota | null>(null);
  const supabase = createClient();

  useEffect(() => {
    getProjectQuota(projectId).then(setQuota).catch(() => { /* quota display is non-critical */ });
  }, [projectId]);

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
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const inputClass = "w-full bg-[#0D0D0D] border border-[#374151] text-[#F4F4F2] text-sm font-mono px-3 py-2.5 rounded focus:outline-none focus:border-[#00E87A] placeholder:text-[#6B7280]";
  const labelClass = "block text-[#9CA3AF] text-xs font-mono uppercase tracking-widest mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="border border-[#374151] rounded-lg p-5 bg-[#111827] space-y-4">
      <p className="text-[#F4F4F2] text-sm font-mono font-bold">
        {t('newRequest')}
      </p>

      <div>
        <label className={labelClass}>{t('formTitle')}</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('formTitlePlaceholder')}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>{t('formDescription')}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('formDescriptionPlaceholder')}
          rows={3}
          required
          className={`${inputClass} resize-none`}
        />
      </div>

      <div>
        <label className={labelClass}>{t('formSize')}</label>
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value as 'small' | 'medium' | 'large')}
          required
          className={inputClass}
        >
          <option value="" disabled>{t('formSizePlaceholder')}</option>
          <option value="small">{t('sizeSmall')}</option>
          {quota?.planTier !== 'basic' && (
            <option value="medium">{t('sizeMedium')}</option>
          )}
          <option value="large">{t('sizeLarge')}</option>
        </select>
        {quota?.planTier === 'basic' && (
          <p className="text-[#6B7280] text-[11px] font-mono mt-1.5">
            {t('mediumPremiumOnly')}
          </p>
        )}

        {/* Quota counter + overage warning */}
        {quota && (
          <div className="mt-2 space-y-1">
            <p className="text-[#6B7280] text-[11px] font-mono">
              {t('quotaRemaining', { remaining: quota.remainingUnits, capacity: quota.capacityUnits })}
            </p>
            {tier === 'large' && (
              <p className="text-yellow-400 text-[11px] font-mono">
                {t('quotaLarge')}
              </p>
            )}
            {(tier === 'small' || tier === 'medium') && (() => {
              const cost = quota.tierUnitCost[tier] ?? 1;
              const isOverage = cost > quota.remainingUnits;
              const price = (quota.tierPriceCents[tier] ?? 0) / 100;
              return isOverage ? (
                <p className="text-yellow-400 text-[11px] font-mono">
                  {t('quotaOverage', { price: price.toLocaleString('ja-JP') })}
                </p>
              ) : (
                <p className="text-[#00E87A] text-[11px] font-mono">
                  {t('quotaIncluded')}
                </p>
              );
            })()}
          </div>
        )}
      </div>

      {status === 'error' && (
        <p className="text-red-400 text-xs font-mono">
          {t('submitError')}
        </p>
      )}

      {status === 'success' && (
        <p className="text-[#00E87A] text-xs font-mono">
          {t('submitSuccess')}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting' || !title.trim() || !description.trim() || !tier}
        className="w-full bg-[#00E87A] text-[#0D0D0D] text-xs font-bold py-2.5 rounded tracking-widest uppercase hover:bg-[#00E87A]/90 transition-colors disabled:opacity-50"
      >
        {status === 'submitting' ? t('submitting') : t('submitButton')}
      </button>
    </form>
  );
}
