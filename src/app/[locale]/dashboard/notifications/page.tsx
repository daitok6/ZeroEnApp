import { requireApproved } from '@/lib/auth/require-approved';
import { NotificationsFeed, type NotificationRow } from '@/components/dashboard/notifications-feed';
import { Bell } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notifications — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

export default async function NotificationsPage({ params }: Props) {
  const { locale } = await params;
  const { user, supabase } = await requireApproved(locale);

  const { data } = await supabase
    .from('notifications')
    .select('id, type, entity_id, entity_kind, title, body, link, created_at, read_at')
    .eq('user_id', user.id)
    .is('dismissed_at', null)
    .order('created_at', { ascending: false })
    .limit(50);

  const notifications = (data ?? []) as NotificationRow[];
  const isJa = locale === 'ja';

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5 text-[#F4F4F2]" strokeWidth={1.5} />
        <div>
          <h1 className="text-xl font-bold font-heading text-[#F4F4F2]">
            {isJa ? '通知' : 'Notifications'}
          </h1>
          <p className="text-[#6B7280] text-xs font-mono mt-0.5">
            {isJa
              ? 'メッセージ・変更依頼・請求書などの最新情報'
              : 'Messages, change requests, invoices, and more'}
          </p>
        </div>
      </div>

      <NotificationsFeed notifications={notifications} locale={locale} />
    </div>
  );
}
