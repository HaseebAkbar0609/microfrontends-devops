"use client";

import { Mail, Phone, Map, Tag, Info } from "lucide-react";
import { OfferFormCompany } from "../types";

type Props = { company: OfferFormCompany };

export function OfferFormCompanySection({ company }: Props) {
  const initials = company.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex items-start gap-4">
      <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#F4F4F5] shadow-[0px_1px_2px_0px_#1018280D] text-xs font-semibold text-slate-600">
        {initials || "NB"}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className="font-sans font-medium text-[14px] leading-[20px] tracking-normal text-[#09090B]">
            {company.name}
          </span>
          <button
            type="button"
            className="flex h-[36px] w-[36px] items-center justify-center rounded-lg bg-[#F4F4F5] shadow-[0px_1px_2px_0px_#1018280D] text-[#6B7280] hover:bg-slate-200/80 transition-colors"
          >
            <Info className="h-4.5 w-4.5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="mt-3 space-y-2 font-sans font-medium text-sm leading-5 tracking-normal text-[#475569]">
          <div className="flex items-center gap-3">
            <Mail className="h-4.5 w-4.5 shrink-0 text-[#6B7280]" strokeWidth={1.5} />
            <span className="truncate">{company.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Tag className="h-4.5 w-4.5 shrink-0 text-[#6B7280]" strokeWidth={1.5} />
            <span>{company.orgNumber}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4.5 w-4.5 shrink-0 text-[#6B7280]" strokeWidth={1.5} />
            <span>{company.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <Map className="h-4.5 w-4.5 shrink-0 text-[#6B7280]" strokeWidth={1.5} />
            <span className="truncate">{company.address}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
