"use client";

import { AtSign, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { OfferQuotedItem } from "../types/offer";

interface Props {
  item: OfferQuotedItem;
}

export function OfferQuotedStatusBadge({ item }: Props) {
  const t = useTranslate();
  const isOpened = item.status === "opened";

  return (
    <div className="group/status relative inline-block">
      <span
        className={cn(
          "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium",
          isOpened
            ? "bg-green-50 text-green-700 ring-1 ring-green-200"
            : "bg-orange-50 text-orange-600 ring-1 ring-orange-200",
        )}
      >
        {isOpened ? (
          <Circle className="h-2 w-2 fill-green-500 text-green-500" />
        ) : (
          <AtSign className="h-3 w-3" />
        )}
        {isOpened
          ? t(localizationConstants.offerQuotedStatusOpened)
          : t(localizationConstants.offerQuotedStatusNotReviewed)}
      </span>
      {isOpened && item.openedAt && (
        <div className="pointer-events-none absolute left-0 top-full z-50 mt-1.5 hidden min-w-max rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-md group-hover/status:block">
          {t(localizationConstants.offerQuotedOpenedAt)} {item.openedAt}
        </div>
      )}
    </div>
  );
}
