export default function AdminLoading() {
  return (
    <div className="space-y-6 max-w-5xl animate-pulse">
      {/* Page title skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-24 bg-[#1F2937] rounded" />
        <div className="h-4 w-48 bg-[#1F2937] rounded" />
      </div>

      {/* Stat cards — 2-col mobile, 4-col desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 border border-[#374151] rounded-lg bg-[#111827] space-y-3">
            <div className="h-4 w-4 bg-[#1F2937] rounded" />
            <div className="space-y-1.5">
              <div className="h-7 w-12 bg-[#1F2937] rounded" />
              <div className="h-3 w-20 bg-[#1F2937] rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Section label */}
      <div className="h-3 w-16 bg-[#1F2937] rounded" />

      {/* Client list skeleton — mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border border-[#374151] rounded-lg bg-[#111827] space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-4 w-32 bg-[#1F2937] rounded" />
                <div className="h-3 w-40 bg-[#1F2937] rounded" />
              </div>
              <div className="h-2 w-2 rounded-full bg-[#1F2937]" />
            </div>
            <div className="h-3 w-24 bg-[#1F2937] rounded" />
            <div className="h-3 w-36 bg-[#1F2937] rounded" />
          </div>
        ))}
      </div>

      {/* Client table skeleton — desktop */}
      <div className="hidden md:block border border-[#374151] rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_48px] gap-4 px-4 py-2 bg-[#111827] border-b border-[#374151]">
          {[80, 80, 60, 80, 24].map((w, i) => (
            <div key={i} className="h-3 bg-[#1F2937] rounded" style={{ width: `${w}%` }} />
          ))}
        </div>
        {/* Rows */}
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="grid grid-cols-[2fr_2fr_1fr_1fr_48px] gap-4 px-4 py-3 items-center border-b border-[#374151] last:border-b-0"
          >
            <div className="space-y-1">
              <div className="h-4 w-3/4 bg-[#1F2937] rounded" />
              <div className="h-3 w-full bg-[#1F2937] rounded" />
            </div>
            <div className="h-4 w-2/3 bg-[#1F2937] rounded" />
            <div className="h-5 w-16 bg-[#1F2937] rounded" />
            <div className="h-3 w-3/4 bg-[#1F2937] rounded" />
            <div className="flex justify-center">
              <div className="h-2 w-2 rounded-full bg-[#1F2937]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
