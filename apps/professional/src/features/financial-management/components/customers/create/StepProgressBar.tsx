"use client";

import React from "react";

interface StepProgressBarProps {
	currentStep: number;
	totalSteps: number;
	className?: string;
}

export function StepProgressBar({
	currentStep,
	totalSteps,
	className,
}: StepProgressBarProps) {
	const progressPercent = Math.round((currentStep / totalSteps) * 100);

	return (
		<div
			className={`rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-2.5 ${className || ""}`}
		>
			<div className="flex items-center justify-between text-xs font-medium">
				<span className="font-semibold text-slate-900">
					Step {currentStep}/{totalSteps}
				</span>
				<span className="font-normal text-slate-500">{progressPercent}%</span>
			</div>
			<div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
				<div
					className="h-full bg-[#111827] transition-all duration-300 ease-out"
					style={{ width: `${progressPercent}%` }}
				/>
			</div>
		</div>
	);
}
