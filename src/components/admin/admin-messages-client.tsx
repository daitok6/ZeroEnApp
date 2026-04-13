'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { AdminSearchFilterBar } from '@/components/admin/admin-search-filter-bar';
import { createClient } from '@/lib/supabase/client';
import { MessageThread } from '@/components/dashboard/message-thread';
import type { ProjectConversation } from '@/lib/admin/queries';

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  sender?: { full_name: string | null; avatar_url: string | null; role: string };
}

interface Props {
  projects: ProjectConversation[];
  initialMessages: Message[];
  initialProjectId: string | null;
  userId: string;
  locale: string;
  initialUnreadCounts: Record<string, number>;
}

export function AdminMessagesClient({ projects, initialMessages, initialProjectId, userId, locale, initialUnreadCounts }: Props) {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialProjectId);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>(initialUnreadCounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const supabaseRef = useRef(createClient());
  const selectedProjectIdRef = useRef(selectedProjectId);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) ?? null;

  const filteredProjects = useMemo(() => {
    let rows = projects;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.clientName?.toLowerCase().includes(q) ?? false) ||
          p.clientEmail.toLowerCase().includes(q),
      );
    }
    if (activeFilters.unread === 'yes') {
      rows = rows.filter((p) => (unreadCounts[p.id] ?? 0) > 0);
    }
    return rows;
  }, [projects, searchQuery, activeFilters, unreadCounts]);

  useEffect(() => {
    selectedProjectIdRef.current = selectedProjectId;
  }, [selectedProjectId]);

  useEffect(() => {
    if (projects.length === 0) return;
    const supabase = supabaseRef.current;
    const suffix = Math.random().toString(36).slice(2, 10);

    const channels = projects.map((project) =>
      supabase
        .channel(`admin-msg-${project.id}-${suffix}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `project_id=eq.${project.id}`,
        }, (payload) => {
          const msg = payload.new as { sender_id: string };
          if (msg.sender_id !== userId && project.id !== selectedProjectIdRef.current) {
            setUnreadCounts((prev) => ({
              ...prev,
              [project.id]: (prev[project.id] ?? 0) + 1,
            }));
          }
        })
        .subscribe()
    );

    return () => { channels.forEach((ch) => supabase.removeChannel(ch)); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects.map((p) => p.id).join(','), userId]);

  const handleSelectProject = async (projectId: string) => {
    setSelectedProjectId(projectId);
    setUnreadCounts((prev) => ({ ...prev, [projectId]: 0 }));
    window.dispatchEvent(new CustomEvent('zeroen:message-read', { detail: { projectId } }));

    if (projectId === initialProjectId) {
      setMessages(initialMessages);
      return;
    }

    setLoading(true);
    const supabase = supabaseRef.current;
    const { data } = await supabase
      .from('messages')
      .select('*, sender:profiles(full_name, avatar_url, role)')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })
      .limit(50);
    setMessages((data as Message[]) ?? []);
    setLoading(false);
  };

  function formatTime(dateStr: string | null): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', { month: 'short', day: 'numeric' });
  }

  const projectList = (
    <div className="flex flex-col h-full border border-[#374151] rounded-lg overflow-hidden bg-[#111827]">
      <div className="px-3 py-3 border-b border-[#374151] shrink-0 space-y-2">
        <p className="text-[#6B7280] text-xs font-mono uppercase tracking-widest px-1">
          {t('allConversations')}
        </p>
        <AdminSearchFilterBar
          placeholder={locale === 'ja' ? '検索…' : 'Search…'}
          filters={[{
            key: 'unread',
            label: locale === 'ja' ? '未読' : 'Unread',
            options: [{ value: 'yes', label: locale === 'ja' ? '未読のみ' : 'Unread only' }],
          }]}
          activeFilters={activeFilters}
          onSearchChange={setSearchQuery}
          onFilterChange={(key, value) => setActiveFilters((prev) => ({ ...prev, [key]: value }))}
          onClear={() => { setSearchQuery(''); setActiveFilters({}); }}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredProjects.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-[#6B7280] text-sm font-mono">
              {t('noConversations')}
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => {
            const isSelected = project.id === selectedProjectId;
            const unread = unreadCounts[project.id] ?? 0;

            return (
              <button
                key={project.id}
                onClick={() => handleSelectProject(project.id)}
                className={`w-full text-left px-4 py-3 border-b border-[#374151] transition-colors hover:bg-[#0D0D0D]/60 ${
                  isSelected ? 'bg-[#00E87A]/5 border-l-2 border-l-[#00E87A]' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className={`text-sm font-mono font-bold truncate ${isSelected ? 'text-[#00E87A]' : 'text-[#F4F4F2]'}`}>
                    {project.name}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    {unread > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#00E87A] text-[#0D0D0D] text-[10px] font-bold font-mono leading-none">
                        {unread > 99 ? '99+' : unread}
                      </span>
                    )}
                    {project.lastMessageAt && (
                      <time className="text-[#374151] text-xs font-mono">
                        {formatTime(project.lastMessageAt)}
                      </time>
                    )}
                  </div>
                </div>
                <p className="text-[#9CA3AF] text-xs font-mono truncate">
                  {project.clientName ?? project.clientEmail}
                </p>
                {project.lastMessageContent && (
                  <p className="text-[#6B7280] text-xs font-mono truncate mt-1">
                    {project.lastMessageContent}
                  </p>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  const threadPanel = selectedProjectId ? (
    loading ? (
      <div className="flex-1 flex items-center justify-center border border-[#374151] rounded-lg bg-[#111827]">
        <p className="text-[#6B7280] text-sm font-mono">
          {tCommon('loading')}
        </p>
      </div>
    ) : (
      <MessageThread
        key={selectedProjectId}
        initialMessages={messages}
        projectId={selectedProjectId}
        userId={userId}
        locale={locale}
      />
    )
  ) : (
    <div className="flex-1 flex items-center justify-center border border-[#374151] rounded-lg bg-[#111827]">
      <p className="text-[#6B7280] text-sm font-mono">
        {t('selectConversation')}
      </p>
    </div>
  );

  return (
    <>
      {/* Desktop: two-column layout */}
      <div className="hidden md:flex gap-4 flex-1 min-h-0">
        <div className="w-72 shrink-0 flex flex-col min-h-0">
          {projectList}
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          {threadPanel}
        </div>
      </div>

      {/* Mobile: single-view with back navigation */}
      <div className="flex md:hidden flex-col flex-1 min-h-0">
        {selectedProjectId ? (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex items-center gap-3 mb-3 shrink-0">
              <button
                onClick={() => setSelectedProjectId(null)}
                className="flex items-center gap-1.5 text-[#9CA3AF] hover:text-[#F4F4F2] text-sm font-mono transition-colors"
              >
                <ArrowLeft size={14} />
                {t('back')}
              </button>
              {selectedProject && (
                <p className="text-[#F4F4F2] text-sm font-mono font-bold truncate">
                  {selectedProject.name}
                </p>
              )}
            </div>
            <div className="flex-1 min-h-0">
              {threadPanel}
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0">
            {projectList}
          </div>
        )}
      </div>
    </>
  );
}
