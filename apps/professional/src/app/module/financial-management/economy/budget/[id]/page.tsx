"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import {
	BudgetDetailPage,
	budgetRepository,
	CREATE_BUDGET_ROUTE,
	BUDGETS_BASE_ROUTE,
} from "@/features/financial-management";
import type { EconomyBudgetItem } from "@/features/financial-management";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default function BudgetDetailRoute({ params }: PageProps) {
	const { id } = use(params);
	const router = useRouter();
	const item = budgetRepository.getById(id);

	if (!item) {
		return (
			<div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
				<p className="text-base font-semibold text-slate-800 mb-2">
					<Translate text={localizationConstants.budgetNotFound} /> (#{id})
				</p>
				<Button
					type="button"
					variant="outline"
					onClick={() => router.push(BUDGETS_BASE_ROUTE)}
					className="gap-2 text-xs cursor-pointer"
				>
					<ArrowLeft className="w-4 h-4" />
					<Translate text={localizationConstants.btnBackToList} />
				</Button>
			</div>
		);
	}

	const handleEdit = (budgetItem: EconomyBudgetItem) => {
		router.push(`${CREATE_BUDGET_ROUTE}?id=${budgetItem.id}`);
	};

	return <BudgetDetailPage item={item} onEdit={handleEdit} />;
}
