import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ManagedClientsTable } from '@/components/admin/managed-clients-table';

export const metadata: Metadata = {
  title: 'Managed Clients — Admin — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

export default async function AdminManagedClientsPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: clients, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, source, onboarding_status, created_at, managed_client_intake(plan_tier, coconala_order_ref, scope_ack, commitment_ack_at)')
    .eq('managed', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[AdminManagedClientsPage] query error:', error.message);
    return (
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">
              {locale === 'ja' ? 'マネージドクライアント' : 'Managed Clients'}
            </h1>
          </div>
          <Link
            href={`/${locale}/admin/managed-clients/new`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00E87A] text-[#0D0D0D] font-mono font-bold text-sm hover:bg-[#00E87A]/90 transition-colors shrink-0"
          >
            + {locale === 'ja' ? '新規追加' : 'New Client'}
          </Link>
        </div>
        <div className="border border-red-500/30 rounded-lg bg-red-500/5 p-4">
          <p className="text-red-400 font-mono text-sm">Failed to load clients. Refresh to retry.</p>
        </div>
      </div>
    );
  }

  const rows = clients ?? [];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">
            {locale === 'ja' ? 'マネージドクライアント' : 'Managed Clients'}
          </h1>
          <p className="text-[#6B7280] text-sm font-mono mt-1">
            {rows.length}{locale === 'ja' ? ' 件' : ' total'}
          </p>
        </div>
        <Link
          href={`/${locale}/admin/managed-clients/new`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00E87A] text-[#0D0D0D] font-mono font-bold text-sm hover:bg-[#00E87A]/90 transition-colors shrink-0"
        >
          + {locale === 'ja' ? '新規追加' : 'New Client'}
        </Link>
      </div>

      <ManagedClientsTable rows={rows} locale={locale} />
    </div>
  );
}
