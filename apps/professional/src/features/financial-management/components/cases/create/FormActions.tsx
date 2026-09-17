"use client";

import React from "react";
import { Save, ArrowRight } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface FormActionsProps {
	activeTab: "basic_info" | "documents";
	isSubmitting?: boolean;
	onCancel: () => void;
	onSave: () => void;
	onNext: () => void;
}

export function FormActions({
	activeTab,
	isSubmitting,
	onCancel,
	onSave,
	onNext,
}: FormActionsProps) {
	return (
		<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
			<button
				type="button"
				onClick={onCancel}
				className="h-9 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
			>
				<Translate text={localizationConstants.casesBtnCancel} />
			</button>

			<button
				type="button"
				onClick={onSave}
				disabled={isSubmitting}
				className="h-9 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
			>
				<Save className="w-3.5 h-3.5" />
				<Translate text={localizationConstants.casesBtnSave} />
			</button>

			<button
				type="button"
				onClick={onNext}
				disabled={isSubmitting}
				className="h-9 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
			>
				<span>
					{activeTab === "basic_info" ? (
						<Translate text={localizationConstants.casesBtnNext} />
					) : (
						<Translate text={localizationConstants.casesCreateButton} />
					)}
				</span>
				<ArrowRight className="w-3.5 h-3.5" />
			</button>
		</div>
	);
}

export default FormActions;
