'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

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

function shortMonth(dateStr: string, locale: string): string {
  const date = new Date(dateStr + 'T00:00:00Z');
  return date.toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
    month: 'short',
    year: '2-digit',
    timeZone: 'UTC',
  });
}

export function AnalyticsChart({ snapshots, locale }: Props) {
  const isJa = locale === 'ja';
  // Oldest first for the chart
  const data = [...snapshots].reverse().map((s) => ({
    month: shortMonth(s.period_start, locale),
    [isJa ? '訪問者' : 'Visitors']: s.visitors,
    [isJa ? 'PV' : 'Page Views']: s.pageviews,
  }));

  const visitorsKey = isJa ? '訪問者' : 'Visitors';
  const pageviewsKey = isJa ? 'PV' : 'Page Views';

  return (
    <div className="border border-[#1F2937] rounded-lg bg-[#111827] p-4">
      <p className="text-[#6B7280] text-[10px] font-mono uppercase tracking-wider mb-4">
        {isJa ? '12ヶ月トレンド' : '12-Month Trend'}
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#6B7280', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
            axisLine={{ stroke: '#1F2937' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#6B7280', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#0D0D0D',
              border: '1px solid #374151',
              borderRadius: 6,
              fontFamily: 'IBM Plex Mono',
              fontSize: 11,
              color: '#F4F4F2',
            }}
            itemStyle={{ color: '#F4F4F2' }}
            labelStyle={{ color: '#6B7280', marginBottom: 4 }}
          />
          <Legend
            wrapperStyle={{
              fontSize: 10,
              fontFamily: 'IBM Plex Mono',
              color: '#6B7280',
              paddingTop: 8,
            }}
          />
          <Line
            type="monotone"
            dataKey={visitorsKey}
            stroke="#00E87A"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#00E87A' }}
          />
          <Line
            type="monotone"
            dataKey={pageviewsKey}
            stroke="#374151"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#374151' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
