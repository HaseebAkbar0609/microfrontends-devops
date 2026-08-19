"use client";

import { useState } from "react";
import { XCircle, FolderOpen } from "lucide-react";
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
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className={cn(
          "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
          isOpened
            ? "bg-green-50 text-green-700"
            : "text-[#A16207]",
        )}
        style={!isOpened ? { backgroundColor: "var(--color-bg-warning-muted, #FEFCE8)" } : undefined}
      >
        {isOpened ? (
          <FolderOpen className="h-3.5 w-3.5 text-green-600" />
        ) : (
          <XCircle className="h-3.5 w-3.5 text-[#A16207]" />
        )}
        {isOpened
          ? t(localizationConstants.offerQuotedStatusOpened)
          : t(localizationConstants.offerQuotedStatusNotReviewed)}
      </span>
      {isOpened && item.openedAt && hovered && (
        <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-2 min-w-max">
          <div className="rounded-lg bg-neutral-900 px-4 py-2.5 shadow-lg">
            <p className="text-sm text-white">
              {t(localizationConstants.offerQuotedOpenedAt)} {item.openedAt}
            </p>
          </div>
          <div className="absolute left-4 -bottom-1.5 h-0 w-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-neutral-900" />
        </div>
      )}
    </div>
  );
}
