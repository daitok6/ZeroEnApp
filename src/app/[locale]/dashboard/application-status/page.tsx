import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Clock, Search, CheckCircle, XCircle, Send } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Application Status — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

const STATUS_CONFIG = {
  pending: {
    icon: Clock,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10 border-yellow-400/20',
    labelEn: 'Pending Review',
    labelJa: '審査待ち',
    descEn: "We've received your application and will review it shortly.",
    descJa: 'アプリケーションを受け取りました。まもなく審査を開始します。',
  },
  reviewing: {
    icon: Search,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10 border-blue-400/20',
    labelEn: 'Under Review',
    labelJa: '審査中',
    descEn: "We're actively reviewing your application. You'll hear from us soon.",
    descJa: 'アプリケーションを審査中です。まもなくご連絡します。',
  },
  accepted: {
    icon: CheckCircle,
    color: 'text-[#00E87A]',
    bgColor: 'bg-[#00E87A]/10 border-[#00E87A]/20',
    labelEn: 'Accepted',
    labelJa: '承認済み',
    descEn: "Congratulations! Your application has been accepted. Refresh to access the full dashboard.",
    descJa: 'おめでとうございます！アプリケーションが承認されました。更新してフルダッシュボードにアクセスしてください。',
  },
  rejected: {
    icon: XCircle,
    color: 'text-red-400',
    bgColor: 'bg-red-400/10 border-red-400/20',
    labelEn: 'Not a Match',
    labelJa: 'マッチしませんでした',
    descEn: "Unfortunately your application wasn't a fit at this time. You're welcome to reapply in the future.",
    descJa: '今回は残念ながらマッチしませんでした。将来また応募していただけます。',
  },
};

export default async function ApplicationStatusPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: application } = await supabase
    .from('applications')
    .select('id, idea_name, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!application) {
    return (
      <div className="max-w-lg space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">
            {locale === 'ja' ? '応募状況' : 'Application Status'}
          </h1>
        </div>
        <div className="border border-[#374151] rounded-lg bg-[#111827] p-6 text-center space-y-4">
          <p className="text-[#6B7280] font-mono text-sm">
            {locale === 'ja'
              ? 'まだ応募していません。'
              : "You haven't submitted an application yet."}
          </p>
          <Link
            href={`/${locale}/dashboard/apply`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#00E87A] text-[#0D0D0D] rounded-lg font-mono text-sm font-bold hover:bg-[#00E87A]/90 transition-colors"
          >
            <Send size={14} />
            {locale === 'ja' ? '今すぐ応募する' : 'Apply Now'}
          </Link>
        </div>
      </div>
    );
  }

  const config = STATUS_CONFIG[application.status as keyof typeof STATUS_CONFIG];
  const Icon = config.icon;
  const submittedDate = new Date(application.created_at).toLocaleDateString(
    locale === 'ja' ? 'ja-JP' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">
          {locale === 'ja' ? '応募状況' : 'Application Status'}
        </h1>
        <p className="text-[#6B7280] text-sm font-mono mt-1">
          {locale === 'ja' ? `提出日: ${submittedDate}` : `Submitted: ${submittedDate}`}
        </p>
      </div>

      <div className={`border rounded-lg p-6 space-y-3 ${config.bgColor}`}>
        <div className="flex items-center gap-3">
          <Icon size={20} className={config.color} />
          <span className={`font-mono font-bold text-sm ${config.color}`}>
            {locale === 'ja' ? config.labelJa : config.labelEn}
          </span>
        </div>
        <p className="text-[#F4F4F2] font-mono text-sm leading-relaxed">
          {locale === 'ja' ? config.descJa : config.descEn}
        </p>
      </div>

      <div className="border border-[#374151] rounded-lg bg-[#111827] p-4">
        <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-2">
          {locale === 'ja' ? '応募内容' : 'Application'}
        </p>
        <p className="text-[#F4F4F2] font-mono text-sm font-bold">{application.idea_name}</p>
      </div>

      {application.status === 'accepted' && (
        <Link
          href={`/${locale}/dashboard`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#00E87A] text-[#0D0D0D] rounded-lg font-mono text-sm font-bold hover:bg-[#00E87A]/90 transition-colors"
        >
          {locale === 'ja' ? 'ダッシュボードを開く' : 'Open Dashboard'}
        </Link>
      )}
    </div>
  );
}
