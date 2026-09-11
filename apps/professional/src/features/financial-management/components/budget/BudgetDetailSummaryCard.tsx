"use client";

import React, { useMemo } from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { EconomyBudgetItem } from "../../types/budget.types";

interface BudgetDetailSummaryCardProps {
	item: EconomyBudgetItem;
}

export function BudgetDetailSummaryCard({
	item,
}: BudgetDetailSummaryCardProps) {
	const formatCurrency = (val: number) => {
		return val.toLocaleString("sv-SE");
	};

	const { incomeSum, costSum, totalContribution } = useMemo(() => {
		let inc = 0;
		let cost = 0;

		if (item.rows && item.rows.length > 0) {
			for (const row of item.rows) {
				const isRevenue = row.konto.startsWith("3");
				const rowMonthSum = Object.values(row.months || {}).reduce(
					(acc, v) => acc + (Number(v) || 0),
					0,
				);
				const effectiveSum = rowMonthSum !== 0 ? rowMonthSum : row.arsbudget;
				if (isRevenue) {
					inc += effectiveSum;
				} else {
					cost += Math.abs(effectiveSum);
				}
			}
		} else {
			inc = item.totalInkomst || 50000;
			cost = item.totalKostnad || 300000;
		}

		return {
			incomeSum: inc,
			costSum: cost,
			totalContribution: inc - cost,
		};
	}, [item]);

	return (
		<div className="flex justify-end">
			<div className="w-full max-w-xs bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
				{/* Intäkter */}
				<div className="flex items-center justify-between text-sm">
					<span className="text-slate-600 font-medium">
						<Translate text={localizationConstants.summaryIncome} />
					</span>
					<span className="font-semibold text-slate-900 font-mono">
						{formatCurrency(incomeSum)}
					</span>
				</div>

				{/* Kostnader */}
				<div className="flex items-center justify-between text-sm">
					<span className="text-slate-600 font-medium">
						<Translate text={localizationConstants.summaryCosts} />
					</span>
					<span className="font-semibold text-slate-900 font-mono">
						-{formatCurrency(costSum)}
					</span>
				</div>

				<div className="border-t border-slate-200 pt-3 flex items-center justify-between">
					<span className="text-sm font-bold text-slate-900">
						<Translate text={localizationConstants.summaryTotalContribution} />
					</span>
					<span className="text-base font-bold text-slate-900 font-mono">
						{formatCurrency(totalContribution)}
					</span>
				</div>
			</div>
		</div>
	);
}
