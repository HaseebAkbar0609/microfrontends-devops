"use client";

import React, { useMemo } from "react";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { BudgetLineItem } from "../../types/budget.types";
import { formatNumber } from "../../utils/economyFormatters";

export interface BudgetSummaryCardProps {
	rows: BudgetLineItem[];
}

/**
 * What the rows add up to: revenue accounts (3xxx) against everything else.
 * A budget with no rows reads zero — the figures are never invented.
 */
export function BudgetSummaryCard({ rows }: BudgetSummaryCardProps) {
	const { incomeSum, costSum, totalContribution } = useMemo(() => {
		let income = 0;
		let cost = 0;

		for (const row of rows ?? []) {
			const monthSum = Object.values(row.months ?? {}).reduce(
				(total, value) => total + (Number(value) || 0),
				0,
			);
			/* A row that has not been spread across the months still counts its year. */
			const effective = monthSum !== 0 ? monthSum : Number(row.arsbudget) || 0;

			if (row.konto.startsWith("3")) {
				income += effective;
			} else {
				cost += Math.abs(effective);
			}
		}

		return { incomeSum: income, costSum: cost, totalContribution: income - cost };
	}, [rows]);

	return (
		<div className="flex justify-end">
			<div className="w-full max-w-xs space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
				<div className="flex items-center justify-between text-sm">
					<span className="font-medium text-slate-600">
						<Translate text={localizationConstants.summaryIncome} />
					</span>
					<span className="font-mono font-semibold text-slate-900">{formatNumber(incomeSum)}</span>
				</div>

				<div className="flex items-center justify-between text-sm">
					<span className="font-medium text-slate-600">
						<Translate text={localizationConstants.summaryCosts} />
					</span>
					<span className="font-mono font-semibold text-slate-900">
						{costSum === 0 ? formatNumber(0) : `-${formatNumber(costSum)}`}
					</span>
				</div>

				<div className="flex items-center justify-between border-t border-slate-200 pt-3">
					<span className="text-sm font-bold text-slate-900">
						<Translate text={localizationConstants.summaryTotalContribution} />
					</span>
					<span className="font-mono text-base font-bold text-slate-900">
						{formatNumber(totalContribution)}
					</span>
				</div>
			</div>
		</div>
	);
}

export default BudgetSummaryCard;
