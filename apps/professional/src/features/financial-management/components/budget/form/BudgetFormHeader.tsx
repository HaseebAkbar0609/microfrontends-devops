"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export interface BudgetFormHeaderProps {
	isEditMode: boolean;
	onBack: () => void;
}

/** The form's top bar: the way back, the title and the single Budget tab. */
export function BudgetFormHeader({ isEditMode, onBack }: BudgetFormHeaderProps) {
	const { t } = useTranslation();

	return (
		<div className="border-b border-slate-200 bg-white px-6 py-4">
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={onBack}
					className="-ml-1.5 cursor-pointer rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
					aria-label={t(localizationConstants.backAriaLabel)}
				>
					<ArrowLeft className="h-5 w-5" />
				</button>
				<h1 className="text-xl font-bold text-slate-900">
					<Translate
						text={
							isEditMode
								? localizationConstants.titleEditBudget
								: localizationConstants.titleNewBudget
						}
					/>
				</h1>
			</div>

			<div className="-mb-4 mt-4 flex gap-6">
				<button
					type="button"
					className="cursor-pointer border-b-2 border-slate-900 pb-3 text-sm font-semibold text-slate-900"
				>
					<Translate text={localizationConstants.tabBudget} />
				</button>
			</div>
		</div>
	);
}

export default BudgetFormHeader;
