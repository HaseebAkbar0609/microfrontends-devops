"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { BalanceSheetData, BalanceSheetRow } from "../../types/financialReports.types";

interface BalanceSheetReportProps {
	data: BalanceSheetData;
}

function formatSek(val: number): string {
	return new Intl.NumberFormat("sv-SE", {
		style: "decimal",
		maximumFractionDigits: 0,
	}).format(val) + " kr";
}

export function BalanceSheetReport({ data }: BalanceSheetReportProps) {
	const renderRow = (row: BalanceSheetRow) => (
		<tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors text-xs">
			<td className="py-2.5 px-3 font-mono font-medium text-slate-500 w-16">{row.accountCode}</td>
			<td className="py-2.5 px-3 font-medium text-slate-800">
				<Translate text={row.labelKey} />
			</td>
			<td className="py-2.5 px-3 text-right font-semibold text-slate-900">{formatSek(row.amount)}</td>
			<td className="py-2.5 px-3 text-right text-slate-500">{formatSek(row.previousPeriodAmount)}</td>
		</tr>
	);

	return (
		<div className="space-y-6">
			{/* Balance Verification Banner */}
			<div className={`p-4 rounded-xl border flex items-center justify-between ${data.isBalanced ? "bg-emerald-50/70 border-emerald-200 text-emerald-900" : "bg-rose-50 border-rose-200 text-rose-900"}`}>
				<div className="flex items-center gap-3">
					{data.isBalanced ? (
						<CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
					) : (
						<AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
					)}
					<div>
						<p className="text-sm font-bold">
							<Translate text={data.isBalanced ? localizationConstants.balanceSheetStatusBalanced : localizationConstants.balanceSheetStatusUnbalanced} />
						</p>
						<p className="text-xs text-slate-600 mt-0.5">
							<Translate text={localizationConstants.balanceSheetTotalAssets} /> ({formatSek(data.totalAssets)}) = <Translate text={localizationConstants.balanceSheetTotalEquityAndLiab} /> ({formatSek(data.totalEquityAndLiabilities)})
						</p>
					</div>
				</div>
				<div className="text-right">
					<span className="text-xs font-semibold px-2.5 py-1 bg-white rounded-md shadow-sm border border-slate-200">
						<Translate text={localizationConstants.balanceSheetDifference} />: {formatSek(data.difference)}
					</span>
				</div>
			</div>

			{/* 2-Column Assets vs Liabilities Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* 1. TILLGÅNGAR (Assets) */}
				<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
					<div>
						<div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
							<h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
								<Translate text={localizationConstants.balanceSheetSecAssets} />
							</h4>
							<span className="text-xs font-bold text-slate-700">{data.periodLabel}</span>
						</div>

						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="bg-slate-50/40 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
									<th className="py-2.5 px-3">Konto</th>
									<th className="py-2.5 px-3">Beskrivning</th>
									<th className="py-2.5 px-3 text-right">Utfall</th>
									<th className="py-2.5 px-3 text-right">Föreg. år</th>
								</tr>
							</thead>
							<tbody>
								{/* Fixed Assets */}
								<tr className="bg-slate-100/50 text-[11px] font-bold text-slate-600 uppercase">
									<td colSpan={4} className="py-2 px-3">
										<Translate text={localizationConstants.balanceSheetSecFixedAssets} />
									</td>
								</tr>
								{data.fixedAssetRows.map(renderRow)}

								{/* Current Assets */}
								<tr className="bg-slate-100/50 text-[11px] font-bold text-slate-600 uppercase">
									<td colSpan={4} className="py-2 px-3">
										<Translate text={localizationConstants.balanceSheetSecCurrentAssets} />
									</td>
								</tr>
								{data.currentAssetRows.map(renderRow)}
							</tbody>
						</table>
					</div>

					{/* Total Assets Footer */}
					<div className="p-4 border-t-2 border-slate-300 bg-slate-100/80 flex items-center justify-between">
						<span className="text-sm font-extrabold text-slate-900">
							<Translate text={localizationConstants.balanceSheetTotalAssets} />
						</span>
						<span className="text-base font-black text-slate-900">
							{formatSek(data.totalAssets)}
						</span>
					</div>
				</div>

				{/* 2. EGET KAPITAL OCH SKULDER (Equity & Liabilities) */}
				<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
					<div>
						<div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
							<h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
								<Translate text={localizationConstants.balanceSheetSecEquityAndLiab} />
							</h4>
							<span className="text-xs font-bold text-slate-700">{data.periodLabel}</span>
						</div>

						<table className="w-full text-left border-collapse">
							<thead>
								<tr className="bg-slate-50/40 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
									<th className="py-2.5 px-3">Konto</th>
									<th className="py-2.5 px-3">Beskrivning</th>
									<th className="py-2.5 px-3 text-right">Utfall</th>
									<th className="py-2.5 px-3 text-right">Föreg. år</th>
								</tr>
							</thead>
							<tbody>
								{/* Equity */}
								<tr className="bg-slate-100/50 text-[11px] font-bold text-slate-600 uppercase">
									<td colSpan={4} className="py-2 px-3">
										<Translate text={localizationConstants.balanceSheetSecEquity} />
									</td>
								</tr>
								{data.equityRows.map(renderRow)}

								{/* Long-term Liabilities */}
								<tr className="bg-slate-100/50 text-[11px] font-bold text-slate-600 uppercase">
									<td colSpan={4} className="py-2 px-3">
										<Translate text={localizationConstants.balanceSheetSecLongTermLiab} />
									</td>
								</tr>
								{data.longTermLiabilityRows.map(renderRow)}

								{/* Short-term Liabilities */}
								<tr className="bg-slate-100/50 text-[11px] font-bold text-slate-600 uppercase">
									<td colSpan={4} className="py-2 px-3">
										<Translate text={localizationConstants.balanceSheetSecShortTermLiab} />
									</td>
								</tr>
								{data.shortTermLiabilityRows.map(renderRow)}
							</tbody>
						</table>
					</div>

					{/* Total Equity and Liabilities Footer */}
					<div className="p-4 border-t-2 border-slate-300 bg-slate-100/80 flex items-center justify-between">
						<span className="text-sm font-extrabold text-slate-900">
							<Translate text={localizationConstants.balanceSheetTotalEquityAndLiab} />
						</span>
						<span className="text-base font-black text-slate-900">
							{formatSek(data.totalEquityAndLiabilities)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
