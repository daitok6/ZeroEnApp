'use client';

import { useState, useMemo } from 'react';
import { AdminSearchFilterBar } from '@/components/admin/admin-search-filter-bar';

export interface DocRow {
  id: string;
  user_id: string;
  document_type: string;
  document_version: string;
  signature_name: string | null;
  signed_at: string;
  locale: string;
  profile?: { full_name: string | null; email: string } | null;
}

interface Props {
  docs: DocRow[];
  locale: string;
}

function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function DocumentsTable({ docs, locale }: Props) {
  const isJa = locale === 'ja';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    let rows = docs;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(
        (d) =>
          (d.profile?.full_name?.toLowerCase().includes(q) ?? false) ||
          (d.profile?.email?.toLowerCase().includes(q) ?? false) ||
          (d.signature_name?.toLowerCase().includes(q) ?? false),
      );
    }
    if (activeFilters.type) rows = rows.filter((d) => d.document_type === activeFilters.type);
    return rows;
  }, [docs, searchQuery, activeFilters]);

  return (
    <div className="space-y-4">
      <AdminSearchFilterBar
        placeholder={isJa ? '名前・メールで検索…' : 'Search by name or email…'}
        filters={[{
          key: 'type',
          label: isJa ? '種別' : 'Type',
          options: [
            { value: 'nda', label: isJa ? '秘密保持契約' : 'NDA' },
            { value: 'partnership', label: isJa ? 'パートナーシップ' : 'Partnership' },
          ],
        }]}
        activeFilters={activeFilters}
        onSearchChange={setSearchQuery}
        onFilterChange={(key, value) => setActiveFilters((prev) => ({ ...prev, [key]: value }))}
        onClear={() => { setSearchQuery(''); setActiveFilters({}); }}
      />

      {filtered.length === 0 ? (
        <div className="border border-[#374151] rounded-lg bg-[#111827] p-8 text-center">
          <p className="text-[#6B7280] font-mono text-sm">
            {isJa ? '署名済み書類はありません' : 'No signed documents yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((doc) => {
            const docTypeLabel =
              doc.document_type === 'nda'
                ? isJa ? '相互秘密保持契約' : 'Mutual Confidentiality Agreement'
                : isJa ? 'パートナーシップ契約' : 'Partnership Agreement';

            return (
              <div
                key={doc.id}
                className="border border-[#374151] rounded-lg bg-[#111827] overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-[#374151] bg-[#0D0D0D]">
                  <p className="text-[#F4F4F2] text-sm font-mono font-bold">
                    {doc.profile?.full_name ?? doc.profile?.email ?? doc.user_id}
                  </p>
                  {doc.profile?.email && (
                    <p className="text-[#6B7280] text-xs font-mono mt-0.5">{doc.profile.email}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="text-[#00E87A] text-xs font-mono w-4">✓</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#F4F4F2] text-sm font-mono">{docTypeLabel}</p>
                    <p className="text-[#6B7280] text-xs font-mono mt-0.5">
                      {isJa ? '署名者: ' : 'Signed by: '}
                      {doc.signature_name ?? '—'}
                      <span className="mx-1.5 text-[#4B5563]">·</span>
                      {formatDate(doc.signed_at, locale)}
                      <span className="mx-1.5 text-[#4B5563]">·</span>
                      {isJa ? 'バージョン: ' : 'v'}
                      {doc.document_version}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded bg-[#00E87A]/10 text-[#00E87A] border border-[#00E87A]/20">
                    {isJa ? '署名済み' : 'Signed'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
