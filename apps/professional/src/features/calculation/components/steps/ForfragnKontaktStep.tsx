"use client";

import React, { useEffect, useState } from "react";
import { CircleUserRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PhoneInput } from "@/components/form/PhoneInput";
import {
	getCustomersForEnquiryAction,
	MOCK_CUSTOMERS_LIST,
	type CustomerDropdownOption,
} from "../../api/createEnquiryApi";

export interface ForfragnKontaktData {
	kontaktperson: string;
	fornamn: string;
	efternamn: string;
	address: string;
	postnummer: string;
	email: string;
	telefon: string;
	ort: string;
	roll: string;
}

export const DEFAULT_KONTAKT: ForfragnKontaktData = {
	kontaktperson: "",
	fornamn: "",
	efternamn: "",
	address: "",
	postnummer: "",
	email: "",
	telefon: "",
	ort: "",
	roll: "",
};

function FormField({
	label,
	value,
	onChange,
	placeholder,
	required,
	error,
	errorMessage,
	type = "text",
	disabled,
	className,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
	required?: boolean;
	error?: boolean;
	errorMessage?: string;
	type?: string;
	disabled?: boolean;
	className?: string;
}) {
	return (
		<div className={cn("flex flex-col gap-1.5", className)}>
			<Label className="text-sm font-medium text-slate-900 mb-0">
				{label}
				{required && <span className="ml-1 text-red-500">*</span>}
			</Label>
			<Input
				type={type}
				value={value}
				disabled={disabled}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className={cn(
					"h-10 w-full rounded-md border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-0",
					error ? "border-red-500 ring-1 ring-red-500" : "border-slate-200",
					disabled && "cursor-not-allowed bg-slate-50 text-slate-500",
				)}
			/>
			{error && errorMessage && (
				<p className="text-xs text-red-500 leading-tight">{errorMessage}</p>
			)}
		</div>
	);
}

function PhoneFormField({
	label,
	value,
	onChange,
	placeholder,
	required,
	error,
	errorMessage,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
	required?: boolean;
	error?: boolean;
	errorMessage?: string;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<Label className="text-sm font-medium text-slate-900 mb-0">
				{label}
				{required && <span className="ml-1 text-red-500">*</span>}
			</Label>
			<PhoneInput
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				hasError={error}
			/>
			{error && errorMessage && (
				<p className="text-xs text-red-500 leading-tight">{errorMessage}</p>
			)}
		</div>
	);
}

export interface ForfragnKontaktStepProps {
	data: ForfragnKontaktData;
	showErrors?: boolean;
	onChange: (patch: Partial<ForfragnKontaktData>) => void;
}

