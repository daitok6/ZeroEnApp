import { getDashboardSession } from '@/lib/dashboard/session';
import { DocumentList } from '@/components/dashboard/document-list';
import type { DocumentItem } from '@/components/dashboard/document-list';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documents — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

export default async function DocumentsPage({ params }: Props) {
  const { locale } = await params;
  const { user, supabase } = await getDashboardSession(locale);

  // Fetch from signed_documents — the immutable source of truth
  const { data: signedDocs } = await supabase
    .from('signed_documents')
    .select('id, document_type, document_version, signature_name, signed_at')
    .eq('user_id', user.id)
    .order('signed_at', { ascending: true });

  const documents: DocumentItem[] = (signedDocs ?? []).map((d) => ({
    id: d.id,
    type: d.document_type === 'nda' ? 'nda' : 'partnership',
    signedAt: d.signed_at,
    details: {
      signature_name: d.signature_name,
      terms_version: d.document_version,
    },
    downloadUrl: `/api/documents/${d.id}/pdf`,
  }));

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold font-heading text-[#F4F4F2]">
          {locale === 'ja' ? '書類' : 'Documents'}
        </h1>
        <p className="text-[#6B7280] text-xs font-mono mt-1">
          {locale === 'ja' ? '署名済みの契約書' : 'Signed agreements and contracts'}
        </p>
      </div>

      <DocumentList documents={documents} locale={locale} />

      {documents.length === 0 && (
        <p className="text-center mt-4">
          <Link
            href={`/${locale}/dashboard/help/messages-and-documents`}
            className="text-xs font-mono text-[#00E87A] hover:underline"
          >
            {locale === 'ja' ? '書類について詳しく見る →' : 'Learn about documents →'}
          </Link>
        </p>
      )}
    </div>
  );
}
