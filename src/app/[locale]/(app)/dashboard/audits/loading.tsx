export default function Loading() {
  return (
    <div className="space-y-6 max-w-3xl animate-pulse">
      <div>
        <div className="h-6 w-32 bg-zen-border/60 rounded" />
        <div className="h-4 w-56 bg-zen-border/40 rounded mt-2" />
      </div>
      <ul className="space-y-3" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <li key={i} className="h-16 border border-zen-border rounded-lg bg-zen-surface" />
        ))}
      </ul>
    </div>
  );
}
