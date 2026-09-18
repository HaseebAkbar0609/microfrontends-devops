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
		<div className={`w-48 space-y-1.5 ${className || ""}`}>
			<div className="flex items-center justify-between text-xs font-semibold">
				<span className="text-slate-800">Step {currentStep}/{totalSteps}</span>
				<span className="text-slate-500 font-normal">{progressPercent}%</span>
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
