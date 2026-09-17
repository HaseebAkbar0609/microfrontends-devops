"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface BudgetBulkActionBarProps {
	selectedCount: number;
	onActivate: () => void;
	onDeactivate: () => void;
}

export function BudgetBulkActionBar({
	selectedCount,
	onActivate,
	onDeactivate,
}: BudgetBulkActionBarProps) {
	return (
		<div className="flex items-center gap-3 pt-3">
			<span className="text-xs text-slate-500 font-medium">
				({selectedCount}{" "}
				<Translate text={localizationConstants.selectedCountLabel} />)
			</span>

			<Button
				type="button"
				variant="outline"
				size="sm"
				disabled={selectedCount === 0}
				onClick={onDeactivate}
				className="h-8 px-3.5 bg-white border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50 cursor-pointer shadow-2xs"
			>
				<Translate text={localizationConstants.btnDeactivateBudget} />
			</Button>

			<Button
				type="button"
				size="sm"
				disabled={selectedCount === 0}
				onClick={onActivate}
				className="h-8 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg disabled:opacity-50 cursor-pointer shadow-2xs"
			>
				<Translate text={localizationConstants.btnActivateBudget} />
			</Button>
		</div>
	);
}
