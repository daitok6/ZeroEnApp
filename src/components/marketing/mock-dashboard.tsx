'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Receipt,
  PlusCircle,
  ShieldCheck,
  Settings,
  Lock,
  CheckCircle2,
  Circle,
  ArrowRight,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'messages' | 'documents' | 'invoices' | 'requests';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MESSAGES = [
  {
    from: 'zeroen',
    text: 'Milestone 2 is live on preview. Please review and approve when ready.',
    time: 'Apr 20, 10:14',
  },
  {
    from: 'client',
    text: 'Looks great — one small thing: can we adjust the hero padding on mobile?',
    time: 'Apr 20, 14:32',
  },
  {
    from: 'zeroen',
    text: "Done — pushed. Mobile hero padding now matches the design spec exactly.",
    time: 'Apr 21, 9:03',
  },
];

const DOCUMENTS = [
  { name: 'ZeroEn Growth Proposal — Kenji Capital', type: 'PDF', date: 'Mar 28' },
  { name: 'Fixed-Price Contract — Growth Tier', type: 'PDF', date: 'Apr 1' },
];

const INVOICES = [
  { label: 'Milestone 1 — Kickoff & Scoping', amount: '¥220,000', status: 'paid', date: 'Apr 3' },
  { label: 'Milestone 2 — Design & Build', amount: '¥440,000', status: 'paid', date: 'Apr 15' },
  { label: 'Milestone 3 — Shipping & Handoff', amount: '¥220,000', status: 'pending', date: 'Apr 28' },
];

const REQUESTS = [
  { title: 'Mobile hero padding adjustment', status: 'completed', amount: 'Included', date: 'Apr 21' },
  { title: 'Add /team page with bios', status: 'quoted', amount: '¥45,000', date: 'Apr 22' },
];

const MILESTONES = [
  { label: 'Scoped & Agreed', done: true },
  { label: 'Design & Build', done: true },
  { label: 'Shipping & Handoff', done: false, active: true },
];

// ─── Badge ────────────────────────────────────────────────────────────────────

const BADGE: Record<string, { bg: string; text: string; label: string }> = {
  completed:  { bg: 'bg-[#6B7280]/20 border border-[#6B7280]/30', text: 'text-[#9CA3AF]', label: 'Completed' },
  in_progress:{ bg: 'bg-[#00E87A]/10 border border-[#00E87A]/30', text: 'text-[#00E87A]',  label: 'In Progress' },
  quoted:     { bg: 'bg-orange-400/10 border border-orange-400/30', text: 'text-orange-400', label: 'Quoted' },
  pending:    { bg: 'bg-orange-400/10 border border-orange-400/30', text: 'text-orange-400', label: 'Pending' },
  paid:       { bg: 'bg-[#00E87A]/10 border border-[#00E87A]/30', text: 'text-[#00E87A]',  label: 'Paid' },
};

