"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import {
	PersonalInfoForm,
	BankInfoForm,
	TaxUnionForm,
	WorkDutiesForm,
} from "@/features/personnel/types/createEmployee.types";
import { PersonalInfoCard } from "./step1/PersonalInfoCard";
import { BankInfoCard } from "./step1/BankInfoCard";
import { TaxUnionCard } from "./step1/TaxUnionCard";
import { WorkDutiesCard } from "./step1/WorkDutiesCard";

interface Step1GrundinformationProps {
	personalInfo: PersonalInfoForm;
	bankInfo: BankInfoForm;
	taxUnion: TaxUnionForm;
	workDuties: WorkDutiesForm;
	validationError: string | null;
	fieldErrors?: Record<string, string>;
	onUpdatePersonalInfo: (field: keyof PersonalInfoForm, value: string) => void;
	onUpdateBankInfo: (field: keyof BankInfoForm, value: string) => void;
	onUpdateTaxUnion: (field: keyof TaxUnionForm, value: string) => void;
	onUpdateWorkDuties: (field: keyof WorkDutiesForm, value: string) => void;
}

export function Step1Grundinformation({
	personalInfo,
	bankInfo,
	taxUnion,
	workDuties,
	validationError,
	fieldErrors,
	onUpdatePersonalInfo,
	onUpdateBankInfo,
	onUpdateTaxUnion,
	onUpdateWorkDuties,
}: Step1GrundinformationProps) {
	return (
		<div className="space-y-6">
			{validationError && (
				<div
					role="alert"
					className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm"
				>
					<AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
					<span>{validationError}</span>
				</div>
			)}

			<PersonalInfoCard
				data={personalInfo}
				fieldErrors={fieldErrors}
				onChange={onUpdatePersonalInfo}
			/>

			<BankInfoCard
				data={bankInfo}
				onChange={onUpdateBankInfo}
			/>

			<TaxUnionCard
				data={taxUnion}
				onChange={onUpdateTaxUnion}
			/>

			<WorkDutiesCard
				data={workDuties}
				fieldErrors={fieldErrors}
				onChange={onUpdateWorkDuties}
			/>
		</div>
	);
}
