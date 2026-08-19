"use client";

import { cn } from "@/lib/utils";

interface Props {
  category: string;
}

export function OfferQuotedCategoryBadge({ category }: Props) {
  const lower = category.toLowerCase();
  const isMåleri = lower === "måleri" || lower === "maleri";
  const isExpress = lower === "express";
  const isB2B = lower === "b2b";

  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-xs font-medium",
        isMåleri && "text-slate-700 ring-1 ring-slate-200",
        isExpress && "text-slate-700 ring-1 ring-slate-200",
        isB2B && "text-slate-700 ring-1 ring-slate-200",
        !isMåleri && !isExpress && !isB2B && "text-slate-600 ring-1 ring-slate-200",
      )}
    >
      {category}
    </span>
  );
}
