export default function Loading() {
  return (
    <div className="max-w-3xl space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-7 w-32 bg-[#1F2937] rounded" />
        <div className="h-3 w-48 bg-[#1F2937] rounded" />
      </div>

      {/* Table header — hidden on mobile */}
      <div className="hidden md:grid md:grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 pb-2 border-b border-[#1F2937]">
        {[120, 80, 60, 70, 50].map((w, i) => (
          <div key={i} className="h-3 bg-[#1F2937] rounded" style={{ width: `${w}%` }} />
        ))}
      </div>

      {/* Invoice rows */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col md:grid md:grid-cols-[1fr_auto_auto_auto_auto] gap-2 md:gap-4 md:items-center p-4 border border-[#1F2937] rounded-lg bg-[#111827]"
          >
            <div className="space-y-1.5">
              <div className="h-4 w-40 bg-[#1F2937] rounded" />
              <div className="h-3 w-24 bg-[#1F2937] rounded" />
            </div>
            <div className="h-6 w-20 bg-[#1F2937] rounded" />
            <div className="h-5 w-14 bg-[#1F2937] rounded" />
            <div className="h-6 w-16 bg-[#1F2937] rounded" />
            <div className="h-8 w-16 bg-[#1F2937] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
