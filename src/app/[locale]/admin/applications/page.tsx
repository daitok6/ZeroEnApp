'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Clock, Search, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import {
  ApplicationDetailPanel,
  type Application,
} from '@/components/admin/application-detail-panel';
import { AdminSearchFilterBar } from '@/components/admin/admin-search-filter-bar';

const STATUS_CONFIG = {
  pending: { icon: Clock, color: 'text-yellow-400', bgColor: 'bg-yellow-400/10 border-yellow-400/20', label: 'Pending' },
  reviewing: { icon: Search, color: 'text-blue-400', bgColor: 'bg-blue-400/10 border-blue-400/20', label: 'Reviewing' },
  accepted: { icon: CheckCircle, color: 'text-[#00E87A]', bgColor: 'bg-[#00E87A]/10 border-[#00E87A]/20', label: 'Accepted' },
  rejected: { icon: XCircle, color: 'text-red-400', bgColor: 'bg-red-400/10 border-red-400/20', label: 'Rejected' },
};

const SCORE_DIMS = [
  { key: 'score_viability' as const, label: 'V' },
  { key: 'score_commitment' as const, label: 'C' },
  { key: 'score_feasibility' as const, label: 'F' },
  { key: 'score_market' as const, label: 'M' },
];

function totalScore(app: Application) {
  const scores = [app.score_viability, app.score_commitment, app.score_feasibility, app.score_market].filter((s) => s !== null) as number[];
  return scores.length === 4 ? scores.reduce((a, b) => a + b, 0) : null;
}

function scoreColor(total: number | null) {
  if (total === null) return 'text-[#6B7280]';
  if (total >= 15) return 'text-[#00E87A]';
  if (total >= 12) return 'text-yellow-400';
  return 'text-red-400';
}

export default function AdminApplicationsPage() {
  const params = useParams();
  const locale = typeof params.locale === 'string' ? params.locale : 'en';
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const filteredApplications = useMemo(() => {
    let rows = applications;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(
        (a) =>
          (a.idea_name?.toLowerCase().includes(q) ?? false) ||
          (a.founder_name?.toLowerCase().includes(q) ?? false) ||
          (a.founder_email?.toLowerCase().includes(q) ?? false),
      );
    }
    if (activeFilters.status) rows = rows.filter((a) => a.status === activeFilters.status);
    if (activeFilters.scored === 'yes') rows = rows.filter((a) => totalScore(a) !== null);
    if (activeFilters.scored === 'no') rows = rows.filter((a) => totalScore(a) === null);
    return rows;
  }, [applications, searchQuery, activeFilters]);

  const supabase = createClient();

  async function load() {
    const { data } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });
    setApplications((data as Application[]) ?? []);
    setLoading(false);
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  function openPanel(app: Application) {
    setSelectedApp(app);
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    // Keep selectedApp briefly so close animation looks right
    setTimeout(() => setSelectedApp(null), 300);
  }

  function handleScored(id: string, updated: Partial<Application>) {
    setApplications((prev) =>
      prev.map((a) => a.id === id ? { ...a, ...updated } : a)
    );
    setSelectedApp((prev) => prev ? { ...prev, ...updated } : prev);
  }

  async function handleApprove(id: string) {
    setActionLoading(id + '-approve');
    await fetch(`/api/admin/applications/${id}/approve`, { method: 'POST' });
    await load();
    setActionLoading(null);
    closePanel();
  }

  async function handleReject(id: string) {
    setActionLoading(id + '-reject');
    await fetch(`/api/admin/applications/${id}/reject`, { method: 'POST' });
    await load();
    setActionLoading(null);
    closePanel();
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-lg bg-[#111827] border border-[#374151] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">Applications</h1>
          <p className="text-[#6B7280] text-sm font-mono mt-1">{applications.length} total</p>
        </div>

        <AdminSearchFilterBar
          placeholder="Search by name or email…"
          filters={[
            {
              key: 'status',
              label: 'Status',
              options: [
                { value: 'pending', label: 'Pending' },
                { value: 'reviewing', label: 'Reviewing' },
                { value: 'accepted', label: 'Accepted' },
                { value: 'rejected', label: 'Rejected' },
              ],
            },
            {
              key: 'scored',
              label: 'Score',
              options: [
                { value: 'yes', label: 'Scored' },
                { value: 'no', label: 'Unscored' },
              ],
            },
          ]}
          activeFilters={activeFilters}
          onSearchChange={setSearchQuery}
          onFilterChange={(key, value) => setActiveFilters((prev) => ({ ...prev, [key]: value }))}
          onClear={() => { setSearchQuery(''); setActiveFilters({}); }}
        />

        {filteredApplications.length === 0 ? (
          <div className="border border-[#374151] rounded-lg bg-[#111827] p-8 text-center">
            <p className="text-[#6B7280] font-mono text-sm">No applications yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredApplications.map((app) => {
              const config = STATUS_CONFIG[app.status];
              const Icon = config.icon;
              const total = totalScore(app);
              const isScored = total !== null;
              const isActioning = actionLoading?.startsWith(app.id);

              return (
                <div
                  key={app.id}
                  onClick={() => openPanel(app)}
                  className="border border-[#374151] rounded-lg bg-[#111827] p-4 space-y-3 cursor-pointer hover:border-[#4B5563] transition-colors"
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[#F4F4F2] font-mono font-bold text-sm truncate">{app.idea_name}</p>
                      <p className="text-[#6B7280] font-mono text-xs mt-0.5 truncate">
                        {app.status === 'accepted' && app.user_id ? (
                          <Link
                            href={`/${locale}/admin/clients/${app.user_id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-[#00E87A] transition-colors hover:underline underline-offset-2"
                          >
                            {app.founder_name}
                          </Link>
                        ) : (
                          app.founder_name
                        )}
                        {' · '}{app.founder_email}
                      </p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-mono font-bold shrink-0 ${config.bgColor} ${config.color}`}>
                      <Icon size={12} />
                      {config.label}
                    </div>
                  </div>

                  {/* Score row */}
                  <div className="flex items-center justify-between">
                    {isScored ? (
                      <div className="flex items-center gap-3">
                        <span className={`font-mono text-xs font-bold ${scoreColor(total)}`}>
                          {total}/20
                        </span>
                        <div className="flex gap-2">
                          {SCORE_DIMS.map((dim) => (
                            <div key={dim.key} className="flex items-center gap-1">
                              <span className="text-[#6B7280] font-mono text-xs">{dim.label}</span>
                              <span className="text-[#F4F4F2] font-mono text-xs">{app[dim.key]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openPanel(app);
                        }}
                        disabled={!!isActioning}
                        className="flex items-center gap-1.5 text-[#6B7280] hover:text-[#00E87A] font-mono text-xs transition-colors disabled:opacity-50"
                      >
                        <Sparkles size={11} />
                        Score with AI
                      </button>
                    )}
                    <span className="text-[#6B7280] font-mono text-xs shrink-0">
                      {new Date(app.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ApplicationDetailPanel
        application={selectedApp}
        open={panelOpen}
        onClose={closePanel}
        onScored={(updated) => selectedApp && handleScored(selectedApp.id, updated)}
        onApprove={handleApprove}
        onReject={handleReject}
        actionLoading={actionLoading}
      />
    </>
  );
}
