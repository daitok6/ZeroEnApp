// src/components/dashboard/request-card.tsx
'use client';

import { InvoicePanel } from './invoice-panel';

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
  locale: string;
  userId: string;
}

const STATUS_LABELS: Record<string, { en: string; ja: string; color: string }> = {
  submitted: { en: 'Submitted', ja: '送信済み', color: 'text-blue-400 border-blue-400/30' },
  reviewing: { en: 'Reviewing', ja: '確認中', color: 'text-yellow-400 border-yellow-400/30' },
  quoted: { en: 'Quoted', ja: '見積済み', color: 'text-orange-400 border-orange-400/30' },
  approved: { en: 'Approved', ja: '承認済み', color: 'text-[#00E87A] border-[#00E87A]/30' },
  in_progress: { en: 'In Progress', ja: '進行中', color: 'text-[#00E87A] border-[#00E87A]/30' },
  completed: { en: 'Completed', ja: '完了', color: 'text-[#6B7280] border-[#6B7280]/30' },
  rejected: { en: 'Rejected', ja: '却下', color: 'text-red-400 border-red-400/30' },
};

const TIER_LABELS = {
  small: { en: 'Small ($50-100)', ja: 'スモール ($50-100)' },
  medium: { en: 'Medium ($200-500)', ja: 'ミディアム ($200-500)' },
  large: { en: 'Large ($500-2,000)', ja: 'ラージ ($500-2,000)' },
};

export function RequestCard({ request, invoice, locale, userId }: RequestCardProps) {
  const isJa = locale === 'ja';
  const statusInfo = STATUS_LABELS[request.status] ?? STATUS_LABELS.submitted;
  const tierInfo = request.tier ? TIER_LABELS[request.tier as keyof typeof TIER_LABELS] : null;
  const showInvoicePanel =
    request.status === 'quoted' && invoice && invoice.status === 'pending';

  return (
    <div className="border border-[#374151] rounded-lg p-4 bg-[#111827]">
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-[#F4F4F2] text-sm font-mono font-bold">{request.title}</p>
        <span className={`shrink-0 text-xs font-mono border px-2 py-0.5 rounded ${statusInfo.color}`}>
          {isJa ? statusInfo.ja : statusInfo.en}
        </span>
      </div>
      <p className="text-[#9CA3AF] text-xs font-mono mb-2 line-clamp-2">{request.description}</p>
      <div className="flex items-center gap-3">
        {tierInfo && (
          <span className="text-[#6B7280] text-xs font-mono">
            {isJa ? tierInfo.ja : tierInfo.en}
          </span>
        )}
        {request.estimated_cost_cents && (
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
    </div>
  );
}
