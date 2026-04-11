'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { SendInvoicePanel } from './send-invoice-panel';
import { CommentThread } from '@/components/shared/comment-thread';
import type { RequestRow } from '@/lib/admin/requests';

type Tab = 'all' | 'needs_review' | 'quoted' | 'in_progress' | 'completed';

const TABS: { key: Tab; labelEn: string; labelJa: string }[] = [
  { key: 'all', labelEn: 'All', labelJa: 'すべて' },
  { key: 'needs_review', labelEn: 'Needs Review', labelJa: '要確認' },
  { key: 'quoted', labelEn: 'Quoted', labelJa: '見積済み' },
  { key: 'in_progress', labelEn: 'In Progress', labelJa: '進行中' },
  { key: 'completed', labelEn: 'Completed', labelJa: '完了' },
];

const STATUS_COLORS: Record<string, string> = {
  submitted: 'text-blue-400 border-blue-400/30',
  reviewing: 'text-yellow-400 border-yellow-400/30',
  quoted: 'text-orange-400 border-orange-400/30',
  approved: 'text-[#00E87A] border-[#00E87A]/30',
  in_progress: 'text-[#00E87A] border-[#00E87A]/30',
  completed: 'text-[#6B7280] border-[#6B7280]/30',
  rejected: 'text-red-400 border-red-400/30',
};

const STATUS_LABELS: Record<string, { en: string; ja: string }> = {
  submitted: { en: 'Submitted', ja: '送信済み' },
  reviewing: { en: 'Reviewing', ja: '確認中' },
  quoted: { en: 'Quoted', ja: '見積済み' },
  approved: { en: 'Approved', ja: '承認済み' },
  in_progress: { en: 'In Progress', ja: '進行中' },
  completed: { en: 'Completed', ja: '完了' },
  rejected: { en: 'Rejected', ja: '却下' },
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
  const isJa = locale === 'ja';
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [panelRequest, setPanelRequest] = useState<RequestRow | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [statusLoading, setStatusLoading] = useState<string | null>(null);

  const filtered = requests.filter((r) => tabFilter(activeTab, r.status));

  function toggleComments(id: string) {
    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
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
      router.refresh();
    } catch {
      // network error — loading spinner cleared in finally
    } finally {
      setStatusLoading(null);
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
      <div className="flex gap-1 flex-wrap mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              activeTab === tab.key
                ? 'bg-[#00E87A]/10 text-[#00E87A] border border-[#00E87A]/30'
                : 'text-[#6B7280] border border-[#374151] hover:border-[#6B7280]'
            }`}
          >
            {isJa ? tab.labelJa : tab.labelEn}
            {tabCounts[tab.key] > 0 && (
              <span className="ml-1.5 opacity-70">{tabCounts[tab.key]}</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="border border-[#374151] rounded-lg bg-[#111827] p-8 text-center">
          <p className="text-[#6B7280] font-mono text-sm">
            {isJa ? 'リクエストはありません' : 'No requests'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((req) => {
            const statusInfo = STATUS_LABELS[req.status] ?? { en: req.status, ja: req.status };
            const statusColor = STATUS_COLORS[req.status] ?? 'text-[#6B7280] border-[#6B7280]/30';
            const commentsOpen = expandedComments.has(req.id);
            const isLoading = statusLoading === req.id;

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
                      <span className={`shrink-0 text-[10px] font-mono border px-2 py-0.5 rounded ${statusColor}`}>
                        {isJa ? statusInfo.ja : statusInfo.en}
                      </span>
                    </div>
                    <p className="text-[#9CA3AF] text-xs font-mono">
                      {req.clientName ?? req.clientEmail} · {req.projectName}
                    </p>
                    <p className="text-[#6B7280] text-xs font-mono line-clamp-2">{req.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {req.invoicedAmountCents !== null && (
                        <span className="text-[#00E87A] text-xs font-mono">
                          ${(req.invoicedAmountCents / 100).toLocaleString()}
                        </span>
                      )}
                      <span className="text-[#374151] text-xs font-mono">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2 flex-wrap pt-1">
                      <ActionButton req={req} isJa={isJa} isLoading={isLoading} updateStatus={updateStatus} setPanelRequest={setPanelRequest} />
                      <button
                        onClick={() => toggleComments(req.id)}
                        aria-label={isJa ? 'コメントを表示' : 'Toggle comments'}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-[#374151] text-[#9CA3AF] rounded hover:border-[#6B7280] transition-colors"
                      >
                        <MessageCircle className="w-3 h-3" />
                        {req.commentCount > 0 && (
                          <span className="text-[#00E87A]">{req.commentCount}</span>
                        )}
                        {commentsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden md:grid md:grid-cols-[2fr_1.5fr_2fr_1fr_1fr_auto] gap-4 items-start">
                    <div className="min-w-0">
                      <p className="text-[#F4F4F2] text-sm font-mono font-bold truncate">{req.title}</p>
                      <p className="text-[#9CA3AF] text-xs font-mono truncate mt-0.5">{req.clientName ?? req.clientEmail}</p>
                    </div>
                    <p className="text-[#9CA3AF] text-xs font-mono truncate self-center">{req.projectName}</p>
                    <p className="text-[#6B7280] text-xs font-mono line-clamp-2 self-center">{req.description}</p>
                    <div className="self-center">
                      <span className={`text-[10px] font-mono border px-2 py-0.5 rounded ${statusColor}`}>
                        {isJa ? statusInfo.ja : statusInfo.en}
                      </span>
                    </div>
                    <div className="self-center">
                      {req.invoicedAmountCents !== null ? (
                        <span className="text-[#00E87A] text-xs font-mono">
                          ${(req.invoicedAmountCents / 100).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-[#374151] text-xs font-mono">—</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 self-center">
                      <ActionButton req={req} isJa={isJa} isLoading={isLoading} updateStatus={updateStatus} setPanelRequest={setPanelRequest} />
                      <button
                        onClick={() => toggleComments(req.id)}
                        aria-label={isJa ? 'コメントを表示' : 'Toggle comments'}
                        className="flex items-center gap-1 p-1.5 text-[#6B7280] hover:text-[#9CA3AF] border border-transparent hover:border-[#374151] rounded transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        {req.commentCount > 0 && (
                          <span className="text-[#00E87A] text-[10px] font-mono">{req.commentCount}</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comments panel */}
                {commentsOpen && (
                  <div className="border-t border-[#374151] bg-[#0D0D0D]/60 px-4 py-4">
                    <p className="text-[#6B7280] text-[10px] font-mono uppercase tracking-wider mb-3">
                      {isJa ? 'コメント' : 'Discussion'}
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
  isJa,
  isLoading,
  updateStatus,
  setPanelRequest,
}: {
  req: RequestRow;
  isJa: boolean;
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
        {isLoading ? '…' : (isJa ? '確認中にする' : 'Mark Reviewing')}
      </button>
    );
  }
  if (req.status === 'reviewing') {
    return (
      <button
        onClick={() => setPanelRequest(req)}
        className="px-3 py-1.5 text-xs font-mono rounded border border-[#00E87A]/30 text-[#00E87A] hover:bg-[#00E87A]/10 transition-colors"
      >
        {isJa ? '請求書を送信' : 'Send Invoice'}
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
        {isLoading ? '…' : (isJa ? '進行中にする' : 'Mark In Progress')}
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
        {isLoading ? '…' : (isJa ? '完了にする' : 'Mark Complete')}
      </button>
    );
  }
  return null;
}
