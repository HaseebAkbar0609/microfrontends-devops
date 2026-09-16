"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface StepProgressCardProps {
	currentStep: 1 | 2;
}

export function StepProgressCard({ currentStep }: StepProgressCardProps) {
	return (
		<div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs sticky top-6">
			<div className="text-xs font-semibold text-slate-800">
				{currentStep === 1 ? (
					<Translate text={localizationConstants.claimsStep1Of2} />
				) : (
					<Translate text={localizationConstants.claimsStep2Of2} />
				)}
			</div>
			<div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-3">
				<div
					className="bg-slate-950 h-full rounded-full transition-all duration-300"
					style={{ width: currentStep === 1 ? "50%" : "100%" }}
				/>
			</div>
		</div>
	);
}

export default StepProgressCard;