export function ForfragnKontaktStep({
	data,
	showErrors,
	onChange,
}: ForfragnKontaktStepProps) {
	const t = useTranslate();
	const [customerList, setCustomerList] = useState<CustomerDropdownOption[]>(MOCK_CUSTOMERS_LIST);

	useEffect(() => {
		let isMounted = true;
		async function loadCustomers() {
			try {
				const customers = await getCustomersForEnquiryAction();
				if (isMounted && customers.length > 0) {
					setCustomerList(customers);
				}
			} catch {
				// Fallback to MOCK_CUSTOMERS_LIST
			}
		}
		loadCustomers();
		return () => {
			isMounted = false;
		};
	}, []);

	const handleCustomerSelect = (value: string) => {
		onChange({ kontaktperson: value });
		const selected = customerList.find(
			(c) => (c.name || c.contactPerson) === value || c.id === value,
		);
		if (selected) {
			onChange({
				kontaktperson: selected.name || selected.contactPerson,
				fornamn: selected.firstName || data.fornamn,
				efternamn: selected.lastName || data.efternamn,
				address: selected.address || data.address,
				postnummer: selected.postalCode || data.postnummer,
				email: selected.email || data.email,
				telefon: selected.phone || data.telefon,
				ort: selected.city || data.ort,
				roll: selected.role || data.roll || "Beställare",
			});
		}
	};

	const emailInvalid = Boolean(
		data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()),
	);

	return (
		<div className="flex flex-col gap-4">
			<Card className="gap-0 overflow-hidden rounded-lg border border-slate-200 bg-white py-0 pb-0 shadow-none">
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-4 sm:px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
						<CircleUserRound className="h-5 w-5 text-slate-700" />
						<Translate text={localizationConstants.calcNewKontaktInfoSection} />
					</CardTitle>
				</CardHeader>

				<CardContent className="px-4 py-4 sm:px-6 sm:py-5">
					<div className="flex flex-col gap-3">
						{/* Kontaktperson Selector */}
						<div className="flex flex-col gap-1.5">
							<Label className="text-sm font-medium text-slate-900 mb-0">
								<Translate text={localizationConstants.calcNewKontaktperson} />
							</Label>
							<Select
								value={data.kontaktperson || ""}
								onValueChange={handleCustomerSelect}
							>
								<SelectTrigger className="h-10 w-full rounded-md border-slate-200 bg-white text-sm text-slate-900 focus:ring-0 [&_svg]:text-slate-900 [&_svg]:opacity-100">
									<SelectValue placeholder={t(localizationConstants.calcNewPlaceholderKontaktperson)} />
								</SelectTrigger>
								<SelectContent>
									{customerList.map((cust) => {
										const displayName = cust.name || cust.contactPerson;
										return (
											<SelectItem key={cust.id} value={displayName} className="text-sm">
												{displayName} {cust.companyName ? `(${cust.companyName})` : ""}
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
						</div>

						{/* Contact Form Fields Grid */}
						<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
							{/* Förnamn */}
							<FormField
								label={t(localizationConstants.agreementDetailFornamn)}
								value={data.fornamn}
								onChange={(v) => onChange({ fornamn: v })}
								placeholder={t(localizationConstants.calcNewPlaceholderDittFornamn)}
								required
								error={showErrors && !data.fornamn.trim()}
								errorMessage={t(localizationConstants.calcNewValidationNameRequired)}
							/>

							{/* Efternamn */}
							<FormField
								label={t(localizationConstants.agreementDetailEfternamn)}
								value={data.efternamn}
								onChange={(v) => onChange({ efternamn: v })}
								placeholder={t(localizationConstants.calcNewPlaceholderDittEfternamn)}
							/>

							{/* Adress */}
							<FormField
								label={t(localizationConstants.calcNewAddressLabel)}
								value={data.address}
								onChange={(v) => onChange({ address: v })}
								placeholder={t(localizationConstants.calcNewPlaceholderDinAdress)}
							/>

							{/* Postnummer */}
							<FormField
								label={t(localizationConstants.calcNewPostNr)}
								value={data.postnummer}
								onChange={(v) => onChange({ postnummer: v.replace(/[^0-9 ]/g, "") })}
								placeholder={t(localizationConstants.calcNewPlaceholderPostnummer)}
							/>

							{/* Mail */}
							<FormField
								label={t(localizationConstants.agreementDetailMail)}
								value={data.email}
								onChange={(v) => onChange({ email: v })}
								placeholder={t(localizationConstants.calcNewPlaceholderDinMail)}
								type="email"
								error={emailInvalid}
								errorMessage={t(localizationConstants.calcInquiryWizEmailErr)}
							/>

							{/* Telefon */}
							<PhoneFormField
								label={t(localizationConstants.calcNewTelefon)}
								value={data.telefon}
								onChange={(v) => onChange({ telefon: v })}
								placeholder={t(localizationConstants.calcNewPlaceholderAngeTelefon)}
							/>

							{/* Ort */}
							<FormField
								label={t(localizationConstants.calcNewOrt)}
								value={data.ort}
								onChange={(v) => onChange({ ort: v })}
								placeholder={t(localizationConstants.calcNewPlaceholderDinOrt)}
							/>

							{/* Roll */}
							<FormField
								label={t(localizationConstants.agreementDetailRoll)}
								value={data.roll || "Beställare"}
								onChange={(v) => onChange({ roll: v })}
								placeholder={t(localizationConstants.calcNewPlaceholderBestallareRoll)}
							/>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
