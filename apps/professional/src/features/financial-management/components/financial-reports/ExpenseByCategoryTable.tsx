"use client";

import { useTranslation } from "react-i18next";
import { PieChart } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ExpenseCategoryBreakdown } from "../../types/financialReports.types";

interface ExpenseByCategoryTableProps {
	rows: ExpenseCategoryBreakdown[];
}

function formatCurrency(val: number, currency: string): string {
	return `${new Intl.NumberFormat("sv-SE", {
		style: "decimal",
		maximumFractionDigits: 0,
	}).format(val)} ${currency}`;
}

export function ExpenseByCategoryTable({ rows }: ExpenseByCategoryTableProps) {
	const { t } = useTranslation();
	const currency = t(localizationConstants.reportCurrencySek);

	if (rows.length === 0) return null;

	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
			<div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<PieChart className="w-4 h-4 text-primary" />
					<h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
						<Translate text={localizationConstants.reportExpenseByCategoryTitle} />
					</h4>
				</div>
				<span className="text-xs text-slate-500 font-medium">
					{rows.length}
				</span>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="bg-slate-50/40 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
							<th className="py-2.5 px-4">
								<Translate text={localizationConstants.category} />
							</th>
							<th className="py-2.5 px-4 text-right">
								<Translate text={localizationConstants.incomeStatementColCurrentPeriod} />
							</th>
							<th className="py-2.5 px-4 text-right">
								<Translate text={localizationConstants.incomeStatementColPreviousPeriod} />
							</th>
							<th className="py-2.5 px-4 text-right">
								<Translate text={localizationConstants.incomeStatementColVarianceSek} />
							</th>
							<th className="py-2.5 px-4 text-right">
								<Translate text={localizationConstants.incomeStatementColVariancePercent} />
							</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((row) => {
							const isPos = row.varianceSek >= 0;
							return (
								<tr
									key={row.category}
									className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors text-xs"
								>
									<td className="py-2.5 px-4 font-semibold text-slate-900">
										<Translate text={row.labelKey} />
									</td>
									<td className="py-2.5 px-4 text-right font-semibold text-slate-900">
										{formatCurrency(row.amount, currency)}
									</td>
									<td className="py-2.5 px-4 text-right text-slate-500">
										{formatCurrency(row.previousPeriodAmount, currency)}
									</td>
									<td
										className={`py-2.5 px-4 text-right font-medium ${
											isPos ? "text-rose-600" : "text-emerald-600"
										}`}
									>
										{isPos ? "+" : ""}
										{formatCurrency(row.varianceSek, currency)}
									</td>
									<td
										className={`py-2.5 px-4 text-right font-medium ${
											isPos ? "text-rose-600" : "text-emerald-600"
										}`}
									>
										{isPos ? "+" : ""}
										{row.variancePercent}%
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
