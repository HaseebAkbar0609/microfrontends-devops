"use client";

import React, { useMemo } from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { BudgetLineItem } from "../../types/budget.types";

interface CreateBudgetSummaryCardProps {
	rows: BudgetLineItem[];
}

export function CreateBudgetSummaryCard({
	rows,
}: CreateBudgetSummaryCardProps) {
	const formatCurrency = (val: number) => {
		return val.toLocaleString("sv-SE");
	};

	const { incomeSum, costSum, totalContribution } = useMemo(() => {
		let inc = 0;
		let cost = 0;

		for (const row of rows || []) {
			const isRevenue = row.konto.startsWith("3");
			const rowMonthSum = Object.values(row.months || {}).reduce(
				(acc, v) => acc + (Number(v) || 0),
				0,
			);
			const effective = rowMonthSum !== 0 ? rowMonthSum : Number(row.arsbudget) || 0;

			if (isRevenue) {
				inc += effective;
			} else {
				cost += Math.abs(effective);
			}
		}

		return {
			incomeSum: inc,
			costSum: cost,
			totalContribution: inc - cost,
		};
	}, [rows]);

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
