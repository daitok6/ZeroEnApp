import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getAdminRequests } from '@/lib/admin/requests';
import { RequestTable } from '@/components/admin/request-table';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Requests — Admin — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

export default async function AdminRequestsPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect(`/${locale}/dashboard`);

  const requests = await getAdminRequests(supabase);
  const isJa = locale === 'ja';

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">
          {isJa ? 'クライアントリクエスト' : 'Client Requests'}
        </h1>
        <p className="text-[#6B7280] text-sm font-mono mt-1">
          {requests.length} {isJa ? '件' : 'total'}
        </p>
      </div>

      <RequestTable
        requests={requests}
        locale={locale}
        adminUserId={user.id}
      />
    </div>
  );
}
