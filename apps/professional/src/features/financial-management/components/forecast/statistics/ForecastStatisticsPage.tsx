"use client";

import dynamic from "next/dynamic";
import { Download } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { TablePagination } from "@/components/table/TablePagination";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { forecastBreadcrumbs } from "../../../constants/economyNav.config";
import { RISK_LEVEL_META } from "../../../constants/forecastRisk.constants";
import { FORECAST_STATISTICS_OBJECT_COLORS } from "../../../constants/forecastStatistics.constants";
import { useForecastStatistics } from "../../../hooks/useForecastStatistics";
import { StatisticsActivityTable } from "./StatisticsActivityTable";
import { StatisticsDonutPanel } from "./StatisticsDonutPanel";
import { StatisticsEventsPanel } from "./StatisticsEventsPanel";
import { StatisticsKpiCards } from "./StatisticsKpiCards";
import { PANEL_SURFACE, PANEL_TITLE } from "../SummaryCardParts";

/* Recharts measures the DOM, so the chart arrives client-side. */
const ProfitCostChart = dynamic(() => import("./charts/StatisticsProfitCostChart"), {
	ssr: false,
	loading: () => <div className="h-64 w-full animate-pulse rounded-lg border border-slate-200 bg-slate-50" />,
});

/**
 * Prognos › Statistik: how the forecast is actually going.
 *
 * Plain sections rather than a widget board. The boards ask the backend which
 * of their widgets have a live source and show an unavailable state for the
 * rest; this page's figures are its own, so it is composed like Riskhantering
 * and Prognos › Personal are.
 */
export function ForecastStatisticsPage() {
	const stats = useForecastStatistics();

	return (
		<div className="flex flex-1 flex-col bg-white">
			<PageHeader
				title={localizationConstants.forecastStatisticsTitle}
				breadcrumbs={forecastBreadcrumbs(localizationConstants.forecastStatisticsTitle)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			<div className="flex flex-1 flex-col gap-5 px-6 pt-5 pb-8">
				<StatisticsKpiCards kpis={stats.kpis} />

				<div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
					<div className="flex flex-col gap-5 lg:col-span-2">
						<section className={PANEL_SURFACE}>
							<h2 className={PANEL_TITLE}>
								<Translate text={localizationConstants.forecastStatisticsProfitTitle} />
							</h2>
							<ProfitCostChart points={stats.chartPoints} />
						</section>

						<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
							<StatisticsEventsPanel
								titleKey={localizationConstants.forecastStatisticsSystemEventsTitle}
								events={stats.systemEvents}
								dotClassName="bg-sky-500"
							/>
							<StatisticsEventsPanel
								titleKey={localizationConstants.forecastStatisticsFinancialEventsTitle}
								events={stats.financialEvents}
								dotClassName="bg-amber-500"
							/>
						</div>
					</div>

					<div className="flex flex-col gap-5">
						<StatisticsDonutPanel
							titleKey={localizationConstants.forecastStatisticsObjectsTitle}
							slices={stats.objectDistribution}
							colorOf={(slice) => FORECAST_STATISTICS_OBJECT_COLORS[slice.id]}
							ariaLabelKey={localizationConstants.forecastStatisticsObjectsChartLabel}
							emptyKey={localizationConstants.forecastStatisticsObjectsEmpty}
						/>
						<StatisticsDonutPanel
							titleKey={localizationConstants.forecastStatisticsHealthTitle}
							slices={stats.healthDistribution}
							colorOf={(slice) => RISK_LEVEL_META[slice.id].color}
							ariaLabelKey={localizationConstants.forecastStatisticsHealthChartLabel}
							emptyKey={localizationConstants.forecastStatisticsHealthEmpty}
						/>
					</div>
				</div>

				<section className={PANEL_SURFACE}>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<h2 className={PANEL_TITLE}>
							<Translate text={localizationConstants.forecastStatisticsActivityTitle} />
						</h2>
							<Button
							type="button"
							variant="outline"
							onClick={stats.exportActivity}
							className="h-9 w-full cursor-pointer gap-2 border-slate-200 sm:w-auto"
						>
							<Download className="h-4 w-4" aria-hidden />
							<Translate text={localizationConstants.forecastStatisticsExport} />
						</Button>
					</div>

					<StatisticsActivityTable
						rows={stats.activityRows}
						sortField={stats.sortField}
						sortDir={stats.sortDir}
						onSort={stats.onSort}
					/>

					<TablePagination
						currentPage={stats.currentPage}
						totalPages={stats.totalPages}
						pageSize={stats.pageSize}
						onPageChange={stats.setPage}
						onPageSizeChange={stats.setPageSize}
						className="justify-center sm:justify-center"
					/>
				</section>
			</div>
		</div>
	);
}

export default ForecastStatisticsPage;
