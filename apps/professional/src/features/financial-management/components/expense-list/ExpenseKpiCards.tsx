"use client";

import React, { useMemo } from "react";
import { CreditCard, Clock, Calendar, PieChart } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ExpenseSummaryStats } from "../../types/expense.types";
import { DEFAULT_ANNUAL_EXPENSE_BUDGET } from "../../constants/expense.constants";

interface ExpenseKpiCardsProps {
	stats: ExpenseSummaryStats;
}

function formatSEK(num: number): string {
	return num.toLocaleString("sv-SE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function ExpenseKpiCards({ stats }: ExpenseKpiCardsProps) {
	// Dynamically format current period (Standard #1 - Zero Hardcoding)
	const currentPeriodLabel = useMemo(() => {
		const now = new Date();
		const month = String(now.getMonth() + 1).padStart(2, "0");
		return `${now.getFullYear()}-${month}`;
	}, []);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
			{/* Card 1: Total Expenses */}
			<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
				<div className="flex items-center justify-between">
					<span className="text-xs font-medium text-slate-500">
						<Translate text={localizationConstants.expenseKpiTotalExpenses} />
					</span>
					<div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
						<CreditCard className="h-4 w-4" />
					</div>
				</div>
				<div className="mt-2">
					<p className="text-xl font-bold text-slate-900 tracking-tight">
						{formatSEK(stats.totalExpenses)} SEK
					</p>
					<p className="text-[11px] text-slate-400 mt-0.5">
						<Translate text={localizationConstants.expenseKpiAccumulatedYear} />
					</p>
				</div>
			</div>

			{/* Card 2: Pending Approval */}
			<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
				<div className="flex items-center justify-between">
					<span className="text-xs font-medium text-slate-500">
						<Translate text={localizationConstants.expenseKpiPendingApproval} />
					</span>
					<div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
						<Clock className="h-4 w-4" />
					</div>
				</div>
				<div className="mt-2">
					<p className="text-xl font-bold text-amber-600 tracking-tight">
						{formatSEK(stats.pendingApprovalAmount)} SEK
					</p>
					<p className="text-[11px] text-amber-600/80 font-medium mt-0.5">
						{stats.pendingApprovalCount} <Translate text={localizationConstants.expenseKpiItemsPending} />
					</p>
				</div>
			</div>

			{/* Card 3: This Month */}
			<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
				<div className="flex items-center justify-between">
					<span className="text-xs font-medium text-slate-500">
						<Translate text={localizationConstants.expenseKpiThisMonth} />
					</span>
					<div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
						<Calendar className="h-4 w-4" />
					</div>
				</div>
				<div className="mt-2">
					<p className="text-xl font-bold text-slate-900 tracking-tight">
						{formatSEK(stats.thisMonthAmount)} SEK
					</p>
					<p className="text-[11px] text-slate-400 mt-0.5">
						{currentPeriodLabel}
					</p>
				</div>
			</div>

			{/* Card 4: Budget Utilization */}
			<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
				<div className="flex items-center justify-between">
					<span className="text-xs font-medium text-slate-500">
						<Translate text={localizationConstants.expenseKpiBudgetUtilization} />
					</span>
					<div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
						<PieChart className="h-4 w-4" />
					</div>
				</div>
				<div className="mt-2">
					<div className="flex items-baseline justify-between">
						<p className="text-xl font-bold text-slate-900 tracking-tight">
							{stats.budgetUtilizationPercentage} %
						</p>
						<span className="text-[10px] text-slate-400 font-medium">
							<Translate text={localizationConstants.expensePaginationOf} /> {DEFAULT_ANNUAL_EXPENSE_BUDGET / 1000000} Mkr
						</span>
					</div>
					<div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
						<div
							className={`h-full rounded-full transition-all duration-300 ${
								stats.budgetUtilizationPercentage > 90
									? "bg-rose-500"
									: stats.budgetUtilizationPercentage > 75
										? "bg-amber-500"
										: "bg-emerald-500"
							}`}
							style={{ width: `${Math.min(100, stats.budgetUtilizationPercentage)}%` }}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ExpenseKpiCards;
