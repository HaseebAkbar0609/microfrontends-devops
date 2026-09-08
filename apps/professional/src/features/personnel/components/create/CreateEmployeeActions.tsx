"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, ArrowLeft } from "lucide-react";
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
		<footer className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 bg-white border-t border-slate-200 mt-6 rounded-b-xl">
			{/* Left: Cancel */}
			<Button
				type="button"
				variant="outline"
				onClick={onCancel}
				className="w-full sm:w-auto text-slate-700 hover:text-red-600 hover:bg-red-50 border-slate-200"
			>
				{t(localizationConstants.btnCancel)}
			</Button>

			{/* Right: Previous / Save / Next */}
			<div className="flex items-center gap-3 w-full sm:w-auto justify-end">
				{activeStep > 1 && (
					<Button
						type="button"
						variant="outline"
						onClick={onPrev}
						className="border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-2"
					>
						<ArrowLeft className="h-4 w-4" />
						{t(localizationConstants.btnPrevious)}
					</Button>
				)}

				<Button
					type="button"
					variant="outline"
					onClick={onSave}
					className="border-slate-200 text-slate-800 font-medium hover:bg-slate-100"
				>
					{t(localizationConstants.btnSave)}
				</Button>

				{activeStep < 5 ? (
					<Button
						type="button"
						onClick={onNext}
						className="bg-slate-900 text-white hover:bg-slate-800 font-medium flex items-center gap-2"
					>
						{t(localizationConstants.btnNext)}
						<ArrowRight className="h-4 w-4" />
					</Button>
				) : (
					<Button
						type="button"
						onClick={onSave}
						className="bg-slate-900 text-white hover:bg-slate-800 font-medium flex items-center gap-2"
					>
						{t(localizationConstants.btnSave)}
						<ArrowRight className="h-4 w-4" />
					</Button>
				)}
			</div>
		</footer>
	);
}
