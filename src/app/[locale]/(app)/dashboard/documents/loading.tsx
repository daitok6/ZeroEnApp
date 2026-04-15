export default function Loading() {
  return (
    <div className="max-w-2xl space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-7 w-28 bg-[#1F2937] rounded" />
        <div className="h-3 w-44 bg-[#1F2937] rounded" />
      </div>

      {/* Document cards */}
      {[1, 2].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 border border-[#374151] rounded-lg bg-[#111827]"
        >
          <div className="h-9 w-9 bg-[#1F2937] rounded shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 w-52 bg-[#1F2937] rounded" />
            <div className="h-3 w-32 bg-[#1F2937] rounded" />
          </div>
          <div className="h-6 w-14 bg-[#1F2937] rounded shrink-0" />
        </div>
      ))}
    </div>
  );
}
