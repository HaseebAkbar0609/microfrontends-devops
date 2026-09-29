"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPrivateAnalyticsAPIAction, listPrivateCustomersAPIAction } from "@/api-actions";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
  ANALYTICS_QUERY_KEYS,
  ANALYTICS_SAMPLE_SIZE,
  ANALYTICS_STALE_TIME_MS,
} from "@/features/customers/analytics/analytics.constants";
import { countByText } from "@/features/customers/analytics/analyticsStats";
import { AnalyticsBarList } from "@/features/customers/analytics/AnalyticsBarList";
import { AnalyticsKpiCard } from "@/features/customers/analytics/AnalyticsKpiCard";
import { AnalyticsError, AnalyticsPanel } from "@/features/customers/analytics/AnalyticsPanel";
import { LeadsAnalyticsPanels } from "@/features/customers/analytics/LeadsAnalyticsPanels";
import { useAnalyticsLocale } from "@/features/customers/analytics/useAnalyticsLocale";

/** Placeholder the customer list mapper uses when the API has no city. */
const MISSING_CITY = "-";

export function PrivateAnalyticsTab() {
  const t = useTranslate();
  const { formatSample } = useAnalyticsLocale();

  const summary = useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.privateSummary,
    queryFn: getPrivateAnalyticsAPIAction,
    staleTime: ANALYTICS_STALE_TIME_MS,
  });
  const customers = useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.activeCustomersSample,
    queryFn: () => listPrivateCustomersAPIAction({ page: 1, pageSize: ANALYTICS_SAMPLE_SIZE }),
    staleTime: ANALYTICS_STALE_TIME_MS,
  });

  const customerItems = customers.data?.items;
  const cityRows = useMemo(
    () =>
      countByText(
        (customerItems ?? []).map((customer) => customer.city),
        { unknown: t(localizationConstants.analyticsUnknownCity), other: t(localizationConstants.analyticsOther) },
        MISSING_CITY
      ),
    [customerItems, t]
  );

  const kpis = [
    { id: "active", labelKey: localizationConstants.activeCustomersTab, value: summary.data?.active_customers, accentClassName: "bg-emerald-50 text-emerald-700" },
    { id: "pending", labelKey: localizationConstants.pendingCustomersTab, value: summary.data?.pending_customers, accentClassName: "bg-amber-50 text-amber-600" },
    { id: "archived", labelKey: localizationConstants.archivedCustomersTab, value: summary.data?.archived_customers, accentClassName: "bg-slate-100 text-slate-700" },
    { id: "total", labelKey: localizationConstants.analyticsTotalPrivateCustomers, value: summary.data?.total_private_customers, accentClassName: "bg-teal-50 text-teal-700" },
  ];

  return (
    <div className="flex flex-col gap-6 px-5 py-6">
      {summary.isError ? (
        <div className="rounded-xl border border-slate-200 bg-white shadow-2xs">
          <AnalyticsError onRetry={() => void summary.refetch()} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <AnalyticsKpiCard
              key={kpi.id}
              labelKey={kpi.labelKey}
              value={kpi.value ?? 0}
              accentClassName={kpi.accentClassName}
              isLoading={summary.isLoading}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <AnalyticsPanel
          titleKey={localizationConstants.analyticsActiveCustomersByCity}
          isLoading={customers.isLoading}
          isError={customers.isError}
          onRetry={() => void customers.refetch()}
          caption={customers.data && formatSample(customers.data.items.length, customers.data.totalItems)}
        >
          <AnalyticsBarList rows={cityRows} />
        </AnalyticsPanel>
        <LeadsAnalyticsPanels />
        <AnalyticsKpiCard
          labelKey={localizationConstants.analyticsDaysLeadToAccepted}
          value={null}
          accentClassName="bg-cyan-50 text-cyan-700"
          hintKey={localizationConstants.analyticsDaysLeadToAcceptedHint}
        />
      </div>
    </div>
  );
}
