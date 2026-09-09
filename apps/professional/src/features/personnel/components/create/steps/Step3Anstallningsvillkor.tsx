"use client";

import React from "react";
import {
	WorkInfoForm,
	SalaryCompensationForm,
	WorkingHoursForm,
	HealthSupportForm,
} from "@/features/personnel/types/createEmployee.types";
import { WorkInfoCard } from "./step3/WorkInfoCard";
import { SalaryCard } from "./step3/SalaryCard";
import { WorkHoursCard } from "./step3/WorkHoursCard";
import { HealthBenefitCard } from "./step3/HealthBenefitCard";

interface Step3AnstallningsvillkorProps {
	workInfo: WorkInfoForm;
	salaryCompensation: SalaryCompensationForm;
	workingHours: WorkingHoursForm;
	healthSupport: HealthSupportForm;
	onUpdateWorkInfo: (field: keyof WorkInfoForm, value: string) => void;
	onUpdateSalaryCompensation: <K extends keyof SalaryCompensationForm>(
		field: K,
		value: SalaryCompensationForm[K]
	) => void;
	onUpdateWorkingHours: (field: keyof WorkingHoursForm, value: string) => void;
	onUpdateHealthSupport: <K extends keyof HealthSupportForm>(
		field: K,
		value: HealthSupportForm[K]
	) => void;
}

export function Step3Anstallningsvillkor({
	workInfo,
	salaryCompensation,
	workingHours,
	healthSupport,
	onUpdateWorkInfo,
	onUpdateSalaryCompensation,
	onUpdateWorkingHours,
	onUpdateHealthSupport,
}: Step3AnstallningsvillkorProps) {
	return (
		<div className="space-y-6">
			<WorkInfoCard
				data={workInfo}
				onChange={onUpdateWorkInfo}
			/>

			<SalaryCard
				data={salaryCompensation}
				onChange={onUpdateSalaryCompensation}
			/>

			<WorkHoursCard
				data={workingHours}
				onChange={onUpdateWorkingHours}
			/>

			<HealthBenefitCard
				data={healthSupport}
				onChange={onUpdateHealthSupport}
			/>
		</div>
	);
}
