import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { DashboardTopbar } from '@/components/dashboard/topbar';
import { UnreadBadge } from '@/components/dashboard/unread-badge';
import { getUnreadCounts } from '@/lib/messages/unread';
import { getLockedKeys } from '@/components/dashboard/nav-items';

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
    .select('status, managed, onboarding_status')
    .eq('id', user.id)
    .single();

  if (profile?.managed && profile?.onboarding_status !== 'complete') {
    redirect(`/${locale}/design-wizard`);
  }

  const navType = profile?.status === 'approved'
    ? 'client'
    : profile?.status === 'onboarding'
    ? 'onboarding'
    : 'pending';

  const topbarLabel = navType === 'onboarding'
    ? (locale === 'ja' ? 'オンボーディング' : 'Onboarding')
    : (locale === 'ja' ? 'ファウンダーダッシュボード' : 'Founder Dashboard');

  // Fetch project for unread counts + locked-key computation
  let initialCounts: Record<string, number> = {};
  let projectIds: string[] = [];
  let lockedKeys: Set<string> = new Set();

  if (navType === 'client') {
    const { data: project } = await supabase
      .from('projects')
      .select('id, client_visible, plan_tier')
      .eq('client_id', user.id)
      .single();

    if (project) {
      projectIds = [project.id];
      initialCounts = await getUnreadCounts(supabase, user.id, projectIds);
      lockedKeys = getLockedKeys({
        client_visible: project.client_visible ?? false,
        plan_tier: project.plan_tier ?? null,
      });
    } else {
      // No project row yet — lock everything except overview/messages/settings
      lockedKeys = getLockedKeys(null);
    }
  }

  const messagesBadge = navType === 'client' ? (
    <UnreadBadge
      initialCounts={initialCounts}
      projectIds={projectIds}
      userId={user.id}
    />
  ) : undefined;

  return (
    <div className="h-screen bg-[#0D0D0D] flex flex-col md:flex-row font-logo">
      <Sidebar locale={locale} navType={navType} basePath="/dashboard" messagesBadge={messagesBadge} lockedKeys={lockedKeys} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardTopbar locale={locale} label={topbarLabel} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          {children}
        </main>
      </div>

      <BottomNav locale={locale} navType={navType} basePath="/dashboard" messagesBadge={messagesBadge} lockedKeys={lockedKeys} />
    </div>
  );
}
