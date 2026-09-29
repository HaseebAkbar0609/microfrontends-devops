"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { listLeadItemsAPIAction } from "@/api-actions";
import { getLeadCategoryName, getLeadCreatedAt } from "@/api-actions/leads/shared";
import localizationConstants from "@/utils/translation/constants";
import {
  ANALYTICS_QUERY_KEYS,
  ANALYTICS_SAMPLE_SIZE,
  ANALYTICS_STALE_TIME_MS,
  LEADS_MONTHS_SHOWN,
  LEADS_WEEKS_SHOWN,
} from "./analytics.constants";
import { countById, countPerMonth, countPerWeek, parseTimestamp } from "./analyticsStats";
import { AnalyticsBarList } from "./AnalyticsBarList";
import { AnalyticsPanel } from "./AnalyticsPanel";
import { useAnalyticsLocale } from "./useAnalyticsLocale";

/** New leads per ISO week and per month, and which categories they came in. */
export function LeadsAnalyticsPanels() {
  const { t } = useTranslation();
  const { locale, formatSample } = useAnalyticsLocale();
  const leads = useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.leadsSample,
    queryFn: () => listLeadItemsAPIAction(ANALYTICS_SAMPLE_SIZE),
    staleTime: ANALYTICS_STALE_TIME_MS,
  });
  const items = leads.data?.items;

  const breakdown = useMemo(() => {
    if (!items?.length) return { perWeek: [], perMonth: [], byCategory: [] };
    const dates = items
      .map((item) => parseTimestamp(getLeadCreatedAt(item)))
      .filter((date): date is Date => date !== null);
    const now = new Date();
    const monthFormat = new Intl.DateTimeFormat(locale, { month: "short", year: "numeric" });
    const categories = items.flatMap((item) => {
      const named = (item.categories ?? []).filter((category) => getLeadCategoryName(category));
      return named.length
        ? named.map((category) => ({ id: category.id, label: getLeadCategoryName(category) }))
        : [{ id: "", label: t(localizationConstants.analyticsUncategorised) }];
    });

    return {
      perWeek: countPerWeek(dates, LEADS_WEEKS_SHOWN, now, (week) =>
        t(localizationConstants.analyticsWeekLabel, { week })
      ),
      perMonth: countPerMonth(dates, LEADS_MONTHS_SHOWN, now, (start) => monthFormat.format(start)),
      byCategory: countById(categories, t(localizationConstants.analyticsOther)),
    };
  }, [items, locale, t]);

  const panelState = {
    isLoading: leads.isLoading,
    isError: leads.isError,
    onRetry: () => void leads.refetch(),
    caption: leads.data && formatSample(leads.data.items.length, leads.data.totalItems),
  };

  return (
    <>
      <AnalyticsPanel titleKey={localizationConstants.analyticsLeadsPerWeek} {...panelState}>
        <AnalyticsBarList rows={breakdown.perWeek} />
      </AnalyticsPanel>
      <AnalyticsPanel titleKey={localizationConstants.analyticsLeadsPerMonth} {...panelState}>
        <AnalyticsBarList rows={breakdown.perMonth} />
      </AnalyticsPanel>
      <AnalyticsPanel titleKey={localizationConstants.analyticsLeadsByCategory} {...panelState}>
        <AnalyticsBarList rows={breakdown.byCategory} />
        {breakdown.byCategory.length > 0 && (
          <p className="px-5 pb-2 text-xs text-slate-500">
            {t(localizationConstants.analyticsCategoryNote)}
          </p>
        )}
      </AnalyticsPanel>
    </>
  );
}
