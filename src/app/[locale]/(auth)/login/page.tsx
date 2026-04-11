import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TerminalWindow } from '@/components/marketing/terminal-window';
import { OAuthButtons } from '@/components/auth/oauth-buttons';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ja' ? 'ログイン — ZeroEn' : 'Log In — ZeroEn',
    robots: { index: false, follow: false },
  };
}

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ intent?: string }>;
};

export default async function LoginPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { intent } = await searchParams;
  const isApplyIntent = intent === 'apply';

  // Redirect already-authenticated users
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    redirect(isApplyIntent ? `/${locale}/dashboard/apply` : `/${locale}/dashboard`);
  }

  const subtitle = isApplyIntent
    ? (locale === 'ja' ? 'アイデアを送るにはアカウントが必要です' : 'You need an account to submit your idea')
    : (locale === 'ja' ? 'ファウンダーダッシュボードにアクセス' : 'Access your founder dashboard');

  const terminalPrompt = isApplyIntent ? '$ auth --provider oauth --apply' : '$ auth --provider oauth';

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="text-center mb-8">
          <p className="text-[#00E87A] text-xs font-mono uppercase tracking-widest mb-2">ZeroEn</p>
          <h1 className="text-2xl font-bold font-heading text-[#F4F4F2]">
            {isApplyIntent
              ? (locale === 'ja' ? 'ログイン / アカウント作成' : 'Log in or create an account')
              : (locale === 'ja' ? 'ログイン' : 'Log in')}
          </h1>
          <p className="text-[#9CA3AF] text-sm font-mono mt-2">
            {subtitle}
          </p>
        </div>

        <TerminalWindow title="zeroen — auth" className="w-full">
          <div className="space-y-4">
            <p className="text-[#6B7280] text-xs font-mono mb-4">
              {terminalPrompt}
            </p>
            <OAuthButtons mode="login" intent={isApplyIntent ? 'apply' : undefined} />
          </div>
        </TerminalWindow>

        <p className="text-center text-[#6B7280] text-xs font-mono mt-6">
          {isApplyIntent
            ? (locale === 'ja' ? 'Googleで続けると新規登録またはログインされます' : 'New or returning — Google handles both')
            : (locale === 'ja' ? 'Googleアカウントでサインインしてください' : 'Sign in with your Google account to continue')}
        </p>
      </div>
    </div>
  );
}
