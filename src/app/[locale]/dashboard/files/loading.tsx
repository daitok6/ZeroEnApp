export default function Loading() {
  return (
    <div className="max-w-2xl space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-7 w-24 bg-[#1F2937] rounded" />
        <div className="h-3 w-40 bg-[#1F2937] rounded" />
      </div>

      {/* Upload zone */}
      <div className="h-36 bg-[#1F2937] rounded-lg border border-dashed border-[#374151]" />

      {/* File list rows */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 border border-[#1F2937] rounded-lg bg-[#111827]"
          >
            <div className="h-8 w-8 bg-[#1F2937] rounded shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-48 bg-[#1F2937] rounded" />
              <div className="h-3 w-24 bg-[#1F2937] rounded" />
            </div>
            <div className="h-7 w-16 bg-[#1F2937] rounded shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
