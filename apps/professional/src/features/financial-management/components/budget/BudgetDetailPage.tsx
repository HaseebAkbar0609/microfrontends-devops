"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { budgetRoutes } from "../../constants/budget.constants";
import type { EconomyBudgetItem } from "../../types/budget.types";
import { BudgetDetailInfoCard } from "./BudgetDetailInfoCard";
import { BudgetDetailSpreadsheet } from "./BudgetDetailSpreadsheet";
import { BudgetSummaryCard } from "./BudgetSummaryCard";

export interface BudgetDetailPageProps {
	item: EconomyBudgetItem;
	onEdit: (item: EconomyBudgetItem) => void;
	/** Which module the screen is mounted in; the way back is built from it. */
	basePath?: string;
}

export function BudgetDetailPage({ item, onEdit, basePath }: BudgetDetailPageProps) {
	const router = useRouter();
	const { t } = useTranslation();
	const routes = budgetRoutes(basePath);

	return (
		<div className="flex min-h-screen min-w-0 flex-1 flex-col bg-slate-50/50">
			{/* Top Header with Back Arrow + #ID. Editing is offered on each card,
			    where it says what it will edit. */}
			<div className="border-b border-slate-200 bg-white px-6 py-4">
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={() => router.push(routes.list)}
						className="-ml-1.5 cursor-pointer rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
						aria-label={t(localizationConstants.backAriaLabel)}
					>
						<ArrowLeft className="h-5 w-5" />
					</button>
					<div>
						<h1 className="text-xl font-bold text-slate-900">
							<Translate text={localizationConstants.titleBudgetDetails} />
						</h1>
						<p className="font-mono text-xs text-slate-500">#{item.budgetnr || item.id}</p>
					</div>
				</div>

				{/* Tabs: Budget */}
				<div className="-mb-4 mt-4 flex gap-6">
					<button
						type="button"
						className="cursor-pointer border-b-2 border-slate-900 pb-3 text-sm font-semibold text-slate-900"
					>
						<Translate text={localizationConstants.tabBudget} />
					</button>
				</div>
			</div>

			{/* Main Detail Content */}
			<div className="mx-auto w-full min-w-0 max-w-6xl space-y-6 p-6">
				<BudgetDetailInfoCard item={item} onEdit={onEdit} />
				<BudgetDetailSpreadsheet item={item} onEdit={onEdit} />
				<BudgetSummaryCard rows={item.rows ?? []} />
			</div>
		</div>
	);
}

export default BudgetDetailPage;
