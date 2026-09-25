"use client";

import React from "react";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export interface BudgetFormFooterProps {
	onCancel: () => void;
	isSubmitting: boolean;
}

/**
 * Avbryt and Spara, once. They stay on screen because the month grid is long
 * enough to push a static footer well out of sight.
 */
export function BudgetFormFooter({ onCancel, isSubmitting }: BudgetFormFooterProps) {
	return (
		<div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-3">
			<Button
				type="button"
				variant="outline"
				onClick={onCancel}
				className="h-10 cursor-pointer border-slate-200 px-5 text-sm font-medium text-slate-700 hover:bg-slate-50"
			>
				<Translate text={localizationConstants.btnCancelBudget} />
			</Button>

			<Button
				type="submit"
				disabled={isSubmitting}
				className="h-10 cursor-pointer gap-2 rounded-lg bg-slate-900 px-6 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
			>
				<Save className="h-4 w-4" />
				<Translate text={localizationConstants.btnSaveBudget} />
			</Button>
		</div>
	);
}

export default BudgetFormFooter;
