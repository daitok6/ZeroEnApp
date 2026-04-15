import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Database } from '@/types/database';

type Project = Database['public']['Tables']['projects']['Row'];

interface ProjectStatusCardProps {
  project: Project | null;
  locale: string;
  hideAdminLinks?: boolean;
}

export function ProjectStatusCard({ project, locale, hideAdminLinks = false }: ProjectStatusCardProps) {
  const t = useTranslations('dashboard.projectStatus');
  const tStatus = useTranslations('common.status');

  if (!project) {
    return (
      <div className="border border-[#374151] rounded-lg p-6 bg-[#111827]">
        <p className="text-[#00E87A] text-xs font-mono uppercase tracking-widest mb-3">
          {t('title')}
        </p>
        <p className="text-[#F4F4F2] font-mono font-bold text-lg mb-2">
          {t('settingUp')}
        </p>
        <p className="text-[#9CA3AF] text-sm font-mono">
          {t('settingUpDesc')}
        </p>
      </div>
    );
  }

  const STATUS_COLORS: Record<string, string> = {
    onboarding: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    building: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    launched: 'text-[#00E87A] bg-[#00E87A]/10 border-[#00E87A]/20',
    operating: 'text-[#00E87A] bg-[#00E87A]/10 border-[#00E87A]/20',
    paused: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    terminated: 'text-red-400 bg-red-400/10 border-red-400/20',
  };

  const statusColor = STATUS_COLORS[project.status] ?? STATUS_COLORS.onboarding;
  const statusLabel = tStatus(project.status as Parameters<typeof tStatus>[0]);

  return (
    <div className="border border-[#374151] rounded-lg p-6 bg-[#111827]">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <p className="text-[#00E87A] text-xs font-mono uppercase tracking-widest mb-1">
            {t('title')}
          </p>
          <h2 className="text-[#F4F4F2] font-mono font-bold text-xl truncate">{project.name}</h2>
          {project.description && (
            <p className="text-[#9CA3AF] text-sm font-mono mt-1">{project.description}</p>
          )}
        </div>
        <span className={`shrink-0 text-xs font-mono font-bold px-3 py-1 rounded border ${statusColor}`}>
          {statusLabel}
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
            {t('viewSite')}
          </a>
        )}
        {!hideAdminLinks && project.github_repo && (
          <a
            href={project.github_repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#9CA3AF] hover:text-[#00E87A] text-xs font-mono transition-colors"
          >
            {t('github')}
          </a>
        )}
        {!hideAdminLinks && project.vercel_project && (
          <a
            href="https://vercel.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#9CA3AF] hover:text-[#00E87A] text-xs font-mono transition-colors"
          >
            {t('vercel')}
          </a>
        )}
        <span className="text-[#6B7280] text-xs font-mono">
          {t('started')}{' '}
          {new Date(project.created_at).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US')}
        </span>
      </div>
    </div>
  );
}
