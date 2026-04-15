import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { DashboardTopbar } from '@/components/dashboard/topbar';
import { UnreadBadge } from '@/components/dashboard/unread-badge';
import { RequestsUnreadBadge } from '@/components/dashboard/requests-unread-badge';
import { getUnreadCounts } from '@/lib/messages/unread';
import { getUnreadRequestCounts } from '@/lib/requests/unread';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params;

  const messages = await getMessages();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  // Fetch profile + all project IDs in parallel — both only need user.id or nothing
  const [{ data: profile }, { data: projects }] = await Promise.all([
    supabase.from('profiles').select('role').eq('id', user.id).single(),
    supabase.from('projects').select('id'),
  ]);

  if (profile?.role !== 'admin') {
    redirect(`/${locale}/dashboard`);
  }

  const projectIds = (projects ?? []).map((p: { id: string }) => p.id);

  // Fetch all change request IDs for unread badge (admin sees all)
  const { data: allRequests } = await supabase.from('change_requests').select('id');
  const allRequestIds = (allRequests ?? []).map((r: { id: string }) => r.id);

  const [initialCounts, { byRequest: initialByRequest }] = await Promise.all([
    getUnreadCounts(supabase, user.id, projectIds),
    getUnreadRequestCounts(supabase, user.id, allRequestIds),
  ]);

  const messagesBadge = (
    <UnreadBadge
      initialCounts={initialCounts}
      projectIds={projectIds}
      userId={user.id}
    />
  );

  const requestsBadge = (
    <RequestsUnreadBadge
      initialByRequest={initialByRequest}
      requestIds={allRequestIds}
      userId={user.id}
    />
  );

  return (
    <NextIntlClientProvider messages={messages}>
      <div data-admin className="h-screen bg-[#0D0D0D] flex flex-col md:flex-row font-logo">
        <Sidebar locale={locale} navType="admin" basePath="/admin" messagesBadge={messagesBadge} requestsBadge={requestsBadge} />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <DashboardTopbar
            locale={locale}
            label={locale === 'ja' ? '管理ダッシュボード' : 'Admin Dashboard'}
          />

          <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
            {children}
          </main>
        </div>

        <BottomNav locale={locale} navType="admin" basePath="/admin" messagesBadge={messagesBadge} requestsBadge={requestsBadge} />
      </div>
    </NextIntlClientProvider>
  );
}
