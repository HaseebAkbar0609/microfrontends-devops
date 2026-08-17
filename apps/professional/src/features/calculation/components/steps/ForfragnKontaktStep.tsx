"use client";

import { Folder } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { KONTAKTPERSON_OPTIONS } from "../../constants/createForfragnOptions";
import type { ForfragnKontaktData } from "../../types/forfragan";

// ── Sub-components ─────────────────────────────────────────────────────────

interface StepFormFieldProps {
	label: string;
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
	required?: boolean;
	type?: string;
	hasError?: boolean;
}

function StepFormField({
	label,
	value,
	onChange,
	placeholder,
	required,
	type = "text",
	hasError,
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
				className={`h-10 w-full rounded-md border bg-white px-3 text-sm focus-visible:outline-none ${
					hasError
						? "border-red-400 focus-visible:border-red-500"
						: "border-slate-200 focus-visible:border-slate-400"
				}`}
			/>
		</div>
	);
}

// ── Main component ─────────────────────────────────────────────────────────

export interface ForfragnKontaktStepProps {
	data: ForfragnKontaktData;
	onChange: (patch: Partial<ForfragnKontaktData>) => void;
	showErrors?: boolean;
	emailError?: boolean;
	phoneError?: boolean;
}

export function ForfragnKontaktStep({
	data,
	onChange,
	showErrors,
	emailError,
	phoneError,
}: ForfragnKontaktStepProps) {
	const t = useTranslate();

	return (
		<div className="flex flex-col gap-4">
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium">
						<Folder className="h-5 w-5 text-slate-700" />
						<Translate text={localizationConstants.calcNewStep1Tab} />
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
							<SelectTrigger className="h-10 border-slate-200 bg-white text-sm focus:ring-0">
								<SelectValue />
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
							placeholder={t(localizationConstants.createForfrgnPlaceholderFornamn)}
							required
							hasError={showErrors && !data.fornamn.trim()}
						/>
						<StepFormField
							label={t(localizationConstants.agreementDetailEfternamn)}
							value={data.efternamn}
							onChange={(v) => onChange({ efternamn: v })}
							placeholder={t(localizationConstants.createForfrgnPlaceholderEfternamn)}
						/>
						<StepFormField
							label={t(localizationConstants.b2bAvtalAdress)}
							value={data.adress}
							onChange={(v) => onChange({ adress: v })}
							placeholder={t(localizationConstants.createForfrgnPlaceholderAdress)}
						/>
						<StepFormField
							label={t(localizationConstants.calcNewPostNr)}
							value={data.postNr}
							onChange={(v) => onChange({ postNr: v })}
							placeholder={t(localizationConstants.createForfrgnPlaceholderPostNr)}
						/>
						<StepFormField
							label={t(localizationConstants.agreementDetailMail)}
							value={data.mail}
							onChange={(v) => onChange({ mail: v })}
							placeholder={t(localizationConstants.createForfrgnPlaceholderMail)}
							type="email"
							hasError={emailError}
						/>
						<div className="grid gap-1.5">
							<label className="text-sm font-medium text-slate-900">
								<Translate text={localizationConstants.calcNewTelefon} />
							</label>
							<div className="flex items-center">
								<span className="flex h-10 items-center rounded-l-md border border-r-0 border-slate-200 bg-white px-3 text-sm text-slate-600">
									+46
								</span>
								<input
									type="text"
									value={data.telefon}
									onChange={(e) => onChange({ telefon: e.target.value })}
									placeholder={t(localizationConstants.createForfrgnPlaceholderTelefon)}
									className={`h-10 w-full rounded-r-md border bg-white px-3 text-sm focus-visible:outline-none ${
										phoneError
											? "border-red-400 focus-visible:border-red-500"
											: "border-slate-200 focus-visible:border-slate-400"
									}`}
								/>
							</div>
						</div>
						<StepFormField
							label={t(localizationConstants.calcNewOrt)}
							value={data.ort}
							onChange={(v) => onChange({ ort: v })}
							placeholder={t(localizationConstants.createForfrgnPlaceholderOrt)}
						/>
						<div className="grid gap-1.5">
							<label className="text-sm font-medium text-slate-900">
								<Translate text={localizationConstants.agreementDetailRoll} />
							</label>
							<input
								type="text"
								value={t(localizationConstants.b2bAvtalBestellare)}
								readOnly
								className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700"
							/>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
