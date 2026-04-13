import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import { DocumentsTable } from '@/components/admin/documents-table';

export const metadata: Metadata = {
  title: 'Documents — Admin — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

export default async function AdminDocumentsPage({ params }: Props) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  const supabase = await createClient();

  const { data: signedDocs } = await supabase
    .from('signed_documents')
    .select('id, user_id, document_type, document_version, signature_name, signed_at, locale')
    .order('signed_at', { ascending: false });

  const docList = signedDocs ?? [];

  const userIds = [...new Set(docList.map((d: { user_id: string }) => d.user_id).filter(Boolean))];
  const { data: profiles } =
    userIds.length > 0
      ? await supabase.from('profiles').select('id, full_name, email').in('id', userIds)
      : { data: [] };

  const profileMap = new Map((profiles ?? []).map((p: { id: string; full_name: string | null; email: string }) => [p.id, p]));

  const docs = docList.map((doc: { id: string; user_id: string; document_type: string; document_version: string; signature_name: string | null; signed_at: string; locale: string }) => ({
    ...doc,
    profile: profileMap.get(doc.user_id) ?? null,
  }));

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

      <DocumentsTable docs={docs} locale={locale} />
    </div>
  );
}
