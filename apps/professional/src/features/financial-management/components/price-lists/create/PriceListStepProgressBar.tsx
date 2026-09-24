"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface PriceListStepProgressBarProps {
	readonly currentStep: number;
	readonly totalSteps?: number;
}

export function PriceListStepProgressBar({
	currentStep,
	totalSteps = 2,
}: PriceListStepProgressBarProps) {
	const progressPercent = Math.round((currentStep / totalSteps) * 100);

	return (
		<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-2.5">
			<div className="flex items-center justify-between text-xs">
				<span className="font-semibold text-slate-900">
					<Translate text={localizationConstants.stepLabel} /> {currentStep}/{totalSteps}
				</span>
			</div>
			<div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
				<div
					className="h-full bg-[#111827] transition-all duration-300 ease-out rounded-full"
					style={{ width: `${progressPercent}%` }}
				/>
			</div>
		</div>
	);
}
