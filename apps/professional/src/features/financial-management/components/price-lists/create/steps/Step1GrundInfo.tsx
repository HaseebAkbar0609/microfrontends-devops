"use client";

import React from "react";
import type { CreatePriceListFormData } from "../../../../types/priceLists.types";
import type { FormErrors } from "../../../../hooks/useCreatePriceListForm";
import { Step1BasicInfoCard } from "./cards/Step1BasicInfoCard";
import { Step1SettingsCard } from "./cards/Step1SettingsCard";

interface Step1GrundInfoProps {
	readonly formData: CreatePriceListFormData;
	readonly errors: FormErrors;
	readonly onUpdateField: <K extends keyof CreatePriceListFormData>(
		field: K,
		value: CreatePriceListFormData[K],
	) => void;
}

export function Step1GrundInfo({
	formData,
	errors,
	onUpdateField,
}: Step1GrundInfoProps) {
	return (
		<div className="space-y-6">
			{/* Card 1: Grund Information */}
			<Step1BasicInfoCard
				formData={formData}
				errors={errors}
				onUpdateField={onUpdateField}
			/>

			{/* Card 2: Inställning */}
			<Step1SettingsCard
				formData={formData}
				onUpdateField={onUpdateField}
			/>
		</div>
	);
}
