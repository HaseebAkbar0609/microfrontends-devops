"use client";

import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useAnalyticsLocale } from "./useAnalyticsLocale";

type AnalyticsKpiCardProps = {
  labelKey: TranslationKeys;
  /** `null` marks a figure the API does not provide yet; it is never guessed. */
  value: number | null;
  accentClassName: string;
  isLoading?: boolean;
  hintKey?: TranslationKeys;
};

/** One headline figure, styled like the sales KPI cards. */
export function AnalyticsKpiCard({
  labelKey,
  value,
  accentClassName,
  isLoading,
  hintKey,
}: AnalyticsKpiCardProps) {
  const { formatNumber } = useAnalyticsLocale();
  const unavailable = value === null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
      <span className={`inline-flex rounded-md px-2 py-0.5 text-sm font-medium ${accentClassName}`}>
        <Translate text={labelKey} />
      </span>
      <p className="mt-3 text-3xl font-semibold tabular-nums text-slate-900">
        {isLoading ? "…" : unavailable ? "—" : formatNumber(value)}
      </p>
      {unavailable && !isLoading && (
        <p className="text-sm font-medium text-slate-600">
          <Translate text={localizationConstants.analyticsNotAvailable} />
        </p>
      )}
      {hintKey && (
        <p className="text-sm text-slate-500">
          <Translate text={hintKey} />
        </p>
      )}
    </div>
  );
}
