"use client";

import { Briefcase, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { DesignKontaktData } from "../types/designRegister";

const KONTAKTPERSON_OPTIONS = ["Anders Svensson", "Maria Lindqvist", "Erik Johansson"];
const BESTELLARE_OPTIONS = ["Anders Svensson", "Maria Lindqvist", "Erik Johansson"];
const FORETAG_OPTIONS = ["Byggbolaget AB", "Fastighetsbolaget AB", "Installationer AB"];
const ROLL_OPTIONS = ["Beställare", "Projektledare", "Kontaktperson", "Ekonomi"];

interface FormFieldProps {
	label: string;
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
	required?: boolean;
	type?: string;
}

function FormField({ label, value, onChange, placeholder, required, type = "text" }: FormFieldProps) {
	return (
		<div className="grid gap-1.5">
			<label className="text-sm font-medium text-slate-900">
				{label}
				{required && <span className="ml-0.5 text-red-500">*</span>}
			</label>
			<input
				type={type}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus-visible:border-slate-400 focus-visible:outline-none"
			/>
		</div>
	);
}

interface PhoneFieldProps {
	label: string;
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
}

function PhoneField({ label, value, onChange, placeholder }: PhoneFieldProps) {
	return (
		<div className="grid gap-1.5">
			<label className="text-sm font-medium text-slate-900">{label}</label>
			<div className="flex items-center">
				<span className="flex h-10 items-center rounded-l-md border border-r-0 border-slate-200 bg-white px-3 text-sm text-slate-600">
					+46
				</span>
				<input
					type="text"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					className="h-10 w-full rounded-r-md border border-slate-200 bg-white px-3 text-sm focus-visible:border-slate-400 focus-visible:outline-none"
				/>
			</div>
		</div>
	);
}

interface DesignKontaktStepProps {
	data: DesignKontaktData;
	onChange: (patch: Partial<DesignKontaktData>) => void;
}

export function DesignKontaktStep({ data, onChange }: DesignKontaktStepProps) {
	const t = useTranslate();
	const isExtern = data.mode === "extern";

	return (
		<div className="flex flex-col gap-4">
			{/* Mode selector */}
			<Card>
				<CardContent className="p-5">
					<div className="flex items-center gap-6">
						<label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
							<input
								type="radio"
								name="design-mode"
								checked={!isExtern}
								onChange={() => onChange({ mode: "eigen" })}
								className="accent-slate-900"
							/>
							<Translate text={localizationConstants.calcNewEgenRegi} />
						</label>
						<label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
							<input
								type="radio"
								name="design-mode"
								checked={isExtern}
								onChange={() => onChange({ mode: "extern" })}
								className="accent-slate-900"
							/>
							<Translate text={localizationConstants.designRegNewExternKund} />
						</label>
					</div>

					{/* Beställare — Extern kund mode only */}
					{isExtern && (
						<div className="mt-4 grid gap-1.5">
							<label className="text-sm font-medium text-slate-900">
								<Translate text={localizationConstants.calcStatBestellare} />
							</label>
							<Select value={data.bestellare} onValueChange={(v) => onChange({ bestellare: v })}>
								<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm focus:ring-0">
									<SelectValue placeholder={t(localizationConstants.calcStatBestellare)} />
								</SelectTrigger>
								<SelectContent>
									{BESTELLARE_OPTIONS.map((o) => (
										<SelectItem key={o} value={o}>{o}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Kunduppgifter */}
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium">
						<div className="flex items-center gap-2">
							<Checkbox
								id="kunduppgifter-enabled"
								checked={data.kunduppgifterEnabled}
								onCheckedChange={(c) => onChange({ kunduppgifterEnabled: Boolean(c) })}
							/>
							<label
								htmlFor="kunduppgifter-enabled"
								className="cursor-pointer text-base font-medium text-slate-900"
							>
								<Translate text={localizationConstants.calcNewKunduppgifter} />
							</label>
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
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
							placeholder={t(localizationConstants.calcNewPlaceholderAddress)}
						/>
						<FormField
							label={t(localizationConstants.calcNewPostNr)}
							value={data.postNr}
							onChange={(v) => onChange({ postNr: v })}
							placeholder={t(localizationConstants.calcNewPlaceholderPostNr)}
						/>
						<FormField
							label={t(localizationConstants.calcNewOrt)}
							value={data.ort}
							onChange={(v) => onChange({ ort: v })}
							placeholder={t(localizationConstants.calcNewPlaceholderOrt)}
						/>
						<FormField
							label={t(localizationConstants.agreementDetailMail)}
							value={data.mail}
							onChange={(v) => onChange({ mail: v })}
							placeholder={t(localizationConstants.calcNewPlaceholderMail)}
							type="email"
						/>
						<PhoneField
							label={t(localizationConstants.calcNewTelefon)}
							value={data.telefon}
							onChange={(v) => onChange({ telefon: v })}
							placeholder={t(localizationConstants.calcNewPlaceholderTelefon)}
						/>
						<div className="lg:col-span-2">
							<FormField
								label={t(localizationConstants.calcNewOrgPersonNr)}
								value={data.orgNr}
								onChange={(v) => onChange({ orgNr: v })}
								placeholder={t(localizationConstants.calcNewPlaceholderOrgNr)}
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Kontaktperson — Extern kund mode */}
			{isExtern && (
				<Card>
					<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
						<CardTitle className="flex items-center gap-2 text-base font-medium">
							<UserRound className="h-5 w-5 text-slate-700" />
							<Translate text={localizationConstants.calcNewKontaktperson} />
						</CardTitle>
					</CardHeader>
					<CardContent className="p-6">
						<div className="mb-4 grid gap-1.5">
							<label className="text-sm font-medium text-slate-900">
								<Translate text={localizationConstants.calcNewKontaktperson} />
							</label>
							<Select value={data.kontaktperson} onValueChange={(v) => onChange({ kontaktperson: v })}>
								<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm focus:ring-0">
									<SelectValue placeholder={t(localizationConstants.calcNewKontaktperson)} />
								</SelectTrigger>
								<SelectContent>
									{KONTAKTPERSON_OPTIONS.map((o) => (
										<SelectItem key={o} value={o}>{o}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
								onChange={(v) => onChange({ kontaktMail: v })}
								placeholder={t(localizationConstants.calcNewPlaceholderMail)}
								type="email"
							/>
							<PhoneField
								label={t(localizationConstants.agreementDetailMobil)}
								value={data.mobil}
								onChange={(v) => onChange({ mobil: v })}
								placeholder={t(localizationConstants.calcNewPlaceholderTelefon)}
							/>
							<div className="grid gap-1.5 lg:col-span-2">
								<label className="text-sm font-medium text-slate-900">
									<Translate text={localizationConstants.agreementDetailRoll} />
								</label>
								<Select value={data.roll} onValueChange={(v) => onChange({ roll: v })}>
									<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm focus:ring-0">
										<SelectValue placeholder={t(localizationConstants.agreementDetailRoll)} />
									</SelectTrigger>
									<SelectContent>
										{ROLL_OPTIONS.map((o) => (
											<SelectItem key={o} value={o}>{o}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Projekterings ansvarig */}
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium">
						{!isExtern ? (
							<div className="flex items-center gap-2">
								<Checkbox
									id="projekt-ansvarig-enabled"
									checked={data.projektAnsvarigEnabled}
									onCheckedChange={(c) => onChange({ projektAnsvarigEnabled: Boolean(c) })}
								/>
								<label
									htmlFor="projekt-ansvarig-enabled"
									className="cursor-pointer text-base font-medium text-slate-900"
								>
									<Translate text={localizationConstants.designRegNewProjektAnsvarig} />
								</label>
							</div>
						) : (
							<>
								<Briefcase className="h-5 w-5 text-slate-700" />
								<Translate text={localizationConstants.designRegNewProjektAnsvarig} />
							</>
						)}
					</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					{isExtern ? (
						<div className="flex flex-col gap-4">
							<div className="grid gap-1.5">
								<label className="text-sm font-medium text-slate-900">
									<Translate text={localizationConstants.calcNewForetagLabel} />
								</label>
								<Select value={data.ansvarigFoetag} onValueChange={(v) => onChange({ ansvarigFoetag: v })}>
									<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm focus:ring-0">
										<SelectValue placeholder={t(localizationConstants.calcNewForetagLabel)} />
									</SelectTrigger>
									<SelectContent>
										{FORETAG_OPTIONS.map((o) => (
											<SelectItem key={o} value={o}>{o}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="grid gap-1.5">
								<label className="text-sm font-medium text-slate-900">
									<Translate text={localizationConstants.calcNewKontaktperson} />
								</label>
								<Select value={data.ansvarigKontaktperson} onValueChange={(v) => onChange({ ansvarigKontaktperson: v })}>
									<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm focus:ring-0">
										<SelectValue placeholder={t(localizationConstants.calcNewKontaktperson)} />
									</SelectTrigger>
									<SelectContent>
										{KONTAKTPERSON_OPTIONS.map((o) => (
											<SelectItem key={o} value={o}>{o}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
								<FormField
									label={t(localizationConstants.agreementDetailFornamn)}
									value={data.ansvarigFornamn}
									onChange={(v) => onChange({ ansvarigFornamn: v })}
									placeholder={t(localizationConstants.calcNewPlaceholderFornamn)}
								/>
								<FormField
									label={t(localizationConstants.agreementDetailEfternamn)}
									value={data.ansvarigEfternamn}
									onChange={(v) => onChange({ ansvarigEfternamn: v })}
									placeholder={t(localizationConstants.calcNewPlaceholderEfternamn)}
								/>
								<FormField
									label={t(localizationConstants.agreementDetailMail)}
									value={data.ansvarigMail}
									onChange={(v) => onChange({ ansvarigMail: v })}
									placeholder={t(localizationConstants.calcNewPlaceholderMail)}
									type="email"
								/>
								<PhoneField
									label={t(localizationConstants.agreementDetailMobil)}
									value={data.ansvarigMobil}
									onChange={(v) => onChange({ ansvarigMobil: v })}
									placeholder={t(localizationConstants.calcNewPlaceholderTelefon)}
								/>
								<div className="grid gap-1.5 lg:col-span-2">
									<label className="text-sm font-medium text-slate-900">
										<Translate text={localizationConstants.agreementDetailRoll} />
									</label>
									<Select value={data.ansvarigRoll} onValueChange={(v) => onChange({ ansvarigRoll: v })}>
										<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm focus:ring-0">
											<SelectValue placeholder={t(localizationConstants.agreementDetailRoll)} />
										</SelectTrigger>
										<SelectContent>
											{ROLL_OPTIONS.map((o) => (
												<SelectItem key={o} value={o}>{o}</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					) : (
						<div className="flex flex-col gap-4">
							<div className="flex items-center justify-between gap-3">
								<div className="flex-1 grid gap-1.5">
									<label className="text-sm font-medium text-slate-900">
										<Translate text={localizationConstants.calcNewKontaktperson} />
									</label>
									<Select value={data.kontaktperson} onValueChange={(v) => onChange({ kontaktperson: v })}>
										<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm focus:ring-0">
											<SelectValue placeholder={t(localizationConstants.calcNewKontaktperson)} />
										</SelectTrigger>
										<SelectContent>
											{KONTAKTPERSON_OPTIONS.map((o) => (
												<SelectItem key={o} value={o}>{o}</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<button
									type="button"
									className="mt-6 cursor-pointer whitespace-nowrap rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
								>
									+ <Translate text={localizationConstants.designRegNewAndraLaggTill} />
								</button>
							</div>
							<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
									onChange={(v) => onChange({ kontaktMail: v })}
									placeholder={t(localizationConstants.calcNewPlaceholderMail)}
									type="email"
								/>
								<PhoneField
									label={t(localizationConstants.agreementDetailMobil)}
									value={data.mobil}
									onChange={(v) => onChange({ mobil: v })}
									placeholder={t(localizationConstants.calcNewPlaceholderTelefon)}
								/>
								<div className="grid gap-1.5 lg:col-span-2">
									<label className="text-sm font-medium text-slate-900">
										<Translate text={localizationConstants.agreementDetailRoll} />
									</label>
									<Select value={data.roll} onValueChange={(v) => onChange({ roll: v })}>
										<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm focus:ring-0">
											<SelectValue placeholder={t(localizationConstants.agreementDetailRoll)} />
										</SelectTrigger>
										<SelectContent>
											{ROLL_OPTIONS.map((o) => (
												<SelectItem key={o} value={o}>{o}</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
