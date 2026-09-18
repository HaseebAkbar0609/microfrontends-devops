"use client";

import React from "react";
import { Check } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface StepProgressBarProps {
	currentStep: number;
	totalSteps: number;
	onStepClick?: (step: number) => void;
	className?: string;
}

const STEPS = [
	{ step: 1, title: "Grundläggande info", desc: "Kund, adresser & bank" },
	{ step: 2, title: "Kontakt", desc: "Telefon, e-post & kontaktpersoner" },
	{ step: 3, title: "Bedömning", desc: "Betyg, dokument & anteckningar" },
	{ step: 4, title: "Faktura", desc: "Villkor, bokföring & ROT/RUT" },
];

export function StepProgressBar({
	currentStep,
	totalSteps,
	onStepClick,
	className,
}: StepProgressBarProps) {
	const progressPercent = Math.round((currentStep / totalSteps) * 100);

	return (
		<div className={`rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5 ${className || ""}`}>
			{/* Top row with step count and progress percentage */}
			<div className="flex items-center justify-between">
				<div>
					<span className="text-xs font-semibold text-slate-500">
						<Translate text={localizationConstants.stepLabel} /> {currentStep} av {totalSteps}
					</span>
					<h3 className="text-sm font-bold text-slate-900 mt-0.5">
						{STEPS[currentStep - 1]?.title || `Steg ${currentStep}`}
					</h3>
				</div>
				<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900 text-white">
					{progressPercent}%
				</span>
			</div>

			{/* Progress Bar */}
			<div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
				<div
					className="h-full bg-slate-900 transition-all duration-300 ease-out"
					style={{ width: `${progressPercent}%` }}
				/>
			</div>

			{/* Interactive Step Chips */}
			<div className="grid grid-cols-2 gap-2 sm:grid-cols-4 pt-1">
				{STEPS.map((s) => {
					const isCompleted = s.step < currentStep;
					const isCurrent = s.step === currentStep;

					return (
						<button
							key={s.step}
							type="button"
							onClick={() => onStepClick?.(s.step)}
							className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
								isCurrent
									? "border-slate-900 bg-slate-50 text-slate-900 shadow-2xs font-semibold"
									: isCompleted
										? "border-emerald-200 bg-emerald-50/50 text-emerald-800"
										: "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50/50"
							}`}
						>
							<div
								className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
									isCurrent
										? "bg-slate-900 text-white"
										: isCompleted
											? "bg-emerald-600 text-white"
											: "bg-slate-100 text-slate-600"
								}`}
							>
								{isCompleted ? <Check className="h-3.5 w-3.5" /> : s.step}
							</div>
							<div className="min-w-0 flex-1">
								<div className="truncate text-xs font-semibold leading-tight">{s.title}</div>
								<div className="truncate text-[10px] text-slate-400 hidden sm:block">
									{s.desc}
								</div>
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}
