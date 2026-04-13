"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO per-client: wire to error tracking (Sentry, Axiom, etc.) if needed.
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-dvh flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-6">
        <p className="text-sm font-mono text-[var(--muted)] tracking-widest">
          500
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Something broke</h1>
        <p className="text-[var(--muted)]">
          We hit an unexpected error. Please try again in a moment.
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-block px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
