import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import { getClientList } from '@/lib/admin/queries';
import { ClientsTable } from '@/components/admin/clients-table';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clients — Admin — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

export default async function AdminClientsPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();
  const t = await getTranslations('admin');
  const clients = await getClientList(supabase);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">
          {t('clients')}
        </h1>
        <p className="text-[#6B7280] text-sm font-mono mt-1">
          {clients.length} {locale === 'ja' ? '件' : 'total'}
        </p>
      </div>

      <ClientsTable initialClients={clients} locale={locale} />
    </div>
  );
}
