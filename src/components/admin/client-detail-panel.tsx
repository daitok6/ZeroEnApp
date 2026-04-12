'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import type { ClientRow } from '@/lib/admin/queries';

interface ClientDetailPanelProps {
  client: ClientRow | null;
  open: boolean;
  onClose: () => void;
  onSaved: (updatedClient: Partial<ClientRow>) => void;
}

function FormField({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[#6B7280] text-xs font-mono uppercase tracking-wider block">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-[#111827] border-[#374151] text-[#F4F4F2] font-mono text-sm placeholder:text-[#374151] focus-visible:border-[#00E87A] focus-visible:ring-[#00E87A]/20 h-9"
      />
    </div>
  );
}

export function ClientDetailPanel({ client, open, onClose, onSaved }: ClientDetailPanelProps) {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [projectName, setProjectName] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [vercelProject, setVercelProject] = useState('');
  const [clientVisible, setClientVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailWarning, setEmailWarning] = useState<string | null>(null);

  // Sync form state when client changes
  useEffect(() => {
    if (client) {
      setProjectName(client.projectName ?? '');
      setSiteUrl(client.siteUrl ?? '');
      setGithubRepo(client.githubRepo ?? '');
      setVercelProject(client.vercelProject ?? '');
      setClientVisible(client.clientVisible ?? false);
      setError(null);
      setEmailWarning(null);
    }
  }, [client]);

  async function handleSave() {
    if (!client) return;
    setLoading(true);
    setError(null);
    setEmailWarning(null);

    try {
      const body: Record<string, unknown> = {
        site_url: siteUrl,
        github_repo: githubRepo,
        vercel_project: vercelProject,
        client_visible: clientVisible,
      };
      if (projectName) body.name = projectName;

      const res = await fetch(`/api/admin/clients/${client.id}/project`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? t('failedToSave'));
        return;
      }

      const data = await res.json();
      const proj = data.project;
      const email = data.email as { sent: boolean; reason?: string } | undefined;

      onSaved({
        projectName: proj.name ?? projectName,
        projectStatus: proj.status ?? client.projectStatus,
        projectUpdatedAt: proj.updated_at ?? client.projectUpdatedAt,
        siteUrl: proj.site_url ?? null,
        githubRepo: proj.github_repo ?? null,
        vercelProject: proj.vercel_project ?? null,
        planTier: proj.plan_tier ?? null,
        clientVisible: proj.client_visible ?? false,
        commitmentStartsAt: proj.commitment_starts_at ?? null,
        stripeSubscriptionId: proj.stripe_subscription_id ?? null,
      });

      if (email && !email.sent && email.reason && email.reason !== 'no-transition') {
        const reasonMap: Record<string, string> = {
          'not-configured': 'Resend not configured — check RESEND_API_KEY env var',
          'send-failed': 'Resend rejected the send — check sender domain verification',
          'no-client-email': 'Client profile has no email address',
        };
        setEmailWarning(`Site-ready email not sent: ${reasonMap[email.reason] ?? email.reason}`);
      } else {
        onClose();
      }
    } catch {
      setError(tCommon('networkError'));
    } finally {
      setLoading(false);
    }
  }

  if (!client) return null;

  const willLaunch = clientVisible && !client.clientVisible;

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[480px] bg-[#0D0D0D] border-[#374151] p-0 overflow-y-auto"
        showCloseButton={true}
      >
        <SheetHeader className="p-5 border-b border-[#374151] sticky top-0 bg-[#0D0D0D] z-10">
          <div className="pr-8">
            <SheetTitle className="text-[#F4F4F2] font-mono font-bold text-base leading-tight">
              {client.full_name ?? client.email}
            </SheetTitle>
            <p className="text-[#6B7280] font-mono text-xs mt-1">{client.email}</p>
          </div>
        </SheetHeader>

        <div className="p-5 space-y-6">

          {/* Project Fields */}
          <section className="space-y-4">
            <p className="text-[#6B7280] font-mono text-xs uppercase tracking-widest">{t('projectName')}</p>
            <div className="space-y-4 border border-[#374151] rounded-lg bg-[#111827] p-4">
              <FormField
                label={t('projectNameLabel')}
                id="project-name"
                value={projectName}
                onChange={setProjectName}
                placeholder="My Project"
              />
              <FormField
                label={t('siteUrl')}
                id="site-url"
                value={siteUrl}
                onChange={setSiteUrl}
                placeholder="https://..."
                type="url"
              />
              <FormField
                label={t('githubRepo')}
                id="github-repo"
                value={githubRepo}
                onChange={setGithubRepo}
                placeholder="https://github.com/..."
                type="url"
              />
              <FormField
                label={t('vercelProject')}
                id="vercel-project"
                value={vercelProject}
                onChange={setVercelProject}
                placeholder="https://vercel.com/..."
                type="url"
              />
            </div>
          </section>

          {/* Visibility toggle */}
          <section className="space-y-3">
            <p className="text-[#6B7280] font-mono text-xs uppercase tracking-widest">{t('visibility')}</p>
            <div className="border border-[#374151] rounded-lg bg-[#111827] p-4 space-y-3">
              <label
                className="flex items-center justify-between gap-3 cursor-pointer"
              >
                <span className="text-[#F4F4F2] font-mono text-sm">{t('enableProject')}</span>
                <button
                  id="client-visible"
                  role="switch"
                  aria-checked={clientVisible}
                  onClick={() => setClientVisible((v) => !v)}
                  className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E87A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827] ${
                    clientVisible ? 'bg-[#00E87A] border-[#00E87A]' : 'bg-[#374151] border-[#374151]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                      clientVisible ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </label>
              {willLaunch && (
                <p className="text-[#F59E0B] font-mono text-xs leading-relaxed border border-[#F59E0B]/20 bg-[#F59E0B]/5 rounded px-3 py-2">
                  {t('enableProjectWarning')}
                </p>
              )}
            </div>
          </section>

          {/* Error */}
          {error && (
            <p className="text-red-400 font-mono text-xs">{error}</p>
          )}

          {/* Email warning (non-fatal) */}
          {emailWarning && (
            <div className="border border-[#F59E0B]/30 bg-[#F59E0B]/5 rounded px-3 py-2 space-y-2">
              <p className="text-[#F59E0B] font-mono text-xs leading-relaxed">{emailWarning}</p>
              <button
                onClick={onClose}
                className="text-[#F59E0B]/70 font-mono text-xs underline underline-offset-2 hover:text-[#F59E0B]"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00E87A] text-[#0D0D0D] rounded font-mono text-xs font-bold hover:bg-[#00E87A]/90 disabled:opacity-50 transition-colors"
          >
            {loading ? t('saving') : t('saveChanges')}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
