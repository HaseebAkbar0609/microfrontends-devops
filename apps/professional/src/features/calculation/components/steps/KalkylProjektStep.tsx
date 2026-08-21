"use client";

import { FileText, Folder } from "lucide-react";
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
import type { KalkylProjektData } from "../../types/kalkyl";

// ── Constants ──────────────────────────────────────────────────────────────

const TYPE_OPTIONS = ["Total", "General", "Löpande", "Samverkan"];
const KATEGORI_OPTIONS = ["Bygg", "El", "VVS", "Mark"];
const AVDELNING_OPTIONS = ["Avdelning 1", "Avdelning 2", "Avdelning 3"];

// ── Sub-components ─────────────────────────────────────────────────────────

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

// ── Main component ─────────────────────────────────────────────────────────

interface KalkylProjektStepProps {
	data: KalkylProjektData;
	onChange: (patch: Partial<KalkylProjektData>) => void;
	showErrors?: boolean;
}

export function KalkylProjektStep({ data, onChange, showErrors }: KalkylProjektStepProps) {
	const t = useTranslate();

	return (
		<div className="flex flex-col gap-4">
			{/* Projekt */}
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium">
						<Folder className="h-5 w-5 text-slate-700" />
						<Translate text={localizationConstants.calcNewProjekt} />
					</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<FormField
							label={t(localizationConstants.calcNewProjektNr)}
							value={data.projektNr}
							onChange={(v) => onChange({ projektNr: v })}
							placeholder={t(localizationConstants.calcNewPlaceholderProjektNr)}
						/>
						<FormField
							label={t(localizationConstants.projectName)}
							value={data.projektNamn}
							onChange={(v) => onChange({ projektNamn: v })}
							placeholder={t(localizationConstants.calcNewPlaceholderProjektNamn)}
							required
							error={showErrors && !data.projektNamn.trim()}
						/>
						<FormField
							label={t(localizationConstants.calcNewKvartersNamn)}
							value={data.kvartersNamn}
							onChange={(v) => onChange({ kvartersNamn: v })}
							placeholder={t(localizationConstants.calcNewPlaceholderKvartersNamn)}
						/>
						<FormField
							label={t(localizationConstants.calcNewProjektAdress)}
							value={data.projektAdress}
							onChange={(v) => onChange({ projektAdress: v })}
							placeholder={t(localizationConstants.calcNewPlaceholderProjektAdress)}
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

			{/* Projekt Information */}
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium">
						<FileText className="h-5 w-5 text-slate-700" />
						<Translate text={localizationConstants.calcNewProjektInfo} />
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
									<SelectValue placeholder={t(localizationConstants.calcNewPlaceholderType)} />
								</SelectTrigger>
								<SelectContent>
									{TYPE_OPTIONS.map((o) => (
										<SelectItem key={o} value={o}>
											{o}
										</SelectItem>
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
									<SelectValue placeholder={t(localizationConstants.calcNewPlaceholderKategori)} />
								</SelectTrigger>
								<SelectContent>
									{KATEGORI_OPTIONS.map((o) => (
										<SelectItem key={o} value={o}>
											{o}
										</SelectItem>
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
									<SelectValue placeholder={t(localizationConstants.calcNewPlaceholderAvdelning)} />
								</SelectTrigger>
								<SelectContent>
									{AVDELNING_OPTIONS.map((o) => (
										<SelectItem key={o} value={o}>
											{o}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<FormField
							label={t(localizationConstants.calcNewKontraktsumma)}
							value={data.kontraktsumma}
							onChange={(v) => onChange({ kontraktsumma: v })}
							placeholder={t(localizationConstants.calcNewPlaceholderKontraktsumma)}
						/>
						<FormField
							label={t(localizationConstants.calcNewOffertNr)}
							value={data.offertNr}
							onChange={(v) => onChange({ offertNr: v })}
							placeholder={t(localizationConstants.calcNewPlaceholderOffertNr)}
						/>
						<FormField
							label={t(localizationConstants.calcStatStartDate)}
							value={data.startDatum}
							onChange={(v) => onChange({ startDatum: v })}
							placeholder={t(localizationConstants.calcNewPlaceholderStartDatum)}
						/>
						<FormField
							label={t(localizationConstants.calcStatEndDate)}
							value={data.slutDatum}
							onChange={(v) => onChange({ slutDatum: v })}
							placeholder={t(localizationConstants.calcNewPlaceholderSlutDatum)}
						/>
						<FormField
							label={t(localizationConstants.calcNewSenasteDatum)}
							value={data.senatsDatum}
							onChange={(v) => onChange({ senatsDatum: v })}
							placeholder="2026-01-15"
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
