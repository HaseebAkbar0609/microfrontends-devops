"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRound } from "lucide-react";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { KONTAKTPERSON_OPTIONS } from "../../constants/createForfragnOptions";

// ── Types ──────────────────────────────────────────────────────────────────

export interface ForfragnKontaktData {
	fornamn: string;
	efternamn: string;
	email: string;
	telefon: string;
	kontaktperson: string;
	roll: string;
}

export const DEFAULT_KONTAKT: ForfragnKontaktData = {
	fornamn: "",
	efternamn: "",
	email: "",
	telefon: "",
	kontaktperson: "",
	roll: "",
};

// ── Sub-components ─────────────────────────────────────────────────────────

interface StepFormFieldProps {
	label: string;
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
	required?: boolean;
	type?: string;
	hasError?: boolean;
	errorMsg?: string;
}

function StepFormField({
	label,
	value,
	onChange,
	placeholder,
	required,
	type = "text",
	hasError,
	errorMsg,
}: StepFormFieldProps) {
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
				className={`h-10 w-full rounded-md border bg-white px-3 text-sm focus-visible:border-slate-400 focus-visible:outline-none ${
					hasError ? "border-red-400 focus-visible:border-red-400" : "border-slate-200"
				}`}
			/>
			{hasError && errorMsg && (
				<p className="text-xs text-red-500">{errorMsg}</p>
			)}
		</div>
	);
}

// ── Main component ─────────────────────────────────────────────────────────

export interface ForfragnKontaktStepProps {
	data: ForfragnKontaktData;
	onChange: (patch: Partial<ForfragnKontaktData>) => void;
	emailError?: boolean;
	phoneError?: boolean;
}

export function ForfragnKontaktStep({
	data,
	onChange,
	emailError,
	phoneError,
}: ForfragnKontaktStepProps) {
	const t = useTranslate();

	return (
		<div className="flex flex-col gap-4">
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium">
						<UserRound className="h-5 w-5 text-slate-700" />
						<Translate text={localizationConstants.calcInquiryWizStep2} />
					</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					<div className="mb-5 grid gap-1.5">
						<label className="text-sm font-medium text-slate-900">
							<Translate text={localizationConstants.calcInquiryWizContactPerson} />
						</label>
						<Select
							value={data.kontaktperson}
							onValueChange={(v) => onChange({ kontaktperson: v })}
						>
							<SelectTrigger className="h-10 border-slate-200 bg-white text-sm focus:ring-0">
								<SelectValue
									placeholder={t(localizationConstants.calcInquiryWizContactPerson)}
								/>
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
						<StepFormField
							label={t(localizationConstants.agreementDetailFornamn)}
							value={data.fornamn}
							onChange={(v) => onChange({ fornamn: v })}
							placeholder={t(localizationConstants.agreementDetailFornamn)}
							required
						/>
						<StepFormField
							label={t(localizationConstants.agreementDetailEfternamn)}
							value={data.efternamn}
							onChange={(v) => onChange({ efternamn: v })}
							placeholder={t(localizationConstants.agreementDetailEfternamn)}
							required
						/>
						<StepFormField
							label={t(localizationConstants.agreementDetailMail)}
							value={data.email}
							onChange={(v) => onChange({ email: v })}
							placeholder="name@example.test"
							required
							type="email"
							hasError={emailError}
							errorMsg={t(localizationConstants.calcInquiryWizEmailErr)}
						/>
						<StepFormField
							label={t(localizationConstants.calcNewTelefon)}
							value={data.telefon}
							onChange={(v) => onChange({ telefon: v })}
							placeholder="+46 70 000 00 00"
							required
							type="tel"
							hasError={phoneError}
							errorMsg={t(localizationConstants.calcInquiryWizPhoneErr)}
						/>
						<StepFormField
							label={t(localizationConstants.agreementDetailRoll)}
							value={data.roll}
							onChange={(v) => onChange({ roll: v })}
							placeholder={t(localizationConstants.agreementDetailRoll)}
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
