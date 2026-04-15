'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { trackEvent } from '@/components/analytics/google-analytics';

type OccupationKey = 'coach' | 'therapist' | 'counselor' | 'other';

type Messages = {
  form: {
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    occupation: string;
    occupationPlaceholder: string;
    occupationCoach: string;
    occupationTherapist: string;
    occupationCounselor: string;
    occupationOther: string;
    currentSite: string;
    currentSitePlaceholder: string;
    challenge: string;
    challengePlaceholder: string;
    consent: string;
    submit: string;
    submitting: string;
    fieldRequired: string;
    emailInvalid: string;
  };
};

type Props = {
  locale: string;
  messages: Messages;
};

export function ApplyForm({ locale, messages }: Props) {
  const router = useRouter();
  const { form: t } = messages;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [occupation, setOccupation] = useState<OccupationKey | ''>('');
  const [currentSite, setCurrentSite] = useState('');
  const [challenge, setChallenge] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attribution, setAttribution] = useState<string>('direct');
  const hasTrackedStart = useRef(false);

  // Read first-touch attribution from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('attribution_source');
      if (stored) setAttribution(stored);
    } catch {
      // localStorage unavailable — silently use 'direct'
    }
  }, []);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = t.fieldRequired;
    if (!email.trim()) next.email = t.fieldRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = t.emailInvalid;
    if (!occupation) next.occupation = t.fieldRequired;
    if (!challenge.trim()) next.challenge = t.fieldRequired;
    if (!consent) next.consent = t.fieldRequired;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleFirstFocus() {
    if (hasTrackedStart.current) return;
    hasTrackedStart.current = true;
    trackEvent({ action: 'apply_start' });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    // Parse attribution into UTM meta
    const parts = attribution.split('/');
    const attributionMeta: Record<string, string> = {};
    if (parts.length >= 1 && parts[0] !== 'direct') {
      attributionMeta.utm_source = parts[0];
      if (parts[1]) attributionMeta.utm_medium = parts[1];
      if (parts[2]) attributionMeta.utm_campaign = parts[2];
    }

    // Merge URL search params for full UTM capture (if available)
    try {
      const url = new URL(window.location.href);
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => {
        const v = url.searchParams.get(k);
        if (v) attributionMeta[k] = v;
      });
    } catch {
      // Non-critical
    }

    try {
      const res = await fetch('/api/lp-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          occupation,
          current_site_url: currentSite.trim() || undefined,
          challenge: challenge.trim(),
          first_touch: attribution,
          attribution_meta: Object.keys(attributionMeta).length > 0 ? attributionMeta : undefined,
          locale,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Submission failed');
      }

      // Track conversion in GA4 (Google Ads conversion fires on thank-you page mount)
      trackEvent({
        action: 'apply_submit',
        params: {
          icp_segment: occupation,
          referral_source: attribution,
        },
      });

      router.push(`/${locale}/apply/thank-you`);
    } catch (err) {
      console.error('Apply form submit error:', err);
      setErrors({ submit: err instanceof Error ? err.message : 'Submission failed. Please try again.' });
      setSubmitting(false);
    }
  }

  const inputClass = `
    w-full bg-[#111827] border border-[#1F2937] rounded px-4 py-3
    text-[#F4F4F2] font-mono text-sm placeholder:text-[#4B5563]
    focus:outline-none focus:border-[#00E87A]/60 focus:ring-1 focus:ring-[#00E87A]/30
    transition-colors
  `;

  const labelClass = 'block text-[#9CA3AF] font-mono text-xs uppercase tracking-widest mb-2';

  const errorClass = 'mt-1 text-red-400 font-mono text-xs';

  const occupationOptions: { value: OccupationKey; label: string }[] = [
    { value: 'coach', label: t.occupationCoach },
    { value: 'therapist', label: t.occupationTherapist },
    { value: 'counselor', label: t.occupationCounselor },
    { value: 'other', label: t.occupationOther },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="apply-name" className={labelClass}>
          {t.name} <span className="text-red-400">*</span>
        </label>
        <input
          id="apply-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={handleFirstFocus}
          placeholder={t.namePlaceholder}
          className={inputClass}
          autoComplete="name"
          maxLength={100}
        />
        {errors.name && <p className={errorClass}>{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="apply-email" className={labelClass}>
          {t.email} <span className="text-red-400">*</span>
        </label>
        <input
          id="apply-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={handleFirstFocus}
          placeholder={t.emailPlaceholder}
          className={inputClass}
          autoComplete="email"
        />
        {errors.email && <p className={errorClass}>{errors.email}</p>}
      </div>

      {/* Occupation */}
      <div>
        <label htmlFor="apply-occupation" className={labelClass}>
          {t.occupation} <span className="text-red-400">*</span>
        </label>
        <select
          id="apply-occupation"
          value={occupation}
          onChange={(e) => setOccupation(e.target.value as OccupationKey | '')}
          onFocus={handleFirstFocus}
          className={`${inputClass} appearance-none`}
        >
          <option value="" disabled className="bg-[#111827]">
            {t.occupationPlaceholder}
          </option>
          {occupationOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#111827]">
              {opt.label}
            </option>
          ))}
        </select>
        {errors.occupation && <p className={errorClass}>{errors.occupation}</p>}
      </div>

      {/* Current site URL (optional) */}
      <div>
        <label htmlFor="apply-site" className={labelClass}>
          {t.currentSite}
        </label>
        <input
          id="apply-site"
          type="url"
          value={currentSite}
          onChange={(e) => setCurrentSite(e.target.value)}
          placeholder={t.currentSitePlaceholder}
          className={inputClass}
          autoComplete="url"
        />
      </div>

      {/* Challenge */}
      <div>
        <label htmlFor="apply-challenge" className={labelClass}>
          {t.challenge} <span className="text-red-400">*</span>
        </label>
        <textarea
          id="apply-challenge"
          value={challenge}
          onChange={(e) => setChallenge(e.target.value)}
          onFocus={handleFirstFocus}
          placeholder={t.challengePlaceholder}
          rows={4}
          maxLength={1000}
          className={`${inputClass} resize-none`}
        />
        {errors.challenge && <p className={errorClass}>{errors.challenge}</p>}
      </div>

      {/* APPI Consent checkbox — required by JP privacy law */}
      <div className="flex items-start gap-3">
        <input
          id="apply-consent"
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[#00E87A] cursor-pointer"
        />
        <label htmlFor="apply-consent" className="text-[#6B7280] font-mono text-xs leading-relaxed cursor-pointer">
          {t.consent}{' '}
          <a href={`/${locale}/privacy`} className="text-[#00E87A] hover:underline" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
        </label>
      </div>
      {errors.consent && <p className={errorClass}>{errors.consent}</p>}

      {/* Submit error */}
      {errors.submit && (
        <p className="text-red-400 font-mono text-xs border border-red-400/20 rounded px-3 py-2 bg-red-400/5">
          {errors.submit}
        </p>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={submitting}
        className="
          w-full
          bg-[#00E87A] text-[#0D0D0D]
          font-heading font-bold
          uppercase tracking-widest
          text-sm
          px-8 py-4
          rounded
          hover:bg-[#00ff88]
          active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
          transition-all duration-150
          shadow-[0_0_24px_rgba(0,232,122,0.4)]
          hover:shadow-[0_0_36px_rgba(0,232,122,0.6)]
          min-h-[48px]
        "
      >
        {submitting ? t.submitting : t.submit}
      </button>
    </form>
  );
}
