"use client";

import React from "react";
import { DollarSign, TrendingDown, Wallet, PieChart } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface BudgetKpiCardsProps {
	kpis: {
		totalBudgeted: number;
		actualSpent: number;
		remaining: number;
		utilization: number;
	};
}

export function BudgetKpiCards({ kpis }: BudgetKpiCardsProps) {
	const formatCurrency = (val: number) => {
		return `${val.toLocaleString("sv-SE")} kr`;
	};

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
			{/* Card 1: Total Budgeted */}
			<div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
				<div className="flex items-center justify-between">
					<span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
						<Translate text={localizationConstants.totalBudgetedKpi} />
					</span>
					<div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
						<DollarSign className="w-4 h-4" />
					</div>
				</div>
				<div className="mt-2">
					<span className="text-xl font-bold text-slate-900 font-mono">
						{formatCurrency(kpis.totalBudgeted)}
					</span>
				</div>
			</div>

			{/* Card 2: Actual Spent */}
			<div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
				<div className="flex items-center justify-between">
					<span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
						<Translate text={localizationConstants.actualSpentKpi} />
					</span>
					<div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
						<TrendingDown className="w-4 h-4" />
					</div>
				</div>
				<div className="mt-2">
					<span className="text-xl font-bold text-slate-900 font-mono">
						{formatCurrency(kpis.actualSpent)}
					</span>
				</div>
			</div>

			{/* Card 3: Remaining Budget */}
			<div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
				<div className="flex items-center justify-between">
					<span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
						<Translate text={localizationConstants.remainingBudgetKpi} />
					</span>
					<div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
						<Wallet className="w-4 h-4" />
					</div>
				</div>
				<div className="mt-2">
					<span className="text-xl font-bold text-slate-900 font-mono">
						{formatCurrency(kpis.remaining)}
					</span>
				</div>
			</div>

			{/* Card 4: Utilization % */}
			<div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
				<div className="flex items-center justify-between">
					<span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
						<Translate text={localizationConstants.utilizationKpi} />
					</span>
					<div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
						<PieChart className="w-4 h-4" />
					</div>
				</div>
				<div className="mt-2 flex items-center justify-between">
					<span className="text-xl font-bold text-slate-900 font-mono">
						{kpis.utilization}%
					</span>
					<div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
						<div
							className={`h-full rounded-full transition-all ${
								kpis.utilization > 100
									? "bg-rose-500"
									: kpis.utilization > 80
										? "bg-amber-500"
										: "bg-emerald-500"
							}`}
							style={{ width: `${Math.min(100, kpis.utilization)}%` }}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
