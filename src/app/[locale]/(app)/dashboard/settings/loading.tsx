export default function Loading() {
  return (
    <div className="max-w-2xl animate-pulse">
      <div className="mb-6 space-y-2">
        <div className="h-7 w-24 bg-zen-elevated rounded" />
        <div className="h-3 w-48 bg-zen-elevated rounded" />
      </div>
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-12 border border-zen-elevated rounded-lg bg-zen-surface" />
        ))}
      </div>
    </div>
  );
}
