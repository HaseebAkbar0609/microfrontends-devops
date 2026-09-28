"use client";

import React from "react";
import { Folder, ClipboardList, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type { KalkylProjektData } from "../../types/kalkyl";
import {
	TYPE_OPTIONS,
	KATEGORI_OPTIONS,
	AVDELNING_OPTIONS,
} from "../../constants";

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

interface KalkylProjektStepProps {
	data: KalkylProjektData;
	showErrors?: boolean;
	onChange: (patch: Partial<KalkylProjektData>) => void;
	onNext?: () => void;
	onChangeAction?: () => void;
}

export function KalkylProjektStep({
	data,
	showErrors,
	onChange,
	onNext,
	onChangeAction,
}: KalkylProjektStepProps) {
	const t = useTranslate();

	return (
		<div className="flex flex-col gap-6">
			{/* 1. Projekt Details Card */}
			<Card className="gap-0 overflow-hidden rounded-lg border border-slate-200 bg-white py-0 pb-0 shadow-none">
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
						<Folder className="h-5 w-5 text-slate-700" />
						<Translate text={localizationConstants.calcNewProjekt} />
					</CardTitle>
				</CardHeader>

				<CardContent className="px-6 py-5">
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<FormField
							label={t(localizationConstants.calcNewProjektNr)}
							value={data.projektNr}
							onChange={(v) => onChange({ projektNr: v })}
							placeholder={t(localizationConstants.calcNewPlaceholderAngeProjektnr)}
						/>

						<FormField
							label={t(localizationConstants.projectName)}
							value={data.projektNamn}
							onChange={(v) => onChange({ projektNamn: v })}
							placeholder={t(localizationConstants.calcNewPlaceholderAngeProjektnamn)}
							required
							error={showErrors && !data.projektNamn.trim()}
							errorMessage={t(localizationConstants.calcNewValidationNameRequired)}
						/>

						<FormField
							label={t(localizationConstants.calcNewKvartersNamn)}
							value={data.kvartersNamn}
							onChange={(v) => onChange({ kvartersNamn: v })}
							placeholder={t(localizationConstants.calcNewPlaceholderAngeKvartersNamn)}
						/>

						<FormField
							label={t(localizationConstants.calcNewProjektAdress)}
							value={data.projektAdress}
							onChange={(v) => onChange({ projektAdress: v })}
							placeholder={t(localizationConstants.calcNewPlaceholderAngeProjektAdress)}
						/>

						<FormField
							label={t(localizationConstants.calcNewPostNr)}
							value={data.postNr}
							onChange={(v) => onChange({ postNr: v.replace(/[^0-9 ]/g, "") })}
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

			{/* 2. Projekt Information Card */}
			<Card className="gap-0 overflow-hidden rounded-lg border border-slate-200 bg-white py-0 pb-0 shadow-none">
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
						<ClipboardList className="h-5 w-5 text-slate-700" />
						<Translate text={localizationConstants.calcNewProjektInfo} />
					</CardTitle>
				</CardHeader>

				<CardContent className="px-6 py-5">
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						{/* Type Dropdown */}
						<div className="flex flex-col gap-1.5">
							<Label className="text-sm font-medium text-slate-900 mb-0">
								<Translate text={localizationConstants.calcProType} />
							</Label>
							<Select value={data.type} onValueChange={(v) => onChange({ type: v })}>
								<SelectTrigger className="h-10 w-full rounded-md border-slate-200 bg-white text-sm text-slate-900 focus:ring-0 [&_svg]:text-slate-900 [&_svg]:opacity-100">
									<SelectValue placeholder={t(localizationConstants.calcNewPlaceholderAngeType)} />
								</SelectTrigger>
								<SelectContent>
									{TYPE_OPTIONS.map((o) => (
										<SelectItem key={o} value={o} className="text-sm">
											{o}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Kategori Dropdown */}
						<div className="flex flex-col gap-1.5">
							<Label className="text-sm font-medium text-slate-900 mb-0">
								<Translate text={localizationConstants.category} />
							</Label>
							<Select value={data.kategori} onValueChange={(v) => onChange({ kategori: v })}>
								<SelectTrigger className="h-10 w-full rounded-md border-slate-200 bg-white text-sm text-slate-900 focus:ring-0 [&_svg]:text-slate-900 [&_svg]:opacity-100">
									<SelectValue placeholder={t(localizationConstants.calcNewPlaceholderAngeKategori)} />
								</SelectTrigger>
								<SelectContent>
									{KATEGORI_OPTIONS.map((o) => (
										<SelectItem key={o} value={o} className="text-sm">
											{o}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Advelning Dropdown */}
						<div className="flex flex-col gap-1.5">
							<Label className="text-sm font-medium text-slate-900 mb-0">
								<Translate text={localizationConstants.calcNewAvdelning} />
							</Label>
							<Select value={data.avdelning} onValueChange={(v) => onChange({ avdelning: v })}>
								<SelectTrigger className="h-10 w-full rounded-md border-slate-200 bg-white text-sm text-slate-900 focus:ring-0 [&_svg]:text-slate-900 [&_svg]:opacity-100">
									<SelectValue placeholder={t(localizationConstants.calcNewPlaceholderAngeAdvelning)} />
								</SelectTrigger>
								<SelectContent>
									{AVDELNING_OPTIONS.map((o) => (
										<SelectItem key={o} value={o} className="text-sm">
											{o}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<FormField
							label={t(localizationConstants.calcNewKontraktsumma)}
							value={data.kontraktsumma}
							onChange={(v) => onChange({ kontraktsumma: v.replace(/[^0-9 krSEK\s.,]/g, "") })}
							placeholder={t(localizationConstants.calcNewPlaceholderAngeKontraktsumma)}
						/>

						<FormField
							label={t(localizationConstants.calcNewOffertNr)}
							value={data.offertNr}
							onChange={(v) => onChange({ offertNr: v })}
							placeholder={t(localizationConstants.calcNewPlaceholderAngeOfferNr)}
						/>

						<FormField
							label={t(localizationConstants.calcStatStartDate)}
							value={data.startDatum}
							onChange={(v) => onChange({ startDatum: v })}
							placeholder={t(localizationConstants.calcNewPlaceholderAngeStartDatum)}
						/>

						<FormField
							label={t(localizationConstants.calcStatEndDate)}
							value={data.slutDatum}
							onChange={(v) => onChange({ slutDatum: v })}
							placeholder={t(localizationConstants.calcNewPlaceholderAngeSlutDatum)}
						/>

						<FormField
							label={t(localizationConstants.calcNewSenasteDatum)}
							value={data.senasteDatum}
							onChange={(v) => onChange({ senasteDatum: v })}
							placeholder={t(localizationConstants.calcNewPlaceholderSenasteDatum)}
						/>
					</div>
				</CardContent>
			</Card>

			{/* 3. Action Buttons below form cards */}
			<div className="flex items-center justify-end gap-3 pt-2">
				<Button
					type="button"
					onClick={onChangeAction}
					className="h-9 cursor-pointer gap-1.5 rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-800"
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.calcNewChangeBtn} />
				</Button>

				{onNext && (
					<Button
						type="button"
						onClick={onNext}
						className="h-9 cursor-pointer gap-1.5 rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-800"
					>
						<Translate text={localizationConstants.nextButton} />
						<ArrowRight className="h-4 w-4" />
					</Button>
				)}
			</div>
		</div>
	);
}
