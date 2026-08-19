"use client";

import { Mail, Map, Phone } from "lucide-react";

import { OfferSendCustomerDetailsProps } from "../types";

export function OfferSendCustomerDetails({
  customer,
}: OfferSendCustomerDetailsProps) {
  const initials = customer.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex items-start gap-4">
      <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#F4F4F5] shadow-[0px_1px_2px_0px_#1018280D] text-xs font-semibold text-slate-600">
        {initials || "AA"}
      </div>

      <div className="min-w-0 flex-1">
        <div className="font-sans font-medium text-[14px] leading-[20px] tracking-normal text-[#09090B]">
          {customer.name}
        </div>

        <div className="mt-3 space-y-2 font-sans font-medium text-sm leading-5 tracking-normal text-[#475569]">
          <div className="flex items-center gap-3">
            <Mail className="h-4.5 w-4.5 text-[#6B7280] shrink-0" strokeWidth={1.5} />
            <span className="truncate">{customer.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4.5 w-4.5 text-[#6B7280] shrink-0" strokeWidth={1.5} />
            <span>{customer.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <Map className="h-4.5 w-4.5 text-[#6B7280] shrink-0" strokeWidth={1.5} />
            <span className="truncate">{customer.address}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
