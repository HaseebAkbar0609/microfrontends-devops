"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { OfferQuotedItem } from "../types/offer";

interface Props {
  item: OfferQuotedItem;
}

export function OfferQuotedContactCell({ item }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative inline-flex items-center gap-1.5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Info size={14} className="shrink-0 cursor-pointer text-slate-400" />
      <span className="cursor-default text-slate-600">{item.contactPerson.name}</span>
      {hovered && (
        <div className="absolute bottom-full left-0 z-50 mb-2 min-w-max">
          <div className="rounded-lg bg-neutral-900 px-4 py-2.5 shadow-lg">
            <p className="text-sm font-medium text-white">{item.contactPerson.phone}</p>
            <p className="text-sm text-white/80">{item.contactPerson.email}</p>
          </div>
          <div className="absolute left-4 -bottom-1.5 h-0 w-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-neutral-900" />
        </div>
      )}
    </div>
  );
}
