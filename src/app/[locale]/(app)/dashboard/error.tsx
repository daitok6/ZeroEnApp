'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';

// Dashboard-level error boundary. Catches render/data errors from any dashboard sub-route.
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ locale: string }>();
  const isJa = params.locale === 'ja';

  useEffect(() => {
    console.error('[dashboard error]', error);
  }, [error]);

  return (
    <div className="max-w-2xl">
      <div className="border border-red-500/30 rounded-lg bg-red-500/5 p-6 md:p-8 text-center space-y-4">
        <h2 className="text-zen-off-white font-mono font-bold text-lg">
          {isJa ? '問題が発生しました' : 'Something went wrong'}
        </h2>
        <p className="text-zen-subtle font-mono text-sm leading-relaxed max-w-md mx-auto">
          {isJa
            ? 'ページの読み込み中にエラーが発生しました。もう一度お試しください。問題が続く場合はメッセージからお知らせください。'
            : "We couldn't load this page. Try again — and if the problem persists, please reach out via Messages."}
        </p>
        {error.digest && (
          <p className="text-zen-subtle/70 font-mono text-xs">ref: {error.digest}</p>
        )}
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 rounded bg-zen-green text-zen-dark font-mono text-sm font-bold hover:bg-zen-green/90 transition-colors"
        >
          {isJa ? 'もう一度試す' : 'Try again'}
        </button>
      </div>
    </div>
  );
}
