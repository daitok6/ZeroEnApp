import { requireApproved } from '@/lib/auth/require-approved';
import { SettingsForm } from '@/components/dashboard/settings-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

export default async function SettingsPage({ params }: Props) {
  const { locale } = await params;
  const { user, supabase } = await requireApproved(locale);

  const { data: profile } = await supabase
    .from('profiles')
    .select('locale')
    .eq('id', user.id)
    .single();

  const isJa = locale === 'ja';
  const savedLocale = (profile?.locale ?? locale) as 'en' | 'ja';

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">
          {isJa ? '設定' : 'Settings'}
        </h1>
        <p className="text-[#6B7280] text-sm font-mono mt-1">
          {isJa ? 'アカウントの設定を管理します。' : 'Manage your account preferences.'}
        </p>
      </div>

      <SettingsForm currentLocale={savedLocale} />
    </div>
  );
}
