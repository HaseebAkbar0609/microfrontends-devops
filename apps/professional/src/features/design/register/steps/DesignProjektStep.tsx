"use client";

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
import type { DesignProjektData } from "../types/designRegister";

const TYPE_OPTIONS = ["Total", "General", "Löpande", "Samverkan"];
const KATEGORI_OPTIONS = ["Bygg", "El", "VVS", "Mark", "Design"];
const AVDELNING_OPTIONS = ["Avdelning 1", "Avdelning 2", "Avdelning 3"];

interface FormFieldProps {
	label: string;
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
	required?: boolean;
	error?: boolean;
}

function FormField({ label, value, onChange, placeholder, required, error }: FormFieldProps) {
	return (
		<div className="grid gap-1.5">
			<label className="text-sm font-medium text-slate-900">
				{label}
				{required && <span className="ml-0.5 text-red-500">*</span>}
			</label>
			<input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className={`h-10 w-full rounded-md border bg-white px-3 text-sm focus-visible:border-slate-400 focus-visible:outline-none ${
					error ? "border-red-400" : "border-slate-200"
				}`}
			/>
		</div>
	);
}

interface DesignProjektStepProps {
	data: DesignProjektData;
	onChange: (patch: Partial<DesignProjektData>) => void;
	showErrors?: boolean;
}

export function DesignProjektStep({ data, onChange, showErrors }: DesignProjektStepProps) {
	const t = useTranslate();

	return (
		<div className="flex flex-col gap-4">
			{/* Projektering */}
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium">
						<Checkbox id="projektering-section" />
						<label htmlFor="projektering-section" className="cursor-pointer text-base font-medium text-slate-900">
							<Translate text={localizationConstants.designRegNewProjektering} />
						</label>
					</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<FormField
							label={t(localizationConstants.designRegNewProjekteringNr)}
							value={data.projekteringNr}
							onChange={(v) => onChange({ projekteringNr: v })}
							placeholder={t(localizationConstants.designRegNewPlaceholderProjekteringNr)}
						/>
						<FormField
							label={t(localizationConstants.designRegNewProjekteringNamn)}
							value={data.projekteringNamn}
							onChange={(v) => onChange({ projekteringNamn: v })}
							placeholder={t(localizationConstants.designRegNewPlaceholderProjekteringNamn)}
							required
							error={showErrors && !data.projekteringNamn.trim()}
						/>
						<FormField
							label={t(localizationConstants.designRegNewKvarteraNamn)}
							value={data.kvarteraNamn}
							onChange={(v) => onChange({ kvarteraNamn: v })}
							placeholder={t(localizationConstants.designRegNewPlaceholderKvarteraNamn)}
						/>
						<FormField
							label={t(localizationConstants.designRegNewProjekteringAdress)}
							value={data.projekteringAdress}
							onChange={(v) => onChange({ projekteringAdress: v })}
							placeholder={t(localizationConstants.designRegNewPlaceholderProjekteringAdress)}
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
					</div>
				</CardContent>
			</Card>

			{/* Projektering Information */}
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium">
						<Checkbox id="projektering-info-section" />
						<label htmlFor="projektering-info-section" className="cursor-pointer text-base font-medium text-slate-900">
							<Translate text={localizationConstants.designRegNewProjekteringInfo} />
						</label>
					</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<div className="grid gap-1.5">
							<label className="text-sm font-medium text-slate-900">
								<Translate text={localizationConstants.calcProType} />
							</label>
							<Select value={data.type} onValueChange={(v) => onChange({ type: v })}>
								<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm focus:ring-0">
									<SelectValue placeholder={t(localizationConstants.designRegNewPlaceholderTyp)} />
								</SelectTrigger>
								<SelectContent>
									{TYPE_OPTIONS.map((o) => (
										<SelectItem key={o} value={o}>{o}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="grid gap-1.5">
							<label className="text-sm font-medium text-slate-900">
								<Translate text={localizationConstants.category} />
							</label>
							<Select value={data.kategori} onValueChange={(v) => onChange({ kategori: v })}>
								<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm focus:ring-0">
									<SelectValue placeholder={t(localizationConstants.designRegNewPlaceholderKategori)} />
								</SelectTrigger>
								<SelectContent>
									{KATEGORI_OPTIONS.map((o) => (
										<SelectItem key={o} value={o}>{o}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="grid gap-1.5">
							<label className="text-sm font-medium text-slate-900">
								<Translate text={localizationConstants.calcNewAvdelning} />
							</label>
							<Select value={data.avdelning} onValueChange={(v) => onChange({ avdelning: v })}>
								<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm focus:ring-0">
									<SelectValue placeholder={t(localizationConstants.designRegNewPlaceholderAvdelning)} />
								</SelectTrigger>
								<SelectContent>
									{AVDELNING_OPTIONS.map((o) => (
										<SelectItem key={o} value={o}>{o}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<FormField
							label={t(localizationConstants.calcStatStartDate)}
							value={data.startDatum}
							onChange={(v) => onChange({ startDatum: v })}
							placeholder={t(localizationConstants.designRegNewPlaceholderStartDatum)}
						/>

						<FormField
							label={t(localizationConstants.calcStatEndDate)}
							value={data.slutDatum}
							onChange={(v) => onChange({ slutDatum: v })}
							placeholder={t(localizationConstants.designRegNewPlaceholderSlutDatum)}
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
