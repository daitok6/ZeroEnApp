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
          <h1 className="text-2xl font-bold font-heading text-[#F4F4F2]">
            {locale === 'ja' ? 'アクセスを取得する' : 'Get Access'}
          </h1>
          <p className="text-[#9CA3AF] text-sm font-mono mt-2">
            {locale === 'ja'
              ? 'Googleアカウントで無料スタート'
              : 'Get started free with Google'}
          </p>
        </div>

        <TerminalWindow title="zeroen — access" className="w-full">
          <div className="space-y-4 text-sm font-mono">
            <p className="text-[#6B7280] text-xs">$ zeroen --get-started</p>
            <p className="text-[#F4F4F2]">
              {locale === 'ja'
                ? 'Googleアカウントでログインして、ブランディングウィザードを開始しましょう。'
                : 'Log in with Google to start your branding wizard.'}
            </p>
            <Link
              href={`/${locale}/login`}
              className="block text-center bg-[#00E87A] text-[#0D0D0D] text-xs font-bold px-4 py-3 rounded tracking-widest uppercase hover:bg-[#00E87A]/90 transition-colors mt-4"
            >
              {locale === 'ja' ? 'Googleでログイン' : 'Log in with Google'}
            </Link>
          </div>
        </TerminalWindow>
      </div>
    </div>
  );
}
