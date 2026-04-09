import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ChangeRequestForm } from '@/components/dashboard/change-request-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Requests — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

export default async function RequestsPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('client_id', user.id)
    .single();

  const requests = project
    ? (await supabase
        .from('change_requests')
        .select('*')
        .eq('project_id', project.id)
        .order('created_at', { ascending: false })).data ?? []
    : [];

  const STATUS_LABELS: Record<string, { en: string; ja: string; color: string }> = {
    submitted: { en: 'Submitted', ja: '送信済み', color: 'text-blue-400 border-blue-400/30' },
    reviewing: { en: 'Reviewing', ja: '確認中', color: 'text-yellow-400 border-yellow-400/30' },
    quoted: { en: 'Quoted', ja: '見積済み', color: 'text-orange-400 border-orange-400/30' },
    approved: { en: 'Approved', ja: '承認済み', color: 'text-[#00E87A] border-[#00E87A]/30' },
    in_progress: { en: 'In Progress', ja: '進行中', color: 'text-[#00E87A] border-[#00E87A]/30' },
    completed: { en: 'Completed', ja: '完了', color: 'text-[#6B7280] border-[#6B7280]/30' },
    rejected: { en: 'Rejected', ja: '却下', color: 'text-red-400 border-red-400/30' },
  };

  const TIER_LABELS = {
    small: { en: 'Small ($50-100)', ja: 'スモール ($50-100)' },
    medium: { en: 'Medium ($200-500)', ja: 'ミディアム ($200-500)' },
    large: { en: 'Large ($500-2,000)', ja: 'ラージ ($500-2,000)' },
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-xl font-bold font-mono text-[#F4F4F2]">
          {locale === 'ja' ? '変更リクエスト' : 'Change Requests'}
        </h1>
        <p className="text-[#6B7280] text-xs font-mono mt-1">
          {locale === 'ja'
            ? 'スコープ外の機能追加を依頼する'
            : 'Request new features beyond your original scope'}
        </p>
      </div>

      {/* Request form */}
      {project && (
        <ChangeRequestForm projectId={project.id} locale={locale} />
      )}

      {/* Existing requests */}
      {requests.length > 0 && (
        <div>
          <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-3">
            {locale === 'ja' ? '過去のリクエスト' : 'Past Requests'}
          </p>
          <div className="space-y-3">
            {requests.map((req) => {
              const statusInfo = STATUS_LABELS[req.status] || STATUS_LABELS.submitted;
              const tierInfo = req.tier ? TIER_LABELS[req.tier as keyof typeof TIER_LABELS] : null;
              return (
                <div key={req.id} className="border border-[#374151] rounded-lg p-4 bg-[#111827]">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-[#F4F4F2] text-sm font-mono font-bold">{req.title}</p>
                    <span className={`shrink-0 text-xs font-mono border px-2 py-0.5 rounded ${statusInfo.color}`}>
                      {locale === 'ja' ? statusInfo.ja : statusInfo.en}
                    </span>
                  </div>
                  <p className="text-[#9CA3AF] text-xs font-mono mb-2 line-clamp-2">{req.description}</p>
                  <div className="flex items-center gap-3">
                    {tierInfo && (
                      <span className="text-[#6B7280] text-xs font-mono">
                        {locale === 'ja' ? tierInfo.ja : tierInfo.en}
                      </span>
                    )}
                    {req.estimated_cost_cents && (
                      <span className="text-[#00E87A] text-xs font-mono">
                        ${(req.estimated_cost_cents / 100).toLocaleString()}
                      </span>
                    )}
                    <span className="text-[#374151] text-xs font-mono ml-auto">
                      {new Date(req.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!project && (
        <div className="border border-[#374151] rounded-lg p-8 bg-[#111827] text-center">
          <p className="text-[#9CA3AF] font-mono text-sm">
            {locale === 'ja'
              ? 'プロジェクト開始後に変更リクエストが送れます'
              : 'Change requests are available once your project starts'}
          </p>
        </div>
      )}
    </div>
  );
}
