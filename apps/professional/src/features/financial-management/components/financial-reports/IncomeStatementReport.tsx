"use client";

import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	formatComparisonPeriodLabel,
	formatPeriodLabel,
} from "../../services/financialReports.service";
import type { IncomeStatementData, IncomeStatementRow, StatementSubtotal } from "../../types/financialReports.types";
import { RevenueByProjectTable } from "./RevenueByProjectTable";
import { ExpenseByCategoryTable } from "./ExpenseByCategoryTable";

interface IncomeStatementReportProps {
	data: IncomeStatementData;
	onAccountClick?: (accountCode: string, labelKey: string, amount: number) => void;
}

function formatCurrency(val: number, currency: string): string {
	return `${new Intl.NumberFormat("sv-SE", {
		style: "decimal",
		maximumFractionDigits: 0,
	}).format(val)} ${currency}`;
}

export function IncomeStatementReport({ data, onAccountClick }: IncomeStatementReportProps) {
	const { t } = useTranslation();
	const currency = t(localizationConstants.reportCurrencySek);
	const periodStr = formatPeriodLabel(data.filter, t);
	const compPeriodStr = formatComparisonPeriodLabel(data.filter, data.comparisonYear, t);

	const renderRow = (row: IncomeStatementRow) => {
		const isPos = row.varianceSek >= 0;
		const isClickable = Boolean(onAccountClick && row.accountCode);

		return (
			<tr
				key={row.id}
				onClick={() => {
					if (isClickable && row.accountCode) {
						onAccountClick?.(row.accountCode, row.labelKey, row.amount);
					}
				}}
				className={`border-b border-slate-100 transition-colors text-xs ${
					isClickable ? "cursor-pointer hover:bg-primary/5 group" : "hover:bg-slate-50/70"
				}`}
				title={isClickable ? t(localizationConstants.reportClickToDrilldown) : undefined}
			>
				<td className="py-2.5 px-4 font-mono font-medium text-slate-500">
					<span className="flex items-center gap-1">
						{row.accountCode}
						{isClickable && (
							<ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
						)}
					</span>
				</td>
				<td className="py-2.5 px-4 font-medium text-slate-800 group-hover:text-primary transition-colors">
					<Translate text={row.labelKey} />
				</td>
				<td className="py-2.5 px-4 text-right font-semibold text-slate-900">{formatCurrency(row.amount, currency)}</td>
				<td className="py-2.5 px-4 text-right text-slate-500">{formatCurrency(row.previousPeriodAmount, currency)}</td>
				<td className={`py-2.5 px-4 text-right font-medium ${isPos ? "text-emerald-600" : "text-rose-600"}`}>
					{isPos ? "+" : ""}{formatCurrency(row.varianceSek, currency)}
				</td>
				<td className={`py-2.5 px-4 text-right font-medium ${isPos ? "text-emerald-600" : "text-rose-600"}`}>
					{isPos ? "+" : ""}{row.variancePercent}%
				</td>
			</tr>
		);
	};

	const renderSubtotalRow = (labelKey: string, subtotal: StatementSubtotal, isMajor = false) => {
		const isPos = subtotal.varianceSek >= 0;

		return (
			<tr className={`border-y ${isMajor ? "bg-slate-100/90 font-bold text-slate-900 border-slate-300 text-sm" : "bg-slate-50 font-semibold text-slate-800 border-slate-200 text-xs"}`}>
				<td className="py-3 px-4" />
				<td className="py-3 px-4">
					<Translate text={labelKey} />
				</td>
				<td className="py-3 px-4 text-right">{formatCurrency(subtotal.amount, currency)}</td>
				<td className="py-3 px-4 text-right text-slate-600">{formatCurrency(subtotal.previousPeriodAmount, currency)}</td>
				<td className={`py-3 px-4 text-right ${isPos ? "text-emerald-700" : "text-rose-700"}`}>
					{isPos ? "+" : ""}{formatCurrency(subtotal.varianceSek, currency)}
				</td>
				<td className={`py-3 px-4 text-right ${isPos ? "text-emerald-700" : "text-rose-700"}`}>
					{isPos ? "+" : ""}{subtotal.variancePercent}%
				</td>
			</tr>
		);
	};

	return (
		<div className="space-y-6">
			{/* Main Statement Card */}
			<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
				<div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50/60 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<h3 className="text-lg font-bold text-slate-900 tracking-tight">
							<Translate text={localizationConstants.incomeStatementTitle} />
						</h3>
						<p className="text-xs text-slate-500 mt-0.5">
							<Translate text={localizationConstants.incomeStatementSubtitle} />
						</p>
					</div>
					<div className="flex items-center gap-2 text-xs font-semibold">
						<span className="px-2.5 py-1 bg-primary/10 text-primary rounded-md">
							{periodStr}
						</span>
						<span className="text-slate-400">vs</span>
						<span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
							{compPeriodStr}
						</span>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse min-w-[640px]">
						<thead>
							<tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
								<th className="py-3 px-4 w-28">
									<Translate text={localizationConstants.incomeStatementColAccount} />
								</th>
								<th className="py-3 px-4">
									<Translate text={localizationConstants.incomeStatementColDescription} />
								</th>
								<th className="py-3 px-4 text-right w-36">
									<Translate text={localizationConstants.incomeStatementColCurrentPeriod} />
								</th>
								<th className="py-3 px-4 text-right w-36">
									<Translate text={localizationConstants.incomeStatementColPreviousPeriod} />
								</th>
								<th className="py-3 px-4 text-right w-36">
									<Translate text={localizationConstants.incomeStatementColVarianceSek} />
								</th>
								<th className="py-3 px-4 text-right w-28">
									<Translate text={localizationConstants.incomeStatementColVariancePercent} />
								</th>
							</tr>
						</thead>
						<tbody>
							{/* 1. Rörelsens intäkter */}
							<tr className="bg-slate-50/40 text-xs font-bold text-slate-700">
								<td colSpan={6} className="py-2 px-4 uppercase tracking-wider text-[11px] text-slate-400">
									<Translate text={localizationConstants.incomeStatementSecRevenue} />
								</td>
							</tr>
							{data.revenueRows.map(renderRow)}
							{renderSubtotalRow(
								localizationConstants.incomeStatementSecRevenue,
								data.subtotals.revenue,
							)}

							{/* 2. Direkta kostnader */}
							<tr className="bg-slate-50/40 text-xs font-bold text-slate-700">
								<td colSpan={6} className="py-2 px-4 uppercase tracking-wider text-[11px] text-slate-400">
									<Translate text={localizationConstants.incomeStatementSecDirectCosts} />
								</td>
							</tr>
							{data.directCostRows.map(renderRow)}
							{renderSubtotalRow(
								localizationConstants.incomeStatementSecDirectCosts,
								data.subtotals.directCosts,
							)}

							{/* Bruttoresultat */}
							{renderSubtotalRow(
								localizationConstants.incomeStatementGrossProfit,
								data.subtotals.grossProfit,
								true,
							)}

							{/* 3. Rörelsekostnader */}
							<tr className="bg-slate-50/40 text-xs font-bold text-slate-700">
								<td colSpan={6} className="py-2 px-4 uppercase tracking-wider text-[11px] text-slate-400">
									<Translate text={localizationConstants.incomeStatementSecOperatingCosts} />
								</td>
							</tr>
							{data.operatingCostRows.map(renderRow)}
							{renderSubtotalRow(
								localizationConstants.incomeStatementSecOperatingCosts,
								data.subtotals.operatingCosts,
							)}

							{/* Rörelseresultat (EBIT) */}
							{renderSubtotalRow(
								localizationConstants.incomeStatementOperatingResult,
								data.subtotals.operatingResult,
								true,
							)}

							{/* 4. Finansiella poster */}
							<tr className="bg-slate-50/40 text-xs font-bold text-slate-700">
								<td colSpan={6} className="py-2 px-4 uppercase tracking-wider text-[11px] text-slate-400">
									<Translate text={localizationConstants.incomeStatementSecFinancial} />
								</td>
							</tr>
							{data.financialRows.map(renderRow)}

							{/* Resultat efter finansiella poster */}
							{renderSubtotalRow(
								localizationConstants.incomeStatementResultBeforeTax,
								data.subtotals.resultBeforeTax,
							)}

							{/* Skatt */}
							<tr className="border-b border-slate-100 text-xs">
								<td className="py-2.5 px-4 font-mono font-medium text-slate-500">8910</td>
								<td className="py-2.5 px-4 font-medium text-slate-800">
									<Translate text={localizationConstants.incomeStatementTaxCost} />
								</td>
								<td className="py-2.5 px-4 text-right font-semibold text-slate-900">{formatCurrency(data.taxCost, currency)}</td>
								<td className="py-2.5 px-4 text-right text-slate-500">{formatCurrency(data.subtotals.taxCost.previousPeriodAmount, currency)}</td>
								<td className="py-2.5 px-4 text-right font-medium text-slate-500">
									{data.subtotals.taxCost.varianceSek !== 0 ? `${formatCurrency(data.subtotals.taxCost.varianceSek, currency)}` : "-"}
								</td>
								<td className="py-2.5 px-4 text-right font-medium text-slate-500">
									{data.subtotals.taxCost.variancePercent !== 0 ? `${data.subtotals.taxCost.variancePercent}%` : "-"}
								</td>
							</tr>

							{/* Årets resultat / Nettoresultat */}
							<tr className="bg-emerald-50/80 border-t-2 border-emerald-500 text-sm font-bold text-slate-900">
								<td className="py-3.5 px-4 font-mono text-emerald-800">8999</td>
								<td className="py-3.5 px-4 text-emerald-950 font-extrabold">
									<Translate text={localizationConstants.incomeStatementNetResult} />
								</td>
								<td className="py-3.5 px-4 text-right font-black text-emerald-800 text-base">{formatCurrency(data.netResult, currency)}</td>
								<td className="py-3.5 px-4 text-right text-slate-600">{formatCurrency(data.subtotals.netResult.previousPeriodAmount, currency)}</td>
								<td className="py-3.5 px-4 text-right text-emerald-700">
									{data.subtotals.netResult.varianceSek >= 0 ? "+" : ""}
									{formatCurrency(data.subtotals.netResult.varianceSek, currency)}
								</td>
								<td className="py-3.5 px-4 text-right text-emerald-700">
									{data.subtotals.netResult.variancePercent >= 0 ? "+" : ""}
									{data.subtotals.netResult.variancePercent}%
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			{/* Project Revenue Breakdown & Expense Category Breakdown */}
			<div className="grid grid-cols-1 gap-6">
				<RevenueByProjectTable rows={data.projectRevenueRows} />
				<ExpenseByCategoryTable rows={data.categoryExpenseRows} />
			</div>
		</div>
	);
}

export default IncomeStatementReport;
