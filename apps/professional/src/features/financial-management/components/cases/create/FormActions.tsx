"use client";

import React from "react";
import { Save, ArrowRight, ArrowLeft } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface FormActionsProps {
	activeTab: "basic_info" | "documents";
	isSubmitting?: boolean;
	isEditMode?: boolean;
	onCancel: () => void;
	onPrevious: () => void;
	onSave: () => void;
	onNext: () => void;
}

export function FormActions({
	activeTab,
	isSubmitting,
	isEditMode,
	onCancel,
	onPrevious,
	onSave,
	onNext,
}: FormActionsProps) {
	return (
		<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-200">
			{/* Left side: Cancel & Previous buttons */}
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={onCancel}
					className="h-9 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
				>
					<Translate text={localizationConstants.casesBtnCancel} />
				</button>

				{activeTab === "documents" && (
					<button
						type="button"
						onClick={onPrevious}
						className="h-9 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
					>
						<ArrowLeft className="w-3.5 h-3.5" />
						<Translate text={localizationConstants.casesBtnPrevious} />
					</button>
				)}
			</div>

			{/* Right side: Next on tab 1, or single primary submit on tab 2 */}
			<div className="flex items-center justify-end gap-3">
				{activeTab === "basic_info" ? (
					<>
						<button
							type="button"
							onClick={onSave}
							disabled={isSubmitting}
							className="h-9 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
						>
							<Save className="w-3.5 h-3.5" />
							<Translate text={localizationConstants.casesBtnSave} />
						</button>

						<button
							type="button"
							onClick={onNext}
							disabled={isSubmitting}
							className="h-9 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
						>
							<span>
								<Translate text={localizationConstants.casesBtnNext} />
							</span>
							<ArrowRight className="w-3.5 h-3.5" />
						</button>
					</>
				) : (
					<button
						type="button"
						onClick={onSave}
						disabled={isSubmitting}
						className="h-9 px-5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
					>
						<Save className="w-3.5 h-3.5" />
						<span>
							{isEditMode ? (
								<Translate text={localizationConstants.casesBtnSaveChanges} />
							) : (
								<Translate text={localizationConstants.casesCreateButton} />
							)}
						</span>
					</button>
				)}
			</div>
		</div>
	);
}

export default FormActions;
