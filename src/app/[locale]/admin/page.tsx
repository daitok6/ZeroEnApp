import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getAdminStats, getClientList } from '@/lib/admin/queries';
import { Users, Briefcase, ClipboardList, DollarSign } from 'lucide-react';
import type { Metadata } from 'next';
import type { ClientHealthStatus } from '@/lib/admin/queries';

export const metadata: Metadata = {
  title: 'Admin — ZeroEn',
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

const STATUS_STYLES: Record<string, string> = {
  onboarding: 'bg-[#F59E0B] text-[#0D0D0D]',
  building: 'bg-[#3B82F6] text-white',
  launched: 'bg-[#00E87A] text-[#0D0D0D]',
  operating: 'bg-[#00E87A] text-[#0D0D0D]',
  paused: 'bg-[#374151] text-[#9CA3AF]',
  terminated: 'bg-[#EF4444] text-white',
};

const HEALTH_COLORS: Record<ClientHealthStatus, string> = {
  green: '#00E87A',
  yellow: '#F59E0B',
  red: '#EF4444',
};

function formatRevenue(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function AdminPage({ params }: Props) {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const t = await getTranslations('admin');

  const [stats, clients] = await Promise.all([
    getAdminStats(supabase),
    getClientList(supabase),
  ]);

  const statCards = [
    {
      key: 'totalClients',
      icon: Users,
      label: t('totalClients'),
      value: stats.totalClients,
    },
    {
      key: 'activeProjects',
      icon: Briefcase,
      label: t('activeProjects'),
      value: stats.activeProjects,
    },
    {
      key: 'pendingApplications',
      icon: ClipboardList,
      label: t('pendingApplications'),
      value: stats.pendingApplications,
    },
    {
      key: 'monthlyRevenue',
      icon: DollarSign,
      label: t('monthlyRevenue'),
      value: formatRevenue(stats.monthlyRevenueCents),
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page title */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-heading text-[#F4F4F2]">
          {locale === 'ja' ? '管理パネル' : 'Admin'}
        </h1>
        <p className="text-[#6B7280] text-sm font-mono mt-1">
          {locale === 'ja' ? 'ZeroEn 管理ダッシュボード' : 'ZeroEn operations overview'}
        </p>
      </div>

      {/* Stat cards — 2-col mobile, 4-col desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              className="flex flex-col gap-3 p-4 border border-[#374151] rounded-lg bg-[#111827]"
            >
              <Icon size={18} className="text-[#6B7280]" />
              <div>
                <p className="text-[#F4F4F2] text-xl md:text-2xl font-bold font-heading">
                  {card.value}
                </p>
                <p className="text-[#6B7280] text-xs font-mono mt-0.5">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Client list */}
      <div>
        <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-3">
          {t('clients')}
        </p>

        {clients.length === 0 ? (
          <p className="text-[#6B7280] text-sm font-mono">{t('noClients')}</p>
        ) : (
          <>
            {/* Mobile: stacked cards */}
            <div className="flex flex-col gap-3 md:hidden">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="p-4 border border-[#374151] rounded-lg bg-[#111827] space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[#F4F4F2] text-sm font-mono font-bold truncate">
                        {client.full_name ?? client.email}
                      </p>
                      <p className="text-[#6B7280] text-xs font-mono truncate">{client.email}</p>
                    </div>
                    {/* Health dot */}
                    <span
                      className="shrink-0 inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: HEALTH_COLORS[client.health] }}
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {client.projectName ? (
                      <span className="text-[#9CA3AF] text-xs font-mono">
                        {client.projectName}
                      </span>
                    ) : (
                      <span className="text-[#6B7280] text-xs font-mono">—</span>
                    )}
                    {client.projectStatus && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${STATUS_STYLES[client.projectStatus] ?? 'bg-[#374151] text-[#9CA3AF]'}`}
                      >
                        {client.projectStatus}
                      </span>
                    )}
                  </div>
                  <p className="text-[#6B7280] text-xs font-mono">
                    {t('lastUpdated')}: {formatDate(client.projectUpdatedAt)}
                  </p>
                </div>
              ))}
            </div>

            {/* Desktop: table layout */}
            <div className="hidden md:block border border-[#374151] rounded-lg overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[2fr_2fr_1fr_1fr_48px] gap-4 px-4 py-2 bg-[#111827] border-b border-[#374151]">
                <p className="text-[#6B7280] text-xs font-mono uppercase tracking-wider">
                  {t('clientName')}
                </p>
                <p className="text-[#6B7280] text-xs font-mono uppercase tracking-wider">
                  {t('projectName')}
                </p>
                <p className="text-[#6B7280] text-xs font-mono uppercase tracking-wider">
                  {t('status')}
                </p>
                <p className="text-[#6B7280] text-xs font-mono uppercase tracking-wider">
                  {t('lastUpdated')}
                </p>
                <p className="text-[#6B7280] text-xs font-mono uppercase tracking-wider text-center">
                  {t('health')}
                </p>
              </div>

              {/* Table rows */}
              {clients.map((client, idx) => (
                <div
                  key={client.id}
                  className={`grid grid-cols-[2fr_2fr_1fr_1fr_48px] gap-4 px-4 py-3 items-center ${
                    idx < clients.length - 1 ? 'border-b border-[#374151]' : ''
                  } hover:bg-[#111827]/60 transition-colors`}
                >
                  <div className="min-w-0">
                    <p className="text-[#F4F4F2] text-sm font-mono truncate">
                      {client.full_name ?? client.email}
                    </p>
                    <p className="text-[#6B7280] text-xs font-mono truncate">{client.email}</p>
                  </div>
                  <p className="text-[#9CA3AF] text-sm font-mono truncate">
                    {client.projectName ?? '—'}
                  </p>
                  <div>
                    {client.projectStatus ? (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${STATUS_STYLES[client.projectStatus] ?? 'bg-[#374151] text-[#9CA3AF]'}`}
                      >
                        {client.projectStatus}
                      </span>
                    ) : (
                      <span className="text-[#6B7280] text-xs font-mono">—</span>
                    )}
                  </div>
                  <p className="text-[#6B7280] text-xs font-mono">
                    {formatDate(client.projectUpdatedAt)}
                  </p>
                  <div className="flex justify-center">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: HEALTH_COLORS[client.health] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
