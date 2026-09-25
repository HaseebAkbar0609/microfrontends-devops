"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { budgetRepository } from "../../../utils/budgetRepository";
import { CreateBudgetPage } from "../CreateBudgetPage";

export interface BudgetCreateRouteProps {
	/** Which module the screen is mounted in; every link is built from it. */
	basePath?: string;
}

/** `?id=` turns the create screen into the edit screen, as both modules mount it. */
function BudgetCreateRouteContent({ basePath }: BudgetCreateRouteProps) {
	const searchParams = useSearchParams();
	const editId = searchParams.get("id");
	const initialItem = editId ? budgetRepository.getById(editId) : undefined;

	return (
		<CreateBudgetPage
			initialItem={initialItem}
			isEditMode={Boolean(initialItem)}
			basePath={basePath}
		/>
	);
}

/** `useSearchParams` needs a Suspense boundary of its own. */
export function BudgetCreateRoute({ basePath }: BudgetCreateRouteProps) {
	return (
		<Suspense
			fallback={
				<div className="p-6 text-sm text-slate-500">
					<Translate text={localizationConstants.loadingLabel} />
				</div>
			}
		>
			<BudgetCreateRouteContent basePath={basePath} />
		</Suspense>
	);
}

export default BudgetCreateRoute;