function Badge({ status }: { status: string }) {
  const s = BADGE[status];
  if (!s) return null;
  return (
    <span className={`inline-block px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

// ─── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab({ onNav }: { onNav: (t: Tab) => void }) {
  return (
    <div className="p-4 space-y-4">

      {/* Plan summary */}
      <div className="bg-[#0D0D0D] border border-[#1F2937] rounded-lg p-4">
        <p className="text-[#9CA3AF] font-mono text-[10px] uppercase tracking-wider mb-3">Plan Summary</p>
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-[#00E87A]/10 border border-[#00E87A]/30 text-[#00E87A] font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
            Growth
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
          {[
            ['Project', '¥880,000'],
            ['Retainer', '¥35,000/mo'],
            ['Delivered', 'Apr 18, 2026'],
            ['Status', 'Active'],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-[#4B5563] font-mono text-[9px] uppercase tracking-wider">{label}</p>
              <p className="text-[#F4F4F2] font-mono text-xs font-bold mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Project milestones */}
      <div className="bg-[#0D0D0D] border border-[#1F2937] rounded-lg p-4">
        <p className="text-[#9CA3AF] font-mono text-[10px] uppercase tracking-wider mb-3">Project Status</p>
        <div className="space-y-2.5">
          {MILESTONES.map((m) => (
            <div key={m.label} className="flex items-center gap-2.5">
              {m.done
                ? <CheckCircle2 className="w-3.5 h-3.5 text-[#00E87A] flex-shrink-0" aria-hidden />
                : <Circle className={`w-3.5 h-3.5 flex-shrink-0 ${m.active ? 'text-[#00E87A]' : 'text-[#374151]'}`} aria-hidden />
              }
              <span className={`font-mono text-xs ${m.done || m.active ? 'text-[#F4F4F2]' : 'text-[#4B5563]'}`}>
                {m.label}
              </span>
              {m.active && (
                <span className="ml-auto bg-[#00E87A]/10 border border-[#00E87A]/30 text-[#00E87A] font-mono text-[9px] px-1.5 py-0.5 rounded">
                  Active
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick-link tiles */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNav('messages')}
          className="bg-[#0D0D0D] border border-[#1F2937] rounded-lg p-3 text-left hover:border-[#00E87A]/40 transition-colors duration-150 group"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#00E87A] mb-2 transition-colors" aria-hidden />
          <p className="text-[#F4F4F2] font-mono text-xs font-bold leading-none">Messages</p>
          <p className="text-[#00E87A] font-mono text-[10px] mt-1.5">3 unread</p>
        </button>
        <button
          onClick={() => onNav('invoices')}
          className="bg-[#0D0D0D] border border-[#1F2937] rounded-lg p-3 text-left hover:border-[#00E87A]/40 transition-colors duration-150 group"
        >
          <Receipt className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#00E87A] mb-2 transition-colors" aria-hidden />
          <p className="text-[#F4F4F2] font-mono text-xs font-bold leading-none">Invoices</p>
          <p className="text-orange-400 font-mono text-[10px] mt-1.5">1 pending</p>
        </button>
      </div>

    </div>
  );
}

// ─── Messages tab ─────────────────────────────────────────────────────────────

function MessagesTab() {
  return (
    <div className="p-4 space-y-3">
      {MESSAGES.map((msg, i) => {
        const isZE = msg.from === 'zeroen';
        return (
          <div key={i} className={`flex gap-2.5 ${isZE ? '' : 'flex-row-reverse'}`}>
            <span
              className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-mono text-[9px] font-bold ${
                isZE ? 'bg-[#00E87A] text-[#0D0D0D]' : 'bg-[#1F2937] text-[#9CA3AF] border border-[#374151]'
              }`}
              aria-hidden
            >
              {isZE ? 'ZE' : 'KK'}
            </span>
            <div className={`max-w-[78%] flex flex-col ${isZE ? 'items-start' : 'items-end'}`}>
              <div
                className={`px-3 py-2 rounded-lg font-mono text-xs leading-relaxed ${
                  isZE ? 'bg-[#1F2937] text-[#F4F4F2]' : 'bg-[#00E87A]/10 border border-[#00E87A]/20 text-[#F4F4F2]'
                }`}
              >
                {msg.text}
              </div>
              <p className="text-[#4B5563] font-mono text-[9px] mt-1">{msg.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Documents tab ────────────────────────────────────────────────────────────

function DocumentsTab() {
  return (
    <div className="p-4 space-y-3">
      {DOCUMENTS.map((doc) => (
        <div key={doc.name} className="bg-[#0D0D0D] border border-[#1F2937] rounded-lg p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileText className="w-3.5 h-3.5 text-[#6B7280] flex-shrink-0" aria-hidden />
            <p className="text-[#F4F4F2] font-mono text-xs truncate">{doc.name}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[#4B5563] font-mono text-[9px]">{doc.date}</span>
            <ArrowRight className="w-3 h-3 text-[#374151]" aria-hidden />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Invoices tab ─────────────────────────────────────────────────────────────

function InvoicesTab() {
  return (
    <div className="p-4 space-y-3">
      {INVOICES.map((inv) => (
        <div key={inv.label} className="bg-[#0D0D0D] border border-[#1F2937] rounded-lg p-3.5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <p className="text-[#F4F4F2] font-mono text-xs font-bold leading-snug">{inv.label}</p>
            <Badge status={inv.status} />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#9CA3AF] font-mono text-xs font-bold">{inv.amount}</span>
            <span className="text-[#4B5563] font-mono text-[10px]">{inv.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Requests tab ─────────────────────────────────────────────────────────────

function RequestsTab() {
  return (
    <div className="p-4 space-y-3">
      {REQUESTS.map((req) => (
        <div key={req.title} className="bg-[#0D0D0D] border border-[#1F2937] rounded-lg p-3.5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <p className="text-[#F4F4F2] font-mono text-xs font-bold leading-snug">{req.title}</p>
            <Badge status={req.status} />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#6B7280] font-mono text-[10px]">{req.date}</span>
            <span className="text-[#9CA3AF] font-mono text-[10px] font-bold">{req.amount}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Sidebar nav ──────────────────────────────────────────────────────────────

type NavEntry = { id: Tab | null; label: string; Icon: React.ElementType; locked?: boolean };

const NAV: NavEntry[] = [
  { id: 'overview',  label: 'Overview',        Icon: LayoutDashboard },
  { id: 'messages',  label: 'Messages',         Icon: MessageSquare },
  { id: 'documents', label: 'Documents',        Icon: FileText },
  { id: 'invoices',  label: 'Invoices',         Icon: Receipt },
  { id: 'requests',  label: 'Change Requests',  Icon: PlusCircle },
  { id: null,        label: 'Audits',           Icon: ShieldCheck, locked: true },
];

const MOBILE_TABS: { id: Tab; label: string }[] = [
  { id: 'overview',  label: 'Overview'  },
  { id: 'messages',  label: 'Messages'  },
  { id: 'invoices',  label: 'Invoices'  },
  { id: 'requests',  label: 'Requests'  },
];

// ─── Main export ──────────────────────────────────────────────────────────────

export function MockDashboard() {
  const [tab, setTab] = useState<Tab>('overview');

  const tabLabel: Record<Tab, string> = {
    overview:  'Overview',
    messages:  'Messages',
    documents: 'Documents',
    invoices:  'Invoices',
    requests:  'Change Requests',
  };

  return (
    <div className="rounded-xl overflow-hidden border border-[#1F2937] bg-[#111827] shadow-[0_0_60px_rgba(0,232,122,0.10)]">

      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#080808] border-b border-[#1F2937]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" aria-hidden />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" aria-hidden />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" aria-hidden />
        <div className="ml-3 flex-1 max-w-[200px] bg-[#1F2937] rounded px-3 py-0.5 text-[#4B5563] font-mono text-[10px] truncate">
          app.zeroen.dev/dashboard
        </div>
      </div>

      {/* Dashboard shell */}
      <div className="flex" style={{ minHeight: 380 }}>

        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-44 flex-shrink-0 border-r border-[#1F2937] bg-[#0D0D0D]">
          {/* Client identity */}
          <div className="px-4 py-3 border-b border-[#1F2937]">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-[#00E87A]/10 border border-[#00E87A]/30 flex items-center justify-center flex-shrink-0">
                <span className="text-[#00E87A] font-mono text-[8px] font-bold">KK</span>
              </span>
              <div className="min-w-0">
                <p className="text-[#F4F4F2] font-mono text-[10px] font-bold leading-none truncate">Kenji Capital</p>
                <p className="text-[#4B5563] font-mono text-[9px] mt-0.5">Growth · ¥35k/mo</p>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex-1 px-2 py-3 space-y-0.5" aria-label="Dashboard navigation">
            {NAV.map(({ id, label, Icon, locked }) => {
              const active = id !== null && id === tab;
              return (
                <button
                  key={label}
                  onClick={() => id && !locked && setTab(id)}
                  aria-current={active ? 'page' : undefined}
                  disabled={locked}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-left transition-colors duration-150 ${
                    locked
                      ? 'text-[#374151] cursor-default'
                      : active
                      ? 'bg-[#00E87A]/10 text-[#00E87A]'
                      : 'text-[#6B7280] hover:text-[#9CA3AF] hover:bg-[#1F2937]/60 cursor-pointer'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden />
                  <span className="font-mono text-xs flex-1 truncate">{label}</span>
                  {locked && <Lock className="w-2.5 h-2.5 flex-shrink-0 text-[#374151]" aria-hidden />}
                </button>
              );
            })}
          </nav>

          <div className="px-2 py-3 border-t border-[#1F2937]">
            <button className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[#4B5563] hover:text-[#6B7280] hover:bg-[#1F2937]/60 transition-colors duration-150 cursor-pointer">
              <Settings className="w-3.5 h-3.5 flex-shrink-0" aria-hidden />
              <span className="font-mono text-xs">Settings</span>
            </button>
          </div>
        </aside>

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Topbar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1F2937] bg-[#080808]">
            <p className="text-[#F4F4F2] font-mono text-xs font-bold">{tabLabel[tab]}</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E87A]" aria-hidden />
              <span className="text-[#6B7280] font-mono text-[10px]">Kenji Tanaka</span>
            </div>
          </div>

          {/* Mobile tab pills */}
          <div className="md:hidden flex border-b border-[#1F2937] overflow-x-auto" role="tablist">
            {MOBILE_TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`flex-shrink-0 px-4 py-2.5 font-mono text-xs transition-colors duration-150 ${
                  tab === t.id
                    ? 'text-[#00E87A] border-b-2 border-[#00E87A]'
                    : 'text-[#6B7280] hover:text-[#9CA3AF]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {tab === 'overview'  && <OverviewTab onNav={setTab} />}
            {tab === 'messages'  && <MessagesTab />}
            {tab === 'documents' && <DocumentsTab />}
            {tab === 'invoices'  && <InvoicesTab />}
            {tab === 'requests'  && <RequestsTab />}
          </div>

        </div>
      </div>
    </div>
  );
}
