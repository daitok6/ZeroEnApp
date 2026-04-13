import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { DashboardTopbar } from '@/components/dashboard/topbar';
import { UnreadBadge } from '@/components/dashboard/unread-badge';
import { RequestsUnreadBadge } from '@/components/dashboard/requests-unread-badge';
import { NotificationsBadge } from '@/components/dashboard/notifications-badge';
import { getUnreadCounts } from '@/lib/messages/unread';
import { getUnreadRequestCounts } from '@/lib/requests/unread';
import { getUnreadNotificationCount } from '@/lib/notifications/unread';
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

  // Fetch profile + project in parallel — both only need user.id
  const [{ data: profile }, { data: project }] = await Promise.all([
    supabase.from('profiles').select('status, managed, onboarding_status').eq('id', user.id).single(),
    supabase.from('projects').select('id, client_visible, plan_tier').eq('client_id', user.id).single(),
  ]);

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

  // Fetch unread counts now that we have the project id
  let initialCounts: Record<string, number> = {};
  let projectIds: string[] = [];
  let lockedKeys: Set<string> = new Set();
  let requestIds: string[] = [];
  let initialByRequest: Record<string, number> = {};
  let initialNotificationCount = 0;

  if (navType === 'client') {
    if (project) {
      projectIds = [project.id];

      const [msgCounts, { data: clientRequests }] = await Promise.all([
        getUnreadCounts(supabase, user.id, projectIds),
        supabase.from('change_requests').select('id').eq('client_id', user.id),
      ]);

      initialCounts = msgCounts;
      requestIds = (clientRequests ?? []).map((r: { id: string }) => r.id);
      const [{ byRequest }, notifCount] = await Promise.all([
        getUnreadRequestCounts(supabase, user.id, requestIds),
        getUnreadNotificationCount(supabase, user.id),
      ]);
      initialByRequest = byRequest;
      initialNotificationCount = notifCount;

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

  const requestsBadge = navType === 'client' ? (
    <RequestsUnreadBadge
      initialByRequest={initialByRequest}
      requestIds={requestIds}
      userId={user.id}
    />
  ) : undefined;

  const notificationsBadge = navType === 'client' ? (
    <NotificationsBadge
      initialCount={initialNotificationCount}
      userId={user.id}
    />
  ) : undefined;

  return (
    <div className="h-screen bg-[#0D0D0D] flex flex-col md:flex-row font-logo">
      <Sidebar locale={locale} navType={navType} basePath="/dashboard" messagesBadge={messagesBadge} requestsBadge={requestsBadge} notificationsBadge={notificationsBadge} lockedKeys={lockedKeys} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardTopbar locale={locale} label={topbarLabel} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          {children}
        </main>
      </div>

      <BottomNav locale={locale} navType={navType} basePath="/dashboard" messagesBadge={messagesBadge} requestsBadge={requestsBadge} notificationsBadge={notificationsBadge} lockedKeys={lockedKeys} />
    </div>
  );
}
