// src/components/dashboard/request-card.tsx
'use client';

import { useTranslations } from 'next-intl';
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

const STATUS_COLORS: Record<string, string> = {
  submitted: 'text-blue-400 border-blue-400/30',
  reviewing: 'text-yellow-400 border-yellow-400/30',
  quoted: 'text-orange-400 border-orange-400/30',
  approved: 'text-[#00E87A] border-[#00E87A]/30',
  in_progress: 'text-[#00E87A] border-[#00E87A]/30',
  completed: 'text-[#6B7280] border-[#6B7280]/30',
  rejected: 'text-red-400 border-red-400/30',
};

export function RequestCard({ request, invoice, locale, userId }: RequestCardProps) {
  const t = useTranslations('common.status');
  const tReq = useTranslations('requests');

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

  return (
    <div className="border border-[#374151] rounded-lg p-4 bg-[#111827]">
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-[#F4F4F2] text-sm font-mono font-bold">{request.title}</p>
        <span className={`shrink-0 text-xs font-mono border px-2 py-0.5 rounded ${statusColor}`}>
          {statusLabel}
        </span>
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
    </div>
  );
}
