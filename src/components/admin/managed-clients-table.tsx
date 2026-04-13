'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { AdminSearchFilterBar } from '@/components/admin/admin-search-filter-bar';

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

export interface ManagedClientRow {
  id: string;
  email: string;
  full_name: string | null;
  source: string | null;
  onboarding_status: string | null;
  created_at: string;
  managed_client_intake: { plan_tier: string | null; coconala_order_ref: string | null; scope_ack: boolean | null; commitment_ack_at: string | null } | { plan_tier: string | null; coconala_order_ref: string | null; scope_ack: boolean | null; commitment_ack_at: string | null }[] | null;
}

interface Props {
  rows: ManagedClientRow[];
  locale: string;
}

export function ManagedClientsTable({ rows, locale }: Props) {
  const isJa = locale === 'ja';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    let data = rows;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (c) =>
          (c.full_name?.toLowerCase().includes(q) ?? false) ||
          c.email.toLowerCase().includes(q),
      );
    }
    if (activeFilters.status) data = data.filter((c) => (c.onboarding_status ?? 'pending') === activeFilters.status);
    if (activeFilters.source) data = data.filter((c) => c.source === activeFilters.source);
    return data;
  }, [rows, searchQuery, activeFilters]);

  return (
    <div className="space-y-4">
      <AdminSearchFilterBar
        placeholder={isJa ? '名前・メールで検索…' : 'Search by name or email…'}
        filters={[
          {
            key: 'status',
            label: isJa ? 'ステータス' : 'Status',
            options: [
              { value: 'pending', label: isJa ? '保留中' : 'Pending' },
              { value: 'onboarding', label: isJa ? 'オンボーディング' : 'Onboarding' },
              { value: 'building', label: isJa ? 'ビルド中' : 'Building' },
              { value: 'launched', label: isJa ? '公開済み' : 'Launched' },
              { value: 'operating', label: isJa ? '運用中' : 'Operating' },
              { value: 'paused', label: isJa ? '停止中' : 'Paused' },
            ],
          },
          {
            key: 'source',
            label: isJa ? '流入元' : 'Source',
            options: [
              { value: 'coconala', label: 'Coconala' },
              { value: 'direct', label: isJa ? 'ダイレクト' : 'Direct' },
            ],
          },
        ]}
        activeFilters={activeFilters}
        onSearchChange={setSearchQuery}
        onFilterChange={(key, value) => setActiveFilters((prev) => ({ ...prev, [key]: value }))}
        onClear={() => { setSearchQuery(''); setActiveFilters({}); }}
      />

      {filtered.length === 0 ? (
        <div className="border border-[#374151] rounded-lg bg-[#111827] p-8 text-center">
          <p className="text-[#6B7280] font-mono text-sm">
            {isJa ? 'マネージドクライアントはまだいません。' : 'No managed clients yet.'}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map((client) => {
              const status = client.onboarding_status ?? 'pending';
              const statusStyle = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
              const intake = Array.isArray(client.managed_client_intake)
                ? client.managed_client_intake[0]
                : client.managed_client_intake;

              return (
                <Link
                  key={client.id}
                  href={`/${locale}/admin/managed-clients/${client.id}`}
                  className="block p-4 border border-[#374151] rounded-lg bg-[#111827] space-y-2 hover:border-[#4B5563] hover:bg-[#1F2937]/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[#F4F4F2] font-mono font-bold text-sm truncate">
                        {client.full_name ?? '—'}
                      </p>
                      <p className="text-[#6B7280] font-mono text-xs mt-0.5 truncate">{client.email}</p>
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
                </Link>
              );
            })}
          </div>

          {/* Desktop: table */}
          <div className="hidden md:block border border-[#374151] rounded-lg bg-[#111827] overflow-hidden">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="border-b border-[#374151]">
                  <th className="text-left px-4 py-3 text-[#6B7280] font-medium">
                    {isJa ? 'メール' : 'Email'}
                  </th>
                  <th className="text-left px-4 py-3 text-[#6B7280] font-medium">
                    {isJa ? '氏名' : 'Name'}
                  </th>
                  <th className="text-left px-4 py-3 text-[#6B7280] font-medium">
                    {isJa ? '流入元' : 'Source'}
                  </th>
                  <th className="text-left px-4 py-3 text-[#6B7280] font-medium">
                    {isJa ? 'プラン' : 'Plan'}
                  </th>
                  <th className="text-left px-4 py-3 text-[#6B7280] font-medium">
                    {isJa ? 'ステータス' : 'Status'}
                  </th>
                  <th className="text-left px-4 py-3 text-[#6B7280] font-medium">
                    {isJa ? '登録日' : 'Created'}
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((client, idx) => {
                  const status = client.onboarding_status ?? 'pending';
                  const statusStyle = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
                  const intake = Array.isArray(client.managed_client_intake)
                    ? client.managed_client_intake[0]
                    : client.managed_client_intake;

                  return (
                    <tr
                      key={client.id}
                      className={`${idx < filtered.length - 1 ? 'border-b border-[#374151]' : ''} hover:bg-[#1F2937]/50 transition-colors`}
                    >
                      <td className="px-4 py-3 text-[#F4F4F2] truncate max-w-[200px]">{client.email}</td>
                      <td className="px-4 py-3 text-[#F4F4F2]">{client.full_name ?? '—'}</td>
                      <td className="px-4 py-3 text-[#9CA3AF] capitalize">{client.source ?? '—'}</td>
                      <td className="px-4 py-3 text-[#9CA3AF] capitalize">{intake?.plan_tier ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-bold ${statusStyle}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#6B7280]">{formatDate(client.created_at, locale)}</td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/${locale}/admin/managed-clients/${client.id}`}
                          className="text-xs font-mono text-[#3B82F6] hover:text-[#60A5FA] transition-colors"
                        >
                          {isJa ? '詳細' : 'View'}
                        </Link>
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
