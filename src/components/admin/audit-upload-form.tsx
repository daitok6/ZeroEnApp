'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';

type ProjectOption = {
  id: string;
  label: string;
  siteUrl: string | null;
};

type Props = {
  locale: string;
  projects: ProjectOption[];
};

function currentQuarter(): string {
  const now = new Date();
  const q = Math.floor(now.getMonth() / 3) + 1;
  return `${now.getFullYear()}-Q${q}`;
}

export function AuditUploadForm({ locale, projects }: Props) {
  const isJa = locale === 'ja';
  const router = useRouter();
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '');
  const [kind, setKind] = useState<'security' | 'seo'>('security');
  const [period, setPeriod] = useState(currentQuarter());
  const [file, setFile] = useState<File | null>(null);
  const [deliver, setDeliver] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file || !projectId) return;
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const form = new FormData();
    form.append('file', file);
    form.append('project_id', projectId);
    form.append('kind', kind);
    form.append('period', period);
    form.append('deliver', deliver ? 'true' : 'false');

    const res = await fetch('/api/admin/audits/upload', {
      method: 'POST',
      body: form,
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: 'Upload failed' }));
      setError(data.error ?? 'Upload failed');
      return;
    }

    setSuccess(true);
    setFile(null);
    // Clear the file input
    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  if (projects.length === 0) {
    return (
      <div className="border border-zen-border rounded-lg bg-zen-surface p-6 text-center">
        <p className="text-zen-subtle font-mono text-sm">
          {isJa
            ? 'Premiumクライアントが登録されていません'
            : 'No Premium clients to upload for yet'}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="border border-zen-border rounded-lg bg-zen-surface p-4 md:p-6 space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block space-y-1.5">
          <span className="text-zen-subtle text-xs font-mono uppercase tracking-widest">
            {isJa ? 'クライアント' : 'Client'}
          </span>
          <select
            required
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full bg-zen-dark border border-zen-border rounded px-3 py-2 text-zen-off-white font-mono text-sm focus:border-zen-green/60 focus:outline-none"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-zen-subtle text-xs font-mono uppercase tracking-widest">
            {isJa ? '種類' : 'Kind'}
          </span>
          <select
            required
            value={kind}
            onChange={(e) => setKind(e.target.value as 'security' | 'seo')}
            className="w-full bg-zen-dark border border-zen-border rounded px-3 py-2 text-zen-off-white font-mono text-sm focus:border-zen-green/60 focus:outline-none"
          >
            <option value="security">{isJa ? 'セキュリティ' : 'Security'}</option>
            <option value="seo">SEO</option>
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-zen-subtle text-xs font-mono uppercase tracking-widest">
            {isJa ? '期間 (YYYY-Q#)' : 'Period (YYYY-Q#)'}
          </span>
          <input
            required
            type="text"
            pattern="\d{4}-Q[1-4]"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            placeholder="2026-Q2"
            className="w-full bg-zen-dark border border-zen-border rounded px-3 py-2 text-zen-off-white font-mono text-sm focus:border-zen-green/60 focus:outline-none"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-zen-subtle text-xs font-mono uppercase tracking-widest">
            {isJa ? 'PDFファイル' : 'PDF file'}
          </span>
          <input
            required
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-zen-off-white font-mono text-xs file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:bg-zen-green/10 file:text-zen-green file:font-mono file:text-xs hover:file:bg-zen-green/20"
          />
        </label>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={deliver}
          onChange={(e) => setDeliver(e.target.checked)}
          className="accent-zen-green"
        />
        <span className="text-zen-off-white font-mono text-sm">
          {isJa ? '配信済みとしてマーク' : 'Mark as delivered now'}
        </span>
      </label>

      {error && (
        <p
          role="alert"
          className="text-sm font-mono text-red-400 bg-red-500/10 border border-red-500/30 rounded px-3 py-2"
        >
          {error}
        </p>
      )}
      {success && (
        <p
          role="status"
          className="text-sm font-mono text-zen-green bg-zen-green/10 border border-zen-green/30 rounded px-3 py-2"
        >
          {isJa ? 'アップロード完了' : 'Uploaded successfully'}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || !file}
        className="inline-flex items-center gap-2 px-4 py-2 rounded bg-zen-green text-zen-dark font-mono text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zen-green/90 transition-colors"
      >
        <Upload size={14} aria-hidden="true" />
        {submitting
          ? isJa
            ? 'アップロード中…'
            : 'Uploading…'
          : isJa
            ? 'アップロード'
            : 'Upload audit'}
      </button>
    </form>
  );
}
