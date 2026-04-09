import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { FolderOpen } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

export default async function FilesPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold font-mono text-[#F4F4F2]">
          {locale === 'ja' ? 'ファイル' : 'Files'}
        </h1>
        <p className="text-[#6B7280] text-xs font-mono mt-1">
          {locale === 'ja' ? '共有プロジェクトファイル' : 'Shared project files'}
        </p>
      </div>

      <div className="border border-[#374151] rounded-lg p-8 bg-[#111827] text-center">
        <FolderOpen size={32} className="mx-auto text-[#374151] mb-4" />
        <p className="text-[#9CA3AF] font-mono text-sm mb-1">
          {locale === 'ja' ? 'ファイル共有は近日公開予定' : 'File sharing coming soon'}
        </p>
        <p className="text-[#6B7280] font-mono text-xs">
          {locale === 'ja'
            ? 'デザインファイル、仕様書、その他の共有ファイルがここに表示されます'
            : 'Design files, specs, and other shared project assets will appear here'}
        </p>
      </div>
    </div>
  );
}
