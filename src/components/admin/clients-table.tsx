'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { AdminSearchFilterBar } from '@/components/admin/admin-search-filter-bar';
import type { ClientRow, ClientHealthStatus } from '@/lib/admin/queries';

interface ClientsTableProps {
  initialClients: ClientRow[];
  locale: string;
}

const STATUS_STYLES: Record<string, string> = {
  onboarding: 'bg-[#F59E0B] text-[#0D0D0D]',
  building: 'bg-[#3B82F6] text-white',
  launched: 'bg-[#00E87A] text-[#0D0D0D]',
  operating: 'bg-[#00E87A] text-[#0D0D0D]',
  paused: 'bg-[#374151] text-[#9CA3AF]',
  terminated: 'bg-[#EF4444] text-white',
};

const HEALTH_COLORS: Record<ClientHealthStatus, string> = {
  green: '#00E87A',
  yellow: '#F59E0B',
  red: '#EF4444',
};

function formatDate(dateStr: string | null, locale: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ClientsTable({ initialClients, locale }: ClientsTableProps) {
  const t = useTranslations('admin');
  const tStatus = useTranslations('common.status');
  const [clients] = useState<ClientRow[]>(initialClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const filteredClients = useMemo(() => {
    let rows = clients;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(
        (c) =>
          (c.full_name?.toLowerCase().includes(q) ?? false) ||
          c.email.toLowerCase().includes(q) ||
          (c.projectName?.toLowerCase().includes(q) ?? false),
      );
    }
    if (activeFilters.status) rows = rows.filter((c) => c.projectStatus === activeFilters.status);
    if (activeFilters.plan) rows = rows.filter((c) => c.planTier === activeFilters.plan);
    if (activeFilters.health) rows = rows.filter((c) => c.health === activeFilters.health);
    return rows;
  }, [clients, searchQuery, activeFilters]);

  const filterGroups = [
    {
      key: 'status',
      label: t('status'),
      options: [
        { value: 'onboarding', label: locale === 'ja' ? 'オンボーディング' : 'Onboarding' },
        { value: 'building', label: locale === 'ja' ? 'ビルド中' : 'Building' },
        { value: 'launched', label: locale === 'ja' ? '公開済み' : 'Launched' },
        { value: 'operating', label: locale === 'ja' ? '運用中' : 'Operating' },
        { value: 'paused', label: locale === 'ja' ? '停止中' : 'Paused' },
      ],
    },
    {
      key: 'plan',
      label: t('plan'),
      options: [
        { value: 'basic', label: 'Basic' },
        { value: 'premium', label: 'Premium' },
      ],
    },
    {
      key: 'health',
      label: t('health'),
      options: [
        { value: 'green', label: locale === 'ja' ? '良好' : 'Green' },
        { value: 'yellow', label: locale === 'ja' ? '注意' : 'Yellow' },
        { value: 'red', label: locale === 'ja' ? '警告' : 'Red' },
      ],
    },
  ];

  return (
    <>
      <AdminSearchFilterBar
        placeholder={locale === 'ja' ? 'クライアントを検索…' : 'Search clients…'}
        filters={filterGroups}
        activeFilters={activeFilters}
        onSearchChange={setSearchQuery}
        onFilterChange={(key, value) => setActiveFilters((prev) => ({ ...prev, [key]: value }))}
        onClear={() => { setSearchQuery(''); setActiveFilters({}); }}
      />

      {filteredClients.length === 0 ? (
        <div className="border border-[#374151] rounded-lg bg-[#111827] p-8 text-center">
          <p className="text-[#6B7280] font-mono text-sm">{t('noClients')}</p>
        </div>
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {filteredClients.map((client) => (
              <Link
                key={client.id}
                href={`/${locale}/admin/clients/${client.id}`}
                className="block p-4 border border-[#374151] rounded-lg bg-[#111827] space-y-2 hover:border-[#4B5563] transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[#F4F4F2] text-sm font-mono font-bold truncate">
                      {client.full_name ?? client.email}
                    </p>
                    <p className="text-[#6B7280] text-xs font-mono truncate">{client.email}</p>
                  </div>
                  <span
                    className="shrink-0 inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: HEALTH_COLORS[client.health] }}
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {client.projectName ? (
                    <span className="text-[#9CA3AF] text-xs font-mono">
                      {client.projectName}
                    </span>
                  ) : (
                    <span className="text-[#6B7280] text-xs font-mono">—</span>
                  )}
                  {client.projectStatus && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${STATUS_STYLES[client.projectStatus] ?? 'bg-[#374151] text-[#9CA3AF]'}`}
                    >
                      {tStatus(client.projectStatus as Parameters<typeof tStatus>[0])}
                    </span>
                  )}
                  {client.planTier && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                        client.planTier === 'premium'
                          ? 'text-[#00E87A] bg-[#00E87A]/10 border-[#00E87A]/30'
                          : 'text-[#9CA3AF] bg-[#374151]/50 border-[#374151]'
                      }`}
                    >
                      {client.planTier === 'premium' ? 'Premium' : 'Basic'}
                    </span>
                  )}
                </div>
                <p className="text-[#6B7280] text-xs font-mono">
                  {t('lastUpdated')}: {formatDate(client.projectUpdatedAt, locale)}
                </p>
              </Link>
            ))}
          </div>

          {/* Desktop: table layout */}
          <div className="hidden md:block border border-[#374151] rounded-lg overflow-hidden">
            <div className="grid grid-cols-[2fr_2fr_1fr_80px_1fr_48px] gap-4 px-4 py-2 bg-[#111827] border-b border-[#374151]">
              <p className="text-[#6B7280] text-xs font-mono uppercase tracking-wider">{t('clientName')}</p>
              <p className="text-[#6B7280] text-xs font-mono uppercase tracking-wider">{t('projectName')}</p>
              <p className="text-[#6B7280] text-xs font-mono uppercase tracking-wider">{t('status')}</p>
              <p className="text-[#6B7280] text-xs font-mono uppercase tracking-wider">{t('plan')}</p>
              <p className="text-[#6B7280] text-xs font-mono uppercase tracking-wider">{t('lastUpdated')}</p>
              <p className="text-[#6B7280] text-xs font-mono uppercase tracking-wider text-center">
                {t('health')}
              </p>
            </div>

            {filteredClients.map((client, idx) => (
              <Link
                key={client.id}
                href={`/${locale}/admin/clients/${client.id}`}
                className={`grid grid-cols-[2fr_2fr_1fr_80px_1fr_48px] gap-4 px-4 py-3 items-center ${
                  idx < filteredClients.length - 1 ? 'border-b border-[#374151]' : ''
                } hover:bg-[#111827]/60 transition-colors`}
              >
                <div className="min-w-0">
                  <p className="text-[#F4F4F2] text-sm font-mono truncate">
                    {client.full_name ?? client.email}
                  </p>
                  <p className="text-[#6B7280] text-xs font-mono truncate">{client.email}</p>
                </div>
                <p className="text-[#9CA3AF] text-sm font-mono truncate">
                  {client.projectName ?? '—'}
                </p>
                <div>
                  {client.projectStatus ? (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${STATUS_STYLES[client.projectStatus] ?? 'bg-[#374151] text-[#9CA3AF]'}`}
                    >
                      {tStatus(client.projectStatus as Parameters<typeof tStatus>[0])}
                    </span>
                  ) : (
                    <span className="text-[#6B7280] text-xs font-mono">—</span>
                  )}
                </div>
                <div>
                  {client.planTier ? (
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        client.planTier === 'premium'
                          ? 'text-[#00E87A] bg-[#00E87A]/10 border-[#00E87A]/30'
                          : 'text-[#9CA3AF] bg-[#374151]/50 border-[#374151]'
                      }`}
                    >
                      {client.planTier === 'premium' ? 'Premium' : 'Basic'}
                    </span>
                  ) : (
                    <span className="text-[#6B7280] text-xs font-mono">—</span>
                  )}
                </div>
                <p className="text-[#6B7280] text-xs font-mono">
                  {formatDate(client.projectUpdatedAt, locale)}
                </p>
                <div className="flex justify-center">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: HEALTH_COLORS[client.health] }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
