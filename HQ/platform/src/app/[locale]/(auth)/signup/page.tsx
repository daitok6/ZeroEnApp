import { TerminalWindow } from '@/components/marketing/terminal-window';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ja' ? 'サインアップ — ZeroEn' : 'Sign Up — ZeroEn',
    robots: { index: false, follow: false },
  };
}

type Props = { params: Promise<{ locale: string }> };

export default async function SignupPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-[#00E87A] text-xs font-mono uppercase tracking-widest mb-2">ZeroEn</p>
          <h1 className="text-2xl font-bold font-mono text-[#F4F4F2]">
            {locale === 'ja' ? 'アクセスを取得する' : 'Get Access'}
          </h1>
          <p className="text-[#9CA3AF] text-sm font-mono mt-2">
            {locale === 'ja'
              ? 'ZeroEnはご招待制です'
              : 'ZeroEn is invite-only'}
          </p>
        </div>

        <TerminalWindow title="zeroen — access" className="w-full">
          <div className="space-y-4 text-sm font-mono">
            <p className="text-[#6B7280] text-xs">$ access --check-eligibility</p>
            <p className="text-[#F4F4F2]">
              {locale === 'ja'
                ? 'ダッシュボードへのアクセスは、採択されたクライアントのみです。'
                : 'Dashboard access is for accepted clients only.'}
            </p>
            <p className="text-[#9CA3AF]">
              {locale === 'ja'
                ? '申し込みフォームから応募してください。審査後、招待をお送りします。'
                : "Apply through our form. If accepted, you'll receive a login invitation."}
            </p>
            <Link
              href={`/${locale}/apply`}
              className="block text-center bg-[#00E87A] text-[#0D0D0D] text-xs font-bold px-4 py-3 rounded tracking-widest uppercase hover:bg-[#00E87A]/90 transition-colors mt-4"
            >
              {locale === 'ja' ? '申し込む — 無料' : 'Apply Free'}
            </Link>
          </div>
        </TerminalWindow>

        <p className="text-center text-[#6B7280] text-xs font-mono mt-6">
          {locale === 'ja' ? 'すでに招待済みですか？' : 'Already have an invitation?'}{' '}
          <Link href={`/${locale}/login`} className="text-[#00E87A] hover:underline">
            {locale === 'ja' ? 'ログイン' : 'Log in'}
          </Link>
        </p>
      </div>
    </div>
  );
}
