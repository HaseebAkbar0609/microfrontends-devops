"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Briefcase, Building2, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type OfferSendPageHeaderProps = {
  title: string;
  postedDate: string;
  badges: string[];
};

function badgeVariant(label: string) {
  const lower = label.toLowerCase();
  if (lower.includes("express")) return "info" as const;
  if (lower.includes("stockholm")) return "success" as const;
  return "warning" as const;
}

function badgeIcon(label: string) {
  const lower = label.toLowerCase();
  if (lower.includes("express")) return Briefcase;
  if (lower.includes("stockholm")) return Building2;
  return MapPin;
}

export function OfferSendPageHeader({
  title,
  postedDate,
  badges,
}: OfferSendPageHeaderProps) {
  const router = useRouter();

  return (
    <div className="w-full px-6 pt-6">
      <div className="mr-auto flex w-full items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-900 font-semibold text-lg hover:text-slate-700 transition-colors cursor-pointer text-left"
          >
            <ArrowLeft className="h-5 w-5 shrink-0 text-slate-900" />
            <h1 className="font-sans font-semibold text-lg leading-7 tracking-normal text-slate-900">
              {title}
            </h1>
          </button>
          {postedDate && (
            <p className="pl-7 mt-1 font-sans font-normal text-xs text-slate-500">
              {postedDate.startsWith("Offert") || postedDate.startsWith("Posted")
                ? postedDate
                : `Posted: ${postedDate}`}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
          {badges.map((b) => {
            const Icon = badgeIcon(b);
            const variant = badgeVariant(b);
            const cls =
              variant === "info"
                ? "gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                : variant === "success"
                  ? "gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                  : "gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-50";

            return (
              <Badge key={b} variant={variant} className={cls}>
                <Icon className="h-3.5 w-3.5" />
                {b}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}
