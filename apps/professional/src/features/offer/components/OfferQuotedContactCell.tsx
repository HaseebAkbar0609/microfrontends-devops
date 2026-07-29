"use client";

import { useState } from "react";
import { OfferQuotedItem } from "../types/offer";

interface Props {
  item: OfferQuotedItem;
}

export function OfferQuotedContactCell({ item }: Props) {
  const [hovered, setHovered] = useState(false);

  const initials = item.contactPerson.name
    .split(" ")
    .map((n) => n[0])
    .join(".")
    .toUpperCase();

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="cursor-default text-slate-600">{initials}</span>
      {hovered && (
        <div className="absolute left-0 top-full z-50 mt-1.5 min-w-max rounded-md border border-slate-200 bg-white px-3 py-2 shadow-md">
          <p className="text-xs font-medium text-slate-900">
            {item.contactPerson.phone}
          </p>
          <p className="text-xs text-slate-500">{item.contactPerson.email}</p>
        </div>
      )}
    </div>
  );
}
