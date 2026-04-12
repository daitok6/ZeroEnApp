'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  sender?: { full_name: string | null; avatar_url: string | null; role: string };
}

interface MessageThreadProps {
  initialMessages: Message[];
  projectId: string;
  userId: string;
  locale: string;
  /** Admin's last_read_at for this project — used to show Seen indicator for client */
  adminLastReadAt?: string | null;
}

export function MessageThread({ initialMessages, projectId, userId, locale, adminLastReadAt }: MessageThreadProps) {
  const t = useTranslations('messages');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  // Stable supabase client reference — never changes between renders
  const supabaseRef = useRef(createClient());

  // Subscribe to new messages via Realtime
  useEffect(() => {
    const supabase = supabaseRef.current;
    const suffix = Math.random().toString(36).slice(2, 10);
    const channelName = `messages-${projectId}-${suffix}`;

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `project_id=eq.${projectId}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [projectId]);

  // Mark conversation as read on mount and when new messages arrive
  useEffect(() => {
    const supabase = supabaseRef.current;
    supabase.from('message_read_status').upsert(
      { user_id: userId, project_id: projectId, last_read_at: new Date().toISOString() },
      { onConflict: 'user_id,project_id' }
    ).then(() => {
      window.dispatchEvent(new CustomEvent('zeroen:message-read', { detail: { projectId } }));
    });
  }, [projectId, userId, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);

    const { error } = await supabaseRef.current.from('messages').insert({
      project_id: projectId,
      sender_id: userId,
      content: newMessage.trim(),
    });

    if (!error) setNewMessage('');
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const myMessages = messages.filter((m) => m.sender_id === userId);
  const lastMyMessage = myMessages[myMessages.length - 1] ?? null;
  const adminHasSeen =
    adminLastReadAt != null &&
    lastMyMessage != null &&
    adminLastReadAt >= lastMyMessage.created_at;

  return (
    <div className="flex flex-col flex-1 min-h-0 border border-[#374151] rounded-lg overflow-hidden bg-[#111827]">
      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#6B7280] font-mono text-sm">
              {t('empty')}
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender_id === userId;
            const senderName = msg.sender?.full_name || (isOwn ? t('you') : 'ZeroEn');
            const isAdmin = msg.sender?.role === 'admin';
            const isLastMine = lastMyMessage?.id === msg.id;

            return (
              <div key={msg.id}>
                <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                    isAdmin ? 'bg-[#00E87A] text-[#0D0D0D]' : 'bg-[#1F2937] text-[#9CA3AF] border border-[#374151]'
                  }`}>
                    {isAdmin ? 'Z' : senderName.charAt(0).toUpperCase()}
                  </div>

                  <div className={`flex flex-col gap-1 max-w-[75%] ${isOwn ? 'items-end' : ''}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-[#6B7280] text-xs font-mono">
                        {isAdmin ? 'ZeroEn' : senderName}
                      </span>
                      <time className="text-[#374151] text-xs font-mono">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </time>
                    </div>
                    <div className={`px-3 py-2 rounded-lg text-sm font-mono ${
                      isAdmin
                        ? 'bg-[#00E87A]/10 border border-[#00E87A]/20 text-[#F4F4F2]'
                        : isOwn
                        ? 'bg-[#1F2937] text-[#F4F4F2]'
                        : 'bg-[#1F2937] border border-[#374151] text-[#F4F4F2]'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>

                {/* Seen indicator — only below the last message sent by this user */}
                {isOwn && isLastMine && adminHasSeen && adminLastReadAt && (
                  <SeenRelativeTime lastReadAt={adminLastReadAt} locale={locale} />
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[#374151] p-3 flex gap-2 shrink-0">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('placeholder')}
          rows={1}
          className="flex-1 bg-[#0D0D0D] border border-[#374151] text-[#F4F4F2] text-sm font-mono px-3 py-2 rounded focus:outline-none focus:border-[#00E87A] placeholder:text-[#6B7280] resize-none"
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim() || sending}
          className="bg-[#00E87A] text-[#0D0D0D] p-2 rounded hover:bg-[#00E87A]/90 transition-colors disabled:opacity-50 shrink-0"
          aria-label={t('sendAria')}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

// Inline seen indicator — updates every 30s
function SeenRelativeTime({ lastReadAt, locale }: { lastReadAt: string; locale: string }) {
  const t = useTranslations('messages');
  const [label, setLabel] = useState(() => formatRelative(lastReadAt, locale, t));

  useEffect(() => {
    const interval = setInterval(() => {
      setLabel(formatRelative(lastReadAt, locale, t));
    }, 30_000);
    return () => clearInterval(interval);
  }, [lastReadAt, locale, t]);

  return (
    <div className="flex justify-end mt-1 pr-10">
      <span className="text-[#6B7280] text-[10px] font-mono">{label}</span>
    </div>
  );
}

function formatRelative(
  dateStr: string,
  _locale: string,
  t: ReturnType<typeof useTranslations<'messages'>>
): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return t('seenJustNow');
  if (diff < 3600) return t('seenMinutes', { n: Math.floor(diff / 60) });
  if (diff < 86400) return t('seenHours', { n: Math.floor(diff / 3600) });
  return t('seenDays', { n: Math.floor(diff / 86400) });
}
