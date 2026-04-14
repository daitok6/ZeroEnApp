'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { trackEvent } from '@/components/analytics/google-analytics';

type BusinessType = 'coach' | 'therapist' | 'counselor' | 'consultant' | 'other';

interface FormState {
  name: string;
  business_type: BusinessType | '';
  current_site: string;
  goal: string;
  timeline: string;
  contact_email: string;
}

const BUSINESS_TYPES: BusinessType[] = ['coach', 'therapist', 'counselor', 'consultant', 'other'];

export default function ApplyPage() {
  const t = useTranslations('saasApply');
  const params = useParams();
  const locale = (params?.locale as string) ?? 'ja';

  const [form, setForm] = useState<FormState>({
    name: '',
    business_type: '',
    current_site: '',
    goal: '',
    timeline: '',
    contact_email: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const attributionRef = useRef<string>('direct');
  const applyStartFired = useRef(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('attribution_source');
      if (stored) attributionRef.current = stored;
    } catch {
      // localStorage unavailable — use default
    }
  }, []);

  function validate(): boolean {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = t('required');
    if (!form.business_type) next.business_type = t('required');
    if (!form.contact_email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email)) {
      next.contact_email = t('required');
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    try {
      const res = await fetch('/api/applications/saas-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          locale,
          attribution_source: attributionRef.current,
        }),
      });

      if (!res.ok) throw new Error('non-2xx');
      setStatus('success');
      trackEvent({
        action: 'apply_submit',
        params: {
          icp_segment: form.business_type,
          referral_source: attributionRef.current,
        },
      });
    } catch {
      setStatus('error');
    }
  }

  function handleFirstFocus() {
    if (!applyStartFired.current) {
      applyStartFired.current = true;
      trackEvent({ action: 'apply_start' });
    }
  }

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  if (status === 'success') {
    return (
      <div className="bg-[#0D0D0D] text-[#F4F4F2] min-h-screen flex items-center justify-center px-4 pt-24">
        <div className="max-w-md w-full text-center space-y-4">
          <span className="text-[#00E87A] text-4xl">✓</span>
          <h1 className="text-2xl font-heading font-bold text-[#F4F4F2]">{t('successTitle')}</h1>
          <p className="text-[#6B7280] font-mono text-sm leading-relaxed">{t('successBody')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0D0D0D] text-[#F4F4F2] min-h-screen pt-24 pb-32 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-4">
            {t('eyebrow')}
          </p>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-[#F4F4F2] mb-4">
            {t('title')}
          </h1>
          <p className="text-[#6B7280] font-mono text-sm leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Name */}
          <div>
            <label className="block font-mono text-xs text-[#9CA3AF] uppercase tracking-widest mb-2">
              {t('labelName')} <span className="text-[#00E87A]">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onFocus={handleFirstFocus}
              placeholder={t('placeholderName')}
              className="w-full bg-[#111827] border border-[#374151] rounded px-4 py-3 font-mono text-sm text-[#F4F4F2] placeholder-[#4B5563] focus:outline-none focus:border-[#00E87A] transition-colors"
            />
            {errors.name && (
              <p className="mt-1 font-mono text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Business type */}
          <div>
            <label className="block font-mono text-xs text-[#9CA3AF] uppercase tracking-widest mb-2">
              {t('labelBusinessType')} <span className="text-[#00E87A]">*</span>
            </label>
            <select
              value={form.business_type}
              onChange={(e) => handleChange('business_type', e.target.value)}
              className="w-full bg-[#111827] border border-[#374151] rounded px-4 py-3 font-mono text-sm text-[#F4F4F2] focus:outline-none focus:border-[#00E87A] transition-colors appearance-none"
            >
              <option value="" disabled className="text-[#4B5563]">
                {t('placeholderBusinessType')}
              </option>
              {BUSINESS_TYPES.map((bt) => (
                <option key={bt} value={bt}>
                  {t(`businessTypes.${bt}`)}
                </option>
              ))}
            </select>
            {errors.business_type && (
              <p className="mt-1 font-mono text-xs text-red-400">{errors.business_type}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block font-mono text-xs text-[#9CA3AF] uppercase tracking-widest mb-2">
              {t('labelEmail')} <span className="text-[#00E87A]">*</span>
            </label>
            <input
              type="email"
              value={form.contact_email}
              onChange={(e) => handleChange('contact_email', e.target.value)}
              placeholder={t('placeholderEmail')}
              className="w-full bg-[#111827] border border-[#374151] rounded px-4 py-3 font-mono text-sm text-[#F4F4F2] placeholder-[#4B5563] focus:outline-none focus:border-[#00E87A] transition-colors"
            />
            {errors.contact_email && (
              <p className="mt-1 font-mono text-xs text-red-400">{errors.contact_email}</p>
            )}
          </div>

          {/* Goal */}
          <div>
            <label className="block font-mono text-xs text-[#9CA3AF] uppercase tracking-widest mb-2">
              {t('labelGoal')}
            </label>
            <textarea
              value={form.goal}
              onChange={(e) => handleChange('goal', e.target.value)}
              placeholder={t('placeholderGoal')}
              rows={3}
              className="w-full bg-[#111827] border border-[#374151] rounded px-4 py-3 font-mono text-sm text-[#F4F4F2] placeholder-[#4B5563] focus:outline-none focus:border-[#00E87A] transition-colors resize-none"
            />
          </div>

          {/* Current site */}
          <div>
            <label className="block font-mono text-xs text-[#9CA3AF] uppercase tracking-widest mb-2">
              {t('labelCurrentSite')}
            </label>
            <input
              type="url"
              value={form.current_site}
              onChange={(e) => handleChange('current_site', e.target.value)}
              placeholder={t('placeholderCurrentSite')}
              className="w-full bg-[#111827] border border-[#374151] rounded px-4 py-3 font-mono text-sm text-[#F4F4F2] placeholder-[#4B5563] focus:outline-none focus:border-[#00E87A] transition-colors"
            />
          </div>

          {/* Timeline */}
          <div>
            <label className="block font-mono text-xs text-[#9CA3AF] uppercase tracking-widest mb-2">
              {t('labelTimeline')}
            </label>
            <input
              type="text"
              value={form.timeline}
              onChange={(e) => handleChange('timeline', e.target.value)}
              placeholder={t('placeholderTimeline')}
              className="w-full bg-[#111827] border border-[#374151] rounded px-4 py-3 font-mono text-sm text-[#F4F4F2] placeholder-[#4B5563] focus:outline-none focus:border-[#00E87A] transition-colors"
            />
          </div>

          {/* Error banner */}
          {status === 'error' && (
            <p className="font-mono text-xs text-red-400 text-center">{t('errorGeneric')}</p>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-[#00E87A] text-[#0D0D0D] font-heading font-bold uppercase tracking-widest text-sm py-4 rounded hover:bg-[#00ff88] active:scale-95 transition-all duration-150 shadow-[0_0_24px_rgba(0,232,122,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? t('submitting') : t('submit')}
            </button>
            <p className="mt-3 text-center text-[#374151] font-mono text-xs">{t('note')}</p>
          </div>
        </form>
      </div>
    </div>
  );
}
