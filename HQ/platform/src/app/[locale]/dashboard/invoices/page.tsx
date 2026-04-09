import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Receipt } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

export default async function InvoicesPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  // In production: fetch from invoices table + Stripe
  const invoices: unknown[] = [];

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold font-mono text-[#F4F4F2]">
          {locale === 'ja' ? '請求書' : 'Invoices'}
        </h1>
        <p className="text-[#6B7280] text-xs font-mono mt-1">
          {locale === 'ja' ? '請求と支払い履歴' : 'Billing and payment history'}
        </p>
      </div>

      {invoices.length === 0 ? (
        <div className="border border-[#374151] rounded-lg p-8 bg-[#111827] text-center">
          <Receipt size={32} className="mx-auto text-[#374151] mb-4" />
          <p className="text-[#9CA3AF] font-mono text-sm mb-1">
            {locale === 'ja' ? '請求書はまだありません' : 'No invoices yet'}
          </p>
          <p className="text-[#6B7280] font-mono text-xs">
            {locale === 'ja'
              ? 'ローンチ後、月$50のプラットフォーム料金が発生します'
              : 'The $50/mo platform fee begins after your app launches'}
          </p>
        </div>
      ) : null}
    </div>
  );
}
