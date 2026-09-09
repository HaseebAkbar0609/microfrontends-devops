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

	return (
		<nav
			aria-label="Create Employee Subnavigation Tabs"
			className="border-b border-slate-200 bg-transparent pt-3"
		>
			<div className="flex items-center gap-6 sm:gap-8 overflow-x-auto pb-0 -mb-[1px] no-scrollbar scroll-smooth">
				{STEPS.map((item) => {
					const isActive = activeStep === item.step;
					return (
						<button
							key={item.step}
							type="button"
							onClick={() => onStepClick(item.step)}
							className={`pb-3 text-sm transition-all border-b-2 whitespace-nowrap cursor-pointer focus:outline-none ${
								isActive
									? "border-slate-900 text-slate-900 font-semibold"
									: "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300 font-normal"
							}`}
							aria-current={isActive ? "step" : undefined}
						>
							{t(localizationConstants[item.labelKey])}
						</button>
					);
				})}
			</div>
		</nav>
	);
}
