export default function Loading() {
  return (
    <div className="flex flex-col max-w-3xl animate-pulse" style={{ height: 'calc(100vh - 8rem)' }}>
      {/* Header */}
      <div className="mb-4 shrink-0 space-y-2">
        <div className="h-7 w-36 bg-[#1F2937] rounded" />
        <div className="h-3 w-48 bg-[#1F2937] rounded" />
      </div>

      {/* Message thread area */}
      <div className="flex-1 border border-[#1F2937] rounded-lg bg-[#111827] p-4 flex flex-col gap-4 overflow-hidden">
        {/* Messages — alternating left/right */}
        <div className="flex gap-3">
          <div className="h-8 w-8 rounded-full bg-[#1F2937] shrink-0" />
          <div className="h-14 w-3/5 bg-[#1F2937] rounded-lg" />
        </div>
        <div className="flex gap-3 justify-end">
          <div className="h-10 w-2/5 bg-[#1F2937] rounded-lg" />
          <div className="h-8 w-8 rounded-full bg-[#1F2937] shrink-0" />
        </div>
        <div className="flex gap-3">
          <div className="h-8 w-8 rounded-full bg-[#1F2937] shrink-0" />
          <div className="h-20 w-4/5 bg-[#1F2937] rounded-lg" />
        </div>
        <div className="flex gap-3 justify-end">
          <div className="h-12 w-1/2 bg-[#1F2937] rounded-lg" />
          <div className="h-8 w-8 rounded-full bg-[#1F2937] shrink-0" />
        </div>
        <div className="flex gap-3">
          <div className="h-8 w-8 rounded-full bg-[#1F2937] shrink-0" />
          <div className="h-10 w-2/5 bg-[#1F2937] rounded-lg" />
        </div>
      </div>

      {/* Input bar */}
      <div className="mt-3 h-12 bg-[#1F2937] rounded-lg shrink-0" />
    </div>
  );
}
