import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { DashboardTopbar } from '@/components/dashboard/topbar';
import { UnreadBadge } from '@/components/dashboard/unread-badge';
import { getUnreadCounts, getTotalUnread } from '@/lib/messages/unread';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DashboardLayout({ children, params }: Props) {
  const { locale } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', user.id)
    .single();

  const navType = profile?.status === 'approved'
    ? 'client'
    : profile?.status === 'onboarding'
    ? 'onboarding'
    : 'pending';

  const topbarLabel = navType === 'onboarding'
    ? (locale === 'ja' ? 'オンボーディング' : 'Onboarding')
    : (locale === 'ja' ? 'クライアントダッシュボード' : 'Client Dashboard');

  // Fetch unread count for approved clients only
  let initialUnread = 0;
  let projectIds: string[] = [];
  if (navType === 'client') {
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('client_id', user.id)
      .single();

    if (project) {
      projectIds = [project.id];
      const counts = await getUnreadCounts(supabase, user.id, projectIds);
      initialUnread = getTotalUnread(counts);
    }
  }

  const messagesBadge = navType === 'client' ? (
    <UnreadBadge
      initialCount={initialUnread}
      projectIds={projectIds}
      userId={user.id}
    />
  ) : undefined;

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col md:flex-row font-logo">
      <Sidebar locale={locale} navType={navType} basePath="/dashboard" messagesBadge={messagesBadge} />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <DashboardTopbar locale={locale} label={topbarLabel} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          {children}
        </main>
      </div>

      <BottomNav locale={locale} navType={navType} basePath="/dashboard" messagesBadge={messagesBadge} />
    </div>
  );
}
