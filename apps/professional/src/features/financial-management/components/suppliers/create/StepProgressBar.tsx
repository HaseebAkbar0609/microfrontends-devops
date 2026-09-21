"use client";

import React from "react";
import { Check } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface StepProgressBarProps {
	currentStep: number;
	totalSteps: number;
}

const STEPS: { step: number; labelKey: keyof typeof localizationConstants }[] = [
	{ step: 1, labelKey: "supplierTabBasicInfo" },
	{ step: 2, labelKey: "supplierTabContact" },
	{ step: 3, labelKey: "supplierTabAssessment" },
];

export function SupplierStepProgressBar({ currentStep }: StepProgressBarProps) {
	return (
		<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-6">
			<div className="space-y-4">
				{STEPS.map((s) => {
					const isCompleted = s.step < currentStep;
					const isCurrent = s.step === currentStep;

					return (
						<div key={s.step} className="flex items-center gap-3">
							<div
								className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
									isCompleted
										? "bg-slate-900 text-white"
										: isCurrent
											? "border-2 border-slate-900 text-slate-900 bg-white"
											: "border border-slate-200 text-slate-400 bg-slate-50"
								}`}
							>
								{isCompleted ? <Check className="h-3.5 w-3.5" /> : s.step}
							</div>
							<span
								className={`text-xs font-medium ${
									isCurrent || isCompleted ? "text-slate-900 font-semibold" : "text-slate-400"
								}`}
							>
								<Translate text={localizationConstants[s.labelKey]} />
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export { SupplierStepProgressBar as StepProgressBar };

