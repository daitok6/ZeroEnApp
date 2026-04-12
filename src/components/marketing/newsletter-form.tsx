'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export function NewsletterForm({ locale }: { locale: string }) {
  const t = useTranslations('footer.newsletter');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <p className="text-[#00E87A] text-sm font-mono">
        {t('subscribed')}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 bg-[#111827] border border-[#374151] text-[#F4F4F2] text-sm font-mono px-3 py-2 rounded focus:outline-none focus:border-[#00E87A] placeholder:text-[#6B7280]"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-[#00E87A] text-[#0D0D0D] text-xs font-bold px-3 py-2 rounded tracking-wider uppercase hover:bg-[#00E87A]/90 transition-colors disabled:opacity-50"
      >
        {t('join')}
      </button>
    </form>
  );
}
