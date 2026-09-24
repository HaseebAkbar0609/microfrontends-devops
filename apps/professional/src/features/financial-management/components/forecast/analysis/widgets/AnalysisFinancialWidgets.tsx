import { Briefcase, Table2 } from "lucide-react";

import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { FORECAST_ANALYSIS_CARD_TITLES } from "../../../../constants/forecastAnalysis.constants";
import type { AnalysisProjectPerformance, AnalysisSummaryRow } from "../../../../types/forecastAnalysis.types";
import { formatNumber, formatSignedSek } from "../../../../utils/economyFormatters";

const HEAD = "px-2 py-1.5 text-xs font-semibold text-slate-600";
const CELL = "px-2 py-2 text-sm text-slate-900 tabular-nums";

/** A variance pill: green when the figure went the right way, red when it did not. */
function VariancePill({ row }: { row: AnalysisSummaryRow }) {
	const good = row.variance === 0 || row.variance > 0 === row.riseIsGood;

	return (
		<span
			className={cn(
				"inline-flex rounded-sm px-2 py-0.5 text-xs font-semibold tabular-nums",
				good ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700",
			)}
		>
			{formatSignedSek(row.variance)}
		</span>
	);
}

/** Financial Summary: budget, utfall and prognos side by side, then the variances. */
function SummaryTable({ rows }: { rows: AnalysisSummaryRow[] }) {
	return (
		<div className="w-full overflow-x-auto">
			<table className="w-full min-w-[22rem] border-collapse">
				<thead>
					<tr className="border-b border-slate-200">
						<th className={cn(HEAD, "text-left")} />
						<th className={cn(HEAD, "text-right")}>
							<Translate text={localizationConstants.forecastAnalysisColBudget} />
						</th>
						<th className={cn(HEAD, "text-right")}>
							<Translate text={localizationConstants.forecastAnalysisColActual} />
						</th>
						<th className={cn(HEAD, "text-right")}>
							<Translate text={localizationConstants.forecastAnalysisColForecast} />
						</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr key={row.labelKey} className="border-b border-slate-100">
							<td className={cn(CELL, "text-left text-slate-600")}>
								<Translate text={row.labelKey} />
							</td>
							<td className={cn(CELL, "text-right")}>{formatNumber(row.budget)}</td>
							<td className={cn(CELL, "text-right")}>{formatNumber(row.actual)}</td>
							<td className={cn(CELL, "text-right")}>{formatNumber(row.forecast)}</td>
						</tr>
					))}
					{/* The frame's last row: one pill per metric, under the columns it draws them in. */}
					<tr>
						<td className={cn(CELL, "text-left text-slate-600")}>
							<Translate text={localizationConstants.forecastAnalysisRowVariance} />
						</td>
						{rows.map((row) => (
							<td key={row.labelKey} className={cn(CELL, "text-right")}>
								<VariancePill row={row} />
							</td>
						))}
					</tr>
				</tbody>
			</table>
		</div>
	);
}

/** Projektutfall: how the running projects sit against their budgets. */
function PerformanceBody({ performance }: { performance: AnalysisProjectPerformance }) {
	const t = useTranslate();

	return (
		<div className="flex flex-1 flex-col gap-3 text-sm">
			<p className="flex items-baseline justify-between gap-3 text-slate-600">
				<Translate text={localizationConstants.forecastAnalysisActiveProjects} />
				<span className="font-semibold text-slate-900 tabular-nums">{performance.activeCount}</span>
			</p>

			<ul className="space-y-1.5 border-t border-slate-200 pt-3 text-slate-600">
				<li className="flex items-center gap-2">
					<span className="size-2 rounded-full bg-emerald-500" aria-hidden />
					<Translate text={localizationConstants.forecastAnalysisOnBudget} />
					<span className="ml-auto font-medium text-slate-900 tabular-nums">{performance.onBudgetCount}</span>
				</li>
				<li className="flex items-center gap-2">
					<span className="size-2 rounded-full bg-red-500" aria-hidden />
					<Translate text={localizationConstants.forecastAnalysisOverBudget} />
					<span className="ml-auto font-medium text-slate-900 tabular-nums">{performance.overBudgetCount}</span>
				</li>
			</ul>

			<div className="space-y-1.5 border-t border-slate-200 pt-3">
				<p className="text-xs font-medium text-slate-500">
					<Translate text={localizationConstants.forecastAnalysisTopOverruns} />
				</p>
				{performance.overruns.length === 0 ? (
					<p className="text-sm text-slate-500">
						<Translate
							text={
								performance.activeCount === 0
									? localizationConstants.forecastAnalysisNoActiveProjects
									: localizationConstants.forecastAnalysisNoOverruns
							}
						/>
					</p>
				) : (
					<ul className="space-y-1">
						{performance.overruns.map((overrun) => (
							<li key={overrun.id} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
								<span className="text-slate-900">{overrun.name}</span>
								<span className="ml-auto shrink-0 text-right text-red-600 tabular-nums">
									{t(localizationConstants.forecastAnalysisAmountOverBudget, {
										amount: formatSignedSek(overrun.amountOver),
									})}
								</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}

/** The frame's two wide cards under the figures. */
export function createAnalysisFinancialWidgets(
	rows: AnalysisSummaryRow[],
	performance: AnalysisProjectPerformance,
): Record<string, WidgetProps> {
	return {
		financialSummary: {
			title: FORECAST_ANALYSIS_CARD_TITLES.financialSummary,
			icon: Table2,
			content: <SummaryTable rows={rows} />,
		},
		projectPerformance: {
			title: FORECAST_ANALYSIS_CARD_TITLES.projectPerformance,
			icon: Briefcase,
			content: <PerformanceBody performance={performance} />,
		},
	};
}
