'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { AdminSearchFilterBar } from '@/components/admin/admin-search-filter-bar';

export interface AuditRow {
  id: string;
  project_id: string;
  kind: string;
  period: string;
  file_name: string;
  file_size: number | null;
  delivered_at: string | null;
  created_at: string;
  clientId?: string | null;
  clientName?: string | null;
}

interface Props {
  audits: AuditRow[];
  locale: string;
}

function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function AuditsList({ audits, locale }: Props) {
  const isJa = locale === 'ja';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    let rows = audits;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(
        (a) =>
          a.file_name.toLowerCase().includes(q) ||
          a.period.toLowerCase().includes(q),
      );
    }
    if (activeFilters.kind) rows = rows.filter((a) => a.kind === activeFilters.kind);
    if (activeFilters.delivered === 'yes') rows = rows.filter((a) => !!a.delivered_at);
    if (activeFilters.delivered === 'no') rows = rows.filter((a) => !a.delivered_at);
    return rows;
  }, [audits, searchQuery, activeFilters]);

  return (
    <section className="space-y-3">
      <h2 className="text-zen-off-white text-sm font-mono font-bold uppercase tracking-widest">
        {isJa ? '最近のアップロード' : 'Recent uploads'}
      </h2>

      <AdminSearchFilterBar
        placeholder={isJa ? 'ファイル名・期間で検索…' : 'Search by filename or period…'}
        filters={[
          {
            key: 'kind',
            label: isJa ? '種別' : 'Type',
            options: [
              { value: 'security', label: isJa ? 'セキュリティ' : 'Security' },
              { value: 'seo', label: 'SEO' },
            ],
          },
          {
            key: 'delivered',
            label: isJa ? '配信' : 'Delivered',
            options: [
              { value: 'yes', label: isJa ? '配信済み' : 'Delivered' },
              { value: 'no', label: isJa ? '未配信' : 'Pending' },
            ],
          },
        ]}
        activeFilters={activeFilters}
        onSearchChange={setSearchQuery}
        onFilterChange={(key, value) => setActiveFilters((prev) => ({ ...prev, [key]: value }))}
        onClear={() => { setSearchQuery(''); setActiveFilters({}); }}
      />

      {filtered.length === 0 ? (
        <div className="border border-zen-border rounded-lg bg-zen-surface p-6 text-center">
          <p className="text-zen-subtle font-mono text-sm">
            {isJa ? 'アップロードされた監査はまだありません' : 'No audits uploaded yet'}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((a) => {
            const kindLabel = a.kind === 'security'
              ? (isJa ? 'セキュリティ' : 'Security')
              : 'SEO';
            return (
              <li
                key={a.id}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 border border-zen-border rounded-lg bg-zen-surface p-3"
              >
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zen-green/10 text-zen-green border border-zen-green/30">
                  {kindLabel}
                </span>
                <span className="text-zen-off-white font-mono text-sm">{a.period}</span>
                <span className="text-zen-subtle font-mono text-xs truncate">{a.file_name}</span>
                {a.clientId && (
                  <Link
                    href={`/${locale}/admin/clients/${a.clientId}`}
                    className="text-[#9CA3AF] font-mono text-xs hover:text-[#00E87A] transition-colors hover:underline underline-offset-2 truncate"
                  >
                    {a.clientName ?? a.clientId}
                  </Link>
                )}
                <span className="ml-auto text-zen-subtle font-mono text-xs">
                  {formatDate(a.created_at, locale)}
                  {a.delivered_at && (
                    <span className="ml-2 text-zen-green">
                      {isJa ? '· 配信済み' : '· delivered'}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
