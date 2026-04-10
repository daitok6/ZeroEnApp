import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { FilesPageClient } from '@/components/dashboard/files-page-client';
import type { Database } from '@/types/database';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Files — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

export default async function FilesPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('client_id', user.id)
    .single();

  const files = project
    ? ((await supabase
        .from('files')
        .select('*')
        .eq('project_id', project.id)
        .order('created_at', { ascending: false })).data ?? [])
    : [];

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold font-heading text-[#F4F4F2]">
          {locale === 'ja' ? 'ファイル' : 'Files'}
        </h1>
        <p className="text-[#6B7280] text-xs font-mono mt-1">
          {locale === 'ja' ? '共有プロジェクトファイル' : 'Shared project files'}
        </p>
      </div>

      {project ? (
        <FilesPageClient
          initialFiles={files as Database['public']['Tables']['files']['Row'][]}
          locale={locale}
        />
      ) : (
        <div className="border border-[#374151] rounded-lg p-8 bg-[#111827] text-center">
          <p className="text-[#9CA3AF] font-mono text-sm">
            {locale === 'ja'
              ? 'プロジェクト開始後にファイル共有が利用できます'
              : 'File sharing is available once your project starts'}
          </p>
        </div>
      )}
    </div>
  );
}
