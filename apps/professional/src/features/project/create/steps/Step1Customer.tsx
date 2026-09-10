"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import { CustomerDetailsCard, SearchableSelect } from "@/components/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/form";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ROLE_OPTIONS } from "../data/projectCreateOptions.mock";
import type { CreateProjectFormData } from "../types";

const FIELD_CLASS =
	"h-10 rounded-md border-slate-200 shadow-none focus-visible:border-gray-300 focus-visible:outline-none";

export interface Step1CustomerProps {
	form: UseFormReturn<CreateProjectFormData>;
}

/**
 * Kunduppgifter and Kontaktperson.
 *
 * The customer block is the shared `CustomerDetailsCard` — the same seven
 * fields the frame draws, already wired to `customerDetailsSchema`. Kund is a
 * plain input there and in the frame, where the value is grey placeholder text
 * like every other field in the card.
 */
export function Step1Customer({ form }: Step1CustomerProps) {
	const t = useTranslate();
	const {
		control,
		register,
		watch,
		setValue,
		formState: { errors },
	} = form;

	const customer = watch("customer");
	const customerErrors = errors.customer;

	const contactField = (
		name: "firstName" | "lastName" | "email",
		labelKey: TranslationKeys,
	) => (
		<div className="space-y-1">
			<Label className="text-sm font-medium text-slate-700">
				<Translate text={labelKey} />
			</Label>
			<Input
				{...register(`contactPerson.${name}` as const)}
				placeholder={t(labelKey)}
				className={FIELD_CLASS}
			/>
			{errors.contactPerson?.[name] && (
				<p className="text-xs font-medium text-red-500">
					{t(errors.contactPerson[name]?.message as TranslationKeys)}
				</p>
			)}
		</div>
	);

	return (
		<div className="space-y-4">
			<CustomerDetailsCard
				value={customer}
				onChange={(patch) => {
					for (const [key, value] of Object.entries(patch)) {
						setValue(
							`customer.${key}` as `customer.${keyof typeof customer}`,
							value as string,
							{ shouldValidate: true, shouldDirty: true },
						);
					}
				}}
				errors={Object.fromEntries(
					Object.entries(customerErrors ?? {}).map(([key, issue]) => [
						key,
						t(
							(issue as { message?: string })
								?.message as TranslationKeys,
						),
					]),
				)}
			/>

			<Card className="rounded-lg border border-slate-200 bg-white shadow-none">
				<CardHeader className="border-b border-slate-200 px-6 py-4">
					<CardTitle className="text-base font-medium text-slate-900">
						<Translate
							text={localizationConstants.orderKontaktpersonSection}
						/>
					</CardTitle>
				</CardHeader>

				<CardContent className="grid grid-cols-1 gap-x-8 gap-y-4 p-6 sm:grid-cols-2">
					{contactField(
						"firstName",
						localizationConstants.orderFornamLabel,
					)}
					{contactField(
						"lastName",
						localizationConstants.orderEfternamnLabel,
					)}
					{contactField("email", localizationConstants.orderMailLabel)}

					<div className="space-y-1">
						<Label className="text-sm font-medium text-slate-700">
							<Translate text={localizationConstants.orderMobilLabel} />
						</Label>
						<Controller
							control={control}
							name="contactPerson.mobile"
							render={({ field }) => (
								<PhoneInput
									value={field.value}
									onChange={field.onChange}
									placeholder={t(
										localizationConstants.orderMobilLabel,
									)}
									hasError={Boolean(errors.contactPerson?.mobile)}
								/>
							)}
						/>
						{errors.contactPerson?.mobile && (
							<p className="text-xs font-medium text-red-500">
								{t(
									errors.contactPerson.mobile
										.message as TranslationKeys,
								)}
							</p>
						)}
					</div>

					<div className="space-y-1">
						<Label className="text-sm font-medium text-slate-700">
							<Translate text={localizationConstants.orderRollLabel} />
						</Label>
						<Controller
							control={control}
							name="contactPerson.role"
							render={({ field }) => (
								<SearchableSelect
									value={field.value}
									onChange={field.onChange}
									options={ROLE_OPTIONS}
									allowCustom={false}
									placeholder={t(
										localizationConstants.orderRollLabel,
									)}
									searchPlaceholder={t(
										localizationConstants.search,
									)}
								/>
							)}
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default Step1Customer;
