"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CreateBudgetPage, budgetRepository } from "@/features/financial-management";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

function CreateBudgetPageContent() {
	const searchParams = useSearchParams();
	const editId = searchParams.get("id");
	const initialItem = editId ? budgetRepository.getById(editId) : undefined;

	return (
		<CreateBudgetPage
			initialItem={initialItem}
			isEditMode={Boolean(initialItem)}
		/>
	);
}

export default function CreateBudgetRoute() {
	return (
		<Suspense
			fallback={
				<div className="p-6 text-sm text-slate-500">
					<Translate text={localizationConstants.loadingLabel} />
				</div>
			}
		>
			<CreateBudgetPageContent />
		</Suspense>
	);
}
