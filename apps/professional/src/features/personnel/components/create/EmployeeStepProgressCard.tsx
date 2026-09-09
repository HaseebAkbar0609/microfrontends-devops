"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import { TOTAL_CREATE_EMPLOYEE_STEPS } from "../../constants/createEmployee.constants";

interface EmployeeStepProgressCardProps {
	activeStep: number;
}

export function EmployeeStepProgressCard({ activeStep }: EmployeeStepProgressCardProps) {
	const { t } = useTranslation();
	const progressPercent = (activeStep / TOTAL_CREATE_EMPLOYEE_STEPS) * 100;
	const label = t(localizationConstants.stepIndicatorLabel, {
		current: activeStep,
		total: TOTAL_CREATE_EMPLOYEE_STEPS,
	});

	return (
		<div className="bg-white border border-slate-200/90 rounded-xl p-4 lg:p-5 shadow-xs">
			<div className="text-sm font-semibold text-slate-900 mb-2.5 lg:mb-3">
				{label}
			</div>
			<div
				className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"
				role="progressbar"
				aria-valuenow={activeStep}
				aria-valuemin={1}
				aria-valuemax={TOTAL_CREATE_EMPLOYEE_STEPS}
				aria-label={label}
			>
				<div
					className="h-full bg-slate-900 rounded-full transition-all duration-300"
					style={{ width: `${progressPercent}%` }}
				/>
			</div>
		</div>
	);
}
