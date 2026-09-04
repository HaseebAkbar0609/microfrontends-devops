"use client";

import { cn } from "@/lib/utils";

interface Props {
  type: string;
}

export function OfferQuotedTypeBadge({ type }: Props) {
  const lower = type.toLowerCase();
  const isExpress = lower === "express";
  const isB2C = lower === "b2c";
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium",
        isExpress && "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
        isB2C && "bg-slate-800 text-white",
        !isExpress && !isB2C && "bg-slate-50 text-slate-600 ring-1 ring-slate-200",
      )}
    >
      {type}
    </span>
  );
}
