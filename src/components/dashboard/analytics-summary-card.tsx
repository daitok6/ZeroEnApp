'use client';

import { Users, Eye, Clock, TrendingDown } from 'lucide-react';

interface TopPage {
  path: string;
  views: number;
  pct: number;
}

interface Snapshot {
  period_start: string;
  period_end: string;
  visitors: number;
  pageviews: number;
  avg_session_seconds: number | null;
  bounce_rate: number | null;
  top_pages: TopPage[] | null;
}

interface Props {
  snapshot: Snapshot;
  locale: string;
}

function formatSeconds(s: number): string {
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function formatMonth(dateStr: string, locale: string): string {
  const date = new Date(dateStr + 'T00:00:00Z');
  return date.toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });
}

const stat = 'flex flex-col gap-0.5 p-4 border border-[#1F2937] rounded-lg bg-[#111827]';
const label = 'text-[#6B7280] text-[10px] font-mono uppercase tracking-wider';
const value = 'text-[#F4F4F2] text-2xl font-bold font-heading';

export function AnalyticsSummaryCard({ snapshot, locale }: Props) {
  const month = formatMonth(snapshot.period_start, locale);
  const isJa = locale === 'ja';

  return (
    <div className="space-y-4">
      <p className="text-[#6B7280] text-xs font-mono">
        {isJa ? '対象期間：' : 'Period: '}
        <span className="text-[#F4F4F2]">{month}</span>
      </p>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className={stat}>
          <div className="flex items-center gap-1.5 mb-1">
            <Users size={12} className="text-[#00E87A]" />
            <span className={label}>{isJa ? '訪問者' : 'Visitors'}</span>
          </div>
          <span className={value}>{snapshot.visitors.toLocaleString()}</span>
        </div>

        <div className={stat}>
          <div className="flex items-center gap-1.5 mb-1">
            <Eye size={12} className="text-[#00E87A]" />
            <span className={label}>{isJa ? 'PV' : 'Page Views'}</span>
          </div>
          <span className={value}>{snapshot.pageviews.toLocaleString()}</span>
        </div>

        <div className={stat}>
          <div className="flex items-center gap-1.5 mb-1">
            <Clock size={12} className="text-[#00E87A]" />
            <span className={label}>{isJa ? '平均滞在' : 'Avg. Session'}</span>
          </div>
          <span className={value}>
            {snapshot.avg_session_seconds != null
              ? formatSeconds(snapshot.avg_session_seconds)
              : '—'}
          </span>
        </div>

        <div className={stat}>
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingDown size={12} className="text-[#00E87A]" />
            <span className={label}>{isJa ? '直帰率' : 'Bounce Rate'}</span>
          </div>
          <span className={value}>
            {snapshot.bounce_rate != null ? `${snapshot.bounce_rate}%` : '—'}
          </span>
        </div>
      </div>

      {/* Top pages */}
      {snapshot.top_pages && snapshot.top_pages.length > 0 && (
        <div className="border border-[#1F2937] rounded-lg overflow-hidden">
          <div className="px-4 py-2 border-b border-[#1F2937] bg-[#111827]">
            <span className="text-[#6B7280] text-[10px] font-mono uppercase tracking-wider">
              {isJa ? '人気ページ' : 'Top Pages'}
            </span>
          </div>
          <div className="divide-y divide-[#1F2937]">
            {snapshot.top_pages.slice(0, 5).map((page) => (
              <div key={page.path} className="flex items-center justify-between px-4 py-2.5 bg-[#0D0D0D]">
                <span className="text-[#F4F4F2] text-xs font-mono truncate max-w-[60%]">
                  {page.path}
                </span>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[#6B7280] text-xs font-mono">
                    {page.views.toLocaleString()} {isJa ? 'PV' : 'views'}
                  </span>
                  <span className="text-[#00E87A] text-xs font-mono w-10 text-right">
                    {page.pct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
