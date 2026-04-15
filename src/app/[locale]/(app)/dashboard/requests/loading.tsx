export default function Loading() {
  return (
    <div className="max-w-2xl space-y-8 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-7 w-44 bg-[#1F2937] rounded" />
        <div className="h-3 w-64 bg-[#1F2937] rounded" />
      </div>

      {/* Form skeleton */}
      <div className="border border-[#1F2937] rounded-lg p-6 bg-[#111827] space-y-4">
        <div className="h-4 w-24 bg-[#1F2937] rounded" />
        <div className="h-10 bg-[#1F2937] rounded" />
        <div className="h-4 w-28 bg-[#1F2937] rounded" />
        <div className="h-24 bg-[#1F2937] rounded" />
        <div className="h-4 w-20 bg-[#1F2937] rounded" />
        <div className="flex gap-3">
          <div className="h-9 flex-1 bg-[#1F2937] rounded" />
          <div className="h-9 flex-1 bg-[#1F2937] rounded" />
          <div className="h-9 flex-1 bg-[#1F2937] rounded" />
        </div>
        <div className="h-10 w-full bg-[#1F2937] rounded" />
      </div>

      {/* Past requests list */}
      <div className="space-y-3">
        <div className="h-3 w-28 bg-[#1F2937] rounded" />
        {[1, 2].map((i) => (
          <div key={i} className="border border-[#1F2937] rounded-lg p-4 bg-[#111827] space-y-2">
            <div className="flex justify-between gap-3">
              <div className="h-4 w-40 bg-[#1F2937] rounded" />
              <div className="h-5 w-20 bg-[#1F2937] rounded" />
            </div>
            <div className="h-3 w-full bg-[#1F2937] rounded" />
            <div className="h-3 w-3/4 bg-[#1F2937] rounded" />
            <div className="flex gap-3">
              <div className="h-3 w-24 bg-[#1F2937] rounded" />
              <div className="h-3 w-16 bg-[#1F2937] rounded ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
