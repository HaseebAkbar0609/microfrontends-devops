"use client";

import { UserPlus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { CustomerDetails } from "@/lib/validation/contactSchema";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { PhoneInput } from "./PhoneInput";

const FIELD_CLASS =
	"h-10 rounded-md border-slate-200 shadow-none focus-visible:border-gray-300 focus-visible:outline-none";

export interface CustomerDetailsCardProps {
	value: CustomerDetails;
	onChange: (patch: Partial<CustomerDetails>) => void;
	errors?: Partial<Record<keyof CustomerDetails, string>>;
	/** Override the card heading; defaults to "Kunduppgifter". */
	titleKey?: TranslationKeys;
	className?: string;
}

/**
 * The "Kunduppgifter" card: company, address, postcode, city, mail, phone and
 * org/personal number.
 *
 * Shared by the order and purchase create flows; `orders/create` still carries
 * its own copy inside Step1CustomerInfo pending migration.
 */
export function CustomerDetailsCard({
	value,
	onChange,
	errors = {},
	titleKey = localizationConstants.orderKunduppgifterSection,
	className,
}: CustomerDetailsCardProps) {
	const t = useTranslate();

	const field = (
		key: keyof CustomerDetails,
		labelKey: TranslationKeys,
		options: {
			placeholder?: string;
			type?: string;
			sanitize?: (raw: string) => string;
		} = {},
	) => (
		<div className="space-y-1">
			<Label className="text-sm font-medium text-slate-700">
				<Translate text={labelKey} />
			</Label>
			<Input
				type={options.type}
				value={value[key]}
				onChange={(event) =>
					onChange({
						[key]: options.sanitize
							? options.sanitize(event.target.value)
							: event.target.value,
					} as Partial<CustomerDetails>)
				}
				placeholder={options.placeholder ?? t(labelKey)}
				className={cn(
					FIELD_CLASS,
					errors[key] && "border-red-500 focus-visible:border-red-500",
				)}
			/>
			{errors[key] && (
				<p className="mt-1 text-xs font-normal text-red-500">
					{t(errors[key] as TranslationKeys)}
				</p>
			)}
		</div>
	);

	return (
		<Card
			className={cn(
				"rounded-lg border border-slate-200 bg-white pb-4 shadow-none",
				className,
			)}
		>
			<CardHeader className="flex h-12 flex-row items-center border-b border-slate-200 px-4 py-0 [.border-b]:pb-0">
				<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
					<UserPlus className="h-5 w-5 text-slate-700" />
					<span>
						<Translate text={titleKey} />
					</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="px-4 py-0">
				<div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
					{field("customer", localizationConstants.orderKundLabel)}
					{field("address", localizationConstants.orderAddressLabel, {
						placeholder: t(localizationConstants.placeholderAddress),
					})}
					{field("postalCode", localizationConstants.orderPostNrLabel, {
						placeholder: t(
							localizationConstants.placeholderPostalCode,
						),
						sanitize: (raw) => raw.replace(/[^0-9 ]/g, ""),
					})}
					{field("city", localizationConstants.orderCityLabel, {
						placeholder: t(localizationConstants.placeholderCity),
					})}
					{field("email", localizationConstants.orderMailLabel, {
						type: "email",
						placeholder: t(localizationConstants.placeholderEmail),
						sanitize: (raw) => raw.trim(),
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
								localizationConstants.placeholderPhone,
							)}
							hasError={Boolean(errors.phone)}
						/>
						{errors.phone && (
							<p className="mt-1 text-xs font-normal text-red-500">
								{t(errors.phone as TranslationKeys)}
							</p>
						)}
					</div>

					{field(
						"orgOrPersonalNo",
						localizationConstants.orderOrgPersonNrLabel,
						{
							placeholder: "556060-2020",
							sanitize: (raw) => raw.replace(/[^0-9\-]/g, ""),
						},
					)}
				</div>
			</CardContent>
		</Card>
	);
}

export default CustomerDetailsCard;
