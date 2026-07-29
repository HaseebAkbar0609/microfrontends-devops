"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Briefcase, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
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
  return MapPin;
}

export function OfferSendPageHeader({
  title,
  postedDate,
  badges,
}: OfferSendPageHeaderProps) {
  const router = useRouter();

  return (
    <div className="w-full px-4 pt-6">
      <div className="mr-auto flex w-full  items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            aria-label="Go back"
             className="p-0! -mt-1.5"
          >
            <ArrowLeft className="h-6! w-6!" />
          </Button>

          <div>
            <h1 className="text-2xl font-semibold leading-tight text-slate-900">
              {title}
            </h1>
            {postedDate && (
              <p className="mt-1 text-sm text-slate-500">{`Posted: ${postedDate}`}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
          {badges.map((b) => {
            const Icon = badgeIcon(b);
            const variant = badgeVariant(b);
            const cls =
              variant === "info"
                ? "gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50"
                : variant === "success"
                  ? "gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                  : "gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-50";

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

