import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { DashboardTopbar } from '@/components/dashboard/topbar';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <div data-admin className="min-h-screen bg-[#0D0D0D] flex flex-col md:flex-row font-logo">
      <Sidebar locale={locale} navType="admin" basePath="/admin" />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <DashboardTopbar
          locale={locale}
          label={locale === 'ja' ? '管理ダッシュボード' : 'Admin Dashboard'}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          {children}
        </main>
      </div>

      <BottomNav locale={locale} navType="admin" basePath="/admin" />
    </div>
  );
}
