import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CheckCircle, Clock, AlertCircle, XCircle, Receipt } from 'lucide-react';
import { PayButton } from '@/components/dashboard/pay-button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoices — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

const STATUS_CONFIG = {
  paid: {
    icon: CheckCircle,
    color: 'text-[#00E87A]',
    bgColor: 'bg-[#00E87A]/10 border-[#00E87A]/20',
    labelEn: 'Paid',
    labelJa: '支払済み',
  },
  pending: {
    icon: Clock,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10 border-yellow-400/20',
    labelEn: 'Pending',
    labelJa: '未払い',
  },
  overdue: {
    icon: AlertCircle,
    color: 'text-red-400',
    bgColor: 'bg-red-400/10 border-red-400/20',
    labelEn: 'Overdue',
    labelJa: '期限超過',
  },
  cancelled: {
    icon: XCircle,
    color: 'text-[#6B7280]',
    bgColor: 'bg-[#6B7280]/10 border-[#6B7280]/20',
    labelEn: 'Cancelled',
    labelJa: 'キャンセル',
  },
};

export default async function InvoicesPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const invoices =
    (
      await supabase
        .from('invoices')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })
    ).data ?? [];

  const pendingTotal = invoices
    .filter((inv) => inv.status === 'pending' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount_cents, 0);

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold font-heading text-[#F4F4F2]">
          {locale === 'ja' ? '請求書' : 'Invoices'}
        </h1>
        <p className="text-[#6B7280] text-xs font-mono mt-1">
          {locale === 'ja' ? '請求と支払い履歴' : 'Billing and payment history'}
        </p>
      </div>

      {/* Summary banner — only if pending balance */}
      {pendingTotal > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border border-yellow-400/30 rounded-lg bg-yellow-400/5">
          <div>
            <p className="text-yellow-400 text-sm font-mono font-bold">
              {locale === 'ja' ? '未払い残高' : 'Outstanding Balance'}
            </p>
            <p className="text-[#F4F4F2] text-2xl font-mono font-bold mt-1">
              ${(pendingTotal / 100).toFixed(2)}
            </p>
          </div>
          <PayButton
            type="subscription"
            locale={locale}
            label={locale === 'ja' ? '今すぐ支払う' : 'Pay Now'}
          />
        </div>
      )}

      {/* Empty state */}
      {invoices.length === 0 && (
        <div className="border border-[#374151] rounded-lg p-8 bg-[#111827] text-center">
          <Receipt size={32} className="mx-auto text-[#374151] mb-4" />
          <p className="text-[#9CA3AF] font-mono text-sm mb-1">
            {locale === 'ja' ? '請求書はまだありません' : 'No invoices yet'}
          </p>
          <p className="text-[#6B7280] font-mono text-xs mb-6">
            {locale === 'ja'
              ? 'ローンチ後、月$50のプラットフォーム料金が発生します'
              : 'The $50/mo platform fee begins after your app launches'}
          </p>
        </div>
      )}

      {/* Invoice list — cards on mobile, grid on md+ */}
      {invoices.length > 0 && (
        <div className="space-y-3">
          {/* Header row — hidden on mobile */}
          <div className="hidden md:grid md:grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 pb-2 border-b border-[#374151]">
            {['Description', 'Type', 'Amount', 'Status', ''].map((h) => (
              <p
                key={h}
                className="text-[#6B7280] text-xs font-mono uppercase tracking-widest"
              >
                {h}
              </p>
            ))}
          </div>

          {invoices.map((invoice) => {
            const config =
              STATUS_CONFIG[invoice.status as keyof typeof STATUS_CONFIG] ||
              STATUS_CONFIG.pending;
            const Icon = config.icon;
            const isPending =
              invoice.status === 'pending' || invoice.status === 'overdue';

            return (
              <div
                key={invoice.id}
                className="flex flex-col md:grid md:grid-cols-[1fr_auto_auto_auto_auto] gap-2 md:gap-4 md:items-center p-4 border border-[#374151] rounded-lg bg-[#111827] hover:border-[#374151]/80 transition-colors"
              >
                {/* Description */}
                <div>
                  <p className="text-[#F4F4F2] text-sm font-mono">
                    {invoice.description}
                  </p>
                  <p className="text-[#6B7280] text-xs font-mono mt-0.5">
                    {new Date(invoice.created_at).toLocaleDateString(
                      locale === 'ja' ? 'ja-JP' : 'en-US'
                    )}
                  </p>
                </div>

                {/* Type badge */}
                <span className="w-fit text-xs font-mono border border-[#374151] text-[#9CA3AF] px-2 py-0.5 rounded">
                  {invoice.type === 'subscription'
                    ? locale === 'ja'
                      ? 'サブスク'
                      : 'Subscription'
                    : locale === 'ja'
                      ? '都度'
                      : 'One-time'}
                </span>

                {/* Amount */}
                <p className="text-[#F4F4F2] font-mono font-bold text-sm">
                  ${(invoice.amount_cents / 100).toFixed(2)}
                </p>

                {/* Status */}
                <span
                  className={`flex items-center gap-1.5 w-fit text-xs font-mono border px-2 py-0.5 rounded ${config.bgColor} ${config.color}`}
                >
                  <Icon size={10} />
                  {locale === 'ja' ? config.labelJa : config.labelEn}
                </span>

                {/* Action */}
                {isPending ? (
                  <PayButton
                    type={
                      invoice.type === 'subscription'
                        ? 'subscription'
                        : 'per_request'
                    }
                    invoiceId={invoice.id}
                    locale={locale}
                    label={locale === 'ja' ? '支払う' : 'Pay'}
                    compact
                  />
                ) : (
                  <div className="hidden md:block" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
