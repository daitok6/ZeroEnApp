import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { DashboardTopbar } from '@/components/dashboard/topbar';
import { navItems, pendingNavItems } from '@/components/dashboard/nav-items';

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

  const items = profile?.status === 'approved' ? navItems : pendingNavItems;

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col md:flex-row">
      {/* Desktop sidebar — hidden on mobile */}
      <Sidebar locale={locale} items={items} basePath="/dashboard" />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <DashboardTopbar locale={locale} label={locale === 'ja' ? 'クライアントダッシュボード' : 'Client Dashboard'} />

        {/* Content — extra bottom padding on mobile for bottom nav */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav — hidden on md+ */}
      <BottomNav locale={locale} items={items} basePath="/dashboard" />
    </div>
  );
}
