import { requireApproved } from '@/lib/auth/require-approved';
import { SubscriptionRequired } from '@/components/dashboard/subscription-required';
import { EmptyState } from '@/components/dashboard/empty-state';
import { AnalyticsSummaryCard } from '@/components/dashboard/analytics-summary-card';
import { AnalyticsChart } from '@/components/dashboard/analytics-chart';
import { FileText } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

interface Snapshot {
  period_start: string;
  period_end: string;
  visitors: number;
  pageviews: number;
  avg_session_seconds: number | null;
  bounce_rate: number | null;
  top_pages: { path: string; views: number; pct: number }[] | null;
}

export default async function AnalyticsPage({ params }: Props) {
  const { locale } = await params;
  const { user, supabase } = await requireApproved(locale);
  const isJa = locale === 'ja';

  const { data: project } = await supabase
    .from('projects')
    .select('id, client_visible, plan_tier')
    .eq('client_id', user.id)
    .single();

  if (project && project.client_visible && !project.plan_tier) {
    return <SubscriptionRequired locale={locale} />;
  }

  const isPremium = project?.plan_tier === 'premium';
  const limit = isPremium ? 12 : 1;

  const { data: snapshots } = project
    ? await supabase
        .from('analytics_snapshots')
        .select(
          'period_start, period_end, visitors, pageviews, avg_session_seconds, bounce_rate, top_pages',
        )
        .eq('project_id', project.id)
        .order('period_start', { ascending: false })
        .limit(limit)
    : { data: null };

  const rows = (snapshots ?? []) as Snapshot[];

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold font-heading text-[#F4F4F2]">
          {isJa ? '分析レポート' : 'Analytics Reports'}
        </h1>
        <p className="text-[#6B7280] text-xs font-mono mt-1">
          {isJa
            ? isPremium
              ? '過去12ヶ月のアナリティクス'
              : '先月のアナリティクス'
            : isPremium
              ? 'Last 12 months of analytics'
              : 'Prior-month analytics'}
        </p>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={FileText}
          locale={locale}
          titleEn="No reports yet"
          titleJa="レポートはまだありません"
          bodyEn="Your first report arrives one month after your site launches. Includes: visitors, page views, top pages, and performance scores."
          bodyJa="最初のレポートはサイト公開後1ヶ月で届きます。訪問者数・ページビュー・人気ページ・パフォーマンス指標が含まれます。"
          cta={{
            labelEn: "What's in your report →",
            labelJa: 'レポートの内容を確認する →',
            href: `/${locale}/dashboard/help/analytics-reports`,
          }}
        />
      ) : (
        <div className="space-y-6">
          {/* Latest month summary — shown for all tiers */}
          <AnalyticsSummaryCard snapshot={rows[0]} locale={locale} />

          {/* Premium: 12-month chart + history table */}
          {isPremium && rows.length > 1 && (
            <>
              <AnalyticsChart snapshots={rows} locale={locale} />

              <div className="border border-[#1F2937] rounded-lg overflow-hidden">
                <div className="px-4 py-2 border-b border-[#1F2937] bg-[#111827]">
                  <span className="text-[#6B7280] text-[10px] font-mono uppercase tracking-wider">
                    {isJa ? '月別履歴' : 'Monthly History'}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="border-b border-[#1F2937] bg-[#111827]">
                        <th className="text-left px-4 py-2 text-[#6B7280] font-normal">
                          {isJa ? '期間' : 'Period'}
                        </th>
                        <th className="text-right px-4 py-2 text-[#6B7280] font-normal">
                          {isJa ? '訪問者' : 'Visitors'}
                        </th>
                        <th className="text-right px-4 py-2 text-[#6B7280] font-normal">
                          {isJa ? 'PV' : 'Page Views'}
                        </th>
                        <th className="text-right px-4 py-2 text-[#6B7280] font-normal hidden sm:table-cell">
                          {isJa ? '平均滞在' : 'Avg. Session'}
                        </th>
                        <th className="text-right px-4 py-2 text-[#6B7280] font-normal hidden sm:table-cell">
                          {isJa ? '直帰率' : 'Bounce'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1F2937]">
                      {rows.map((s) => {
                        const d = new Date(s.period_start + 'T00:00:00Z');
                        const label = d.toLocaleDateString(isJa ? 'ja-JP' : 'en-US', {
                          year: 'numeric',
                          month: 'short',
                          timeZone: 'UTC',
                        });
                        return (
                          <tr key={s.period_start} className="bg-[#0D0D0D] hover:bg-[#111827] transition-colors">
                            <td className="px-4 py-2.5 text-[#F4F4F2]">{label}</td>
                            <td className="px-4 py-2.5 text-right text-[#F4F4F2]">
                              {s.visitors.toLocaleString()}
                            </td>
                            <td className="px-4 py-2.5 text-right text-[#F4F4F2]">
                              {s.pageviews.toLocaleString()}
                            </td>
                            <td className="px-4 py-2.5 text-right text-[#6B7280] hidden sm:table-cell">
                              {s.avg_session_seconds != null
                                ? s.avg_session_seconds < 60
                                  ? `${s.avg_session_seconds}s`
                                  : `${Math.floor(s.avg_session_seconds / 60)}m ${s.avg_session_seconds % 60}s`
                                : '—'}
                            </td>
                            <td className="px-4 py-2.5 text-right text-[#6B7280] hidden sm:table-cell">
                              {s.bounce_rate != null ? `${s.bounce_rate}%` : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
