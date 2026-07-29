"use client";

import { Mail, Phone, MapPin, Building2 } from "lucide-react";
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
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
        {initials || "NB"}
      </div>

      <div className="min-w-0">
        <div className="text-base font-semibold text-slate-900">{company.name}</div>
        <div className="mt-3 space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 shrink-0 text-slate-500" />
            <span className="truncate">{company.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Building2 className="h-4 w-4 shrink-0 text-slate-500" />
            <span>{company.orgNumber}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 shrink-0 text-slate-500" />
            <span>{company.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 shrink-0 text-slate-500" />
            <span className="truncate">{company.address}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
