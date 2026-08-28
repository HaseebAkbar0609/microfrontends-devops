"use client";

import { CircleUserRound } from "lucide-react";

import { PhoneInput } from "@/components/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { ComplaintContact } from "../types";

const FIELD_CLASS =
	"h-10 rounded-md border-slate-200 shadow-none focus-visible:border-gray-300 focus-visible:outline-none";

export interface ComplaintContactOption {
	id: string;
	name: string;
}

export interface ComplaintContactCardProps {
	titleKey: TranslationKeys;
	value: ComplaintContact;
	onChange: (patch: Partial<ComplaintContact>) => void;
	errors?: Partial<Record<keyof ComplaintContact, string>>;
	contactOptions: ComplaintContactOption[];
}

/**
 * Contact block from the complaint wizard, rendered twice by the design — for
 * the supplier's contact and for the reporting side. Only Förnamn is required,
 * matching the asterisk in the frame.
 */
export function ComplaintContactCard({
	titleKey,
	value,
	onChange,
	errors = {},
	contactOptions,
}: ComplaintContactCardProps) {
	const t = useTranslate();

	const field = (
		key: keyof ComplaintContact,
		labelKey: TranslationKeys,
		options: { required?: boolean; type?: string } = {},
	) => (
		<div className="space-y-1">
			<Label className="text-sm font-medium text-slate-700">
				<Translate text={labelKey} />
				{options.required && (
					<span className="ml-0.5 text-red-500" aria-hidden>
						*
					</span>
				)}
			</Label>
			<Input
				type={options.type}
				value={value[key]}
				onChange={(event) => onChange({ [key]: event.target.value })}
				placeholder={t(labelKey)}
				aria-required={options.required || undefined}
				className={cn(FIELD_CLASS, errors[key] && "border-red-500")}
			/>
			{errors[key] && (
				<p className="mt-1 text-xs font-normal text-red-500">
					{t(errors[key] as TranslationKeys)}
				</p>
			)}
		</div>
	);

	return (
		<Card className="rounded-lg border border-slate-200 bg-white pb-4 shadow-none">
			<CardHeader className="flex h-12 flex-row items-center border-b border-slate-200 px-4 py-0 [.border-b]:pb-0">
				<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
					<CircleUserRound className="h-5 w-5 text-slate-700" />
					<Translate text={titleKey} />
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4 px-4 py-0">
				<div className="space-y-1">
					<Label className="text-sm font-medium text-slate-700">
						<Translate
							text={localizationConstants.complaintFieldContact}
						/>
					</Label>
					<Select
						value={value.contactId || undefined}
						onValueChange={(id) => onChange({ contactId: id })}
					>
						<SelectTrigger className="h-10 w-full cursor-pointer border-slate-200 bg-white text-sm text-slate-900 shadow-none">
							<SelectValue
								placeholder={t(
									localizationConstants.complaintFieldContact,
								)}
							/>
						</SelectTrigger>
						<SelectContent className="bg-white">
							{contactOptions.map((option) => (
								<SelectItem key={option.id} value={option.id}>
									{option.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
					{field("firstName", localizationConstants.orderFornamLabel, {
						required: true,
					})}
					{field(
						"lastName",
						localizationConstants.orderEfternamnLabel,
					)}
					{field("address", localizationConstants.orderAddressLabel)}
					{field(
						"postalCode",
						localizationConstants.complaintFieldPostalCode,
					)}
					{field("email", localizationConstants.orderMailLabel, {
						type: "email",
					})}

					<div className="space-y-1">
						<Label className="text-sm font-medium text-slate-700">
							<Translate
								text={localizationConstants.orderTelefonLabel}
							/>
						</Label>
						<PhoneInput
							value={value.phone}
							onChange={(phone) => onChange({ phone })}
							placeholder={t(
								localizationConstants.orderTelefonLabel,
							)}
							hasError={Boolean(errors.phone)}
						/>
						{errors.phone && (
							<p className="mt-1 text-xs font-normal text-red-500">
								{t(errors.phone as TranslationKeys)}
							</p>
						)}
					</div>

					{field("city", localizationConstants.orderCityLabel)}
					{field("role", localizationConstants.orderRollLabel)}
				</div>
			</CardContent>
		</Card>
	);
}

export default ComplaintContactCard;
