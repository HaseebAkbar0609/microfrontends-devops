export function SupplierDetailSkeleton() {
  return (
    <div className="flex flex-col flex-1">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-3 bg-white">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-48 bg-slate-200 rounded animate-pulse mt-1" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-6 p-6 bg-white items-start">
        {/* Left column card skeleton */}
        <div className="w-full bg-white rounded-xl shadow-sm p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="w-20 h-20 bg-slate-200 rounded-full animate-pulse" />
            <div className="flex gap-2">
              <div className="h-5 w-16 bg-slate-200 rounded animate-pulse" />
              <div className="h-5 w-16 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="h-8 w-44 bg-slate-200 rounded animate-pulse mt-1" />
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-4 h-4 bg-slate-200 rounded animate-pulse" />
                <div className="flex-1 flex flex-col gap-1">
                  <div className="h-3 w-12 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column tab content skeleton */}
        <div className="w-full bg-white rounded-xl shadow-sm p-6 flex flex-col gap-6">
          <div className="flex gap-4 border-b border-slate-100 pb-3">
            <div className="h-6 w-16 bg-slate-200 rounded animate-pulse" />
            <div className="h-6 w-16 bg-slate-200 rounded animate-pulse" />
            <div className="h-6 w-16 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
            <div className="h-20 w-full bg-slate-200 rounded animate-pulse" />
            <div className="h-32 w-full bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
