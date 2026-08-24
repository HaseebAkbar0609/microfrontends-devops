"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";

export interface RecordNavRowProps {
  /**
   * The record's own name (a data value, not a translation key). Rule 2 of the
   * guideline: this replaces the breadcrumb on any page reached by drilling
   * into a specific record.
   */
  title: string;
  description?: string;
  /** Explicit destination for the back arrow. Omit to step back in history. */
  backHref?: string;
  /** Right-aligned slot for record-level actions. */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Back-navigation row: arrow + record title (+ optional description).
 * Sits directly below the primary tab row on record pages.
 */
export function RecordNavRow({
  title,
  description,
  backHref,
  actions,
  className,
}: RecordNavRowProps) {
  const router = useRouter();
  const t = useTranslate();
  const backLabel = t(localizationConstants.goBackButton);

  const arrowClass =
    "flex size-6 shrink-0 items-center justify-center rounded-md text-slate-900 transition-colors hover:bg-slate-100";

  return (
    <div className={cn("flex items-start justify-between gap-4 pt-4", className)}>
      <div className="flex min-w-0 items-start gap-2">
        {backHref ? (
          <Link href={backHref} aria-label={backLabel} className={arrowClass}>
            <ArrowLeft className="size-5" aria-hidden />
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => router.back()}
            aria-label={backLabel}
            className={cn(arrowClass, "cursor-pointer")}
          >
            <ArrowLeft className="size-5" aria-hidden />
          </button>
        )}

        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-slate-900">
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>

      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export default RecordNavRow;
