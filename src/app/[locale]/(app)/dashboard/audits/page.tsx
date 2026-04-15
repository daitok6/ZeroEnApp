import { getDashboardSession } from '@/lib/dashboard/session';
import Link from 'next/link';
import { ShieldCheck, Search, Download, Lock } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Audits — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function DashboardAuditsPage({ params }: Props) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  const { project, supabase } = await getDashboardSession(locale);

  // RLS: only returns rows if the user is a Premium client on the owning project.
  const { data: audits } = await supabase
    .from('audits')
    .select('id, kind, period, file_name, delivered_at, created_at')
    .order('created_at', { ascending: false });

  const isPremium = project?.plan_tier === 'premium';

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-heading text-zen-off-white">
          {isJa ? '監査レポート' : 'Audits'}
        </h1>
        <p className="text-zen-subtle text-sm font-mono mt-1">
          {isJa
            ? 'セキュリティ・SEOの四半期監査レポート'
            : 'Quarterly security & SEO audit reports'}
        </p>
      </div>

      {!isPremium ? (
        <div className="border border-zen-border rounded-lg bg-zen-surface p-6 md:p-8 text-center space-y-4">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-zen-green/30 bg-zen-green/5 mx-auto"
            aria-hidden="true"
          >
            <Lock size={18} className="text-zen-green" />
          </div>
          <h2 className="text-zen-off-white font-mono font-bold text-lg">
            {isJa ? 'Premium限定の特典' : 'A Premium benefit'}
          </h2>
          <p className="text-zen-subtle font-mono text-sm leading-relaxed max-w-md mx-auto">
            {isJa
              ? '四半期ごとにセキュリティとSEOの監査レポートを無料で受け取れます。問題は修正後にPDFで配信されます。'
              : 'Premium includes a free security and SEO audit every quarter. Issues are fixed first, then the PDF report is delivered.'}
          </p>
          <Link
            href={`/${locale}/dashboard/billing`}
            className="inline-block px-4 py-2 rounded bg-zen-green text-zen-dark font-mono text-sm font-bold hover:bg-zen-green/90 transition-colors"
          >
            {isJa ? 'Premiumにアップグレード' : 'Upgrade to Premium'}
          </Link>
        </div>
      ) : (audits ?? []).length === 0 ? (
        <div className="border border-zen-border rounded-lg bg-zen-surface p-6 md:p-8 text-center space-y-2">
          <p className="text-zen-off-white font-mono text-sm font-bold">
            {isJa ? 'まだ監査レポートはありません' : 'No audits yet'}
          </p>
          <p className="text-zen-subtle font-mono text-xs leading-relaxed max-w-md mx-auto">
            {isJa
              ? '最初の四半期監査が完了すると、ここにレポートが表示されます。'
              : 'Your first quarterly audit report will appear here once it is delivered.'}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {(audits ?? []).map((a) => {
            const isSecurity = a.kind === 'security';
            const Icon = isSecurity ? ShieldCheck : Search;
            const kindLabel = isSecurity
              ? isJa
                ? 'セキュリティ監査'
                : 'Security audit'
              : isJa
                ? 'SEO監査'
                : 'SEO audit';
            return (
              <li key={a.id}>
                <Link
                  href={`/api/audits/${a.id}/download`}
                  className="flex items-center gap-3 md:gap-4 border border-zen-border rounded-lg bg-zen-surface p-4 hover:border-zen-green/50 transition-colors group"
                >
                  <span
                    className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-zen-green/10 border border-zen-green/20"
                    aria-hidden="true"
                  >
                    <Icon size={18} className="text-zen-green" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-zen-off-white font-mono text-sm font-bold">
                      {kindLabel} · {a.period}
                    </p>
                    <p className="text-zen-subtle font-mono text-xs mt-0.5 truncate">
                      {a.delivered_at
                        ? `${isJa ? '配信日' : 'Delivered'}: ${formatDate(a.delivered_at, locale)}`
                        : formatDate(a.created_at, locale)}
                    </p>
                  </div>
                  <Download
                    size={16}
                    className="shrink-0 text-zen-subtle group-hover:text-zen-green transition-colors"
                    aria-label={isJa ? 'ダウンロード' : 'Download'}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
