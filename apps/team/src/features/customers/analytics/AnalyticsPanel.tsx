"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

type AnalyticsPanelProps = {
  titleKey: TranslationKeys;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  /** Footnote under the content, e.g. which sample the figures are based on. */
  caption?: string;
  children: ReactNode;
};

/** White card with a title bar that owns the loading and error states of its content. */
export function AnalyticsPanel({
  titleKey,
  isLoading,
  isError,
  onRetry,
  caption,
  children,
}: AnalyticsPanelProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
      <h2 className="border-b border-slate-200 px-5 py-4 text-base font-semibold text-slate-900">
        <Translate text={titleKey} />
      </h2>
      {isLoading ? (
        <p role="status" className="px-5 py-8 text-sm text-slate-400">
          <Translate text={localizationConstants.analyticsLoading} />
        </p>
      ) : isError ? (
        <AnalyticsError onRetry={onRetry} />
      ) : (
        <>
          {children}
          {caption && <p className="px-5 pb-4 text-xs text-slate-500">{caption}</p>}
        </>
      )}
    </section>
  );
}

export function AnalyticsError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-wrap items-center gap-3 px-5 py-6">
      <p className="text-sm text-red-600">
        <Translate text={localizationConstants.analyticsLoadFailed} />
      </p>
      {onRetry && (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          <Translate text={localizationConstants.analyticsRetry} />
        </Button>
      )}
    </div>
  );
}
