"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
	listLeadItemsAPIAction,
	listPendingProfessionalsAPIAction,
	listProfessionalsAPIAction,
} from "@/api-actions";
import { mapLeadStatusToApiStatus } from "@/api-actions/leads/shared";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	ANALYTICS_QUERY_KEYS,
	ANALYTICS_SAMPLE_SIZE,
	ANALYTICS_STALE_TIME_MS,
	COUNT_ONLY_PAGE_SIZE,
} from "@/features/customers/analytics/analytics.constants";
import { countByText } from "@/features/customers/analytics/analyticsStats";
import { AnalyticsBarList } from "@/features/customers/analytics/AnalyticsBarList";
import { AnalyticsKpiCard } from "@/features/customers/analytics/AnalyticsKpiCard";
import { AnalyticsError, AnalyticsPanel } from "@/features/customers/analytics/AnalyticsPanel";
import { useAnalyticsLocale } from "@/features/customers/analytics/useAnalyticsLocale";

/**
 * A lead counts as accepted once a professional took it, including after it was
 * paid. Two values also keep the API on its plain lead list: a lone "accepted"
 * switches it to a per-quote listing.
 */
const ACCEPTED_LEAD_STATUSES = [
	mapLeadStatusToApiStatus("accepterad"),
	mapLeadStatusToApiStatus("betalda"),
] as const;

export function ProfessionalAnalyticsTab() {
	const t = useTranslate();
	const { formatSample } = useAnalyticsLocale();

	const active = useQuery({
		queryKey: ANALYTICS_QUERY_KEYS.activeProfessionalsSample,
		queryFn: () => listProfessionalsAPIAction({ page: 1, pageSize: ANALYTICS_SAMPLE_SIZE }),
		staleTime: ANALYTICS_STALE_TIME_MS,
	});
	const pending = useQuery({
		queryKey: ANALYTICS_QUERY_KEYS.pendingProfessionalsCount,
		queryFn: () => listPendingProfessionalsAPIAction({ page: 1, pageSize: COUNT_ONLY_PAGE_SIZE }),
		staleTime: ANALYTICS_STALE_TIME_MS,
	});
	const accepted = useQuery({
		queryKey: ANALYTICS_QUERY_KEYS.acceptedLeadsCount,
		queryFn: () => listLeadItemsAPIAction(COUNT_ONLY_PAGE_SIZE, ACCEPTED_LEAD_STATUSES),
		staleTime: ANALYTICS_STALE_TIME_MS,
	});

	const rows = active.data?.items;
	const breakdown = useMemo(() => {
		const labels = {
			unknown: t(localizationConstants.analyticsUnknownCity),
			other: t(localizationConstants.analyticsOther),
		};
		return {
			byCity: countByText((rows ?? []).map((row) => row.city), labels),
			byCategory: countByText((rows ?? []).map((row) => row.category), {
				...labels,
				unknown: t(localizationConstants.analyticsUncategorised),
			}),
		};
	}, [rows, t]);

	const counts = [
		{ id: "active", labelKey: localizationConstants.professionalTabActive, query: active, accentClassName: "bg-emerald-50 text-emerald-700" },
		{ id: "pending", labelKey: localizationConstants.professionalTabPending, query: pending, accentClassName: "bg-amber-50 text-amber-600" },
		{ id: "accepted", labelKey: localizationConstants.analyticsAcceptedLeads, query: accepted, accentClassName: "bg-teal-50 text-teal-700", hintKey: localizationConstants.analyticsAcceptedLeadsHint },
	];
	const queries = [active, pending, accepted];
	const panelState = {
		isLoading: active.isLoading,
		isError: active.isError,
		onRetry: () => void active.refetch(),
		caption: active.data && formatSample(active.data.items.length, active.data.totalItems),
	};

	return (
		<div className="flex flex-col gap-6 py-2">
			{queries.some((query) => query.isError) ? (
				<div className="rounded-xl border border-slate-200 bg-white shadow-2xs">
					<AnalyticsError onRetry={() => queries.forEach((query) => query.isError && void query.refetch())} />
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
					{counts.map((kpi) => (
						<AnalyticsKpiCard
							key={kpi.id}
							labelKey={kpi.labelKey}
							value={kpi.query.data?.totalItems ?? 0}
							isLoading={kpi.query.isLoading}
							accentClassName={kpi.accentClassName}
							hintKey={kpi.hintKey}
						/>
					))}
					<AnalyticsKpiCard
						labelKey={localizationConstants.analyticsLicenseIncome}
						value={null}
						accentClassName="bg-cyan-50 text-cyan-700"
						hintKey={localizationConstants.analyticsLicenseIncomeHint}
					/>
				</div>
			)}

			<div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
				<AnalyticsPanel titleKey={localizationConstants.analyticsProfessionalsByCity} {...panelState}>
					<AnalyticsBarList rows={breakdown.byCity} />
				</AnalyticsPanel>
				<AnalyticsPanel titleKey={localizationConstants.analyticsProfessionalsByCategory} {...panelState}>
					<AnalyticsBarList rows={breakdown.byCategory} />
				</AnalyticsPanel>
			</div>
		</div>
	);
}
