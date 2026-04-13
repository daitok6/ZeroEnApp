// src/components/dashboard/request-card.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MessageSquare, ChevronDown, ChevronUp, XCircle } from 'lucide-react';
import { InvoicePanel } from './invoice-panel';
import { CommentThread } from '@/components/shared/comment-thread';

interface Invoice {
  id: string;
  amount_cents: number;
  description: string;
  due_date: string | null;
  currency: string;
  status: string;
}

interface RequestCardProps {
  request: {
    id: string;
    title: string;
    description: string;
    status: string;
    tier: string | null;
    estimated_cost_cents: number | null;
    created_at: string;
  };
  invoice: Invoice | null;
  commentCount: number;
  locale: string;
  userId: string;
}

const STATUS_COLORS: Record<string, string> = {
  submitted: 'text-blue-400 border-blue-400/30',
  reviewing: 'text-yellow-400 border-yellow-400/30',
  quoted: 'text-orange-400 border-orange-400/30',
  approved: 'text-[#00E87A] border-[#00E87A]/30',
  in_progress: 'text-[#00E87A] border-[#00E87A]/30',
  completed: 'text-[#6B7280] border-[#6B7280]/30',
  rejected: 'text-red-400 border-red-400/30',
};

const CANCELLABLE_STATUSES = new Set(['submitted', 'reviewing', 'quoted']);

export function RequestCard({ request, invoice, commentCount, locale, userId }: RequestCardProps) {
  const router = useRouter();
  const t = useTranslations('common.status');
  const tReq = useTranslations('requests');
  const tCommon = useTranslations('common');
  const [expanded, setExpanded] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  const statusColor = STATUS_COLORS[request.status] ?? STATUS_COLORS.submitted;
  const statusKey = request.status === 'in_progress' ? 'inProgress' : request.status;
  const statusLabel = t(statusKey as Parameters<typeof t>[0]);

  const TIER_LABELS: Record<string, string> = {
    small: tReq('sizeSmall'),
    medium: tReq('sizeMedium'),
    large: tReq('sizeLarge'),
  };

  const tierLabel = request.tier ? TIER_LABELS[request.tier] : null;
  const showInvoicePanel =
    request.status === 'quoted' && invoice && invoice.status === 'pending';

  const invoiceWasDeclined =
    invoice?.status === 'declined' && request.status === 'reviewing';

  const canCancel = CANCELLABLE_STATUSES.has(request.status);

  async function handleCancel() {
    setCancelling(true);
    setCancelError('');
    try {
      const res = await fetch(`/api/requests/${request.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason.trim() || undefined }),
      });
      if (res.ok) {
        setShowCancelModal(false);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setCancelError(data.error ?? tCommon('somethingWentWrong'));
      }
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="border border-[#374151] rounded-lg p-4 bg-[#111827]">
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-[#F4F4F2] text-sm font-mono font-bold">{request.title}</p>
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
          {invoiceWasDeclined && (
            <span className="text-xs font-mono border px-2 py-0.5 rounded text-red-400 border-red-400/30">
              {tReq('needsRequote')}
            </span>
          )}
          <span className={`text-xs font-mono border px-2 py-0.5 rounded ${statusColor}`}>
            {statusLabel}
          </span>
        </div>
      </div>
      <p className="text-[#9CA3AF] text-xs font-mono mb-2 line-clamp-2">{request.description}</p>
      <div className="flex items-center gap-3">
        {tierLabel && (
          <span className="text-[#6B7280] text-xs font-mono">
            {tierLabel}
          </span>
        )}
        {request.estimated_cost_cents != null && (
          <span className="text-[#00E87A] text-xs font-mono">
            ${(request.estimated_cost_cents / 100).toLocaleString()}
          </span>
        )}
        <span className="text-[#374151] text-xs font-mono ml-auto">
          {new Date(request.created_at).toLocaleDateString()}
        </span>
      </div>

      {showInvoicePanel && (
        <InvoicePanel
          requestId={request.id}
          invoice={invoice}
          locale={locale}
          userId={userId}
        />
      )}

      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-mono text-[#6B7280] hover:text-[#F4F4F2] transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{tReq('discussion')}</span>
          {commentCount > 0 && (
            <span className="bg-[#374151] text-[#F4F4F2] text-[10px] px-1.5 py-0.5 rounded-full leading-none">
              {commentCount}
            </span>
          )}
          {expanded ? (
            <ChevronUp className="w-3 h-3 ml-0.5" />
          ) : (
            <ChevronDown className="w-3 h-3 ml-0.5" />
          )}
        </button>

        {canCancel && (
          <button
            type="button"
            onClick={() => setShowCancelModal(true)}
            className="flex items-center gap-1.5 text-xs font-mono text-[#6B7280] hover:text-red-400 transition-colors ml-auto"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>{tReq('cancelRequest')}</span>
          </button>
        )}
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-[#374151]">
          <CommentThread requestId={request.id} currentUserId={userId} locale={locale} />
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => !cancelling && setShowCancelModal(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-sm bg-[#111827] border border-[#374151] rounded-xl p-5 space-y-4">
            <h3 className="text-[#F4F4F2] text-sm font-bold font-heading">
              {tReq('cancelConfirm')}
            </h3>
            <p className="text-[#9CA3AF] text-xs font-mono">
              {tReq('cancelDescription')}
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder={tReq('cancelReasonPlaceholder')}
              rows={3}
              className="w-full bg-[#0D0D0D] border border-[#374151] rounded px-3 py-2 text-xs font-mono text-[#F4F4F2] placeholder-[#6B7280] focus:outline-none focus:border-[#00E87A]/50 resize-none"
            />
            {cancelError && (
              <p className="text-red-400 text-xs font-mono">{cancelError}</p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="flex-1 py-2 rounded-lg border border-[#374151] text-[#9CA3AF] text-xs font-mono hover:border-[#6B7280] disabled:opacity-50 transition-colors"
              >
                {tCommon('cancel')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 py-2 rounded-lg bg-red-400/10 border border-red-400/30 text-red-400 text-xs font-mono hover:bg-red-400/20 disabled:opacity-50 transition-colors"
              >
                {cancelling ? '…' : tReq('cancelRequest')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
