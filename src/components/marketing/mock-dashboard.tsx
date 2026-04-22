'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  BarChart3,
  MessageSquare,
  Receipt,
  PlusCircle,
  Settings,
  TrendingUp,
  Eye,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'analytics' | 'requests' | 'invoices' | 'messages';

// ─── Mock data ────────────────────────────────────────────────────────────────

const VISITORS: { month: string; v: number }[] = [
  { month: 'Jan', v: 823 },
  { month: 'Feb', v: 910 },
  { month: 'Mar', v: 1045 },
  { month: 'Apr', v: 1102 },
  { month: 'May', v: 1189 },
  { month: 'Jun', v: 1204 },
];

const CW = 300;
const CH = 56;
const MIN_V = 823;
const MAX_V = 1204;
const RANGE = MAX_V - MIN_V;
const X_STEP = CW / (VISITORS.length - 1);
const toX = (i: number) => i * X_STEP;
const toY = (v: number) => CH - ((v - MIN_V) / RANGE) * CH;
const PTS = VISITORS.map((d, i) => `${toX(i)},${toY(d.v)}`).join(' ');
const FILL = `M ${VISITORS.map((d, i) => `${toX(i)},${toY(d.v)}`).join(' L ')} L ${CW},${CH} L 0,${CH} Z`;

const REQUESTS = [
  { title: 'Update hero section copy', status: 'completed', amount: '¥4,000', date: 'Apr 2' },
  { title: 'Add Instagram feed to footer', status: 'in_progress', amount: '¥10,000', date: 'Apr 8' },
  { title: 'Add contact form to /contact', status: 'quoted', amount: '¥4,000', date: 'Apr 11' },
];

const INVOICES = [
  { period: 'April 2026', amount: '¥10,000', status: 'paid', date: 'Apr 1' },
  { period: 'March 2026', amount: '¥10,000', status: 'paid', date: 'Mar 1' },
  { period: 'February 2026', amount: '¥10,000', status: 'paid', date: 'Feb 1' },
];

const MESSAGES = [
  {
    from: 'zeroen',
    text: 'Your April analytics report is ready. Visitors up 12% from March.',
    time: 'Apr 10, 9:02',
  },
  {
    from: 'client',
    text: 'Thanks! Can you also update the hero section copy?',
    time: 'Apr 10, 11:35',
  },
  {
    from: 'zeroen',
    text: "On it — logged as a change request (Small, ¥4,000). Approve when ready.",
    time: 'Apr 11, 8:47',
  },
];

// ─── Badge ────────────────────────────────────────────────────────────────────

const BADGE: Record<string, { bg: string; text: string; label: string }> = {
  completed:  { bg: 'bg-[#6B7280]/20 border border-[#6B7280]/30', text: 'text-[#9CA3AF]', label: 'Completed' },
  in_progress:{ bg: 'bg-[#00E87A]/10 border border-[#00E87A]/30', text: 'text-[#00E87A]',  label: 'In Progress' },
  quoted:     { bg: 'bg-orange-400/10 border border-orange-400/30', text: 'text-orange-400', label: 'Quoted' },
  submitted:  { bg: 'bg-blue-400/10 border border-blue-400/30',   text: 'text-blue-400',   label: 'Submitted' },
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

// ─── Metric card ──────────────────────────────────────────────────────────────

function MetricCard({
  icon, label, value, delta, up,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: string;
  up: boolean;
}) {
  return (
    <div className="bg-[#0D0D0D] border border-[#1F2937] rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#6B7280]">{icon}</span>
        <span className={`font-mono text-[10px] flex items-center gap-0.5 ${up ? 'text-[#00E87A]' : 'text-red-400'}`}>
          {up
            ? <ArrowUpRight className="w-2.5 h-2.5" aria-hidden />
            : <ArrowDownRight className="w-2.5 h-2.5" aria-hidden />}
          {delta}
        </span>
      </div>
      <p className="text-[#F4F4F2] font-mono font-bold text-base leading-none">{value}</p>
      <p className="text-[#6B7280] font-mono text-[10px] mt-1.5">{label}</p>
    </div>
  );
}

// ─── Analytics tab ────────────────────────────────────────────────────────────

function AnalyticsTab() {
  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard icon={<BarChart3 className="w-3.5 h-3.5" aria-hidden />} label="Visitors"    value="1,204" delta="+12%" up />
        <MetricCard icon={<Eye       className="w-3.5 h-3.5" aria-hidden />} label="Page Views"  value="3,819" delta="+8%"  up />
        <MetricCard icon={<Clock     className="w-3.5 h-3.5" aria-hidden />} label="Avg Session" value="2m 14s" delta="+14s" up />
        <MetricCard icon={<TrendingUp className="w-3.5 h-3.5" aria-hidden />} label="Bounce Rate" value="61%" delta="-3%" up={false} />
      </div>

      <div className="bg-[#0D0D0D] border border-[#1F2937] rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[#9CA3AF] font-mono text-[10px] uppercase tracking-wider">6-Month Trend</p>
          <p className="text-[#6B7280] font-mono text-[10px]">Visitors</p>
        </div>
        <svg
          viewBox={`0 0 ${CW} ${CH + 16}`}
          className="w-full"
          preserveAspectRatio="none"
          aria-label="Visitor trend over 6 months, showing growth from 823 in January to 1,204 in June"
          role="img"
        >
          <defs>
            <linearGradient id="mkd-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#00E87A" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#00E87A" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={FILL} fill="url(#mkd-fill)" />
          <polyline
            points={PTS}
            fill="none"
            stroke="#00E87A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {VISITORS.map((d, i) => (
            <circle key={i} cx={toX(i)} cy={toY(d.v)} r="2.5" fill="#00E87A" />
          ))}
          {VISITORS.map((d, i) => (
            <text
              key={i}
              x={toX(i)}
              y={CH + 13}
              textAnchor="middle"
              fontSize="8"
              fill="#4B5563"
              fontFamily="monospace"
            >
              {d.month}
            </text>
          ))}
        </svg>
      </div>

      <div className="bg-[#0D0D0D] border border-[#1F2937] rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 border-b border-[#1F2937]">
          <p className="text-[#9CA3AF] font-mono text-[10px] uppercase tracking-wider">Top Pages</p>
        </div>
        {[
          { path: '/home',    views: '1,604', pct: '42%' },
          { path: '/about',   views: '879',   pct: '23%' },
          { path: '/contact', views: '687',   pct: '18%' },
        ].map((row) => (
          <div
            key={row.path}
            className="flex items-center justify-between px-4 py-2 border-b border-[#1F2937]/50 last:border-0"
          >
            <span className="font-mono text-xs text-[#9CA3AF]">{row.path}</span>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] text-[#6B7280]">{row.views} views</span>
              <span className="font-mono text-[10px] text-[#00E87A] w-8 text-right">{row.pct}</span>
            </div>
          </div>
        ))}
      </div>
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

