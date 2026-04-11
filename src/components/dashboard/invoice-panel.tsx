// src/components/dashboard/invoice-panel.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { CommentThread } from '@/components/shared/comment-thread';

interface InvoicePanelProps {
  requestId: string;
  invoice: {
    id: string;
    amount_cents: number;
    description: string;
    due_date: string | null;
    currency: string;
  };
  locale: string;
  userId: string;
}

export function InvoicePanel({ requestId, invoice, locale, userId }: InvoicePanelProps) {
  const router = useRouter();
  const isJa = locale === 'ja';
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
          {isJa ? '✓ 承認されました。作業を開始します。' : '✓ Approved. Work will begin shortly.'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-3 rounded-lg bg-[#1a2433] border border-[#00E87A]/20 p-4 space-y-3">
        <p className="text-[#6B7280] text-[10px] font-mono uppercase tracking-wider">
          {isJa ? '請求書' : 'Invoice'}
        </p>

        <div className="flex items-baseline gap-3">
          <span className="text-[#00E87A] text-xl font-bold font-mono">
            {invoice.amount_cents === 0
              ? (isJa ? '無料' : 'Free')
              : `$${(invoice.amount_cents / 100).toLocaleString()}`}
          </span>
          {invoice.amount_cents === 0 && (
            <span className="text-[#6B7280] text-xs font-mono">
              {isJa ? 'プランに含まれています' : 'Included in your plan'}
            </span>
          )}
        </div>

        <p className="text-[#9CA3AF] text-xs font-mono">{invoice.description}</p>

        {invoice.due_date && (
          <p className="text-[#6B7280] text-xs font-mono">
            {isJa ? '期日: ' : 'Due: '}
            {new Date(invoice.due_date).toLocaleDateString()}
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
              : (isJa ? '承認する' : (invoice.amount_cents > 0 ? 'Accept & Pay' : 'Accept'))}
          </button>

          <button
            onClick={() => setShowComments((v) => !v)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#374151] text-[#9CA3AF] text-xs font-mono hover:border-[#6B7280] transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            {isJa ? '相談する' : 'Discuss'}
          </button>

          <button
            onClick={() => setShowDeclineModal(true)}
            disabled={loading !== null}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-400/30 text-red-400 text-xs font-mono hover:bg-red-400/10 disabled:opacity-50 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            {isJa ? '断る' : 'Decline'}
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
              {isJa ? '断りますか？' : 'Decline this invoice?'}
            </h3>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder={isJa ? '理由（任意）' : 'Reason (optional)'}
              rows={3}
              className="w-full bg-[#0D0D0D] border border-[#374151] rounded px-3 py-2 text-xs font-mono text-[#F4F4F2] placeholder-[#6B7280] focus:outline-none focus:border-[#00E87A]/50 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeclineModal(false)}
                className="flex-1 py-2 rounded-lg border border-[#374151] text-[#9CA3AF] text-xs font-mono hover:border-[#6B7280] transition-colors"
              >
                {isJa ? 'キャンセル' : 'Cancel'}
              </button>
              <button
                onClick={handleDecline}
                disabled={loading !== null}
                className="flex-1 py-2 rounded-lg bg-red-400/10 border border-red-400/30 text-red-400 text-xs font-mono hover:bg-red-400/20 disabled:opacity-50 transition-colors"
              >
                {loading === 'decline' ? '…' : (isJa ? '断る' : 'Decline')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
