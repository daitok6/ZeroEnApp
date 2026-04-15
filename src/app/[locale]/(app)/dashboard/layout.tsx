import { redirect } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
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
import { getDashboardSession } from '@/lib/dashboard/session';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Message keys used by dashboard client components (sidebar, bottom-nav, etc.)
const DASH_MSG_KEYS = [
  'admin', 'plan', 'common', 'settings', 'auth', 'dashboard',
  'requests', 'invoices', 'billing', 'messages', 'documents',
  'onboarding', 'comments',
] as const;

export default async function DashboardLayout({ children, params }: Props) {
  const { locale } = await params;

  const [{ user, profile, project, supabase }, allMessages] = await Promise.all([
    getDashboardSession(locale),
    getMessages(),
  ]);

  // Only pass the dashboard-relevant keys (~40% of the full bundle)
  const messages = Object.fromEntries(
    DASH_MSG_KEYS.filter((k) => k in allMessages).map((k) => [k, allMessages[k]])
  );

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const navType = profile?.status === 'client'
    ? 'client'
    : profile?.status === 'onboarding'
    ? 'onboarding'
    : 'pending';

  const topbarLabel = navType === 'onboarding'
    ? (locale === 'ja' ? 'オンボーディング' : 'Onboarding')
    : (locale === 'ja' ? 'ファウンダーダッシュボード' : 'Founder Dashboard');

  let initialCounts: Record<string, number> = {};
  let projectIds: string[] = [];
  let lockedKeys: Set<string> = new Set();
  let requestIds: string[] = [];
  let initialByRequest: Record<string, number> = {};
  let initialNotificationCount = 0;

  if (navType === 'client') {
    if (project) {
      projectIds = [project.id];

      // All three badge sources fetched in a single parallel round-trip
      const [msgCounts, { data: clientRequests }, notifCount] = await Promise.all([
        getUnreadCounts(supabase, user.id, projectIds),
        supabase.from('change_requests').select('id').eq('client_id', user.id),
        getUnreadNotificationCount(supabase, user.id),
      ]);

      initialCounts = msgCounts;
      requestIds = (clientRequests ?? []).map((r: { id: string }) => r.id);
      initialNotificationCount = notifCount;

      if (requestIds.length > 0) {
        const { byRequest } = await getUnreadRequestCounts(supabase, user.id, requestIds);
        initialByRequest = byRequest;
      }

      lockedKeys = getLockedKeys({
        client_visible: project.client_visible ?? false,
        plan_tier: project.plan_tier ?? null,
      });
    } else {
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
    <NextIntlClientProvider messages={messages}>
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
    </NextIntlClientProvider>
  );
}
