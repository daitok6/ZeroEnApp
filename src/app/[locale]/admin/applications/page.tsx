'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Clock, Search, CheckCircle, XCircle, User } from 'lucide-react';

const STATUS_CONFIG = {
  pending: { icon: Clock, color: 'text-yellow-400', bgColor: 'bg-yellow-400/10 border-yellow-400/20', label: 'Pending' },
  reviewing: { icon: Search, color: 'text-blue-400', bgColor: 'bg-blue-400/10 border-blue-400/20', label: 'Reviewing' },
  accepted: { icon: CheckCircle, color: 'text-[#00E87A]', bgColor: 'bg-[#00E87A]/10 border-[#00E87A]/20', label: 'Accepted' },
  rejected: { icon: XCircle, color: 'text-red-400', bgColor: 'bg-red-400/10 border-red-400/20', label: 'Rejected' },
};

type Application = {
  id: string;
  idea_name: string;
  founder_name: string;
  founder_email: string;
  founder_commitment: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  score_viability: number | null;
  score_commitment: number | null;
  score_feasibility: number | null;
  score_market: number | null;
  user_id: string | null;
  created_at: string;
};

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const supabase = createClient();

  async function load() {
    const { data } = await supabase
      .from('applications')
      .select('id, idea_name, founder_name, founder_email, founder_commitment, status, score_viability, score_commitment, score_feasibility, score_market, user_id, created_at')
      .order('created_at', { ascending: false });
    setApplications((data as Application[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleApprove(id: string) {
    setActionLoading(id + '-approve');
    await fetch(`/api/admin/applications/${id}/approve`, { method: 'POST' });
    await load();
    setActionLoading(null);
  }

  async function handleReject(id: string) {
    setActionLoading(id + '-reject');
    await fetch(`/api/admin/applications/${id}/reject`, { method: 'POST' });
    await load();
    setActionLoading(null);
  }

  const totalScore = (app: Application) => {
    const scores = [app.score_viability, app.score_commitment, app.score_feasibility, app.score_market].filter((s) => s !== null) as number[];
    return scores.length ? scores.reduce((a, b) => a + b, 0) : null;
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 rounded-lg bg-[#111827] border border-[#374151] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">Applications</h1>
        <p className="text-[#6B7280] text-sm font-mono mt-1">{applications.length} total</p>
      </div>

      {applications.length === 0 ? (
        <div className="border border-[#374151] rounded-lg bg-[#111827] p-8 text-center">
          <p className="text-[#6B7280] font-mono text-sm">No applications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const config = STATUS_CONFIG[app.status];
            const Icon = config.icon;
            const score = totalScore(app);
            const isActioning = actionLoading?.startsWith(app.id);

            return (
              <div
                key={app.id}
                className="border border-[#374151] rounded-lg bg-[#111827] p-4 space-y-3"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[#F4F4F2] font-mono font-bold text-sm truncate">{app.idea_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <User size={12} className="text-[#6B7280] shrink-0" />
                      <span className="text-[#6B7280] font-mono text-xs truncate">
                        {app.founder_name} · {app.founder_email}
                      </span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-mono font-bold shrink-0 ${config.bgColor} ${config.color}`}>
                    <Icon size={12} />
                    {config.label}
                  </div>
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-[#6B7280]">
                  <span>{app.founder_commitment}</span>
                  <span>{app.user_id ? 'Has account' : 'No account'}</span>
                  {score !== null && <span>Score: {score}/20</span>}
                  <span>{new Date(app.created_at).toLocaleDateString()}</span>
                </div>

                {/* Actions — only for non-terminal statuses */}
                {(app.status === 'pending' || app.status === 'reviewing') && (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleApprove(app.id)}
                      disabled={!!isActioning}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00E87A] text-[#0D0D0D] rounded font-mono text-xs font-bold hover:bg-[#00E87A]/90 disabled:opacity-50 transition-colors"
                    >
                      <CheckCircle size={12} />
                      {actionLoading === app.id + '-approve' ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(app.id)}
                      disabled={!!isActioning}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-red-400/30 text-red-400 rounded font-mono text-xs hover:bg-red-400/10 disabled:opacity-50 transition-colors"
                    >
                      <XCircle size={12} />
                      {actionLoading === app.id + '-reject' ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
