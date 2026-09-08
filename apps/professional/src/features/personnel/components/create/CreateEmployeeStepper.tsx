"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import { CreateEmployeeStep } from "../../types/createEmployee.types";

interface CreateEmployeeStepperProps {
	activeStep: CreateEmployeeStep;
	onStepClick: (step: CreateEmployeeStep) => void;
}

interface StepItem {
	step: CreateEmployeeStep;
	labelKey: keyof typeof localizationConstants;
}

const STEPS: StepItem[] = [
	{ step: 1, labelKey: "tabInformation" },
	{ step: 2, labelKey: "tabContactPerson" },
	{ step: 3, labelKey: "tabEmploymentTerms" },
	{ step: 4, labelKey: "tabCompetence" },
	{ step: 5, labelKey: "tabDocuments" },
];

export function CreateEmployeeStepper({
	activeStep,
	onStepClick,
}: CreateEmployeeStepperProps) {
	const { t } = useTranslation();

	const progressPercentage = (activeStep / STEPS.length) * 100;
	const stepText = t(localizationConstants.stepIndicatorLabel)
		.replace("{current}", String(activeStep))
		.replace("{total}", String(STEPS.length));

	return (
		<nav
			aria-label="Create Employee Steps"
			className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 bg-white px-2 pt-2 gap-4"
		>
			{/* Horizontal Tab Items */}
			<div className="flex items-center gap-6 overflow-x-auto pb-0 -mb-[1px]">
				{STEPS.map((item) => {
					const isActive = activeStep === item.step;
					return (
						<button
							key={item.step}
							type="button"
							onClick={() => onStepClick(item.step)}
							className={`pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
								isActive
									? "border-slate-900 text-slate-900 font-semibold"
									: "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
							}`}
							aria-current={isActive ? "step" : undefined}
						>
							{t(localizationConstants[item.labelKey])}
						</button>
					);
				})}
			</div>

			{/* Progress Indicator */}
			<div className="flex items-center gap-3 pb-3 shrink-0">
				<span className="text-xs font-semibold text-slate-600">
					{stepText}
				</span>
				<div
					className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200"
					role="progressbar"
					aria-valuenow={activeStep}
					aria-valuemin={1}
					aria-valuemax={STEPS.length}
					aria-label={stepText}
				>
					<div
						className="h-full bg-slate-900 transition-all duration-300 rounded-full"
						style={{ width: `${progressPercentage}%` }}
					/>
				</div>
			</div>
		</nav>
	);
}
