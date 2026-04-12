import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Managed Clients — Admin — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  onboarding: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
  building: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
  launched: 'bg-[#00E87A]/10 text-[#00E87A] border-[#00E87A]/20',
  operating: 'bg-[#00E87A]/10 text-[#00E87A] border-[#00E87A]/20',
  paused: 'bg-[#374151]/50 text-[#9CA3AF] border-[#374151]',
  terminated: 'bg-red-500/10 text-red-400 border-red-500/20',
};

function formatDate(dateStr: string | null, locale: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function AdminManagedClientsPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: clients, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, source, onboarding_status, created_at, managed_client_intake(plan_tier, coconala_order_ref, scope_ack, commitment_ack_at)')
    .eq('managed', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[AdminManagedClientsPage] query error:', error.message);
  }

  const rows = clients ?? [];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">
            {locale === 'ja' ? 'マネージドクライアント' : 'Managed Clients'}
          </h1>
          <p className="text-[#6B7280] text-sm font-mono mt-1">
            {rows.length}{locale === 'ja' ? ' 件' : ' total'}
          </p>
        </div>
        <Link
          href={`/${locale}/admin/managed-clients/new`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00E87A] text-[#0D0D0D] font-mono font-bold text-sm hover:bg-[#00E87A]/90 transition-colors shrink-0"
        >
          + {locale === 'ja' ? '新規追加' : 'New Client'}
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="border border-[#374151] rounded-lg bg-[#111827] p-8 text-center">
          <p className="text-[#6B7280] font-mono text-sm">
            {locale === 'ja' ? 'マネージドクライアントはまだいません。' : 'No managed clients yet.'}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {rows.map((client) => {
              const status = client.onboarding_status ?? 'pending';
              const statusStyle = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
              const intake = Array.isArray(client.managed_client_intake)
                ? client.managed_client_intake[0]
                : client.managed_client_intake;

              return (
                <div
                  key={client.id}
                  className="p-4 border border-[#374151] rounded-lg bg-[#111827] space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[#F4F4F2] font-mono font-bold text-sm truncate">
                        {client.full_name ?? '—'}
                      </p>
                      <p className="text-[#6B7280] font-mono text-xs mt-0.5 truncate">
                        {client.email}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono font-bold shrink-0 ${statusStyle}`}>
                      {status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-[#6B7280]">
                    <span className="capitalize">{client.source ?? '—'}</span>
                    <span>·</span>
                    <span className="capitalize">{intake?.plan_tier ?? '—'}</span>
                    <span>·</span>
                    <span>{formatDate(client.created_at, locale)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: table */}
          <div className="hidden md:block border border-[#374151] rounded-lg bg-[#111827] overflow-hidden">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-[#374151]">
                  <th className="text-left px-4 py-3 text-[#6B7280] font-medium">
                    {locale === 'ja' ? 'メール' : 'Email'}
                  </th>
                  <th className="text-left px-4 py-3 text-[#6B7280] font-medium">
                    {locale === 'ja' ? '氏名' : 'Name'}
                  </th>
                  <th className="text-left px-4 py-3 text-[#6B7280] font-medium">
                    {locale === 'ja' ? '流入元' : 'Source'}
                  </th>
                  <th className="text-left px-4 py-3 text-[#6B7280] font-medium">
                    {locale === 'ja' ? 'プラン' : 'Plan'}
                  </th>
                  <th className="text-left px-4 py-3 text-[#6B7280] font-medium">
                    {locale === 'ja' ? 'ステータス' : 'Status'}
                  </th>
                  <th className="text-left px-4 py-3 text-[#6B7280] font-medium">
                    {locale === 'ja' ? '登録日' : 'Created'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((client, idx) => {
                  const status = client.onboarding_status ?? 'pending';
                  const statusStyle = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
                  const intake = Array.isArray(client.managed_client_intake)
                    ? client.managed_client_intake[0]
                    : client.managed_client_intake;

                  return (
                    <tr
                      key={client.id}
                      className={`${idx < rows.length - 1 ? 'border-b border-[#374151]' : ''} hover:bg-[#1F2937]/50 transition-colors`}
                    >
                      <td className="px-4 py-3 text-[#F4F4F2] truncate max-w-[200px]">
                        {client.email}
                      </td>
                      <td className="px-4 py-3 text-[#F4F4F2]">
                        {client.full_name ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-[#9CA3AF] capitalize">
                        {client.source ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-[#9CA3AF] capitalize">
                        {intake?.plan_tier ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-bold ${statusStyle}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#6B7280]">
                        {formatDate(client.created_at, locale)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
