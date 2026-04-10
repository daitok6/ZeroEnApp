import { TerminalWindow } from '@/components/marketing/terminal-window';
import { OAuthButtons } from '@/components/auth/oauth-buttons';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ja' ? 'ログイン — ZeroEn' : 'Log In — ZeroEn',
    robots: { index: false, follow: false },
  };
}

type Props = { params: Promise<{ locale: string }> };

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="text-center mb-8">
          <p className="text-[#00E87A] text-xs font-mono uppercase tracking-widest mb-2">ZeroEn</p>
          <h1 className="text-2xl font-bold font-heading text-[#F4F4F2]">
            {locale === 'ja' ? 'ログイン' : 'Log in'}
          </h1>
          <p className="text-[#9CA3AF] text-sm font-mono mt-2">
            {locale === 'ja' ? 'クライアントダッシュボードにアクセス' : 'Access your client dashboard'}
          </p>
        </div>

        <TerminalWindow title="zeroen — auth" className="w-full">
          <div className="space-y-4">
            <p className="text-[#6B7280] text-xs font-mono mb-4">
              $ auth --provider oauth
            </p>
            <OAuthButtons mode="login" />
          </div>
        </TerminalWindow>

        <p className="text-center text-[#6B7280] text-xs font-mono mt-6">
          {locale === 'ja' ? 'アカウントをお持ちでない方は' : "Don't have an account?"}{' '}
          <Link href={`/${locale}/apply`} className="text-[#00E87A] hover:underline">
            {locale === 'ja' ? '申し込む' : 'Apply free'}
          </Link>
        </p>
      </div>
    </div>
  );
}
