"use client";

import { SALES_CHART_FILL_CLASS } from "@/features/sales/constants/salesTheme";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { AnalyticsBarRow } from "./analyticsStats";
import { useAnalyticsLocale } from "./useAnalyticsLocale";

/**
 * One series per list, so the panel title names it and no legend is needed.
 * Every row prints its value next to its label, which keeps the meaning off
 * colour alone; the bar itself is decoration for sighted users.
 */
export function AnalyticsBarList({ rows }: { rows: AnalyticsBarRow[] }) {
  const { formatNumber } = useAnalyticsLocale();
  const max = Math.max(0, ...rows.map((row) => row.value));

  if (rows.length === 0) {
    return (
      <p className="px-5 py-8 text-sm text-slate-500">
        <Translate text={localizationConstants.analyticsNoData} />
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3 px-5 py-4">
      {rows.map((row) => (
        <li key={row.id}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-slate-700">{row.label}</span>
            <span className="text-sm tabular-nums text-slate-900">{formatNumber(row.value)}</span>
          </div>
          <div aria-hidden="true" className="mt-1 h-1.5 w-full rounded-full bg-slate-100">
            {row.value > 0 && (
              <div
                className={`h-1.5 rounded-full ${SALES_CHART_FILL_CLASS}`}
                style={{ width: `${(row.value / max) * 100}%` }}
              />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
