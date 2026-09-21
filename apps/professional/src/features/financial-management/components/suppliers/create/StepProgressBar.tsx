"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface StepProgressBarProps {
	currentStep: number;
	totalSteps: number;
}

export function SupplierStepProgressBar({ currentStep, totalSteps }: StepProgressBarProps) {
	const progressPercentage = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

	return (
		<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<div className="space-y-2.5">
				<p className="text-xs font-semibold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.supplierStepPrefix} /> {currentStep}/{totalSteps}
				</p>
				<div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
					<div
						className="h-full bg-slate-900 rounded-full transition-all duration-300 ease-in-out"
						style={{ width: `${progressPercentage}%` }}
					/>
				</div>
			</div>
		</div>
	);
}

export { SupplierStepProgressBar as StepProgressBar };

