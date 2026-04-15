export default function Loading() {
  return (
    <div className="max-w-2xl animate-pulse">
      <div className="mb-6 space-y-2">
        <div className="h-7 w-32 bg-zen-elevated rounded" />
        <div className="h-3 w-56 bg-zen-elevated rounded" />
      </div>
      <div className="border border-zen-elevated rounded-lg p-6 bg-zen-surface space-y-3">
        <div className="h-4 w-40 bg-zen-elevated rounded" />
        <div className="h-3 w-full bg-zen-elevated rounded" />
        <div className="h-3 w-3/4 bg-zen-elevated rounded" />
      </div>
    </div>
  );
}