// ─── Invoices tab ─────────────────────────────────────────────────────────────

function InvoicesTab() {
  return (
    <div className="p-4">
      <div className="bg-[#0D0D0D] border border-[#1F2937] rounded-lg overflow-hidden">
        <div className="hidden md:grid grid-cols-4 px-4 py-2.5 border-b border-[#1F2937]">
          {['Period', 'Amount', 'Status', 'Date'].map((h) => (
            <p key={h} className="text-[#6B7280] font-mono text-[10px] uppercase tracking-wider">{h}</p>
          ))}
        </div>
        {INVOICES.map((inv) => (
          <div
            key={inv.period}
            className="grid grid-cols-2 md:grid-cols-4 items-center px-4 py-3 border-b border-[#1F2937]/50 last:border-0"
          >
            <p className="text-[#F4F4F2] font-mono text-xs">{inv.period}</p>
            <p className="text-[#9CA3AF] font-mono text-xs font-bold text-right md:text-left">{inv.amount}</p>
            <div className="col-span-2 md:col-span-1 mt-2 md:mt-0">
              <Badge status={inv.status} />
            </div>
            <p className="hidden md:block text-[#6B7280] font-mono text-[10px]">{inv.date}</p>
          </div>
        ))}
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
                isZE
                  ? 'bg-[#00E87A] text-[#0D0D0D]'
                  : 'bg-[#1F2937] text-[#9CA3AF] border border-[#374151]'
              }`}
              aria-hidden
            >
              {isZE ? 'ZE' : 'TD'}
            </span>
            <div className={`max-w-[78%] flex flex-col ${isZE ? 'items-start' : 'items-end'}`}>
              <div
                className={`px-3 py-2 rounded-lg font-mono text-xs leading-relaxed ${
                  isZE
                    ? 'bg-[#1F2937] text-[#F4F4F2]'
                    : 'bg-[#00E87A]/10 border border-[#00E87A]/20 text-[#F4F4F2]'
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

// ─── Sidebar nav ──────────────────────────────────────────────────────────────

const NAV: { id: Tab | null; label: string; Icon: React.ElementType }[] = [
  { id: null,        label: 'Overview',  Icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics', Icon: BarChart3 },
  { id: 'messages',  label: 'Messages',  Icon: MessageSquare },
  { id: 'invoices',  label: 'Invoices',  Icon: Receipt },
  { id: 'requests',  label: 'Requests',  Icon: PlusCircle },
];

const MOBILE_TABS: { id: Tab; label: string }[] = [
  { id: 'analytics', label: 'Analytics' },
  { id: 'requests',  label: 'Requests'  },
  { id: 'invoices',  label: 'Invoices'  },
  { id: 'messages',  label: 'Messages'  },
];

// ─── Main export ──────────────────────────────────────────────────────────────

export function MockDashboard() {
  const [tab, setTab] = useState<Tab>('analytics');

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
                <span className="text-[#00E87A] font-mono text-[8px] font-bold">TD</span>
              </span>
              <div className="min-w-0">
                <p className="text-[#F4F4F2] font-mono text-[10px] font-bold leading-none truncate">Takahashi Dental</p>
                <p className="text-[#4B5563] font-mono text-[9px] mt-0.5">Basic · ¥10,000/mo</p>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex-1 px-2 py-3 space-y-0.5" aria-label="Dashboard navigation">
            {NAV.map(({ id, label, Icon }) => {
              const active = id === tab;
              return (
                <button
                  key={label}
                  onClick={() => id && setTab(id)}
                  aria-current={active ? 'page' : undefined}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-left transition-colors duration-150 ${
                    active
                      ? 'bg-[#00E87A]/10 text-[#00E87A]'
                      : id
                      ? 'text-[#6B7280] hover:text-[#9CA3AF] hover:bg-[#1F2937]/60 cursor-pointer'
                      : 'text-[#4B5563] cursor-default'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden />
                  <span className="font-mono text-xs">{label}</span>
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
            <p className="text-[#F4F4F2] font-mono text-xs font-bold capitalize">{tab}</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E87A]" aria-hidden />
              <span className="text-[#6B7280] font-mono text-[10px]">takahashi-dental.zeroen.dev</span>
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
            {tab === 'analytics' && <AnalyticsTab />}
            {tab === 'requests'  && <RequestsTab />}
            {tab === 'invoices'  && <InvoicesTab />}
            {tab === 'messages'  && <MessagesTab />}
          </div>

        </div>
      </div>
    </div>
  );
}
