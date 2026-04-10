import { requireApproved } from '@/lib/auth/require-approved';
import { Download, FileText } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

export default async function AnalyticsPage({ params }: Props) {
  const { locale } = await params;
  await requireApproved(locale);

  // In production: list files from Supabase Storage bucket "analytics-reports"
  // For now, show empty state
  const reports: { name: string; month: string; url: string }[] = [];

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold font-heading text-[#F4F4F2]">
          {locale === 'ja' ? '分析レポート' : 'Analytics Reports'}
        </h1>
        <p className="text-[#6B7280] text-xs font-mono mt-1">
          {locale === 'ja'
            ? '毎月のアナリティクスPDFレポート'
            : 'Monthly analytics PDF reports'}
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="border border-[#374151] rounded-lg p-8 bg-[#111827] text-center">
          <FileText size={32} className="mx-auto text-[#374151] mb-4" />
          <p className="text-[#9CA3AF] font-mono text-sm mb-2">
            {locale === 'ja'
              ? '最初のレポートはローンチ後1ヶ月で届きます'
              : 'Your first report arrives one month after launch'}
          </p>
          <p className="text-[#6B7280] font-mono text-xs">
            {locale === 'ja'
              ? '訪問者数、ページビュー、パフォーマンス指標が含まれます'
              : 'Includes: visitors, page views, top pages, and performance scores'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.name} className="flex items-center justify-between p-4 border border-[#374151] rounded-lg bg-[#111827] hover:border-[#00E87A]/50 transition-colors">
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-[#00E87A] shrink-0" />
                <div>
                  <p className="text-[#F4F4F2] text-sm font-mono font-bold">{report.month}</p>
                  <p className="text-[#6B7280] text-xs font-mono">{report.name}</p>
                </div>
              </div>
              <a
                href={report.url}
                download
                className="flex items-center gap-1 text-[#00E87A] text-xs font-mono hover:underline"
              >
                <Download size={12} />
                {locale === 'ja' ? 'ダウンロード' : 'Download'}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
