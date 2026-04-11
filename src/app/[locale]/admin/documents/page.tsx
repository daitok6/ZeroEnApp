import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documents — Admin — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function AdminDocumentsPage({ params }: Props) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  const supabase = await createClient();

  // Fetch all projects with profile info and application date
  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, client_id, application_id, onboarding_data, created_at')
    .order('created_at', { ascending: false });

  const projectList = projects ?? [];

  // Gather all client_ids and application_ids for batch lookups
  const clientIds = [...new Set(projectList.map((p) => p.client_id))];
  const applicationIds = projectList
    .map((p) => p.application_id)
    .filter((id): id is string => id !== null);

  const [profilesResult, applicationsResult] = await Promise.all([
    clientIds.length > 0
      ? supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', clientIds)
      : Promise.resolve({ data: [] }),
    applicationIds.length > 0
      ? supabase
          .from('applications')
          .select('id, created_at')
          .in('id', applicationIds)
      : Promise.resolve({ data: [] }),
  ]);

  const profileMap = new Map(
    (profilesResult.data ?? []).map((p) => [p.id, p])
  );
  const applicationMap = new Map(
    (applicationsResult.data ?? []).map((a) => [a.id, a])
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">
          {isJa ? '書類' : 'Documents'}
        </h1>
        <p className="text-[#6B7280] text-sm font-mono mt-1">
          {isJa
            ? `${projectList.length} 件のクライアント`
            : `${projectList.length} client${projectList.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {projectList.length === 0 ? (
        <div className="border border-[#374151] rounded-lg bg-[#111827] p-8 text-center">
          <p className="text-[#6B7280] font-mono text-sm">
            {isJa ? 'クライアントがいません' : 'No clients yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {projectList.map((project) => {
            const profile = profileMap.get(project.client_id);
            const application = project.application_id
              ? applicationMap.get(project.application_id)
              : null;
            const od =
              project.onboarding_data as Record<string, unknown> | null;

            const hasNda = application !== null && application !== undefined;
            const hasPartnership = od !== null && od !== undefined;

            return (
              <div
                key={project.id}
                className="border border-[#374151] rounded-lg bg-[#111827] overflow-hidden"
              >
                {/* Client header */}
                <div className="px-4 py-3 border-b border-[#374151] bg-[#0D0D0D]">
                  <p className="text-[#F4F4F2] text-sm font-mono font-bold">
                    {profile?.full_name ?? profile?.email ?? project.client_id}
                  </p>
                  <p className="text-[#6B7280] text-xs font-mono mt-0.5">
                    {project.name}
                    {profile?.email && (
                      <span className="ml-2 text-[#4B5563]">· {profile.email}</span>
                    )}
                  </p>
                </div>

                {/* Document rows */}
                <div className="divide-y divide-[#1F2937]">
                  {hasNda && (
                    <div className="flex items-center gap-3 px-4 py-3">
                      <span className="text-[#00E87A] text-xs font-mono w-4">✓</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#F4F4F2] text-sm font-mono">
                          {isJa ? '相互秘密保持契約' : 'Mutual Confidentiality Agreement'}
                        </p>
                        <p className="text-[#6B7280] text-xs font-mono mt-0.5">
                          {isJa ? '署名日: ' : 'Signed: '}
                          {formatDate(application!.created_at, locale)}
                        </p>
                      </div>
                      <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded bg-[#00E87A]/10 text-[#00E87A] border border-[#00E87A]/20">
                        {isJa ? '署名済み' : 'Signed'}
                      </span>
                    </div>
                  )}

                  {hasPartnership && (
                    <div className="flex items-center gap-3 px-4 py-3">
                      <span className="text-[#00E87A] text-xs font-mono w-4">✓</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#F4F4F2] text-sm font-mono">
                          {isJa ? 'パートナーシップ契約' : 'Partnership Agreement'}
                        </p>
                        <p className="text-[#6B7280] text-xs font-mono mt-0.5">
                          {isJa ? '署名者: ' : 'Signed by: '}
                          {typeof od!.signature_name === 'string'
                            ? od!.signature_name
                            : '—'}
                          {typeof od!.terms_accepted_at === 'string' && (
                            <span className="ml-2">
                              · {formatDate(od!.terms_accepted_at as string, locale)}
                            </span>
                          )}
                        </p>
                      </div>
                      <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded bg-[#00E87A]/10 text-[#00E87A] border border-[#00E87A]/20">
                        {isJa ? '署名済み' : 'Signed'}
                      </span>
                    </div>
                  )}

                  {!hasNda && !hasPartnership && (
                    <div className="px-4 py-3">
                      <p className="text-[#6B7280] text-xs font-mono">
                        {isJa ? '書類なし' : 'No documents'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
