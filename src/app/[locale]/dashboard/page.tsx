import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProjectStatusCard } from '@/components/dashboard/project-status-card';
import { MilestoneTracker } from '@/components/dashboard/milestone-tracker';
import { CongratsModal } from '@/components/onboarding/congrats-modal';
import Link from 'next/link';
import { MessageSquare, FileText, Receipt, PlusCircle, Send, ClipboardList } from 'lucide-react';
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

  const { data: profile } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', user.id)
    .single();

  // Onboarding users: show congrats modal overlay
  if (profile?.status === 'onboarding') {
    return <CongratsModal locale={locale} />;
  }

  // Pending users: show apply CTA only
  if (profile?.status !== 'approved') {
    return (
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">
            {locale === 'ja' ? 'ようこそ' : 'Welcome'}
          </h1>
          <p className="text-[#6B7280] text-sm font-mono mt-1">
            {locale === 'ja' ? 'ZeroEnへようこそ' : 'Get started with ZeroEn'}
          </p>
        </div>
        <div className="border border-[#374151] rounded-lg bg-[#111827] p-6 space-y-4">
          <p className="text-[#F4F4F2] font-mono text-sm leading-relaxed">
            {locale === 'ja'
              ? 'アカウントが作成されました。次のステップは、アプリケーションを提出することです。審査後、フルダッシュボードへのアクセスが付与されます。'
              : "Your account is set up. The next step is to submit your application. Once reviewed and accepted, you'll get access to the full dashboard."}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              href={`/${locale}/dashboard/apply`}
              className="flex items-center gap-3 p-4 border border-[#00E87A]/30 rounded-lg bg-[#00E87A]/5 hover:bg-[#00E87A]/10 hover:border-[#00E87A]/60 transition-all group"
            >
              <Send size={16} className="text-[#00E87A] shrink-0" />
              <div>
                <p className="text-[#F4F4F2] text-sm font-mono font-bold">
                  {locale === 'ja' ? '応募する' : 'Submit Application'}
                </p>
                <p className="text-[#6B7280] text-xs font-mono mt-0.5">
                  {locale === 'ja' ? 'アイデアを共有する' : 'Share your idea'}
                </p>
              </div>
            </Link>
            <Link
              href={`/${locale}/dashboard/application-status`}
              className="flex items-center gap-3 p-4 border border-[#374151] rounded-lg bg-[#0D0D0D] hover:border-[#00E87A]/30 transition-all group"
            >
              <ClipboardList size={16} className="text-[#6B7280] group-hover:text-[#00E87A] shrink-0 transition-colors" />
              <div>
                <p className="text-[#F4F4F2] text-sm font-mono font-bold">
                  {locale === 'ja' ? '応募状況' : 'Application Status'}
                </p>
                <p className="text-[#6B7280] text-xs font-mono mt-0.5">
                  {locale === 'ja' ? '審査状況を確認' : 'Check your status'}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
      key: 'documents',
      icon: FileText,
      labelEn: 'Documents',
      labelJa: '書類',
      path: `/${locale}/dashboard/documents`,
      descEn: 'Signed agreements',
      descJa: '署名済み契約書',
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
        <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">
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
