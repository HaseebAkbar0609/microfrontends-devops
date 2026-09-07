"use client";

import React from "react";
import Link from "next/link";
import {
	Activity,
	AlertCircle,
	ArrowUpRight,
	Banknote,
	BarChart3,
	Coins,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	WidgetBarRow,
	WidgetContent as Content,
	WidgetMockTag as MockTag,
	WidgetRow as Row,
} from "@/features/widgetdashboard/components/WidgetContent";
import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import type { EconomyDashboardState } from "../../../types/economyDashboard.types";
import {
	formatNumber,
	formatPercent,
	formatSek,
	formatSignedSek,
} from "../../../utils/economyFormatters";

export function createEconomyHealthWidgets(
	state: EconomyDashboardState,
): Record<string, WidgetProps> {
	const { healthScore, overview, kpis, cashFlow } = state;

	return {
		// 1) Financial Health Score
		financialHealthScore: {
			title: localizationConstants.financialHealthScoreTitle,
			icon: Activity,
			content: (
				<Content>
					<div className="flex items-center justify-between pb-1">
						<div className="flex items-baseline gap-1.5">
							<span className="text-2xl font-bold tracking-tight text-slate-900">
								{healthScore.score}
							</span>
							<span className="text-xs font-medium text-slate-500">
								/ {healthScore.maxScore}
							</span>
						</div>
						<span
							className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${healthScore.statusColor}`}
						>
							<Translate text={healthScore.statusKey} />
						</span>
					</div>

					<div className="space-y-1 pt-1 border-t border-slate-200/60">
						<Row
							label={localizationConstants.healthScoreCashRunway}
							value={`${healthScore.cashRunwayMonths} ${localizationConstants.monthsUnit}`}
						/>
						<Row
							label={localizationConstants.healthScoreGrossMargin}
							value={formatPercent(healthScore.grossMarginPercent)}
						/>
						<Row
							label={localizationConstants.healthScoreOverdueAr}
							value={`${formatSek(healthScore.overdueArAmount)} (${healthScore.overdueInvoicesCount} ${localizationConstants.invoicesCountSuffix})`}
						/>
					</div>

					<div className="mt-2 rounded-md bg-amber-50/80 p-2.5 border border-amber-200/60">
						<div className="flex items-start gap-1.5 text-xs text-amber-900">
							<AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-600" />
							<div>
								<span className="font-semibold block">
									<Translate text={localizationConstants.healthScoreSuggestedAction} />:
								</span>
								<p className="mt-0.5 text-[11px] leading-relaxed text-amber-800">
									<Translate text={healthScore.suggestedActionKey} />
								</p>
							</div>
						</div>
					</div>

					<div className="pt-1 flex items-center justify-between">
						<Link
							href="/module/financial-management/invoice"
							className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 transition-colors"
						>
							<Translate text={localizationConstants.viewInvoicesAction} />
							<ArrowUpRight size={12} />
						</Link>
						<MockTag />
					</div>
				</Content>
			),
		},

		// 2) Ekonomiöversikt
		economyOverview: {
			title: localizationConstants.economyOverviewWidgetTitle,
			icon: Coins,
			content: (
				<Content>
					<Row
						label={localizationConstants.econOverviewRevenue}
						value={formatSek(overview.revenue)}
					/>
					<Row
						label={localizationConstants.econOverviewCosts}
						value={formatSek(overview.costs)}
					/>
					<div className="pt-1">
						<WidgetBarRow
							label={localizationConstants.econOverviewContributionMargin}
							percent={Math.round(overview.contributionMarginPercent)}
							value={`${formatSek(overview.contributionMargin)} (${formatPercent(overview.contributionMarginPercent)})`}
							color="bg-emerald-500"
						/>
					</div>
					<Row
						label={localizationConstants.econOverviewNetResult}
						value={formatSek(overview.netResult)}
					/>
					<Row
						label={localizationConstants.econOverviewOpenInvoices}
						value={formatSek(overview.openInvoicesAr)}
					/>
					<div className="pt-1 flex items-center justify-between">
						<Link
							href="/module/financial-management/forecast"
							className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 transition-colors"
						>
							<Translate text={localizationConstants.viewReportsAction} />
							<ArrowUpRight size={12} />
						</Link>
						<MockTag />
					</div>
				</Content>
			),
		},

		// 3) KPI Dashboard
		kpiDashboard: {
			title: localizationConstants.kpiDashboardWidgetTitle,
			icon: BarChart3,
			content: (
				<Content>
					<Row
						label={localizationConstants.kpiBillableHours}
						value={`${formatNumber(kpis.billableHours)} ${localizationConstants.hoursShortUnit}`}
					/>
					<div className="pt-0.5">
						<WidgetBarRow
							label={localizationConstants.kpiUtilization}
							percent={kpis.utilizationPercent}
							value={formatPercent(kpis.utilizationPercent)}
							color="bg-blue-600"
						/>
					</div>
					<Row
						label={localizationConstants.kpiInvoiceLeadTime}
						value={`${kpis.avgLeadTimeDays} ${localizationConstants.daysShortUnit}`}
					/>
					<div className="pt-0.5">
						<WidgetBarRow
							label={localizationConstants.kpiQuoteConversion}
							percent={kpis.quoteConversionPercent}
							value={formatPercent(kpis.quoteConversionPercent)}
							color="bg-indigo-500"
						/>
					</div>
					<div className="pt-0.5">
						<WidgetBarRow
							label={localizationConstants.kpiOnTimePayments}
							percent={kpis.onTimePaymentsPercent}
							value={formatPercent(kpis.onTimePaymentsPercent)}
							color="bg-emerald-500"
						/>
					</div>
					<MockTag />
				</Content>
			),
		},

		// 4) Kassaflöde
		cashFlow: {
			title: localizationConstants.cashFlowWidgetTitle,
			icon: Banknote,
			content: (
				<Content>
					<Row
						label={localizationConstants.cashFlowOpening}
						value={formatSek(cashFlow.openingCash)}
					/>
					<Row
						label={localizationConstants.cashFlowIn30Days}
						value={
							<span className="font-semibold text-emerald-600">
								+{formatSek(cashFlow.cashIn30Days)}
							</span>
						}
					/>
					<Row
						label={localizationConstants.cashFlowOut30Days}
						value={
							<span className="font-semibold text-rose-600">
								-{formatSek(cashFlow.cashOut30Days)}
							</span>
						}
					/>
					<div className="flex items-baseline justify-between gap-2 text-xs pt-1 border-t border-slate-200/60">
						<span className="font-semibold text-slate-700">
							<Translate text={localizationConstants.cashFlowNet} />
						</span>
						<span
							className={`font-bold inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[11px] ${
								cashFlow.netCashFlow >= 0
									? "bg-emerald-50 text-emerald-700"
									: "bg-rose-50 text-rose-700"
							}`}
						>
							{cashFlow.netCashFlow >= 0 ? (
								<TrendingUp size={12} />
							) : (
								<TrendingDown size={12} />
							)}
							{formatSignedSek(cashFlow.netCashFlow)}
						</span>
					</div>
					<Row
						label={localizationConstants.cashFlowForecast14Days}
						value={formatSek(cashFlow.forecastCash14Days)}
					/>
					<MockTag />
				</Content>
			),
		},
	};
}
