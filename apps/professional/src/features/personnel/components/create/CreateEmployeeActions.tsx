"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, ArrowLeft, Save } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { CreateEmployeeStep } from "../../types/createEmployee.types";

interface CreateEmployeeActionsProps {
	activeStep: CreateEmployeeStep;
	onCancel: () => void;
	onSave: () => void;
	onPrev: () => void;
	onNext: () => void;
}

export function CreateEmployeeActions({
	activeStep,
	onCancel,
	onSave,
	onPrev,
	onNext,
}: CreateEmployeeActionsProps) {
	const { t } = useTranslation();

	return (
		<footer className="flex flex-wrap items-center justify-end gap-3 pt-6 pb-12 border-t border-slate-200 mt-8">
			{/* Optional Previous button when step > 1 */}
			{activeStep > 1 && (
				<Button
					type="button"
					variant="outline"
					onClick={onPrev}
					className="h-10 px-5 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-lg text-sm flex items-center gap-1.5 shadow-2xs"
				>
					<ArrowLeft className="h-4 w-4" />
					{t(localizationConstants.btnPrevious)}
				</Button>
			)}

			{/* Avbryt (Cancel) */}
			<Button
				type="button"
				variant="outline"
				onClick={onCancel}
				className="h-10 px-6 bg-white border-slate-200 text-slate-800 hover:bg-slate-50 font-medium rounded-lg text-sm shadow-2xs"
			>
				{t(localizationConstants.btnCancel)}
			</Button>

			{/* Spara (Save) */}
			<Button
				type="button"
				onClick={onSave}
				className="h-10 px-6 bg-slate-900 text-white hover:bg-slate-800 font-medium rounded-lg text-sm flex items-center gap-2 shadow-xs"
			>
				<Save className="h-4 w-4" />
				{t(localizationConstants.btnSave)}
			</Button>

			{/* Nästa (Next) or Slutför */}
			{activeStep < 5 ? (
				<Button
					type="button"
					onClick={onNext}
					className="h-10 px-6 bg-slate-900 text-white hover:bg-slate-800 font-medium rounded-lg text-sm flex items-center gap-2 shadow-xs"
				>
					{t(localizationConstants.btnNext)}
					<ArrowRight className="h-4 w-4" />
				</Button>
			) : (
				<Button
					type="button"
					onClick={onSave}
					className="h-10 px-6 bg-slate-900 text-white hover:bg-slate-800 font-medium rounded-lg text-sm flex items-center gap-2 shadow-xs"
				>
					{t(localizationConstants.btnSave)}
					<ArrowRight className="h-4 w-4" />
				</Button>
			)}
		</footer>
	);
}
