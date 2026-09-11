"use client";

import React from "react";
import { ArrowLeft, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { BUDGETS_BASE_ROUTE } from "../../constants/budget.constants";
import type { EconomyBudgetItem } from "../../types/budget.types";
import { BudgetDetailInfoCard } from "./BudgetDetailInfoCard";
import { BudgetDetailSpreadsheet } from "./BudgetDetailSpreadsheet";
import { BudgetDetailSummaryCard } from "./BudgetDetailSummaryCard";

interface BudgetDetailPageProps {
	item: EconomyBudgetItem;
	onEdit: (item: EconomyBudgetItem) => void;
}

export function BudgetDetailPage({ item, onEdit }: BudgetDetailPageProps) {
	const router = useRouter();

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			{/* Top Header with Back Arrow + #ID */}
			<div className="bg-white border-b border-slate-200 px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={() => router.push(BUDGETS_BASE_ROUTE)}
							className="p-1.5 -ml-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
							aria-label={localizationConstants.backAriaLabel}
						>
							<ArrowLeft className="w-5 h-5" />
						</button>
						<div>
							<h1 className="text-xl font-bold text-slate-900">
								<Translate text={localizationConstants.titleBudgetDetails} />
							</h1>
							<p className="text-xs text-slate-500 font-mono">
								#{item.budgetnr || item.id}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Button
							type="button"
							onClick={() => onEdit(item)}
							className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg shadow-sm gap-1.5 cursor-pointer"
						>
							<Edit2 className="w-3.5 h-3.5" />
							<Translate text={localizationConstants.btnEditBudget} />
						</Button>
					</div>
				</div>

				{/* Tabs: Budget */}
				<div className="flex gap-6 mt-4 -mb-4">
					<button
						type="button"
						className="pb-3 border-b-2 border-slate-900 font-semibold text-sm text-slate-900 cursor-pointer"
					>
						<Translate text={localizationConstants.tabBudget} />
					</button>
				</div>
			</div>

			{/* Main Detail Content */}
			<div className="p-6 max-w-6xl mx-auto w-full space-y-6">
				{/* Card 1: Budget Information */}
				<BudgetDetailInfoCard item={item} onEdit={onEdit} />

				{/* Card 2: Budget 12-Month Spreadsheet */}
				<BudgetDetailSpreadsheet item={item} onEdit={onEdit} />

				{/* Summary Card */}
				<BudgetDetailSummaryCard item={item} />
			</div>
		</div>
	);
}

export default BudgetDetailPage;
