"use client";

import type { UseFormReturn } from "react-hook-form";

import { FormDatePicker, FormInput, FormSelect } from "@/components/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	DEPARTMENT_OPTIONS,
	PROJECT_CATEGORY_OPTIONS,
	PROJECT_TYPE_OPTIONS,
} from "../data/projectCreate.config";
import type { CreateProjectFormData } from "../types";
import { LinkedProjectCard } from "../components/LinkedProjectCard";

export interface Step2ProjectInfoProps {
	form: UseFormReturn<CreateProjectFormData>;
}

/** A titled card, matching the grey-headed cards the frames draw. */
function SectionCard({
	titleKey,
	children,
}: {
	titleKey: TranslationKeys;
	children: React.ReactNode;
}) {
	return (
		<Card className="rounded-lg border border-slate-200 bg-white shadow-none">
			<CardHeader className="border-b border-slate-200 px-6 py-4">
				<CardTitle className="text-base font-medium text-slate-900">
					<Translate text={titleKey} />
				</CardTitle>
			</CardHeader>
			<CardContent className="grid grid-cols-1 gap-x-8 gap-y-4 p-6 sm:grid-cols-2">
				{children}
			</CardContent>
		</Card>
	);
}

/** Projekt, Koppla projekt and Projekt Information. */
export function Step2ProjectInfo({ form }: Step2ProjectInfoProps) {
	const t = useTranslate();
	const { control, watch } = form;

	const toOptions = (values: string[]) =>
		values.map((value) => ({ value, label: value }));

	return (
		<div className="space-y-4">
			<SectionCard titleKey={localizationConstants.projectLabel}>
				<FormInput
					control={control}
					name="details.projectNo"
					label={localizationConstants.projectNumberLabel}
					required
					placeholder={localizationConstants.projectNumberLabel}
					translateError={(message) => t(message as TranslationKeys)}
				/>
				<FormInput
					control={control}
					name="details.projectName"
					label={localizationConstants.projectNameLabel}
					required
					placeholder={localizationConstants.projectNameLabel}
					translateError={(message) => t(message as TranslationKeys)}
				/>
				<FormInput
					control={control}
					name="details.blockName"
					label={localizationConstants.orderBlockNameLabel}
					placeholder={localizationConstants.orderBlockNameLabel}
					translateError={(message) => t(message as TranslationKeys)}
				/>
				<FormInput
					control={control}
					name="details.projectAddress"
					label={localizationConstants.agreementAddress}
					placeholder={localizationConstants.agreementAddress}
					translateError={(message) => t(message as TranslationKeys)}
				/>
				<FormInput
					control={control}
					name="details.postalCode"
					label={localizationConstants.orderPostNrLabel}
					placeholder={localizationConstants.orderPostNrLabel}
					translateError={(message) => t(message as TranslationKeys)}
				/>
				<FormInput
					control={control}
					name="details.city"
					label={localizationConstants.orderCityLabel}
					placeholder={localizationConstants.orderCityLabel}
					translateError={(message) => t(message as TranslationKeys)}
				/>
			</SectionCard>

			<LinkedProjectCard form={form} />

			<SectionCard titleKey={localizationConstants.projectCreateInfoSection}>
				<FormSelect
					control={control}
					name="details.type"
					label={localizationConstants.orderTypLabel}
					placeholder={localizationConstants.orderTypLabel}
					options={toOptions(PROJECT_TYPE_OPTIONS)}
				/>
				<FormSelect
					control={control}
					name="details.category"
					label={localizationConstants.orderKategoriLabel}
					placeholder={localizationConstants.orderKategoriLabel}
					options={toOptions(PROJECT_CATEGORY_OPTIONS)}
				/>
				<FormSelect
					control={control}
					name="details.department"
					label={localizationConstants.orderAvdelningLabel}
					placeholder={localizationConstants.orderAvdelningLabel}
					options={toOptions(DEPARTMENT_OPTIONS)}
				/>
				<FormInput
					control={control}
					name="details.contractSum"
					label={localizationConstants.orderKontraktsummaLabel}
					placeholder={localizationConstants.orderKontraktsummaLabel}
					translateError={(message) => t(message as TranslationKeys)}
				/>
				<FormInput
					control={control}
					name="details.offerNo"
					label={localizationConstants.orderOffertNrLabel}
					placeholder={localizationConstants.orderOffertNrLabel}
					translateError={(message) => t(message as TranslationKeys)}
				/>
				<FormDatePicker
					control={control}
					name="details.startDate"
					label={localizationConstants.orderStartDatumLabel}
					placeholder={localizationConstants.placeholderEnterStartDate}
					translateError={(message) => t(message as TranslationKeys)}
				/>
				{/* The end date is also guarded in the schema — this field is
				    typeable, so the picker's limit alone is not enough. */}
				<FormDatePicker
					control={control}
					name="details.endDate"
					label={localizationConstants.orderSlutDatumLabel}
					placeholder={localizationConstants.placeholderEnterEndDate}
					minDate={watch("details.startDate")}
					translateError={(message) => t(message as TranslationKeys)}
				/>
			</SectionCard>
		</div>
	);
}

export default Step2ProjectInfo;
