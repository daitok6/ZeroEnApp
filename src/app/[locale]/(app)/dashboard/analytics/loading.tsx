export default function Loading() {
  return (
    <div className="max-w-2xl animate-pulse">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <div className="h-7 w-44 bg-[#1F2937] rounded" />
        <div className="h-3 w-56 bg-[#1F2937] rounded" />
      </div>

      {/* Empty state placeholder shape */}
      <div className="border border-[#1F2937] rounded-lg p-8 bg-[#111827] flex flex-col items-center gap-4">
        <div className="h-8 w-8 bg-[#1F2937] rounded" />
        <div className="h-4 w-64 bg-[#1F2937] rounded" />
        <div className="h-3 w-80 bg-[#1F2937] rounded" />
      </div>
    </div>
  );
}
