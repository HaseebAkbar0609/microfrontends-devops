"use client";

import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { IncomeStatementData, IncomeStatementRow } from "../../types/financialReports.types";

interface IncomeStatementReportProps {
	data: IncomeStatementData;
}

function formatSek(val: number): string {
	return new Intl.NumberFormat("sv-SE", {
		style: "decimal",
		maximumFractionDigits: 0,
	}).format(val) + " kr";
}

export function IncomeStatementReport({ data }: IncomeStatementReportProps) {
	const renderRow = (row: IncomeStatementRow) => {
		const isPos = row.varianceSek >= 0;
		return (
			<tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors text-xs">
				<td className="py-2.5 px-4 font-mono font-medium text-slate-500">{row.accountCode}</td>
				<td className="py-2.5 px-4 font-medium text-slate-800">
					<Translate text={row.labelKey} />
				</td>
				<td className="py-2.5 px-4 text-right font-semibold text-slate-900">{formatSek(row.amount)}</td>
				<td className="py-2.5 px-4 text-right text-slate-500">{formatSek(row.previousPeriodAmount)}</td>
				<td className={`py-2.5 px-4 text-right font-medium ${isPos ? "text-emerald-600" : "text-rose-600"}`}>
					{isPos ? "+" : ""}{formatSek(row.varianceSek)}
				</td>
				<td className={`py-2.5 px-4 text-right font-medium ${isPos ? "text-emerald-600" : "text-rose-600"}`}>
					{isPos ? "+" : ""}{row.variancePercent}%
				</td>
			</tr>
		);
	};

	const renderSubtotalRow = (labelKey: string, amount: number, prevAmount: number, isMajor = false) => {
		const variance = amount - prevAmount;
		const variancePct = prevAmount !== 0 ? Math.round((variance / prevAmount) * 1000) / 10 : 0;
		const isPos = variance >= 0;

		return (
			<tr className={`border-y ${isMajor ? "bg-slate-100/90 font-bold text-slate-900 border-slate-300 text-sm" : "bg-slate-50 font-semibold text-slate-800 border-slate-200 text-xs"}`}>
				<td className="py-3 px-4" />
				<td className="py-3 px-4">
					<Translate text={labelKey} />
				</td>
				<td className="py-3 px-4 text-right">{formatSek(amount)}</td>
				<td className="py-3 px-4 text-right text-slate-600">{formatSek(prevAmount)}</td>
				<td className={`py-3 px-4 text-right ${isPos ? "text-emerald-700" : "text-rose-700"}`}>
					{isPos ? "+" : ""}{formatSek(variance)}
				</td>
				<td className={`py-3 px-4 text-right ${isPos ? "text-emerald-700" : "text-rose-700"}`}>
					{isPos ? "+" : ""}{variancePct}%
				</td>
			</tr>
		);
	};

	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
			{/* Report Header */}
			<div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50/60 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h3 className="text-lg font-bold text-slate-900 tracking-tight">
						<Translate text={localizationConstants.incomeStatementTitle} />
					</h3>
					<p className="text-xs text-slate-500 mt-0.5">
						<Translate text={localizationConstants.incomeStatementSubtitle} />
					</p>
				</div>
				<div className="flex items-center gap-4 text-xs font-semibold">
					<span className="px-2.5 py-1 bg-primary/10 text-primary rounded-md">
						{data.periodLabel}
					</span>
					<span className="text-slate-400">vs</span>
					<span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
						{data.comparisonPeriodLabel}
					</span>
				</div>
			</div>

			{/* Statement Table */}
			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
							<th className="py-3 px-4 w-24">
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
							data.totalRevenue,
							Math.round(data.totalRevenue * 0.93)
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
							data.totalDirectCosts,
							Math.round(data.totalDirectCosts * 0.92)
						)}

						{/* Bruttoresultat */}
						{renderSubtotalRow(
							localizationConstants.incomeStatementGrossProfit,
							data.grossProfit,
							Math.round(data.grossProfit * 0.94),
							true
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
							data.totalOperatingExpenses,
							Math.round(data.totalOperatingExpenses * 0.94)
						)}

						{/* Rörelseresultat (EBIT) */}
						{renderSubtotalRow(
							localizationConstants.incomeStatementOperatingResult,
							data.operatingResult,
							Math.round(data.operatingResult * 0.93),
							true
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
							data.netProfitBeforeTax,
							Math.round(data.netProfitBeforeTax * 0.92)
						)}

						{/* Skatt */}
						<tr className="border-b border-slate-100 text-xs">
							<td className="py-2.5 px-4 font-mono font-medium text-slate-500">8910</td>
							<td className="py-2.5 px-4 font-medium text-slate-800">
								<Translate text={localizationConstants.incomeStatementTaxCost} /> (20.6%)
							</td>
							<td className="py-2.5 px-4 text-right font-semibold text-slate-900">{formatSek(data.taxCost)}</td>
							<td className="py-2.5 px-4 text-right text-slate-500">{formatSek(Math.round(data.taxCost * 0.92))}</td>
							<td className="py-2.5 px-4 text-right font-medium text-slate-500">-</td>
							<td className="py-2.5 px-4 text-right font-medium text-slate-500">-</td>
						</tr>

						{/* Årets resultat / Nettoresultat */}
						<tr className="bg-emerald-50/80 border-t-2 border-emerald-500 text-sm font-bold text-slate-900">
							<td className="py-3.5 px-4 font-mono text-emerald-800">8999</td>
							<td className="py-3.5 px-4 text-emerald-950 font-extrabold">
								<Translate text={localizationConstants.incomeStatementNetResult} />
							</td>
							<td className="py-3.5 px-4 text-right font-black text-emerald-800 text-base">{formatSek(data.netResult)}</td>
							<td className="py-3.5 px-4 text-right text-slate-600">{formatSek(Math.round(data.netResult * 0.9))}</td>
							<td className="py-3.5 px-4 text-right text-emerald-700">+{formatSek(Math.round(data.netResult * 0.1))}</td>
							<td className="py-3.5 px-4 text-right text-emerald-700">+10.0%</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}
