'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface PayButtonProps {
  type: 'subscription' | 'per_request';
  invoiceId?: string;
  locale: string;
  label: string;
  compact?: boolean;
}

export function PayButton({
  type,
  invoiceId,
  locale,
  label,
  compact = false,
}: PayButtonProps) {
  const tCommon = useTranslations('common');
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, invoiceId, locale }),
      });
      const { url, error } = await res.json();
      if (error) {
        alert(error);
        return;
      }
      if (url) window.location.href = url;
    } catch {
      alert(tCommon('somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className={`bg-[#00E87A] text-[#0D0D0D] font-bold font-mono uppercase tracking-widest rounded hover:bg-[#00E87A]/90 transition-colors disabled:opacity-50 ${
        compact ? 'text-xs px-3 py-1.5' : 'text-xs px-4 py-2.5 w-full sm:w-auto'
      }`}
    >
      {loading ? '...' : label}
    </button>
  );
}
