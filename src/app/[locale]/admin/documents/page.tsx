import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documents — Admin — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function AdminDocumentsPage({ params }: Props) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  const supabase = await createClient();

  // Fetch all signed documents with profile info
  const { data: signedDocs } = await supabase
    .from('signed_documents')
    .select('id, user_id, document_type, document_version, signature_name, signed_at, locale')
    .order('signed_at', { ascending: false });

  const docList = signedDocs ?? [];

  // Batch lookup profiles
  const userIds = [...new Set(docList.map((d) => d.user_id).filter(Boolean))];
  const { data: profiles } =
    userIds.length > 0
      ? await supabase.from('profiles').select('id, full_name, email').in('id', userIds)
      : { data: [] };

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">
          {isJa ? '書類' : 'Documents'}
        </h1>
        <p className="text-[#6B7280] text-sm font-mono mt-1">
          {isJa
            ? `${docList.length} 件の署名済み書類`
            : `${docList.length} signed document${docList.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {docList.length === 0 ? (
        <div className="border border-[#374151] rounded-lg bg-[#111827] p-8 text-center">
          <p className="text-[#6B7280] font-mono text-sm">
            {isJa ? '署名済み書類はありません' : 'No signed documents yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {docList.map((doc) => {
            const profile = profileMap.get(doc.user_id);
            const docTypeLabel =
              doc.document_type === 'nda'
                ? isJa
                  ? '相互秘密保持契約'
                  : 'Mutual Confidentiality Agreement'
                : isJa
                  ? 'パートナーシップ契約'
                  : 'Partnership Agreement';

            return (
              <div
                key={doc.id}
                className="border border-[#374151] rounded-lg bg-[#111827] overflow-hidden"
              >
                {/* Client header */}
                <div className="px-4 py-3 border-b border-[#374151] bg-[#0D0D0D]">
                  <p className="text-[#F4F4F2] text-sm font-mono font-bold">
                    {profile?.full_name ?? profile?.email ?? doc.user_id}
                  </p>
                  {profile?.email && (
                    <p className="text-[#6B7280] text-xs font-mono mt-0.5">
                      {profile.email}
                    </p>
                  )}
                </div>

                {/* Document row */}
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
