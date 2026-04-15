export default function Loading() {
  return (
    <div className="space-y-6 max-w-3xl animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-28 bg-[#1F2937] rounded" />
        <div className="h-3 w-24 bg-[#1F2937] rounded" />
      </div>

      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-[#374151] rounded-lg bg-[#111827] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#374151] bg-[#0D0D0D] space-y-1.5">
            <div className="h-4 w-36 bg-[#1F2937] rounded" />
            <div className="h-3 w-48 bg-[#1F2937] rounded" />
          </div>
          <div className="divide-y divide-[#1F2937]">
            {[1, 2].map((j) => (
              <div key={j} className="flex items-center gap-3 px-4 py-3">
                <div className="h-4 w-4 bg-[#1F2937] rounded shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-48 bg-[#1F2937] rounded" />
                  <div className="h-3 w-32 bg-[#1F2937] rounded" />
                </div>
                <div className="h-5 w-12 bg-[#1F2937] rounded shrink-0" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
