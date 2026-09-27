import { Banknote, Coins, PieChart } from "lucide-react";

import { WidgetBarRow } from "@/features/widgetdashboard/components/WidgetContent";
import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { FORECAST_KEY_FIGURES_CARD_TITLES } from "../../../../../constants/forecastAnalysis.constants";
import type {
	AnalysisCashFlow,
	AnalysisProfitability,
	AnalysisProjectPerformance,
	AnalysisUtilization,
} from "../../../../../types/forecastAnalysis.types";
import { formatHours, formatNumber, formatPercent, formatSek } from "../../../../../utils/economyFormatters";
import { StatBlock, TONE_CLASS, changeTone } from "../../widgets/AnalysisCardParts";

/** Kassaflöde: what is owed to the company, and what it has yet to invoice. */
function CashFlowBody({ cashFlow }: { cashFlow: AnalysisCashFlow }) {
	/* Waiting longer for payment is the bad news, so more days reads badly. */
	const dsoTone = changeTone(cashFlow.dsoDays - cashFlow.dsoPreviousDays, false);

	return (
		<div className="flex flex-1 flex-wrap gap-6">
			<StatBlock
				labelKey={localizationConstants.forecastKeyFiguresAccountsReceivable}
				value={formatSek(cashFlow.accountsReceivable)}
				meta={
					<>
						<p className={cn("font-medium", TONE_CLASS[dsoTone])}>
							<Translate
								text={localizationConstants.forecastKeyFiguresDso}
								values={{ days: cashFlow.dsoDays }}
							/>
						</p>
						<p>
							<Translate
								text={localizationConstants.forecastKeyFiguresDsoPrevious}
								values={{ days: cashFlow.dsoPreviousDays }}
							/>
						</p>
					</>
				}
			/>
			<StatBlock
				labelKey={localizationConstants.forecastKeyFiguresWorkInProgress}
				value={formatSek(cashFlow.workInProgress)}
				meta={
					<Translate
						text={localizationConstants.forecastKeyFiguresUninvoicedHours}
						values={{ hours: formatNumber(cashFlow.uninvoicedHours) }}
					/>
				}
			/>
		</div>
	);
}

/** Projektlönsamhet: the average project, the extremes, and what runs over budget. */
function ProfitabilityBody({
	profitability,
	performance,
}: {
	profitability: AnalysisProfitability;
	performance: AnalysisProjectPerformance;
}) {
	if (!profitability.lowest || !profitability.highest) {
		return (
			<p className="py-4 text-sm text-slate-500">
				<Translate text={localizationConstants.forecastKeyFiguresNoProjects} />
			</p>
		);
	}

	return (
		<div className="flex flex-1 flex-col gap-4">
			<StatBlock
				labelKey={localizationConstants.forecastKeyFiguresAverageMargin}
				value={formatPercent(profitability.averageMarginPercent)}
			/>

			<dl className="flex flex-wrap gap-6 text-sm">
				<div className="min-w-0 flex-1">
					<dt className="text-xs font-medium text-slate-500">
						<Translate text={localizationConstants.forecastKeyFiguresLowestMargin} />
					</dt>
					<dd className="flex flex-wrap items-baseline justify-between gap-2 text-slate-900">
						<span className="truncate">{profitability.lowest.name}</span>
						<span className="font-semibold text-red-600 tabular-nums">
							{formatPercent(profitability.lowest.percent)}
						</span>
					</dd>
				</div>
				<div className="min-w-0 flex-1">
					<dt className="text-xs font-medium text-slate-500">
						<Translate text={localizationConstants.forecastKeyFiguresHighestMargin} />
					</dt>
					<dd className="flex flex-wrap items-baseline justify-between gap-2 text-slate-900">
						<span className="truncate">{profitability.highest.name}</span>
						<span className="font-semibold text-emerald-600 tabular-nums">
							{formatPercent(profitability.highest.percent)}
						</span>
					</dd>
				</div>
			</dl>

			{/* The frame's red block: how many projects passed their budget. */}
			<p className="mt-auto flex items-center justify-between gap-3 rounded-sm bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
				<Translate text={localizationConstants.forecastAnalysisOverBudget} />
				<span className="tabular-nums">{performance.overBudgetCount}</span>
			</p>
		</div>
	);
}

/** Debiteringsgrad against target, and what an hour of it brings in. */
function UtilizationBody({ utilization }: { utilization: AnalysisUtilization }) {
	const onTarget = utilization.utilizationPercent >= utilization.targetPercent;

	return (
		<div className="flex flex-1 flex-col gap-4 text-sm text-slate-600">
			<WidgetBarRow
				label={localizationConstants.forecastAnalysisKpiUtilization}
				percent={Math.min(utilization.utilizationPercent, 100)}
				value={
					<span className={onTarget ? "text-emerald-600" : "text-amber-600"}>
						{formatPercent(utilization.utilizationPercent)}
					</span>
				}
				color={onTarget ? "bg-emerald-500" : "bg-amber-500"}
			/>
			<p className="-mt-2 text-xs text-slate-500">
				<Translate
					text={localizationConstants.forecastKeyFiguresUtilizationTarget}
					values={{ percent: formatPercent(utilization.targetPercent, 0) }}
				/>
			</p>

			<dl className="flex flex-wrap gap-6">
				<StatBlock
					labelKey={localizationConstants.forecastKeyFiguresBillableHours}
					value={formatHours(utilization.billableHours)}
					meta={
						<Translate
							text={localizationConstants.forecastKeyFiguresCapacityHours}
							values={{ hours: formatHours(utilization.capacityHours) }}
						/>
					}
				/>
				<StatBlock
					labelKey={localizationConstants.forecastKeyFiguresRevenuePerHour}
					value={formatSek(utilization.revenuePerBillableHour)}
				/>
			</dl>
		</div>
	);
}

export interface KeyFiguresCashInput {
	cashFlow: AnalysisCashFlow;
	profitability: AnalysisProfitability;
	performance: AnalysisProjectPerformance;
	utilization: AnalysisUtilization;
}

/** Nyckeltal's three middle cards. */
export function createKeyFiguresCashWidgets({
	cashFlow,
	profitability,
	performance,
	utilization,
}: KeyFiguresCashInput): Record<string, WidgetProps> {
	return {
		cashFlow: {
			title: FORECAST_KEY_FIGURES_CARD_TITLES.cashFlow,
			icon: Banknote,
			content: <CashFlowBody cashFlow={cashFlow} />,
		},
		projectProfitability: {
			title: FORECAST_KEY_FIGURES_CARD_TITLES.projectProfitability,
			icon: PieChart,
			content: <ProfitabilityBody profitability={profitability} performance={performance} />,
		},
		utilizationRates: {
			title: FORECAST_KEY_FIGURES_CARD_TITLES.utilizationRates,
			icon: Coins,
			content: <UtilizationBody utilization={utilization} />,
		},
	};
}
