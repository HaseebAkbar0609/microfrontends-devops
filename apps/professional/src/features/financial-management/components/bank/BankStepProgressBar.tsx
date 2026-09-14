"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export interface BankStepProgressBarProps {
	currentStep: 1 | 2;
	totalSteps?: number;
}

export function BankStepProgressBar({
	currentStep,
	totalSteps = 2,
}: BankStepProgressBarProps) {
	const progressPercent = (currentStep / totalSteps) * 100;

	return (
		<div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
			<div className="flex items-center justify-between mb-2">
				<span className="text-xs font-semibold text-slate-800">
					<Translate
						text={
							currentStep === 1
								? localizationConstants.step1Of2
								: localizationConstants.step2Of2
						}
					/>
				</span>
			</div>
			<div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
				<div
					className="bg-slate-900 h-full rounded-full transition-all duration-300"
					style={{ width: `${progressPercent}%` }}
				/>
			</div>
		</div>
	);
}

export default BankStepProgressBar;
