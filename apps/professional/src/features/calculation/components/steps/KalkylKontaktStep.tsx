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
import type { KalkylKontaktData } from "../../types/kalkyl";

// ── Constants ──────────────────────────────────────────────────────────────

const KONTAKTPERSON_OPTIONS = ["Anders Svensson", "Maria Lindqvist", "Erik Johansson"];
const ROLL_OPTIONS = ["Kalkyl", "Projektledare", "Ekonomi"];

// ── Sub-components ─────────────────────────────────────────────────────────

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

// ── Main component ─────────────────────────────────────────────────────────

interface KalkylKontaktStepProps {
	data: KalkylKontaktData;
	onChange: (patch: Partial<KalkylKontaktData>) => void;
}

export function KalkylKontaktStep({ data, onChange }: KalkylKontaktStepProps) {
	const t = useTranslate();
	const isExtend = data.mode === "extend";

	return (
		<div className="flex flex-col gap-4">
			{/* Koppla till offert */}
			<Card>
				<CardContent className="p-5">
					<p className="mb-3 text-sm font-medium text-slate-900">
						<Translate text={localizationConstants.calcNewKopplaOffert} />
					</p>
					<div className="flex items-center gap-2">
						<Select value={data.offert} onValueChange={(v) => onChange({ offert: v })}>
							<SelectTrigger className="h-10 flex-1 border-slate-200 bg-white text-sm focus:ring-0">
								<SelectValue placeholder={t(localizationConstants.calcNewValjOffert)} />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="off-001">Offert 001</SelectItem>
								<SelectItem value="off-002">Offert 002</SelectItem>
							</SelectContent>
						</Select>
						<button
							type="button"
							className="h-10 cursor-pointer rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-700"
						>
							<Translate text={localizationConstants.calcNewKopplaBtn} />
						</button>
					</div>

					<div className="mt-4 flex items-center gap-6">
						<label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
							<input
								type="radio"
								name="kalkyl-mode"
								checked={!isExtend}
								onChange={() => onChange({ mode: "eigen" })}
								className="accent-slate-900"
							/>
							<Translate text={localizationConstants.calcNewEgenRegi} />
						</label>
						<label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
							<input
								type="radio"
								name="kalkyl-mode"
								checked={isExtend}
								onChange={() => onChange({ mode: "extend" })}
								className="accent-slate-900"
							/>
							<Translate text={localizationConstants.calcNewExtendKund} />
						</label>
					</div>
				</CardContent>
			</Card>

			{/* Beställare — Extend Kund mode only */}
			{isExtend && (
				<Card>
					<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
						<CardTitle className="flex items-center gap-2 text-base font-medium">
							<UserRound className="h-5 w-5 text-slate-700" />
							<Translate text={localizationConstants.calcStatBestellare} />
						</CardTitle>
					</CardHeader>
					<CardContent className="p-6">
						<div className="mb-4 flex items-center gap-2">
							<Checkbox
								id="bestellare-kunduppgifter"
								checked={data.bestellareKunduppgifter}
								onCheckedChange={(c) => onChange({ bestellareKunduppgifter: Boolean(c) })}
							/>
							<label
								htmlFor="bestellare-kunduppgifter"
								className="cursor-pointer text-sm font-medium text-slate-700"
							>
								<Translate text={localizationConstants.calcNewKunduppgifter} />
							</label>
						</div>
						<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
							<FormField
								label={t(localizationConstants.calcNewForetagLabel)}
								value={data.bestellareFoetag}
								onChange={(v) => onChange({ bestellareFoetag: v })}
								placeholder={t(localizationConstants.calcNewPlaceholderForetag)}
							/>
							<FormField
								label={t(localizationConstants.calcNewAddressLabel)}
								value={data.bestellareAddress}
								onChange={(v) => onChange({ bestellareAddress: v })}
								placeholder={t(localizationConstants.calcNewPlaceholderAddress)}
							/>
							<FormField
								label={t(localizationConstants.calcNewPostNr)}
								value={data.bestellarePostNr}
								onChange={(v) => onChange({ bestellarePostNr: v })}
								placeholder={t(localizationConstants.calcNewPlaceholderPostNr)}
							/>
							<FormField
								label={t(localizationConstants.calcNewOrt)}
								value={data.bestellareOrt}
								onChange={(v) => onChange({ bestellareOrt: v })}
								placeholder={t(localizationConstants.calcNewPlaceholderOrt)}
							/>
							<FormField
								label={t(localizationConstants.agreementDetailMail)}
								value={data.bestellareMail}
								onChange={(v) => onChange({ bestellareMail: v })}
								placeholder={t(localizationConstants.calcNewPlaceholderMail)}
								type="email"
							/>
							<PhoneField
								label={t(localizationConstants.calcNewTelefon)}
								value={data.bestellareTelefon}
								onChange={(v) => onChange({ bestellareTelefon: v })}
								placeholder={t(localizationConstants.calcNewPlaceholderTelefon)}
							/>
						</div>

						<div className="mt-5 border-t border-slate-100 pt-5">
							<p className="mb-4 text-sm font-medium text-slate-900">
								<Translate text={localizationConstants.calcNewKontaktInfoSection} />
							</p>
							<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
								<FormField
									label={t(localizationConstants.agreementDetailFornamn)}
									value={data.bestellareFornamn}
									onChange={(v) => onChange({ bestellareFornamn: v })}
									placeholder={t(localizationConstants.calcNewPlaceholderFornamn)}
								/>
								<FormField
									label={t(localizationConstants.agreementDetailEfternamn)}
									value={data.bestellareEfternamn}
									onChange={(v) => onChange({ bestellareEfternamn: v })}
									placeholder={t(localizationConstants.calcNewPlaceholderEfternamn)}
								/>
								<FormField
									label={t(localizationConstants.agreementDetailMail)}
									value={data.bestellareKontaktMail}
									onChange={(v) => onChange({ bestellareKontaktMail: v })}
									placeholder={t(localizationConstants.calcNewPlaceholderMail)}
									type="email"
								/>
								<PhoneField
									label={t(localizationConstants.agreementDetailMobil)}
									value={data.bestellareMobil}
									onChange={(v) => onChange({ bestellareMobil: v })}
									placeholder={t(localizationConstants.calcNewPlaceholderTelefon)}
								/>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Entreprenör */}
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium">
						<Briefcase className="h-5 w-5 text-slate-700" />
						<Translate text={localizationConstants.calcNewEntreprenor} />
					</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					<div className="mb-4 flex items-center gap-2">
						<Checkbox
							id="ent-kunduppgifter"
							checked={data.kunduppgifter}
							onCheckedChange={(c) => onChange({ kunduppgifter: Boolean(c) })}
						/>
						<label
							htmlFor="ent-kunduppgifter"
							className="cursor-pointer text-sm font-medium text-slate-700"
						>
							<Translate text={localizationConstants.calcNewKunduppgifter} />
						</label>
					</div>
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

			{/* Kalkylansvarig — Eigen regi mode only */}
			{!isExtend && (
				<Card>
					<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
						<CardTitle className="flex items-center gap-2 text-base font-medium">
							<UserRound className="h-5 w-5 text-slate-700" />
							<Translate text={localizationConstants.calcNewKalkylAnsvarig} />
						</CardTitle>
					</CardHeader>
					<CardContent className="p-6">
						<div className="mb-4 grid gap-1.5">
							<label className="text-sm font-medium text-slate-900">
								<Translate text={localizationConstants.calcNewKontaktperson} />
							</label>
							<Select
								value={data.kontaktperson}
								onValueChange={(v) => onChange({ kontaktperson: v })}
							>
								<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm focus:ring-0">
									<SelectValue placeholder={t(localizationConstants.calcNewPlaceholderKontaktperson)} />
								</SelectTrigger>
								<SelectContent>
									{KONTAKTPERSON_OPTIONS.map((o) => (
										<SelectItem key={o} value={o}>
											{o}
										</SelectItem>
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
										<SelectValue placeholder={t(localizationConstants.calcNewPlaceholderRoll)} />
									</SelectTrigger>
									<SelectContent>
										{ROLL_OPTIONS.map((o) => (
											<SelectItem key={o} value={o}>
												{o}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
