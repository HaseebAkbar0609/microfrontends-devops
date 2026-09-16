"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import { FormInput, PhoneInput, SearchableSelect } from "@/components/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ORGANISATION_OPTIONS } from "../data/projectCreateOptions.mock";
import type { CreateProjectFormData } from "../types";

export interface OrganisationDetailsCardProps {
	form: UseFormReturn<CreateProjectFormData>;
	/** Right-aligned header slot — the frame's "+ Ändra /Lägg till". */
	action?: React.ReactNode;
}

/**
 * The Organisation card: which company, and how to reach it.
 *
 * The company field's label is the contractor type chosen a card above — the
 * frame heads it "Elektriker" once that is the type — falling back to the
 * section name while nothing is chosen.
 */
export function OrganisationDetailsCard({
	form,
	action,
}: OrganisationDetailsCardProps) {
	const t = useTranslate();
	const { control, watch, formState } = form;
	const contractorType = watch("organisation.contractorType");

	const textField = (
		name: "address" | "postalCode" | "city" | "email",
		labelKey: TranslationKeys,
	) => (
		<FormInput
			control={control}
			name={`organisation.${name}` as const}
			label={labelKey}
			placeholder={labelKey}
			translateError={(message) => t(message as TranslationKeys)}
		/>
	);

	return (
		<Card className="rounded-lg border border-slate-200 bg-white shadow-none">
			<CardHeader className="flex flex-row items-center justify-between border-b border-slate-200 px-6 py-3">
				<CardTitle className="text-base font-medium text-slate-900">
					<Translate text={localizationConstants.orderOrganisationTab} />
				</CardTitle>
				{action}
			</CardHeader>

			<CardContent className="grid grid-cols-1 gap-x-8 gap-y-4 p-6 sm:grid-cols-2">
				<div className="space-y-1">
					<Label className="text-sm font-medium text-slate-700">
						{contractorType || (
							<Translate
								text={localizationConstants.orderOrganisationTab}
							/>
						)}
					</Label>
					<Controller
						control={control}
						name="organisation.organizationName"
						render={({ field }) => (
							<SearchableSelect
								value={field.value}
								onChange={field.onChange}
								options={ORGANISATION_OPTIONS}
								placeholder={t(
									localizationConstants.orderOrganisationTab,
								)}
								searchPlaceholder={t(localizationConstants.search)}
							/>
						)}
					/>
				</div>

				{textField("address", localizationConstants.agreementAddress)}
				{textField("postalCode", localizationConstants.orderPostNrLabel)}
				{textField("city", localizationConstants.orderCityLabel)}
				{textField("email", localizationConstants.orderMailLabel)}

				<div className="space-y-1">
					<Label className="text-sm font-medium text-slate-700">
						<Translate text={localizationConstants.orderTelefonLabel} />
					</Label>
					<Controller
						control={control}
						name="organisation.phone"
						render={({ field }) => (
							<PhoneInput
								value={field.value}
								onChange={field.onChange}
								placeholder={t(
									localizationConstants.orderTelefonLabel,
								)}
								hasError={Boolean(formState.errors.organisation?.phone)}
							/>
						)}
					/>
					{formState.errors.organisation?.phone && (
						<p className="text-xs font-medium text-red-500">
							{t(
								formState.errors.organisation.phone
									.message as TranslationKeys,
							)}
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

export default OrganisationDetailsCard;
