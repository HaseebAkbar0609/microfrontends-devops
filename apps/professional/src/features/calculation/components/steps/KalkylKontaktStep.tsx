"use client";

import React from "react";
import { Folder, CircleUserRound, UserRoundCog, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import type { KalkylKontaktData } from "../../types/kalkyl";
import {
	type OfferDropdownOption,
	MOCK_BESTALLARE_COMPANIES,
	MOCK_RESPONSIBLE_PERSONS,
	MOCK_CALCULATION_ROLES,
} from "../../api/createCalculation";

// ── Shadcn Form Field Component ───────────────────────────────────────────

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
		<div className={cn("grid gap-1.5", className)}>
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
				<p className="text-xs text-red-500">{errorMessage}</p>
			)}
		</div>
	);
}

// ── Shared Standard Phone Field Component ─────────────────────────────────

function PhoneFormField({
	label,
	value,
	onChange,
	placeholder,
	required,
	error,
	errorMessage,
	className,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
	required?: boolean;
	error?: boolean;
	errorMessage?: string;
	className?: string;
}) {
	return (
		<div className={cn("grid gap-1.5", className)}>
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
				<p className="text-xs text-red-500">{errorMessage}</p>
			)}
		</div>
	);
}

// ── Step 1 Component ───────────────────────────────────────────────────────

interface KalkylKontaktStepProps {
	data: KalkylKontaktData;
	offerOptions: OfferDropdownOption[];
	isLoadingOffers?: boolean;
	showErrors?: boolean;
	onChange: (patch: Partial<KalkylKontaktData>) => void;
	onKoppla: () => void;
	onSaveSection?: () => void;
	onCancelSection?: () => void;
}

