"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { budgetRoutes } from "../../../constants/budget.constants";
import { budgetRepository } from "../../../utils/budgetRepository";
import { BudgetDetailPage } from "../BudgetDetailPage";

export interface BudgetDetailRouteProps {
	id: string;
	/** Which module the screen is mounted in; every link is built from it. */
	basePath?: string;
}

/**
 * The detail screen as a route: the lookup, the not-found state and the way
 * back to the list, so Ekonomi and Prognos share one copy of all three.
 */
export function BudgetDetailRoute({ id, basePath }: BudgetDetailRouteProps) {
	const router = useRouter();
	const routes = budgetRoutes(basePath);
	const item = budgetRepository.getById(id);

	if (!item) {
		return (
			<div className="flex min-h-[400px] flex-col items-center justify-center p-12">
				<p className="mb-2 text-base font-semibold text-slate-800">
					<Translate text={localizationConstants.budgetNotFound} /> (#{id})
				</p>
				<Button
					type="button"
					variant="outline"
					onClick={() => router.push(routes.list)}
					className="cursor-pointer gap-2 text-xs"
				>
					<ArrowLeft className="h-4 w-4" />
					<Translate text={localizationConstants.btnBackToList} />
				</Button>
			</div>
		);
	}

	return (
		<BudgetDetailPage
			item={item}
			basePath={basePath}
			onEdit={(budget) => router.push(routes.edit(budget.id))}
		/>
	);
}

export default BudgetDetailRoute;
