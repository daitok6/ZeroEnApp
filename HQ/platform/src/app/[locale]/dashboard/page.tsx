import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProjectStatusCard } from '@/components/dashboard/project-status-card';
import { MilestoneTracker } from '@/components/dashboard/milestone-tracker';
import Link from 'next/link';
import { MessageSquare, FileText, Receipt, PlusCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  // Fetch project (may not exist yet — placeholder DB returns null gracefully)
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', user.id)
    .single();

  // Fetch milestones if project exists
  const milestones = project
    ? ((
        await supabase
          .from('milestones')
          .select('*')
          .eq('project_id', project.id)
          .order('sort_order')
      ).data ?? [])
    : [];

  const quickLinks = [
    {
      key: 'messages',
      icon: MessageSquare,
      labelEn: 'Messages',
      labelJa: 'メッセージ',
      path: `/${locale}/dashboard/messages`,
      descEn: 'Chat with the team',
      descJa: 'チームとチャット',
    },
    {
      key: 'files',
      icon: FileText,
      labelEn: 'Files',
      labelJa: 'ファイル',
      path: `/${locale}/dashboard/files`,
      descEn: 'Shared project files',
      descJa: '共有ファイル',
    },
    {
      key: 'invoices',
      icon: Receipt,
      labelEn: 'Invoices',
      labelJa: '請求書',
      path: `/${locale}/dashboard/invoices`,
      descEn: 'Billing & payments',
      descJa: '請求・支払い',
    },
    {
      key: 'requests',
      icon: PlusCircle,
      labelEn: 'Requests',
      labelJa: 'リクエスト',
      path: `/${locale}/dashboard/requests`,
      descEn: 'Request new features',
      descJa: '機能追加リクエスト',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page title */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-mono text-[#F4F4F2]">
          {locale === 'ja' ? 'ダッシュボード' : 'Dashboard'}
        </h1>
        <p className="text-[#6B7280] text-sm font-mono mt-1">
          {locale === 'ja' ? 'プロジェクトの状況を確認' : 'Track your project progress'}
        </p>
      </div>

      {/* Project status + milestones — stack on mobile, side by side on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProjectStatusCard project={project} locale={locale} />
        <MilestoneTracker milestones={milestones} locale={locale} />
      </div>

      {/* Quick links — 2-col on mobile (2×2 grid), 4-col on md+ */}
      <div>
        <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-3">
          {locale === 'ja' ? 'クイックリンク' : 'Quick Links'}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.key}
                href={link.path}
                className="flex flex-col gap-3 p-4 border border-[#374151] rounded-lg bg-[#111827] hover:border-[#00E87A]/50 hover:bg-[#111827]/80 transition-all group"
              >
                <Icon
                  size={18}
                  className="text-[#6B7280] group-hover:text-[#00E87A] transition-colors"
                />
                <div>
                  <p className="text-[#F4F4F2] text-sm font-mono font-bold">
                    {locale === 'ja' ? link.labelJa : link.labelEn}
                  </p>
                  <p className="text-[#6B7280] text-xs font-mono mt-0.5">
                    {locale === 'ja' ? link.descJa : link.descEn}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
