'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AdminSearchFilterBar } from '@/components/admin/admin-search-filter-bar';
import { ChevronDown, ChevronUp, MessageCircle, X } from 'lucide-react';
import { SendInvoicePanel } from './send-invoice-panel';
import { CommentThread } from '@/components/shared/comment-thread';
import type { RequestRow } from '@/lib/admin/requests';
import { formatJpy } from '@/lib/format-jpy';

type Tab = 'all' | 'needs_review' | 'quoted' | 'in_progress' | 'completed';

const TABS: Tab[] = ['all', 'needs_review', 'quoted', 'in_progress', 'completed'];

const TIER_COLORS: Record<string, string> = {
  small: 'text-blue-300 border-blue-300/30',
  medium: 'text-purple-400 border-purple-400/30',
  large: 'text-orange-400 border-orange-400/30',
};

const STATUS_COLORS: Record<string, string> = {
  submitted: 'text-blue-400 border-blue-400/30',
  reviewing: 'text-yellow-400 border-yellow-400/30',
  quoted: 'text-orange-400 border-orange-400/30',
  approved: 'text-[#00E87A] border-[#00E87A]/30',
  in_progress: 'text-[#00E87A] border-[#00E87A]/30',
  completed: 'text-[#6B7280] border-[#6B7280]/30',
  rejected: 'text-red-400 border-red-400/30',
};

function tabFilter(tab: Tab, status: string): boolean {
  if (tab === 'all') return true;
  if (tab === 'needs_review') return status === 'submitted' || status === 'reviewing';
  if (tab === 'quoted') return status === 'quoted';
  if (tab === 'in_progress') return status === 'approved' || status === 'in_progress';
  if (tab === 'completed') return status === 'completed' || status === 'rejected';
  return false;
}

interface RequestTableProps {
  requests: RequestRow[];
  locale: string;
  adminUserId: string;
}

