// src/components/dashboard/invoice-panel.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CheckCircle, XCircle, MessageCircle, ExternalLink } from 'lucide-react';
import { formatJpy } from '@/lib/format-jpy';
import { CommentThread } from '@/components/shared/comment-thread';

interface InvoicePanelProps {
  requestId: string;
  invoice: {
    id: string;
    amount_cents: number;
    description: string;
    due_date: string | null;
    currency: string;
    stripe_hosted_invoice_url?: string | null;
  };
  locale: string;
  userId: string;
}

export function InvoicePanel({ requestId, invoice, locale, userId }: InvoicePanelProps) {
  const hostedUrl = invoice.stripe_hosted_invoice_url ?? null;
  const router = useRouter();
  const t = useTranslations('invoices');
  const tCommon = useTranslations('common');
  const [loading, setLoading] = useState<'accept' | 'decline' | null>(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleAccept() {
    setLoading('accept');
    try {
      const res = await fetch(`/api/requests/${requestId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept', locale }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.approved) {
        setSuccess(true);
        router.refresh();
      }
    } finally {
      setLoading(null);
    }
  }

  async function handleDecline() {
    setLoading('decline');
    try {
      await fetch(`/api/requests/${requestId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'decline', locale, reason: declineReason }),
      });
      setShowDeclineModal(false);
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  if (success) {
    return (
      <div className="mt-3 rounded-lg bg-[#00E87A]/10 border border-[#00E87A]/30 px-4 py-3">
        <p className="text-[#00E87A] text-xs font-mono">
          {t('approvedMessage')}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-3 rounded-lg bg-[#1a2433] border border-[#00E87A]/20 p-4 space-y-3">
        <p className="text-[#6B7280] text-[10px] font-mono uppercase tracking-wider">
          {t('invoice')}
        </p>

        <div className="flex items-baseline gap-3">
          <span className="text-[#00E87A] text-xl font-bold font-mono">
            {invoice.amount_cents === 0
              ? t('free')
              : formatJpy(invoice.amount_cents)}
          </span>
          {invoice.amount_cents === 0 && (
            <span className="text-[#6B7280] text-xs font-mono">
              {t('includedInPlan')}
            </span>
          )}
        </div>

        <p className="text-[#9CA3AF] text-xs font-mono">{invoice.description}</p>

        {invoice.due_date && (
          <p className="text-[#6B7280] text-xs font-mono">
            {t('due')} {new Date(invoice.due_date).toLocaleDateString()}
          </p>
        )}

        <div className="flex gap-2 flex-wrap pt-1">
          <button
            onClick={handleAccept}
            disabled={loading !== null}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00E87A] text-[#0D0D0D] text-xs font-mono font-bold hover:bg-[#00E87A]/90 disabled:opacity-50 transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            {loading === 'accept'
              ? '…'
              : (invoice.amount_cents > 0 ? t('acceptAndPay') : t('accept'))}
          </button>

          {hostedUrl && invoice.amount_cents > 0 && (
            <a
              href={hostedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#374151] text-[#9CA3AF] text-xs font-mono hover:border-[#6B7280] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {locale === 'ja' ? '請求書を見る' : 'View invoice'}
            </a>
          )}

          <button
            onClick={() => setShowComments((v) => !v)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#374151] text-[#9CA3AF] text-xs font-mono hover:border-[#6B7280] transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            {t('discuss')}
          </button>

          <button
            onClick={() => setShowDeclineModal(true)}
            disabled={loading !== null}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-400/30 text-red-400 text-xs font-mono hover:bg-red-400/10 disabled:opacity-50 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            {t('decline')}
          </button>
        </div>

        {showComments && (
          <div className="pt-3 border-t border-[#374151]">
            <CommentThread
              requestId={requestId}
              currentUserId={userId}
              locale={locale}
            />
          </div>
        )}
      </div>

      {/* Decline modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowDeclineModal(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-sm bg-[#111827] border border-[#374151] rounded-xl p-5 space-y-4">
            <h3 className="text-[#F4F4F2] text-sm font-bold font-heading">
              {t('declineConfirm')}
            </h3>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder={t('declineReason')}
              rows={3}
              className="w-full bg-[#0D0D0D] border border-[#374151] rounded px-3 py-2 text-xs font-mono text-[#F4F4F2] placeholder-[#6B7280] focus:outline-none focus:border-[#00E87A]/50 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeclineModal(false)}
                className="flex-1 py-2 rounded-lg border border-[#374151] text-[#9CA3AF] text-xs font-mono hover:border-[#6B7280] transition-colors"
              >
                {tCommon('cancel')}
              </button>
              <button
                onClick={handleDecline}
                disabled={loading !== null}
                className="flex-1 py-2 rounded-lg bg-red-400/10 border border-red-400/30 text-red-400 text-xs font-mono hover:bg-red-400/20 disabled:opacity-50 transition-colors"
              >
                {loading === 'decline' ? '…' : t('decline')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
