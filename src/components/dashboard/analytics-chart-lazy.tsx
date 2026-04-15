'use client';

import dynamic from 'next/dynamic';

const AnalyticsChartInner = dynamic(
  () => import('./analytics-chart').then((m) => ({ default: m.AnalyticsChart })),
  { ssr: false, loading: () => <div className="border border-[#1F2937] rounded-lg bg-[#111827] h-[268px] animate-pulse" /> }
);

interface Snapshot {
  period_start: string;
  visitors: number;
  pageviews: number;
  avg_session_seconds: number | null;
  bounce_rate: number | null;
}

interface Props {
  snapshots: Snapshot[];
  locale: string;
}

export function AnalyticsChart(props: Props) {
  return <AnalyticsChartInner {...props} />;
}
