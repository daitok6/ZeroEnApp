interface Props {
  error: string | null;
}

export function ErrorBanner({ error }: Props) {
  if (!error) return null;
  return (
    <div className="mb-3 rounded border border-red-500/50 bg-red-500/10 p-3 text-red-400 text-xs font-mono">
      {error}
    </div>
  );
}
