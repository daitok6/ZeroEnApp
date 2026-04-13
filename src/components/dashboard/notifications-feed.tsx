'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageSquare, PlusCircle, Receipt, Bell, X } from 'lucide-react';
import { markNotificationRead, markAllNotificationsRead, dismissNotification } from '@/lib/notifications/actions';

export interface NotificationRow {
  id: string;
  type: 'message' | 'request_comment' | 'invoice_update' | 'request_status';
  entity_id: string;
  entity_kind: 'project' | 'change_request';
  title: string;
  body: string | null;
  link: string;
  created_at: string;
  read_at: string | null;
}

interface NotificationsFeedProps {
  notifications: NotificationRow[];
  locale: string;
}

const TYPE_ICON: Record<NotificationRow['type'], React.ElementType> = {
  message: MessageSquare,
  request_comment: MessageSquare,
  invoice_update: Receipt,
  request_status: PlusCircle,
};

function groupByDay(items: NotificationRow[]): { label: string; items: NotificationRow[] }[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const groups: Record<string, NotificationRow[]> = {};
  for (const n of items) {
    const d = new Date(n.created_at);
    d.setHours(0, 0, 0, 0);
    let label: string;
    if (d.getTime() === today.getTime()) label = 'Today';
    else if (d.getTime() === yesterday.getTime()) label = 'Yesterday';
    else label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    if (!groups[label]) groups[label] = [];
    groups[label].push(n);
  }

  return Object.entries(groups).map(([label, items]) => ({ label, items }));
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function NotificationsFeed({ notifications: initial, locale }: NotificationsFeedProps) {
  const router = useRouter();
  const [items, setItems] = useState(initial);

  // Zero the nav badge when this page mounts
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('zeroen:notifications-read'));
  }, []);

  const groups = groupByDay(items);
  const hasUnread = items.some((n) => !n.read_at);
  const isJa = locale === 'ja';

  async function handleClick(n: NotificationRow) {
    if (!n.read_at) {
      setItems((prev) =>
        prev.map((x) => x.id === n.id ? { ...x, read_at: new Date().toISOString() } : x)
      );
      await markNotificationRead(n.id);
    }
    router.push(`/${locale}${n.link}`);
  }

  async function handleDismiss(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    setItems((prev) => prev.filter((x) => x.id !== id));
    await dismissNotification(id);
  }

  async function handleMarkAllRead() {
    setItems((prev) => prev.map((x) => ({ ...x, read_at: x.read_at ?? new Date().toISOString() })));
    await markAllNotificationsRead();
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Bell className="w-10 h-10 text-[#374151] mb-4" strokeWidth={1.5} />
        <p className="text-[#6B7280] text-sm font-mono">
          {isJa ? '通知はありません' : 'No notifications yet'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {hasUnread && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="text-xs font-mono text-[#6B7280] hover:text-[#00E87A] transition-colors"
          >
            {isJa ? 'すべて既読にする' : 'Mark all as read'}
          </button>
        </div>
      )}

      {groups.map(({ label, items: groupItems }) => (
        <div key={label}>
          <p className="text-[#6B7280] text-[10px] font-mono uppercase tracking-widest mb-2">
            {label}
          </p>
          <div className="space-y-1">
            {groupItems.map((n) => {
              const Icon = TYPE_ICON[n.type] ?? Bell;
              return (
                <div
                  key={n.id}
                  className={`group relative flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    n.read_at
                      ? 'border-[#1F2937] bg-transparent hover:bg-[#111827]'
                      : 'border-[#374151] bg-[#111827] hover:bg-[#1F2937]'
                  }`}
                  onClick={() => handleClick(n)}
                >
                  {/* Unread dot */}
                  {!n.read_at && (
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#00E87A] shrink-0" />
                  )}
                  {n.read_at && <span className="mt-1.5 w-1.5 h-1.5 shrink-0" />}

                  <div className="shrink-0 mt-0.5 text-[#6B7280]">
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-mono truncate ${n.read_at ? 'text-[#6B7280]' : 'text-[#F4F4F2] font-bold'}`}>
                      {n.title}
                    </p>
                    {n.body && (
                      <p className="text-[10px] font-mono text-[#6B7280] mt-0.5 line-clamp-1">
                        {n.body}
                      </p>
                    )}
                    <p className="text-[10px] font-mono text-[#374151] mt-1">
                      {relativeTime(n.created_at)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDismiss(e, n.id)}
                    className="shrink-0 opacity-0 group-hover:opacity-100 text-[#374151] hover:text-[#9CA3AF] transition-all p-0.5"
                    aria-label="Dismiss"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
