"use client";

import { Disc, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface Props {
  status: string;
  openedAt?: string;
}

export function OfferQuotedStatusBadge({ status, openedAt }: Props) {
  const t = useTranslate();
  const isOpened = status === "opened" || status === "Öppnad";

  return (
    <div className="group/status relative inline-block">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium",
          isOpened
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-amber-50 text-amber-700 border border-amber-200",
        )}
      >
        {isOpened ? (
          <FolderOpen className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
        ) : (
          <Disc className="h-3.5 w-3.5 text-amber-600 shrink-0" />
        )}
        {isOpened
          ? t(localizationConstants.offerQuotedStatusOpened)
          : t(localizationConstants.offerQuotedStatusNotReviewed)}
      </span>
      {isOpened && openedAt && (
        <div className="pointer-events-none absolute left-0 top-full z-50 mt-1.5 hidden min-w-max rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-md group-hover/status:block">
          {t(localizationConstants.offerQuotedOpenedAt)} {openedAt}
        </div>
      )}
    </div>
  );
}
