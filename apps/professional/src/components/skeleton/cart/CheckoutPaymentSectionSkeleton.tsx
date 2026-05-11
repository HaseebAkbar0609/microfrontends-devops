import { Skeleton } from "@/components/ui/skeleton";

export function CheckoutPaymentSectionSkeleton() {
  return (
    <div className="rounded-xl bg-white p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-6 w-56" />
      </div>

      <div className="rounded-lg border border-border p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-12" />
            <Skeleton className="h-10 w-12" />
            <Skeleton className="h-10 w-12" />
          </div>
        </div>

        <Skeleton className="h-12 w-40" />
        <Skeleton className="h-28 w-full" />
        <div className="flex justify-end">
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <Skeleton className="h-5 w-64" />
      <Skeleton className="h-4 w-[75%]" />
    </div>
  );
}

