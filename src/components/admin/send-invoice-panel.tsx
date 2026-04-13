'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import type { RequestRow } from '@/lib/admin/requests';

interface SendInvoicePanelProps {
  request: RequestRow;
  locale: string;
  onClose: () => void;
}

export function SendInvoicePanel({ request, locale: _locale, onClose }: SendInvoicePanelProps) {
  const router = useRouter();
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');

  const defaultAmount = request.estimatedCostCents !== null
    ? String(request.estimatedCostCents / 100)
    : '';

  const [amountYen, setAmountYen] = useState(defaultAmount);
  const [description, setDescription] = useState(request.title);
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [hostedUrl, setHostedUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    // JPY is zero-decimal — store as integer yen, not cents
    const amountYenInt = Math.round(parseFloat(amountYen || '0'));
    if (isNaN(amountYenInt) || amountYenInt < 0) {
      setError(t('invalidAmount'));
      return;
    }
    if (!description.trim()) {
      setError(t('enterDescription'));
      return;
    }
    setSubmitting(true);
    const res = await fetch(`/api/admin/requests/${request.id}/invoice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount_cents: amountYenInt,
        description: description.trim(),
        due_date: dueDate || null,
      }),
    });
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      router.refresh();
      if (data.hostedInvoiceUrl) {
        setHostedUrl(data.hostedInvoiceUrl);
      } else {
        onClose();
      }
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? tCommon('somethingWentWrong'));
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="invoice-dialog-title"
        className="relative w-full max-w-md bg-[#111827] border border-[#374151] rounded-xl p-6 space-y-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="invoice-dialog-title" className="text-[#F4F4F2] text-sm font-bold font-heading">
              {t('sendInvoice')}
            </h2>
            <p className="text-[#6B7280] text-xs font-mono mt-0.5 line-clamp-1">
              {request.title}
            </p>
          </div>
          <button onClick={onClose} aria-label={tCommon('close')} className="text-[#6B7280] hover:text-[#F4F4F2] transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Request description for reference */}
        <div className="bg-[#0D0D0D] rounded-lg p-3 border border-[#374151]">
          <p className="text-[#9CA3AF] text-xs font-mono line-clamp-3">{request.description}</p>
        </div>

        {hostedUrl && (
          <div className="space-y-3">
            <p className="text-[#00E87A] text-xs font-mono">
              {t('invoiceSent')}
            </p>
            <div className="flex items-center gap-2 bg-[#0D0D0D] border border-[#374151] rounded px-3 py-2">
              <span className="text-[#9CA3AF] text-xs font-mono truncate flex-1">{hostedUrl}</span>
              <button
                type="button"
                onClick={() => { navigator.clipboard.writeText(hostedUrl); }}
                className="text-[#6B7280] hover:text-[#F4F4F2] text-xs font-mono shrink-0 transition-colors"
              >
                {t('copy')}
              </button>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 rounded-lg border border-[#374151] text-[#9CA3AF] text-xs font-mono hover:border-[#6B7280] transition-colors"
            >
              {tCommon('close')}
            </button>
          </div>
        )}
        {!hostedUrl && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#6B7280] text-xs font-mono uppercase tracking-wider mb-1.5">
              {t('amount')}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[#6B7280] font-mono text-sm">¥</span>
              <input
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={amountYen}
                onChange={(e) => setAmountYen(e.target.value)}
                placeholder="0"
                className="flex-1 bg-[#0D0D0D] border border-[#374151] rounded px-3 py-2 text-sm font-mono text-[#F4F4F2] placeholder-[#6B7280] focus:outline-none focus:border-[#00E87A]/50"
              />
            </div>
            <p className="text-[#6B7280] text-[10px] font-mono mt-1">
              {t('amountHelper')}
            </p>
          </div>

          <div>
            <label className="block text-[#6B7280] text-xs font-mono uppercase tracking-wider mb-1.5">
              {t('description')}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-[#374151] rounded px-3 py-2 text-sm font-mono text-[#F4F4F2] placeholder-[#6B7280] focus:outline-none focus:border-[#00E87A]/50"
            />
          </div>

          <div>
            <label className="block text-[#6B7280] text-xs font-mono uppercase tracking-wider mb-1.5">
              {t('dueDate')}
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-[#374151] rounded px-3 py-2 text-sm font-mono text-[#F4F4F2] focus:outline-none focus:border-[#00E87A]/50"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs font-mono">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-lg bg-[#00E87A] text-[#0D0D0D] text-sm font-mono font-bold hover:bg-[#00E87A]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? t('sending') : t('sendInvoice')}
          </button>
        </form>
        )}
      </div>
    </div>
  );
}
