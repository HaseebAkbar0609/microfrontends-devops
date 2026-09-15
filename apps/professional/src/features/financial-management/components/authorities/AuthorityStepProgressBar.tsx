"use client";

import React from "react";
import { Check } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface AuthorityStepProgressBarProps {
	currentStep: 1 | 2;
	totalSteps?: number;
}

export function AuthorityStepProgressBar({
	currentStep,
	totalSteps = 2,
}: AuthorityStepProgressBarProps) {
	const progressPercent = (currentStep / totalSteps) * 100;

	return (
		<div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
			<div className="flex items-center justify-between">
				<span className="text-xs font-semibold text-slate-800">
					Step {currentStep}/{totalSteps}
				</span>
			</div>

			{/* Progress Bar Track */}
			<div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
				<div
					className="bg-slate-900 h-2 rounded-full transition-all duration-300"
					style={{ width: `${progressPercent}%` }}
				/>
			</div>

			{/* Step List */}
			<div className="space-y-3 pt-2">
				<div className="flex items-center gap-3">
					<div
						className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
							currentStep > 1
								? "bg-emerald-500 text-white"
								: currentStep === 1
									? "bg-slate-900 text-white"
									: "bg-slate-100 text-slate-400"
						}`}
					>
						{currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : "1"}
					</div>
					<div className="text-xs">
						<p
							className={`font-medium ${
								currentStep === 1 ? "text-slate-900 font-semibold" : "text-slate-600"
							}`}
						>
							<Translate text={localizationConstants.tabGrundlaggandeInfo} />
						</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<div
						className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
							currentStep === 2
								? "bg-slate-900 text-white"
								: "bg-slate-100 text-slate-400"
						}`}
					>
						2
					</div>
					<div className="text-xs">
						<p
							className={`font-medium ${
								currentStep === 2 ? "text-slate-900 font-semibold" : "text-slate-400"
							}`}
						>
							<Translate text={localizationConstants.tabDokument} />
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AuthorityStepProgressBar;
