import { ExternalLink } from 'lucide-react';
import { Database } from '@/types/database';

type Project = Database['public']['Tables']['projects']['Row'];

interface ProjectStatusCardProps {
  project: Project | null;
  locale: string;
}

const STATUS_LABELS: Record<string, { en: string; ja: string; color: string }> = {
  onboarding: { en: 'Onboarding', ja: 'オンボード中', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  building: { en: 'Building', ja: '開発中', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  launched: { en: 'Launched', ja: 'ローンチ済み', color: 'text-[#00E87A] bg-[#00E87A]/10 border-[#00E87A]/20' },
  operating: { en: 'Operating', ja: '運用中', color: 'text-[#00E87A] bg-[#00E87A]/10 border-[#00E87A]/20' },
  paused: { en: 'Paused', ja: '一時停止中', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
  terminated: { en: 'Terminated', ja: '終了', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
};

export function ProjectStatusCard({ project, locale }: ProjectStatusCardProps) {
  if (!project) {
    return (
      <div className="border border-[#374151] rounded-lg p-6 bg-[#111827]">
        <p className="text-[#00E87A] text-xs font-mono uppercase tracking-widest mb-3">
          {locale === 'ja' ? 'プロジェクト' : 'Project'}
        </p>
        <p className="text-[#F4F4F2] font-mono font-bold text-lg mb-2">
          {locale === 'ja' ? 'プロジェクト準備中' : 'Project Being Set Up'}
        </p>
        <p className="text-[#9CA3AF] text-sm font-mono">
          {locale === 'ja'
            ? 'オンボーディング完了。プロジェクトの準備ができたらここに表示されます。'
            : "You're all set. Your project will appear here once it's been created."}
        </p>
      </div>
    );
  }

  const statusInfo = STATUS_LABELS[project.status] || STATUS_LABELS.onboarding;

  return (
    <div className="border border-[#374151] rounded-lg p-6 bg-[#111827]">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <p className="text-[#00E87A] text-xs font-mono uppercase tracking-widest mb-1">
            {locale === 'ja' ? 'プロジェクト' : 'Project'}
          </p>
          <h2 className="text-[#F4F4F2] font-mono font-bold text-xl truncate">{project.name}</h2>
          {project.description && (
            <p className="text-[#9CA3AF] text-sm font-mono mt-1">{project.description}</p>
          )}
        </div>
        <span className={`shrink-0 text-xs font-mono font-bold px-3 py-1 rounded border ${statusInfo.color}`}>
          {locale === 'ja' ? statusInfo.ja : statusInfo.en}
        </span>
      </div>

      {/* Links row */}
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-[#374151]">
        {project.site_url && (
          <a
            href={project.site_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#00E87A] font-bold text-xs font-mono hover:text-[#00E87A]/80 transition-colors"
          >
            <ExternalLink size={12} />
            {locale === 'ja' ? 'サイトを見る' : 'View Live Site'} →
          </a>
        )}
        {project.github_repo && (
          <a
            href={project.github_repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#9CA3AF] hover:text-[#00E87A] text-xs font-mono transition-colors"
          >
            GitHub →
          </a>
        )}
        {project.vercel_project && (
          <a
            href="https://vercel.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#9CA3AF] hover:text-[#00E87A] text-xs font-mono transition-colors"
          >
            Vercel →
          </a>
        )}
        <span className="text-[#6B7280] text-xs font-mono">
          {locale === 'ja' ? '開始:' : 'Started:'}{' '}
          {new Date(project.created_at).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US')}
        </span>
      </div>
    </div>
  );
}
