'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FileText, ChevronDown, ChevronUp, Download } from 'lucide-react';

export type DocumentItem = {
  id: string;
  type: 'nda' | 'partnership';
  signedAt: string;
  downloadUrl?: string;
  details?: {
    signature_name?: string;
    entity_name?: string | null;
    terms_version?: string;
    ip_address?: string;
  };
};

interface Props {
  documents: DocumentItem[];
  locale: string;
}

function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function DocumentList({ documents, locale }: Props) {
  const t = useTranslations('documents');
  const tCommon = useTranslations('common');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  if (documents.length === 0) {
    return (
      <div className="border border-[#374151] rounded-lg p-8 bg-[#111827] text-center">
        <p className="text-[#9CA3AF] font-mono text-sm">
          {t('empty')}
        </p>
      </div>
    );
  }

  const ndaPoints = t.raw('confidentialityPoints') as string[];
  const partnershipTerms = t.raw('partnershipTerms') as Array<{ label: string; value: string }>;

  return (
    <div className="space-y-3">
      {documents.map((doc) => {
        const isOpen = expanded[doc.id] ?? false;
        const title = doc.type === 'nda' ? t('nda') : t('partnership');

        return (
          <div
            key={doc.id}
            className="border border-[#374151] rounded-lg bg-[#111827] overflow-hidden"
          >
            {/* Card header */}
            <div className="flex items-center gap-4 p-4">
              <div className="shrink-0 w-9 h-9 rounded bg-[#00E87A]/10 flex items-center justify-center">
                <FileText size={16} className="text-[#00E87A]" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[#F4F4F2] text-sm font-mono font-bold truncate">{title}</p>
                <p className="text-[#6B7280] text-xs font-mono mt-0.5">
                  {t('signed')} {formatDate(doc.signedAt, locale)}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00E87A]/10 text-[#00E87A] border border-[#00E87A]/20">
                  {t('signedBadge')}
                </span>
                {doc.downloadUrl && (
                  <a
                    href={doc.downloadUrl}
                    download
                    className="flex items-center gap-1.5 text-[#9CA3AF] hover:text-[#00E87A] text-xs font-mono transition-colors"
                  >
                    <Download size={14} />
                    {t('download')}
                  </a>
                )}
                <button
                  onClick={() => toggle(doc.id)}
                  className="flex items-center gap-1.5 text-[#9CA3AF] hover:text-[#F4F4F2] text-xs font-mono transition-colors"
                >
                  {isOpen ? (
                    <>
                      {tCommon('close')}
                      <ChevronUp size={14} />
                    </>
                  ) : (
                    <>
                      {t('view')}
                      <ChevronDown size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Expanded content */}
            {isOpen && (
              <div className="border-t border-[#374151] p-4 space-y-4 bg-[#0D0D0D]">
                {doc.type === 'nda' ? (
                  <div className="space-y-3">
                    <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest">
                      {t('confidentialityTitle')}
                    </p>
                    <ul className="space-y-2">
                      {ndaPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm font-mono text-[#F4F4F2]">
                          <span className="text-[#00E87A] mt-0.5 shrink-0">✓</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-[#6B7280] text-xs font-mono pt-2 border-t border-[#374151]">
                      {t('electronicAcceptance', { date: formatDate(doc.signedAt, locale) })}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest">
                      {t('partnershipTitle')}
                    </p>
                    <div className="space-y-2">
                      {partnershipTerms.map((term) => (
                        <div key={term.label} className="flex gap-3 text-sm font-mono">
                          <span className="text-[#00E87A] shrink-0 w-32 sm:w-36">{term.label}</span>
                          <span className="text-[#F4F4F2]">{term.value}</span>
                        </div>
                      ))}
                    </div>
                    {doc.details && (
                      <div className="pt-3 border-t border-[#374151] space-y-1.5">
                        {doc.details.signature_name && (
                          <div className="flex gap-3 text-xs font-mono">
                            <span className="text-[#6B7280] shrink-0 w-32">
                              {t('signature')}
                            </span>
                            <span className="text-[#F4F4F2]">{doc.details.signature_name}</span>
                          </div>
                        )}
                        {doc.details.entity_name && (
                          <div className="flex gap-3 text-xs font-mono">
                            <span className="text-[#6B7280] shrink-0 w-32">
                              {t('entity')}
                            </span>
                            <span className="text-[#F4F4F2]">{doc.details.entity_name}</span>
                          </div>
                        )}
                        {doc.details.terms_version && (
                          <div className="flex gap-3 text-xs font-mono">
                            <span className="text-[#6B7280] shrink-0 w-32">
                              {t('termsVersion')}
                            </span>
                            <span className="text-[#F4F4F2]">{doc.details.terms_version}</span>
                          </div>
                        )}
                        <div className="flex gap-3 text-xs font-mono">
                          <span className="text-[#6B7280] shrink-0 w-32">
                            {t('signedAt')}
                          </span>
                          <span className="text-[#F4F4F2]">
                            {new Date(doc.signedAt).toLocaleString(locale === 'ja' ? 'ja-JP' : 'en-US')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
