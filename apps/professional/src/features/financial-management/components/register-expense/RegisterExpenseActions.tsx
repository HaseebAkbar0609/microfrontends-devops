"use client";

import React from "react";
import { Save, PlusCircle, Loader2, Eye } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";

interface RegisterExpenseActionsProps {
	onCancel: () => void;
	onPreview: () => void;
	onSaveAndAdd: () => void;
	onSave: () => void;
	isSaving: boolean;
}

export function RegisterExpenseActions({
	onCancel,
	onPreview,
	onSaveAndAdd,
	onSave,
	isSaving,
}: RegisterExpenseActionsProps) {
	return (
		<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-3 pb-8">
			{/* Cancel Button */}
			<Button
				type="button"
				variant="outline"
				onClick={onCancel}
				disabled={isSaving}
				className="h-9 px-6 text-xs font-normal border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer bg-white rounded-md"
			>
				<Translate text={localizationConstants.registerExpenseBtnCancel} />
			</Button>

			{/* Preview Button */}
			<Button
				type="button"
				variant="outline"
				onClick={onPreview}
				disabled={isSaving}
				className="h-9 px-4 text-xs font-normal border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer bg-white rounded-md gap-1.5"
			>
				<Eye className="h-3.5 w-3.5 text-slate-500" />
				<span>Förhandsgranska</span>
			</Button>

			{/* Save & Add Another Button */}
			<Button
				type="button"
				variant="outline"
				onClick={onSaveAndAdd}
				disabled={isSaving}
				className="h-9 px-5 text-xs font-medium border-slate-300 text-slate-800 hover:bg-slate-50 cursor-pointer bg-white rounded-md gap-1.5"
			>
				{isSaving ? (
					<Loader2 className="h-3.5 w-3.5 animate-spin" />
				) : (
					<PlusCircle className="h-3.5 w-3.5 text-slate-600" />
				)}
				<span>
					<Translate text={localizationConstants.registerExpenseBtnSaveAndAdd} />
				</span>
			</Button>

			{/* Save & Finish Button */}
			<Button
				type="button"
				onClick={onSave}
				disabled={isSaving}
				className="h-9 px-6 text-xs font-medium bg-zinc-950 hover:bg-slate-800 text-white gap-2 shadow-xs cursor-pointer rounded-md transition-colors"
			>
				{isSaving ? (
					<Loader2 className="h-3.5 w-3.5 animate-spin" />
				) : (
					<Save className="h-3.5 w-3.5" />
				)}
				<span>
					<Translate text={localizationConstants.registerExpenseBtnSave} />
				</span>
			</Button>
		</div>
	);
}

export default RegisterExpenseActions;
