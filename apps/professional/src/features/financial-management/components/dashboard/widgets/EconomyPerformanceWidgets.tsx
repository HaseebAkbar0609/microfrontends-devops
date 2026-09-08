"use client";

import React from "react";
import Link from "next/link";
import {
	ArrowUpRight,
	Briefcase,
	Calculator,
	FileSpreadsheet,
	Package,
	TrendingDown,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	WidgetBarRow,
	WidgetContent as Content,
	WidgetRow as Row,
} from "@/features/widgetdashboard/components/WidgetContent";
import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import type { EconomyDashboardState } from "../../../types/economyDashboard.types";
import {
	formatPercent,
	formatSek,
} from "../../../utils/economyFormatters";

export function createEconomyPerformanceWidgets(
	state: EconomyDashboardState,
): Record<string, WidgetProps> {
	const { profitability, incomeStatement, revenueDistribution, costDistribution, budgetItems } = state;

	return {
		// 5) Lönsamhet
		profitability: {
			title: localizationConstants.profitabilityWidgetTitle,
			icon: TrendingDown,
			content: (
				<Content>
					<div className="space-y-1.5 pb-2">
						<span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
							<Translate text={localizationConstants.profitabilityGrossMarginTrend} />
						</span>
						<div className="grid grid-cols-3 gap-1.5 text-center">
							{profitability.grossMarginTrends.map((trend) => (
								<div
									key={trend.monthKey}
									className="rounded-md bg-white border border-slate-200/80 p-1.5"
								>
									<span className="text-[10px] text-slate-500 font-medium block">
										{trend.monthKey}
									</span>
									<span className="text-xs font-bold text-slate-800">
										{formatPercent(trend.marginPercent)}
									</span>
								</div>
							))}
						</div>
					</div>

					<div className="space-y-1 pt-1.5 border-t border-slate-200/60">
						<span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
							<Translate text={localizationConstants.profitabilityTopJobs} />
						</span>
						{profitability.topProfitableJobs.map((job) => (
							<Row
								key={job.id}
								label={job.title}
								value={formatSek(job.amount)}
							/>
						))}
					</div>
				</Content>
			),
		},

		// 6) Resultat (Simplified P&L)
		incomeStatement: {
			title: localizationConstants.incomeStatementWidgetTitle,
			icon: FileSpreadsheet,
			content: (
				<Content>
					<Row
						label={localizationConstants.econOverviewRevenue}
						value={formatSek(incomeStatement.revenue)}
					/>
					<Row
						label={localizationConstants.incomeDirectCosts}
						value={formatSek(incomeStatement.directCosts)}
					/>
					<div className="flex items-baseline justify-between gap-2 text-xs py-1 border-y border-slate-200/60 font-semibold text-slate-800">
						<span>
							<Translate text={localizationConstants.incomeGrossProfit} />
						</span>
						<span>{formatSek(incomeStatement.grossProfit)}</span>
					</div>
					<Row
						label={localizationConstants.incomeOverheads}
						value={formatSek(incomeStatement.overheads)}
					/>
					<div className="flex items-baseline justify-between gap-2 text-xs pt-1 border-t border-slate-200/60 font-bold text-slate-900">
						<span>
							<Translate text={localizationConstants.incomeEbit} />
						</span>
						<span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200/60">
							{formatSek(incomeStatement.ebit)}
						</span>
					</div>
					<div className="pt-1 flex items-center justify-between">
						<Link
							href="/module/financial-management/forecast"
							className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 transition-colors"
						>
							<Translate text={localizationConstants.viewReportsAction} />
							<ArrowUpRight size={12} />
						</Link>
					</div>
				</Content>
			),
		},

		// 10) Intäktsfördelning
		revenueDistribution: {
			title: localizationConstants.revenueDistributionWidgetTitle,
			icon: Briefcase,
			content: (
				<Content>
					<div className="h-2 w-full flex rounded-full overflow-hidden mb-2">
						{revenueDistribution.map((seg) => (
							<div
								key={seg.id}
								className={seg.color}
								style={{ width: `${seg.percent}%` }}
								title={`${seg.percent}%`}
							/>
						))}
					</div>
					{revenueDistribution.map((seg) => (
						<div key={seg.id} className="flex items-center justify-between text-xs py-0.5">
							<div className="flex items-center gap-1.5">
								<span className={`w-2 h-2 rounded-full ${seg.color}`} />
								<span className="text-slate-600">
									<Translate text={seg.titleKey} />
								</span>
							</div>
							<span className="font-medium text-slate-800">
								{formatSek(seg.amount)} ({formatPercent(seg.percent, 0)})
							</span>
						</div>
					))}
				</Content>
			),
		},

		// 13) Kostnadsfördelning
		costDistribution: {
			title: localizationConstants.costDistributionWidgetTitle,
			icon: Package,
			content: (
				<Content>
					{costDistribution.map((cost) => (
						<WidgetBarRow
							key={cost.id}
							label={cost.titleKey}
							percent={cost.percent}
							value={`${formatSek(cost.amount)} (${cost.percent} %)`}
							color={cost.color}
						/>
					))}
				</Content>
			),
		},

		// 15) Budget
		budget: {
			title: localizationConstants.budgetWidgetTitle,
			icon: Calculator,
			content: (
				<Content>
					{budgetItems.map((item) => (
						<div key={item.id} className="space-y-0.5 pt-0.5">
							<div className="flex items-baseline justify-between text-xs">
								<span className="text-slate-600 font-medium">
									<Translate text={item.labelKey} />
								</span>
								<div className="flex items-baseline gap-1.5">
									<span className="font-semibold text-slate-800">
										{formatSek(item.actualAmount)}
									</span>
									<span
										className={`text-[10px] font-bold px-1.5 py-0.2 rounded-xs ${
											item.variancePercent <= 0 && item.id === "b-rev"
												? "text-rose-600 bg-rose-50"
												: item.variancePercent > 0 && item.id === "b-cost"
												? "text-rose-600 bg-rose-50"
												: "text-emerald-600 bg-emerald-50"
										}`}
									>
										{item.variancePercent > 0 ? `+${item.variancePercent}%` : `${item.variancePercent}%`}
									</span>
								</div>
							</div>
							<p className="text-[10px] text-slate-400">
								Budget: {formatSek(item.budgetAmount)}
							</p>
						</div>
					))}
				</Content>
			),
		},
	};
}
