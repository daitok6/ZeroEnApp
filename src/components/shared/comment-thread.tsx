'use client';

import { useState, useEffect, useCallback } from 'react';
import { Send } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  author: { full_name: string | null; role: string } | null;
}

interface CommentThreadProps {
  requestId: string;
  currentUserId: string;
  locale: string;
}

export function CommentThread({ requestId, currentUserId, locale }: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    const res = await fetch(`/api/requests/${requestId}/comments`);
    if (res.ok) {
      setComments(await res.json());
    }
    setLoading(false);
  }, [requestId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    const res = await fetch(`/api/requests/${requestId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: content.trim() }),
    });
    if (res.ok) {
      setContent('');
      await fetchComments();
    }
    setSubmitting(false);
  }

  const isJa = locale === 'ja';

  return (
    <div className="space-y-3">
      {loading ? (
        <p className="text-[#6B7280] text-xs font-mono">
          {isJa ? '読み込み中…' : 'Loading…'}
        </p>
      ) : (
        <>
          {comments.length === 0 && (
            <p className="text-[#6B7280] text-xs font-mono">
              {isJa ? 'コメントはまだありません' : 'No comments yet'}
            </p>
          )}
          <div className="space-y-2">
            {comments.map((c) => {
              const isAdmin = c.author?.role === 'admin';
              const isOwn = c.author_id === currentUserId;
              return (
                <div
                  key={c.id}
                  className={`rounded-lg px-3 py-2 ${
                    isAdmin
                      ? 'bg-[#1a2433] border border-[#00E87A]/20'
                      : 'bg-[#111827] border border-[#374151]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#6B7280] text-[10px] font-mono">
                      {isAdmin
                        ? 'ZeroEn'
                        : (c.author?.full_name ?? (isJa ? 'あなた' : 'You'))}
                    </span>
                    {isOwn && !isAdmin && (
                      <span className="text-[#374151] text-[10px] font-mono">
                        ({isJa ? 'あなた' : 'you'})
                      </span>
                    )}
                    <span className="text-[#374151] text-[10px] font-mono ml-auto">
                      {new Date(c.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[#F4F4F2] text-xs font-mono whitespace-pre-wrap">
                    {c.content}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isJa ? 'コメントを入力…' : 'Add a comment…'}
          className="flex-1 bg-[#0D0D0D] border border-[#374151] rounded px-3 py-2 text-xs font-mono text-[#F4F4F2] placeholder-[#6B7280] focus:outline-none focus:border-[#00E87A]/50 min-w-0"
        />
        <button
          type="submit"
          disabled={!content.trim() || submitting}
          className="shrink-0 p-2 rounded bg-[#00E87A]/10 border border-[#00E87A]/30 text-[#00E87A] hover:bg-[#00E87A]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label={isJa ? '送信' : 'Send'}
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
