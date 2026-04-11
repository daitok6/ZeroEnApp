import { requireApproved } from '@/lib/auth/require-approved';
import { DocumentList } from '@/components/dashboard/document-list';
import type { DocumentItem } from '@/components/dashboard/document-list';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documents — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

export default async function DocumentsPage({ params }: Props) {
  const { locale } = await params;
  const { user, supabase } = await requireApproved(locale);

  const { data: project } = await supabase
    .from('projects')
    .select('id, application_id, onboarding_data')
    .eq('client_id', user.id)
    .single();

  const documents: DocumentItem[] = [];

  if (project) {
    // NDA — derived from the application submission date
    if (project.application_id) {
      const { data: application } = await supabase
        .from('applications')
        .select('created_at')
        .eq('id', project.application_id)
        .single();

      if (application) {
        documents.push({
          id: 'nda',
          type: 'nda',
          signedAt: application.created_at,
        });
      }
    }

    // Partnership Agreement — from onboarding_data
    if (project.onboarding_data) {
      const od = project.onboarding_data as Record<string, unknown>;
      const signedAt =
        typeof od.terms_accepted_at === 'string' ? od.terms_accepted_at : project.id;

      documents.push({
        id: 'partnership',
        type: 'partnership',
        signedAt,
        details: {
          signature_name:
            typeof od.signature_name === 'string' ? od.signature_name : undefined,
          entity_name:
            typeof od.entity_name === 'string' ? od.entity_name : null,
          terms_version:
            typeof od.terms_version === 'string' ? od.terms_version : undefined,
        },
      });
    }
  }

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
    </div>
  );
}
