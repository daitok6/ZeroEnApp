import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProjectStatusCard } from '@/components/dashboard/project-status-card';
import { PlanSummaryCard } from '@/components/dashboard/plan-summary-card';
import { CongratsModal } from '@/components/onboarding/congrats-modal';
import { ResumeOnboardingBanner } from '@/components/onboarding/resume-banner';
import { PlanWizard } from '@/components/dashboard/plan-wizard';
import { SubscriptionPending } from '@/components/dashboard/subscription-pending';
import Link from 'next/link';
import {
  MessageSquare,
  FileText,
  Receipt,
  PlusCircle,
  Send,
  ClipboardList,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import type { Metadata } from 'next';
import type { LucideIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ subscribed?: string }>;
};

type QuickLink = {
  key: string;
  icon: LucideIcon;
  labelEn: string;
  labelJa: string;
  path: string;
  descEn: string;
  descJa: string;
  premiumOnly?: boolean;
  locked?: boolean;
};

export default async function DashboardPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { subscribed } = await searchParams;
  const isJa = locale === 'ja';
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase
    .from('profiles')
    .select('status, managed, onboarding_progress')
    .eq('id', user.id)
    .single();

  // Onboarding users: first visit = congrats modal, return visit = resume banner
  if (profile?.status === 'onboarding') {
    if (profile.onboarding_progress) {
      const progress = profile.onboarding_progress as { current_step: number };
      return <ResumeOnboardingBanner locale={locale} currentStep={progress.current_step} />;
    }
    return <CongratsModal locale={locale} />;
  }

  // New SaaS applicants who completed the design wizard — show pending review
  if (profile?.status === 'applicant') {
    return (
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-heading text-zen-off-white">
            {isJa ? '申請を受け付けました' : 'Application received.'}
          </h1>
          <p className="text-zen-subtle text-sm font-mono mt-1">
            {isJa ? 'ZeroEnへようこそ' : 'Welcome to ZeroEn'}
          </p>
        </div>
        <div className="border border-zen-border rounded-lg bg-zen-surface p-6 space-y-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full border border-zen-green/30 bg-zen-green/5">
            <span className="text-zen-green text-xl" aria-hidden="true">◎</span>
          </div>
          <p className="text-zen-off-white font-mono text-sm leading-relaxed">
            {isJa
              ? '運営者が3〜5営業日以内にレビューし、メールでお知らせします。審査通過後、フルダッシュボードへのアクセスが付与されます。'
              : 'The operator will review your application within 3–5 business days and email you. Once approved, you\'ll get access to the full dashboard.'}
          </p>
          <Link
            href={`/${locale}`}
            className="inline-block text-zen-green font-mono text-sm hover:underline"
          >
            {isJa ? 'トップへ戻る →' : 'Back to home →'}
          </Link>
        </div>
      </div>
    );
  }

  // Pending users: show apply CTA only
  if (profile?.status !== 'approved') {
    return (
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-heading text-zen-off-white">
            {isJa ? 'ようこそ' : 'Welcome'}
          </h1>
          <p className="text-zen-subtle text-sm font-mono mt-1">
            {isJa ? 'ZeroEnへようこそ' : 'Get started with ZeroEn'}
          </p>
        </div>
        <div className="border border-zen-border rounded-lg bg-zen-surface p-6 space-y-4">
          <p className="text-zen-off-white font-mono text-sm leading-relaxed">
            {isJa
              ? 'アカウントが作成されました。次は応募フォームの提出です。審査後、フルダッシュボードへのアクセスが付与されます。'
              : "Your account is set up. The next step is to submit your application. Once reviewed and accepted, you'll get access to the full dashboard."}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              href={`/${locale}/dashboard/apply`}
              className="flex items-center gap-3 p-4 border border-zen-green/30 rounded-lg bg-zen-green/5 hover:bg-zen-green/10 hover:border-zen-green/60 transition-all group"
            >
              <Send size={16} className="text-zen-green shrink-0" aria-hidden="true" />
              <div>
                <p className="text-zen-off-white text-sm font-mono font-bold">
                  {isJa ? '応募する' : 'Submit Application'}
                </p>
                <p className="text-zen-subtle text-xs font-mono mt-0.5">
                  {isJa ? 'アイデアを共有する' : 'Share your idea'}
                </p>
              </div>
            </Link>
            <Link
              href={`/${locale}/dashboard/application-status`}
              className="flex items-center gap-3 p-4 border border-zen-border rounded-lg bg-zen-dark hover:border-zen-green/30 transition-all group"
            >
              <ClipboardList
                size={16}
                className="text-zen-subtle group-hover:text-zen-green shrink-0 transition-colors"
                aria-hidden="true"
              />
              <div>
                <p className="text-zen-off-white text-sm font-mono font-bold">
                  {isJa ? '応募状況' : 'Application Status'}
                </p>
                <p className="text-zen-subtle text-xs font-mono mt-0.5">
                  {isJa ? '審査状況を確認' : 'Check your status'}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fetch project (may not exist yet)
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', user.id)
    .single();

  // Managed clients whose site isn't ready yet → show "being prepared" overview
  if (profile?.managed && !project?.client_visible) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-heading text-zen-off-white">
            {isJa ? 'ダッシュボード' : 'Dashboard'}
          </h1>
        </div>
        <div className="border border-zen-border rounded-lg bg-zen-surface p-6 md:p-8 text-center space-y-4">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-zen-green/30 bg-zen-green/5 mx-auto"
            aria-hidden="true"
          >
            <span className="text-zen-green text-xl">◎</span>
          </div>
          <h2 className="text-zen-off-white font-mono font-bold text-lg">
            {isJa ? 'ウェブサイトを制作中です' : 'Your website is being prepared'}
          </h2>
          <p className="text-zen-subtle font-mono text-sm leading-relaxed max-w-md mx-auto">
            {isJa
              ? 'デザインブリーフを受け取りました。サイトの準備ができ次第、メールでお知らせします。'
              : "We've received your design brief. You'll get an email when your site is ready to preview."}
          </p>
          <p className="text-zen-subtle/70 font-mono text-xs">
            {isJa ? '質問はメッセージから' : 'Questions? Use Messages to reach us.'}
          </p>
        </div>
      </div>
    );
  }

  // If project is visible to client but no plan chosen → show plan gate
  if (project?.client_visible && !project?.plan_tier) {
    // checkout_pending_at is set when the Stripe Checkout session is created and
    // cleared by the webhook on success. Show pending UI for up to 15 minutes —
    // this survives page refreshes (unlike relying solely on ?subscribed=true).
    const checkoutPendingAt = project?.checkout_pending_at
      ? new Date(project.checkout_pending_at)
      : null;
    const isPendingRecently =
      checkoutPendingAt !== null &&
      // eslint-disable-next-line react-hooks/purity -- server component, computed once per request
      Date.now() - checkoutPendingAt.getTime() < 15 * 60 * 1000;

    if (isPendingRecently || subscribed === 'true') {
      return (
        <div className="space-y-6 max-w-2xl">
          <SubscriptionPending locale={locale} />
        </div>
      );
    }

    return (
      <div className="space-y-6 max-w-2xl">
        <PlanWizard projectId={project.id} locale={locale} siteUrl={project.site_url} />
      </div>
    );
  }

  const isPremium = project?.plan_tier === 'premium';

  const quickLinks: QuickLink[] = [
    {
      key: 'messages',
      icon: MessageSquare,
      labelEn: 'Messages',
      labelJa: 'メッセージ',
      path: `/${locale}/dashboard/messages`,
      descEn: 'Chat with the team',
      descJa: 'チームとチャット',
    },
    {
      key: 'documents',
      icon: FileText,
      labelEn: 'Documents',
      labelJa: '書類',
      path: `/${locale}/dashboard/documents`,
      descEn: 'Signed agreements',
      descJa: '署名済み契約書',
    },
    {
      key: 'invoices',
      icon: Receipt,
      labelEn: 'Invoices',
      labelJa: '請求書',
      path: `/${locale}/dashboard/invoices`,
      descEn: 'Billing & payments',
      descJa: '請求・支払い',
    },
    {
      key: 'requests',
      icon: PlusCircle,
      labelEn: 'Requests',
      labelJa: 'リクエスト',
      path: `/${locale}/dashboard/requests`,
      descEn: 'Request new features',
      descJa: '機能追加リクエスト',
    },
    {
      key: 'audits',
      icon: ShieldCheck,
      labelEn: 'Audits',
      labelJa: '監査',
      path: `/${locale}/dashboard/audits`,
      descEn: isPremium ? 'Security & SEO reports' : 'Premium only',
      descJa: isPremium ? 'セキュリティ・SEOレポート' : 'Premium限定',
      premiumOnly: true,
      locked: !isPremium,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page title */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold font-heading text-zen-off-white">
            {isJa ? 'ダッシュボード' : 'Dashboard'}
          </h1>
          {project?.plan_tier && (
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                project.plan_tier === 'premium'
                  ? 'text-zen-green bg-zen-green/10 border-zen-green/30'
                  : 'text-zen-muted bg-zen-border/50 border-zen-border'
              }`}
            >
              {project.plan_tier === 'premium' ? 'Premium' : 'Basic'}
            </span>
          )}
        </div>
        <p className="text-zen-subtle text-sm font-mono mt-1">
          {isJa ? 'プロジェクトの状況を確認' : 'Track your project progress'}
        </p>
      </div>

      {/* Project status + plan summary */}
      {project?.plan_tier ? (
        <div className="space-y-4">
          {/* Top row: project status + plan summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProjectStatusCard project={project} locale={locale} hideAdminLinks={true} />
            <PlanSummaryCard
              planTier={project.plan_tier}
              commitmentStartsAt={project.commitment_starts_at ?? new Date().toISOString()}
              locale={locale}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProjectStatusCard project={project} locale={locale} />
        </div>
      )}

      {/* Quick links — 2-col on mobile, up to 5-col on md+ */}
      <div>
        <p className="text-zen-subtle text-xs font-mono uppercase tracking-widest mb-3">
          {isJa ? 'クイックリンク' : 'Quick Links'}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            const label = isJa ? link.labelJa : link.labelEn;
            const desc = isJa ? link.descJa : link.descEn;
            const ariaLabel = link.locked
              ? `${label} — ${isJa ? 'Premium限定' : 'Premium only'}`
              : label;

            const baseClasses =
              'flex flex-col gap-3 p-4 border rounded-lg transition-all group';
            const stateClasses = link.locked
              ? 'border-zen-border/60 bg-zen-surface/60 hover:border-zen-green/40'
              : 'border-zen-border bg-zen-surface hover:border-zen-green/50 hover:bg-zen-surface/80';

            return (
              <Link
                key={link.key}
                href={link.locked ? `/${locale}/dashboard/billing` : link.path}
                aria-label={ariaLabel}
                className={`${baseClasses} ${stateClasses}`}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    size={18}
                    className={
                      link.locked
                        ? 'text-zen-subtle/70'
                        : 'text-zen-subtle group-hover:text-zen-green transition-colors'
                    }
                    aria-hidden="true"
                  />
                  {link.locked && (
                    <Lock size={12} className="text-zen-subtle/60" aria-hidden="true" />
                  )}
                </div>
                <div>
                  <p className="text-zen-off-white text-sm font-mono font-bold">{label}</p>
                  <p className="text-zen-subtle text-xs font-mono mt-0.5">{desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
