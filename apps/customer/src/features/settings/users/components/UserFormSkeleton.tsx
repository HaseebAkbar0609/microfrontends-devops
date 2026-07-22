"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface UserFormSkeletonProps {
  /** Number of skeleton fields to render, defaults to 8 */
  fieldCount?: number;
}

export function UserFormSkeleton({ fieldCount = 8 }: UserFormSkeletonProps) {
  return (
    <div className="max-w-5xl rounded-md border border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-2 text-sm font-medium text-slate-900">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="grid grid-cols-1 gap-x-3 gap-y-3 px-4 py-4 md:grid-cols-2">
        {Array.from({ length: fieldCount }).map((_, index) => (
          <div
            key={index}
            className={`space-y-1.5 ${index === fieldCount - 2 ? "md:col-span-2" : ""}`}
          >
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
        <div className="md:col-span-2">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="mt-1.5 h-10 w-full rounded-md" />
          <Skeleton className="mt-2 h-20 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