export function RequestTable({ requests, locale, adminUserId }: RequestTableProps) {
  const router = useRouter();
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const tStatus = useTranslations('common.status');
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [panelRequest, setPanelRequest] = useState<RequestRow | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [statusLoading, setStatusLoading] = useState<string | null>(null);
  const [approveLoading, setApproveLoading] = useState<string | null>(null);
  const [rejectState, setRejectState] = useState<{ id: string; comment: string } | null>(null);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    let rows = requests.filter((r) => tabFilter(activeTab, r.status));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.clientName?.toLowerCase().includes(q) ?? false) ||
          (r.clientEmail?.toLowerCase().includes(q) ?? false) ||
          (r.projectName?.toLowerCase().includes(q) ?? false),
      );
    }
    if (activeFilters.tier) rows = rows.filter((r) => r.tier === activeFilters.tier);
    return rows;
  }, [requests, activeTab, searchQuery, activeFilters]);

  function getTabLabel(tab: Tab): string {
    switch (tab) {
      case 'all': return tCommon('all');
      case 'needs_review': return t('needsReview');
      case 'quoted': return tStatus('quoted');
      case 'in_progress': return tStatus('inProgress');
      case 'completed': return tStatus('completed');
    }
  }

  function getStatusLabel(status: string): string {
    const key = status === 'in_progress' ? 'inProgress' : status;
    try {
      return tStatus(key as Parameters<typeof tStatus>[0]);
    } catch {
      return status;
    }
  }

  function getActionLabel(req: RequestRow): string | null {
    if (req.status === 'submitted') return t('markReviewing');
    if (req.status === 'reviewing') return t('sendInvoice');
    if (req.status === 'approved') return t('markInProgress');
    if (req.status === 'in_progress') return t('markComplete');
    return null;
  }

  function toggleComments(id: string) {
    setExpandedComments((prev) => {
      const next = new Set(prev);
      const opening = !prev.has(id);
      if (opening) {
        next.add(id);
        void fetch(`/api/requests/${id}/read`, { method: 'POST' });
        window.dispatchEvent(new CustomEvent('zeroen:request-read', { detail: { requestId: id } }));
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  async function updateStatus(requestId: string, status: string) {
    setStatusLoading(requestId);
    try {
      const res = await fetch(`/api/admin/requests/${requestId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) return;
      await router.refresh();
    } catch {
      // network error — loading spinner cleared in finally
    } finally {
      setStatusLoading(null);
    }
  }

  async function approveRequest(requestId: string) {
    setApproveLoading(requestId);
    try {
      const res = await fetch(`/api/admin/requests/${requestId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });
      if (!res.ok) return;
      await router.refresh();
    } catch {
      // network error
    } finally {
      setApproveLoading(null);
    }
  }

  async function rejectRequest(requestId: string, comment: string) {
    if (!comment.trim()) return;
    setRejectLoading(true);
    try {
      const res = await fetch(`/api/admin/requests/${requestId}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment }),
      });
      if (!res.ok) return;
      setRejectState(null);
      await router.refresh();
    } catch {
      // network error
    } finally {
      setRejectLoading(false);
    }
  }

  const tabCounts: Record<Tab, number> = {
    all: requests.length,
    needs_review: requests.filter((r) => r.status === 'submitted' || r.status === 'reviewing').length,
    quoted: requests.filter((r) => r.status === 'quoted').length,
    in_progress: requests.filter((r) => r.status === 'approved' || r.status === 'in_progress').length,
    completed: requests.filter((r) => r.status === 'completed' || r.status === 'rejected').length,
  };

  return (
    <>
      {/* Filter tabs */}
      <div className="flex gap-1 flex-wrap mb-3">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              activeTab === tab
                ? 'bg-[#00E87A]/10 text-[#00E87A] border border-[#00E87A]/30'
                : 'text-[#6B7280] border border-[#374151] hover:border-[#6B7280]'
            }`}
          >
            {getTabLabel(tab)}
            {tabCounts[tab] > 0 && (
              <span className="ml-1.5 opacity-70">{tabCounts[tab]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Search + size filter */}
      <div className="mb-4">
        <AdminSearchFilterBar
          placeholder={locale === 'ja' ? 'タイトル・クライアントで検索…' : 'Search by title or client…'}
          filters={[{
            key: 'tier',
            label: locale === 'ja' ? '規模' : 'Size',
            options: [
              { value: 'small', label: locale === 'ja' ? '小' : 'Small' },
              { value: 'medium', label: locale === 'ja' ? '中' : 'Medium' },
              { value: 'large', label: locale === 'ja' ? '大' : 'Large' },
            ],
          }]}
          activeFilters={activeFilters}
          onSearchChange={setSearchQuery}
          onFilterChange={(key, value) => setActiveFilters((prev) => ({ ...prev, [key]: value }))}
          onClear={() => { setSearchQuery(''); setActiveFilters({}); }}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="border border-[#374151] rounded-lg bg-[#111827] p-8 text-center">
          <p className="text-[#6B7280] font-mono text-sm">
            {t('noRequests')}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((req) => {
            const statusColor = STATUS_COLORS[req.status] ?? 'text-[#6B7280] border-[#6B7280]/30';
            const tierColor = TIER_COLORS[req.tier ?? ''] ?? 'text-[#6B7280] border-[#6B7280]/30';
            const commentsOpen = expandedComments.has(req.id);
            const isLoading = statusLoading === req.id;
            const isApproving = approveLoading === req.id;
            const isRejecting = rejectState?.id === req.id;
            const canApproveReject = req.status === 'submitted' || req.status === 'reviewing';
            const actionLabel = getActionLabel(req);

            return (
              <div
                key={req.id}
                className="border border-[#374151] rounded-lg bg-[#111827] overflow-hidden"
              >
                {/* Main row */}
                <div className="p-4">
                  {/* Mobile layout */}
                  <div className="space-y-2 md:hidden">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[#F4F4F2] text-sm font-mono font-bold">{req.title}</p>
                      <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                        {req.tier && (
                          <span className={`text-[10px] font-mono border px-2 py-0.5 rounded ${tierColor}`}>
                            {req.tier}
                          </span>
                        )}
                        {req.invoiceStatus === 'declined' && (
                          <span className="text-[10px] font-mono border px-2 py-0.5 rounded text-red-400 border-red-400/30">
                            {t('invoiceDeclined')}
                          </span>
                        )}
                        <span className={`text-[10px] font-mono border px-2 py-0.5 rounded ${statusColor}`}>
                          {getStatusLabel(req.status)}
                        </span>
                      </div>
                    </div>
                    <p className="text-[#9CA3AF] text-xs font-mono">
                      {req.clientName ?? req.clientEmail} · {req.projectName}
                    </p>
                    <p className="text-[#6B7280] text-xs font-mono line-clamp-2">{req.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {req.invoicedAmountCents !== null && (
                        <span className="text-[#00E87A] text-xs font-mono">
                          {formatJpy(req.invoicedAmountCents)}
                        </span>
                      )}
                      <span className="text-[#374151] text-xs font-mono">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2 flex-wrap pt-1">
                      <ActionButton req={req} actionLabel={actionLabel} isLoading={isLoading} updateStatus={updateStatus} setPanelRequest={setPanelRequest} />
                      {canApproveReject && (
                        <button
                          onClick={() => approveRequest(req.id)}
                          disabled={isApproving}
                          className="px-3 py-1.5 text-xs font-mono rounded border border-[#00E87A]/30 text-[#00E87A] hover:bg-[#00E87A]/10 disabled:opacity-50 transition-colors"
                        >
                          {isApproving ? t('approvingRequest') : t('approveRequest')}
                        </button>
                      )}
                      {canApproveReject && !isRejecting && (
                        <button
                          onClick={() => setRejectState({ id: req.id, comment: '' })}
                          className="px-3 py-1.5 text-xs font-mono rounded border border-red-400/30 text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                          {t('rejectRequest')}
                        </button>
                      )}
                      <button
                        onClick={() => toggleComments(req.id)}
                        aria-label={t('discussion')}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-[#374151] text-[#9CA3AF] rounded hover:border-[#6B7280] transition-colors"
                      >
                        <MessageCircle className="w-3 h-3" />
                        {req.commentCount > 0 && (
                          <span className="text-[#00E87A]">{req.commentCount}</span>
                        )}
                        {commentsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>
                    {/* Inline reject form */}
                    {isRejecting && (
                      <div className="space-y-2 pt-1">
                        <textarea
                          value={rejectState?.comment ?? ''}
                          onChange={(e) => setRejectState((s) => s ? { ...s, comment: e.target.value } : null)}
                          placeholder={t('rejectReasonPlaceholder')}
                          rows={2}
                          className="w-full bg-[#0D0D0D] border border-red-400/30 text-[#F4F4F2] text-xs font-mono px-3 py-2 rounded focus:outline-none focus:border-red-400 placeholder:text-[#6B7280] resize-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => rejectRequest(req.id, rejectState?.comment ?? '')}
                            disabled={rejectLoading || !rejectState?.comment.trim()}
                            className="px-3 py-1.5 text-xs font-mono rounded border border-red-400/30 text-red-400 hover:bg-red-400/10 disabled:opacity-50 transition-colors"
                          >
                            {rejectLoading ? t('rejectingRequest') : t('confirmReject')}
                          </button>
                          <button
                            onClick={() => setRejectState(null)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono border border-[#374151] text-[#9CA3AF] rounded hover:border-[#6B7280] transition-colors"
                          >
                            <X className="w-3 h-3" />
                            {t('cancelAction')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden md:grid md:grid-cols-[2fr_1.5fr_2fr_1fr_1fr_auto] gap-4 items-start">
                    <div className="min-w-0">
                      <p className="text-[#F4F4F2] text-sm font-mono font-bold truncate">{req.title}</p>
                      <p className="text-[#9CA3AF] text-xs font-mono truncate mt-0.5">{req.clientName ?? req.clientEmail}</p>
                    </div>
                    <p className="text-[#9CA3AF] text-xs font-mono truncate self-center">{req.projectName}</p>
                    <p className="text-[#6B7280] text-xs font-mono line-clamp-2 self-center">{req.description}</p>
                    <div className="self-center flex items-center gap-1.5 flex-wrap">
                      {req.tier && (
                        <span className={`text-[10px] font-mono border px-2 py-0.5 rounded ${tierColor}`}>
                          {req.tier}
                        </span>
                      )}
                      {req.invoiceStatus === 'declined' && (
                        <span className="text-[10px] font-mono border px-2 py-0.5 rounded text-red-400 border-red-400/30">
                          {t('invoiceDeclined')}
                        </span>
                      )}
                      <span className={`text-[10px] font-mono border px-2 py-0.5 rounded ${statusColor}`}>
                        {getStatusLabel(req.status)}
                      </span>
                    </div>
                    <div className="self-center">
                      {req.invoicedAmountCents !== null ? (
                        <span className="text-[#00E87A] text-xs font-mono">
                          {formatJpy(req.invoicedAmountCents)}
                        </span>
                      ) : (
                        <span className="text-[#374151] text-xs font-mono">—</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 self-center flex-wrap">
                      <ActionButton req={req} actionLabel={actionLabel} isLoading={isLoading} updateStatus={updateStatus} setPanelRequest={setPanelRequest} />
                      {canApproveReject && (
                        <button
                          onClick={() => approveRequest(req.id)}
                          disabled={isApproving}
                          className="px-3 py-1.5 text-xs font-mono rounded border border-[#00E87A]/30 text-[#00E87A] hover:bg-[#00E87A]/10 disabled:opacity-50 transition-colors"
                        >
                          {isApproving ? t('approvingRequest') : t('approveRequest')}
                        </button>
                      )}
                      {canApproveReject && !isRejecting && (
                        <button
                          onClick={() => setRejectState({ id: req.id, comment: '' })}
                          className="px-3 py-1.5 text-xs font-mono rounded border border-red-400/30 text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                          {t('rejectRequest')}
                        </button>
                      )}
                      <button
                        onClick={() => toggleComments(req.id)}
                        aria-label={t('discussion')}
                        className="flex items-center gap-1 p-1.5 text-[#6B7280] hover:text-[#9CA3AF] border border-transparent hover:border-[#374151] rounded transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        {req.commentCount > 0 && (
                          <span className="text-[#00E87A] text-[10px] font-mono">{req.commentCount}</span>
                        )}
                      </button>
                    </div>
                    {/* Inline reject form for desktop */}
                    {isRejecting && (
                      <div className="col-span-6 space-y-2 pt-1 border-t border-[#374151] mt-2">
                        <p className="text-[#9CA3AF] text-[11px] font-mono uppercase tracking-wider">{t('rejectReason')}</p>
                        <textarea
                          value={rejectState?.comment ?? ''}
                          onChange={(e) => setRejectState((s) => s ? { ...s, comment: e.target.value } : null)}
                          placeholder={t('rejectReasonPlaceholder')}
                          rows={2}
                          className="w-full bg-[#0D0D0D] border border-red-400/30 text-[#F4F4F2] text-xs font-mono px-3 py-2 rounded focus:outline-none focus:border-red-400 placeholder:text-[#6B7280] resize-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => rejectRequest(req.id, rejectState?.comment ?? '')}
                            disabled={rejectLoading || !rejectState?.comment.trim()}
                            className="px-3 py-1.5 text-xs font-mono rounded border border-red-400/30 text-red-400 hover:bg-red-400/10 disabled:opacity-50 transition-colors"
                          >
                            {rejectLoading ? t('rejectingRequest') : t('confirmReject')}
                          </button>
                          <button
                            onClick={() => setRejectState(null)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono border border-[#374151] text-[#9CA3AF] rounded hover:border-[#6B7280] transition-colors"
                          >
                            <X className="w-3 h-3" />
                            {t('cancelAction')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Comments panel */}
                {commentsOpen && (
                  <div className="border-t border-[#374151] bg-[#0D0D0D]/60 px-4 py-4">
                    <p className="text-[#6B7280] text-[10px] font-mono uppercase tracking-wider mb-3">
                      {t('discussion')}
                    </p>
                    <CommentThread
                      requestId={req.id}
                      currentUserId={adminUserId}
                      locale={locale}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Send invoice slide-out */}
      {panelRequest && (
        <SendInvoicePanel
          request={panelRequest}
          locale={locale}
          onClose={() => setPanelRequest(null)}
        />
      )}
    </>
  );
}

function ActionButton({
  req,
  actionLabel,
  isLoading,
  updateStatus,
  setPanelRequest,
}: {
  req: RequestRow;
  actionLabel: string | null;
  isLoading: boolean;
  updateStatus: (id: string, status: string) => Promise<void>;
  setPanelRequest: (r: RequestRow) => void;
}) {
  if (req.status === 'submitted') {
    return (
      <button
        onClick={() => updateStatus(req.id, 'reviewing')}
        disabled={isLoading}
        className="px-3 py-1.5 text-xs font-mono rounded border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 disabled:opacity-50 transition-colors"
      >
        {isLoading ? '…' : actionLabel}
      </button>
    );
  }
  if (req.status === 'reviewing') {
    return (
      <button
        onClick={() => setPanelRequest(req)}
        className="px-3 py-1.5 text-xs font-mono rounded border border-[#00E87A]/30 text-[#00E87A] hover:bg-[#00E87A]/10 transition-colors"
      >
        {actionLabel}
      </button>
    );
  }
  if (req.status === 'approved') {
    return (
      <button
        onClick={() => updateStatus(req.id, 'in_progress')}
        disabled={isLoading}
        className="px-3 py-1.5 text-xs font-mono rounded border border-blue-400/30 text-blue-400 hover:bg-blue-400/10 disabled:opacity-50 transition-colors"
      >
        {isLoading ? '…' : actionLabel}
      </button>
    );
  }
  if (req.status === 'in_progress') {
    return (
      <button
        onClick={() => updateStatus(req.id, 'completed')}
        disabled={isLoading}
        className="px-3 py-1.5 text-xs font-mono rounded border border-[#6B7280]/30 text-[#6B7280] hover:bg-[#6B7280]/10 disabled:opacity-50 transition-colors"
      >
        {isLoading ? '…' : actionLabel}
      </button>
    );
  }
  return null;
}
