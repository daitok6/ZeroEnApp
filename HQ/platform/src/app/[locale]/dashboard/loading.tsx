export default function Loading() {
  return (
    <div className="space-y-6 max-w-4xl animate-pulse">
      {/* Page title skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-44 bg-[#1F2937] rounded" />
        <div className="h-4 w-56 bg-[#1F2937] rounded" />
      </div>

      {/* Project status + milestones grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-40 bg-[#1F2937] rounded-lg" />
        <div className="h-40 bg-[#1F2937] rounded-lg" />
      </div>

      {/* Quick links label */}
      <div className="h-3 w-24 bg-[#1F2937] rounded" />

      {/* Quick links — 2-col on mobile, 4-col on md+ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-[#1F2937] rounded-lg" />
        ))}
      </div>
    </div>
  );
}