export function KalkylKontaktStep({
	data,
	offerOptions,
	isLoadingOffers,
	showErrors,
	onChange,
	onKoppla,
	onSaveSection,
	onCancelSection,
}: KalkylKontaktStepProps) {
	const t = useTranslate();
	const isExtend = data.mode === "extend";

	return (
		<div className="flex flex-col gap-6">
			{/* 1. Koppla till offert Card */}
			<Card className="gap-0 rounded-lg border border-slate-200 bg-white py-0 pb-0 shadow-none">
				<CardContent className="px-6 py-4">
					<Label className="mb-3 block text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.calcNewKopplaOffert} />
					</Label>

					<div className="w-full">
						<Select value={data.offert} onValueChange={(v) => onChange({ offert: v })}>
							<SelectTrigger className="h-10 w-full rounded-md border-slate-200 bg-white text-sm text-slate-900 focus:ring-0 [&_svg]:text-slate-900 [&_svg]:opacity-100">
								<SelectValue placeholder={t(localizationConstants.calcNewValjOffert)} />
							</SelectTrigger>
							<SelectContent>
								{offerOptions.map((opt) => (
									<SelectItem key={opt.id} value={opt.id} className="text-sm">
										{opt.code ? `${opt.code} - ${opt.title}` : opt.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="mt-3 flex justify-end">
						<Button
							type="button"
							onClick={onKoppla}
							disabled={isLoadingOffers || !data.offert}
							className="h-9 min-w-24 cursor-pointer rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
						>
							<Translate text={localizationConstants.calcNewKopplaBtn} />
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* 2. Mode selection (Egen regi vs Extern Kund) outside of the first card */}
			<RadioGroup
				value={data.mode}
				onValueChange={(val) => onChange({ mode: val as "eigen" | "extend" })}
				className="grid grid-cols-1 gap-4 sm:grid-cols-2"
			>
				<Label
					htmlFor="mode-eigen"
					className={cn(
						"flex h-11 cursor-pointer items-center gap-2.5 rounded-md border bg-white px-4 py-2 text-sm font-normal text-slate-800 shadow-none transition-colors",
						!isExtend
							? "border-slate-300"
							: "border-slate-200 hover:border-slate-300",
					)}
				>
					<RadioGroupItem
						id="mode-eigen"
						value="eigen"
						className="border-slate-300 text-slate-900 focus:ring-slate-900 data-[state=checked]:border-slate-900"
					/>
					<span className="text-sm font-medium text-slate-800">
						<Translate text={localizationConstants.calcNewEgenRegi} />
					</span>
				</Label>

				<Label
					htmlFor="mode-extend"
					className={cn(
						"flex h-11 cursor-pointer items-center gap-2.5 rounded-md border bg-white px-4 py-2 text-sm font-normal text-slate-800 shadow-none transition-colors",
						isExtend
							? "border-slate-300"
							: "border-slate-200 hover:border-slate-300",
					)}
				>
					<RadioGroupItem
						id="mode-extend"
						value="extend"
						className="border-slate-300 text-slate-900 focus:ring-slate-900 data-[state=checked]:border-slate-900"
					/>
					<span className="text-sm font-medium text-slate-800">
						<Translate text={localizationConstants.calcNewExternKund} />
					</span>
				</Label>
			</RadioGroup>

			{/* Beställare Section (Only in Extern Kund mode) */}
			{isExtend && (
				<div className="flex flex-col gap-4">
					<h2 className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.calcNewBestallare} />
					</h2>

					{/* Beställare Kunduppgifter Card */}
					<Card className="gap-0 overflow-hidden rounded-lg border border-slate-200 bg-white py-0 pb-0 shadow-none">
						<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
							<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
								<Folder className="h-5 w-5 text-slate-700" />
								<Translate text={localizationConstants.calcNewKunduppgifter} />
							</CardTitle>
						</CardHeader>
						<CardContent className="px-6 py-5">
							<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
								<div className="grid gap-1.5">
									<Label className="text-sm font-medium text-slate-900 mb-0">
										<Translate text={localizationConstants.calcNewForetagLabel} />
									</Label>
									<Select
										value={data.bestellareForetag}
										onValueChange={(v) => onChange({ bestellareForetag: v })}
									>
										<SelectTrigger className="h-10 w-full rounded-md border-slate-200 bg-white text-sm text-slate-900 focus:ring-0 [&_svg]:text-slate-900 [&_svg]:opacity-100">
											<SelectValue placeholder={t(localizationConstants.calcNewPlaceholderForetag)} />
										</SelectTrigger>
										<SelectContent>
											{MOCK_BESTALLARE_COMPANIES.map((company) => (
												<SelectItem key={company} value={company} className="text-sm">
													{company}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<FormField
									label={t(localizationConstants.calcNewAddressLabel)}
									value={data.bestellareAddress}
									onChange={(v) => onChange({ bestellareAddress: v })}
									placeholder={t(localizationConstants.calcNewPlaceholderAngeAdressen)}
								/>

								<FormField
									label={t(localizationConstants.calcNewPostNr)}
									value={data.bestellarePostNr}
									onChange={(v) => onChange({ bestellarePostNr: v.replace(/[^0-9 ]/g, "") })}
									placeholder={t(localizationConstants.calcNewPlaceholderAngePostnr)}
								/>

								<FormField
									label={t(localizationConstants.calcNewOrt)}
									value={data.bestellareOrt}
									onChange={(v) => onChange({ bestellareOrt: v })}
									placeholder={t(localizationConstants.calcNewPlaceholderPlats)}
								/>

								<FormField
									label={t(localizationConstants.agreementDetailMail)}
									value={data.bestellareMail}
									onChange={(v) => onChange({ bestellareMail: v.trim() })}
									placeholder={t(localizationConstants.calcNewPlaceholderMail)}
									type="email"
								/>

								<PhoneFormField
									label={t(localizationConstants.calcNewTelefon)}
									value={data.bestellareTelefon}
									onChange={(v) => onChange({ bestellareTelefon: v })}
									placeholder={t(localizationConstants.calcNewPlaceholderAngeTelefon)}
								/>

								<div className="lg:col-span-2">
									<FormField
										label={t(localizationConstants.calcNewOrgPersonNr)}
										value={data.bestellareOrgNr}
										onChange={(v) => onChange({ bestellareOrgNr: v.replace(/[^0-9\-]/g, "") })}
										placeholder={t(localizationConstants.calcNewPlaceholderOrgNr)}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Beställare Kontaktinformation Card */}
					<Card className="gap-0 overflow-hidden rounded-lg border border-slate-200 bg-white py-0 pb-0 shadow-none">
						<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
							<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
								<CircleUserRound className="h-5 w-5 text-slate-700" />
								<Translate text={localizationConstants.calcNewKontaktInfoSection} />
							</CardTitle>
						</CardHeader>
						<CardContent className="px-6 py-5">
							<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
								<div className="grid gap-1.5 lg:col-span-2">
									<Label className="text-sm font-medium text-slate-900 mb-0">
										<Translate text={localizationConstants.calcNewKontaktperson} />
									</Label>
									<Select
										value={data.bestellareKontaktperson}
										onValueChange={(v) => onChange({ bestellareKontaktperson: v })}
									>
										<SelectTrigger className="h-10 w-full rounded-md border-slate-200 bg-white text-sm text-slate-900 focus:ring-0 [&_svg]:text-slate-900 [&_svg]:opacity-100">
											<SelectValue placeholder={t(localizationConstants.calcNewPlaceholderKontaktperson)} />
										</SelectTrigger>
										<SelectContent>
											{MOCK_RESPONSIBLE_PERSONS.map((person) => (
												<SelectItem key={person} value={person} className="text-sm">
													{person}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<FormField
									label={t(localizationConstants.agreementDetailFornamn)}
									value={data.bestellareFornamn}
									onChange={(v) => onChange({ bestellareFornamn: v })}
									placeholder={t(localizationConstants.calcNewPlaceholderDittFornamn)}
									required
									error={showErrors && !data.bestellareFornamn.trim()}
									errorMessage={t(localizationConstants.calcNewValidationNameRequired)}
								/>

								<FormField
									label={t(localizationConstants.agreementDetailEfternamn)}
									value={data.bestellareEfternamn}
									onChange={(v) => onChange({ bestellareEfternamn: v })}
									placeholder={t(localizationConstants.calcNewPlaceholderDittEfternamn)}
								/>

								<FormField
									label={t(localizationConstants.calcNewAddressLabel)}
									value={data.bestellareKontaktAddress}
									onChange={(v) => onChange({ bestellareKontaktAddress: v })}
									placeholder={t(localizationConstants.calcNewPlaceholderDinAdress)}
								/>

								<FormField
									label={t(localizationConstants.calcNewPostNr)}
									value={data.bestellareKontaktPostnummer}
									onChange={(v) => onChange({ bestellareKontaktPostnummer: v.replace(/[^0-9 ]/g, "") })}
									placeholder={t(localizationConstants.calcNewPlaceholderPostnummer)}
								/>

								<FormField
									label={t(localizationConstants.agreementDetailMail)}
									value={data.bestellareKontaktMail}
									onChange={(v) => onChange({ bestellareKontaktMail: v.trim() })}
									placeholder={t(localizationConstants.calcNewPlaceholderDinMail)}
									type="email"
								/>

								<PhoneFormField
									label={t(localizationConstants.calcNewTelefon)}
									value={data.bestellareTelefonDirect}
									onChange={(v) => onChange({ bestellareTelefonDirect: v })}
									placeholder={t(localizationConstants.calcNewPlaceholderAngeTelefon)}
								/>

								<FormField
									label={t(localizationConstants.calcNewOrt)}
									value={data.bestellareKontaktOrt}
									onChange={(v) => onChange({ bestellareKontaktOrt: v })}
									placeholder={t(localizationConstants.calcNewPlaceholderDinOrt)}
								/>

								<FormField
									label={t(localizationConstants.agreementDetailRoll)}
									value={data.bestellareRoll}
									onChange={(v) => onChange({ bestellareRoll: v })}
									placeholder={t(localizationConstants.calcNewPlaceholderBestallareRoll)}
								/>
							</div>

							<div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
								<Button
									type="button"
									variant="ghost"
									onClick={onCancelSection}
									className="h-9 cursor-pointer rounded-md border border-transparent bg-[var(--color-bg-secondary,#F4F4F5)] px-4 text-sm font-medium text-slate-800 hover:bg-slate-200"
								>
									<Translate text={localizationConstants.cancelButton} />
								</Button>

								<Button
									type="button"
									onClick={onSaveSection}
									className="h-9 cursor-pointer gap-1.5 rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
								>
									<Save className="h-4 w-4" />
									<Translate text={localizationConstants.calcNewSaveBtn} />
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Entreprenör Section */}
			<div className="flex flex-col gap-4">
				<h2 className="text-base font-semibold text-slate-900">
					<Translate text={localizationConstants.calcNewEntreprenor} />
				</h2>

				{/* Entreprenör Kunduppgifter Card */}
				<Card className="gap-0 overflow-hidden rounded-lg border border-slate-200 bg-white py-0 pb-0 shadow-none">
					<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
						<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
							<Folder className="h-5 w-5 text-slate-700" />
							<Translate text={localizationConstants.calcNewKunduppgifter} />
						</CardTitle>
					</CardHeader>
					<CardContent className="px-6 py-5">
						<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
							<FormField
								label={t(localizationConstants.calcNewForetagLabel)}
								value={data.foretag}
								onChange={(v) => onChange({ foretag: v })}
								placeholder={t(localizationConstants.calcNewPlaceholderForetag)}
							/>

							<FormField
								label={t(localizationConstants.calcNewAddressLabel)}
								value={data.address}
								onChange={(v) => onChange({ address: v })}
								placeholder={t(localizationConstants.calcNewPlaceholderAngeAdressen)}
							/>

							<FormField
								label={t(localizationConstants.calcNewPostNr)}
								value={data.postNr}
								onChange={(v) => onChange({ postNr: v.replace(/[^0-9 ]/g, "") })}
								placeholder={t(localizationConstants.calcNewPlaceholderAngePostnr)}
							/>

							<FormField
								label={t(localizationConstants.calcNewOrt)}
								value={data.ort}
								onChange={(v) => onChange({ ort: v })}
								placeholder={t(localizationConstants.calcNewPlaceholderPlats)}
							/>

							<FormField
								label={t(localizationConstants.agreementDetailMail)}
								value={data.mail}
								onChange={(v) => onChange({ mail: v.trim() })}
								placeholder={t(localizationConstants.calcNewPlaceholderMail)}
								type="email"
							/>

							<PhoneFormField
								label={t(localizationConstants.calcNewTelefon)}
								value={data.telefon}
								onChange={(v) => onChange({ telefon: v })}
								placeholder={t(localizationConstants.calcNewPlaceholderAngeTelefon)}
							/>

							<div className="lg:col-span-2">
								<FormField
									label={t(localizationConstants.calcNewOrgPersonNr)}
									value={data.orgNr}
									onChange={(v) => onChange({ orgNr: v.replace(/[^0-9\-]/g, "") })}
									placeholder={t(localizationConstants.calcNewPlaceholderOrgNr)}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Entreprenör Kalkylansvarig Card */}
				<Card className="gap-0 overflow-hidden rounded-lg border border-slate-200 bg-white py-0 pb-0 shadow-none">
					<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
						<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
							<UserRoundCog className="h-5 w-5 text-slate-700" />
							<Translate text={localizationConstants.calcNewKalkylAnsvarig} />
						</CardTitle>
					</CardHeader>
					<CardContent className="px-6 py-5">
						<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
							<div className="grid gap-1.5 lg:col-span-2">
								<Label className="text-sm font-medium text-slate-900 mb-0">
									<Translate text={localizationConstants.calcNewKontaktperson} />
								</Label>
								<Select
									value={data.kontaktperson}
									onValueChange={(v) => onChange({ kontaktperson: v })}
								>
									<SelectTrigger className="h-10 w-full rounded-md border-slate-200 bg-white text-sm text-slate-900 focus:ring-0 [&_svg]:text-slate-900 [&_svg]:opacity-100">
										<SelectValue placeholder={t(localizationConstants.calcNewPlaceholderKontaktperson)} />
									</SelectTrigger>
									<SelectContent>
										{MOCK_RESPONSIBLE_PERSONS.map((person) => (
											<SelectItem key={person} value={person} className="text-sm">
												{person}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<FormField
								label={t(localizationConstants.agreementDetailFornamn)}
								value={data.fornamn}
								onChange={(v) => onChange({ fornamn: v })}
								placeholder={t(localizationConstants.calcNewPlaceholderFornamn)}
							/>

							<FormField
								label={t(localizationConstants.agreementDetailEfternamn)}
								value={data.efternamn}
								onChange={(v) => onChange({ efternamn: v })}
								placeholder={t(localizationConstants.calcNewPlaceholderEfternamn)}
							/>

							<FormField
								label={t(localizationConstants.agreementDetailMail)}
								value={data.kontaktMail}
								onChange={(v) => onChange({ kontaktMail: v.trim() })}
								placeholder={t(localizationConstants.calcNewPlaceholderMail)}
								type="email"
							/>

							<PhoneFormField
								label={t(localizationConstants.agreementDetailMobil)}
								value={data.mobil}
								onChange={(v) => onChange({ mobil: v })}
								placeholder={t(localizationConstants.calcNewPlaceholderMobil)}
							/>

							<div className="grid gap-1.5">
								<Label className="text-sm font-medium text-slate-900 mb-0">
									<Translate text={localizationConstants.agreementDetailRoll} />
								</Label>
								<Select
									value={data.roll}
									onValueChange={(v) => onChange({ roll: v })}
								>
									<SelectTrigger className="h-10 w-full rounded-md border-slate-200 bg-white text-sm text-slate-900 focus:ring-0 [&_svg]:text-slate-900 [&_svg]:opacity-100">
										<SelectValue placeholder={t(localizationConstants.calcNewPlaceholderRoll)} />
									</SelectTrigger>
									<SelectContent>
										{MOCK_CALCULATION_ROLES.map((r) => (
											<SelectItem key={r} value={r} className="text-sm">
												{r}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
							<Button
								type="button"
								variant="ghost"
								onClick={onCancelSection}
								className="h-9 cursor-pointer rounded-md border border-transparent bg-[var(--color-bg-secondary,#F4F4F5)] px-4 text-sm font-medium text-slate-800 hover:bg-slate-200"
							>
								<Translate text={localizationConstants.cancelButton} />
							</Button>

							<Button
								type="button"
								onClick={onSaveSection}
								className="h-9 cursor-pointer gap-1.5 rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
							>
								<Save className="h-4 w-4" />
								<Translate text={localizationConstants.calcNewSaveBtn} />
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
