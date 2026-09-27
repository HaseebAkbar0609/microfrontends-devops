"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { WageTypeFormData, WageTypeFormErrors } from "../../../../types/wageTypes.types";
import {
	PERSONAL_TYPE_OPTIONS,
	WAGE_FORM_OPTIONS,
	TRANSACTION_TYPE_OPTIONS,
	UNIT_OPTIONS,
	TAX_OPTIONS,
	EMPLOYER_CONTRIBUTION_OPTIONS,
} from "../../../../constants/wageTypes.constants";

interface CreateWageTypeFormCardProps {
	readonly formData: WageTypeFormData;
	readonly errors: WageTypeFormErrors;
	readonly onUpdateField: <K extends keyof WageTypeFormData>(
		field: K,
		value: WageTypeFormData[K],
	) => void;
}

export function CreateWageTypeFormCard({
	formData,
	errors,
	onUpdateField,
}: CreateWageTypeFormCardProps) {
	return (
		<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
			{/* Section Title */}
			<h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
				<Translate text={localizationConstants.grundInformationSection} />
			</h3>

			<div className="space-y-4 text-xs">
				{/* Row 1: Löneart id & Benämning */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					<div className="space-y-1.5">
						<label className="font-semibold text-slate-800 block">
							<Translate text={localizationConstants.wageTypeIdHeader} />
							<span className="text-red-500 ml-1">*</span>
						</label>
						<Input
							value={formData.loneartId}
							onChange={(e) => onUpdateField("loneartId", e.target.value)}
							placeholder={localizationConstants.wageTypeCodePlaceholder}
							className={`h-10 w-full bg-slate-50/50 border-slate-200 text-sm shadow-2xs ${
								errors.loneartId ? "border-red-500 focus-visible:ring-red-500" : ""
							}`}
						/>
						{errors.loneartId && <p className="text-xs text-red-500">{errors.loneartId}</p>}
					</div>

					<div className="space-y-1.5">
						<label className="font-semibold text-slate-800 block">
							<Translate text={localizationConstants.wageTypeNameHeader} />
							<span className="text-red-500 ml-1">*</span>
						</label>
						<Input
							value={formData.benamning}
							onChange={(e) => onUpdateField("benamning", e.target.value)}
							placeholder={localizationConstants.wageTypeNamePlaceholder}
							className={`h-10 w-full bg-white border-slate-200 text-sm shadow-2xs ${
								errors.benamning ? "border-red-500 focus-visible:ring-red-500" : ""
							}`}
						/>
						{errors.benamning && <p className="text-xs text-red-500">{errors.benamning}</p>}
					</div>
				</div>

				{/* Row 2: Personal typ & Löneform */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					<div className="space-y-1.5">
						<label className="font-semibold text-slate-800 block">
							<Translate text={localizationConstants.wageTypePersonalTypeHeader} />
						</label>
						<Select
							value={formData.personalTyp}
							onValueChange={(val) => onUpdateField("personalTyp", val as WageTypeFormData["personalTyp"])}
						>
							<SelectTrigger className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs">
								<SelectValue placeholder={localizationConstants.wageTypeSelectPersonalTypePlaceholder} />
							</SelectTrigger>
							<SelectContent className="bg-white border-slate-200">
								{PERSONAL_TYPE_OPTIONS.map((opt) => (
									<SelectItem key={opt.value} value={opt.value}>
										<Translate text={opt.labelKey} />
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-1.5">
						<label className="font-semibold text-slate-800 block">
							<Translate text={localizationConstants.wageTypeWageFormHeader} />
						</label>
						<Select
							value={formData.loneform}
							onValueChange={(val) => onUpdateField("loneform", val as WageTypeFormData["loneform"])}
						>
							<SelectTrigger className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs">
								<SelectValue placeholder={localizationConstants.wageTypeSelectWageFormPlaceholder} />
							</SelectTrigger>
							<SelectContent className="bg-white border-slate-200">
								{WAGE_FORM_OPTIONS.map((opt) => (
									<SelectItem key={opt.value} value={opt.value}>
										<Translate text={opt.labelKey} />
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Row 3: Transaktionstyp & Enhet */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					<div className="space-y-1.5">
						<label className="font-semibold text-slate-800 block">
							<Translate text={localizationConstants.wageTypeTransactionTypeHeader} />
						</label>
						<Select
							value={formData.transaktionstyp}
							onValueChange={(val) => onUpdateField("transaktionstyp", val as WageTypeFormData["transaktionstyp"])}
						>
							<SelectTrigger className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs">
								<SelectValue placeholder={localizationConstants.wageTypeSelectTransactionTypePlaceholder} />
							</SelectTrigger>
							<SelectContent className="bg-white border-slate-200">
								{TRANSACTION_TYPE_OPTIONS.map((opt) => (
									<SelectItem key={opt.value} value={opt.value}>
										<Translate text={opt.labelKey} />
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-1.5">
						<label className="font-semibold text-slate-800 block">
							<Translate text={localizationConstants.wageTypeUnitHeader} />
							<span className="text-red-500 ml-1">*</span>
						</label>
						<Select
							value={formData.enhet}
							onValueChange={(val) => onUpdateField("enhet", val as WageTypeFormData["enhet"])}
						>
							<SelectTrigger className={`h-10 w-full bg-white border-slate-200 text-sm shadow-2xs ${
								errors.enhet ? "border-red-500" : ""
							}`}>
								<SelectValue placeholder={localizationConstants.wageTypeSelectUnitPlaceholder} />
							</SelectTrigger>
							<SelectContent className="bg-white border-slate-200">
								{UNIT_OPTIONS.map((opt) => (
									<SelectItem key={opt.value} value={opt.value}>
										<Translate text={opt.labelKey} />
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.enhet && <p className="text-xs text-red-500">{errors.enhet}</p>}
					</div>
				</div>

				{/* Row 4: Preliminärskatt % & Arbetsgivaravgifter % */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					<div className="space-y-1.5">
						<label className="font-semibold text-slate-800 block">
							<Translate text={localizationConstants.wageTypePreliminaryTaxHeader} />
						</label>
						<Select
							value={formData.preliminarskatt}
							onValueChange={(val) => onUpdateField("preliminarskatt", val)}
						>
							<SelectTrigger className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs">
								<SelectValue placeholder={localizationConstants.wageTypeSelectTaxPlaceholder} />
							</SelectTrigger>
							<SelectContent className="bg-white border-slate-200">
								{TAX_OPTIONS.map((opt) => (
									<SelectItem key={opt.value} value={opt.value}>
										<Translate text={opt.labelKey} />
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-1.5">
						<label className="font-semibold text-slate-800 block">
							<Translate text={localizationConstants.wageTypeEmployerContributionHeader} />
						</label>
						<Select
							value={formData.arbetsgivaravgift}
							onValueChange={(val) => onUpdateField("arbetsgivaravgift", val)}
						>
							<SelectTrigger className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs">
								<SelectValue placeholder={localizationConstants.wageTypeSelectContributionPlaceholder} />
							</SelectTrigger>
							<SelectContent className="bg-white border-slate-200">
								{EMPLOYER_CONTRIBUTION_OPTIONS.map((opt) => (
									<SelectItem key={opt.value} value={opt.value}>
										<Translate text={opt.labelKey} />
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Row 5: Konto debet & Konto kredit */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					<div className="space-y-1.5">
						<label className="font-semibold text-slate-800 block">
							<Translate text={localizationConstants.wageTypeAccountDebitLabel} />
						</label>
						<Input
							value={formData.kontoDebet}
							onChange={(e) => onUpdateField("kontoDebet", e.target.value)}
							placeholder={localizationConstants.wageTypeAccountPlaceholder}
							className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="font-semibold text-slate-800 block">
							<Translate text={localizationConstants.wageTypeAccountCreditLabel} />
						</label>
						<Input
							value={formData.kontoKredit}
							onChange={(e) => onUpdateField("kontoKredit", e.target.value)}
							placeholder={localizationConstants.wageTypeAccountCreditPlaceholder}
							className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs"
						/>
					</div>
				</div>

				{/* Row 6: Mot konto AG & AG underlag */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					<div className="space-y-1.5">
						<label className="font-semibold text-slate-800 block">
							<Translate text={localizationConstants.wageTypeAccountOppositeAGLabel} />
						</label>
						<Input
							value={formData.motKontoAG}
							onChange={(e) => onUpdateField("motKontoAG", e.target.value)}
							placeholder={localizationConstants.wageTypeOppositeAGPlaceholder}
							className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs"
						/>
					</div>

					<div className="space-y-2">
						<label className="font-semibold text-slate-800 block">
							<Translate text={localizationConstants.wageTypeAgUnderlagLabel} />
						</label>
						<div className="flex items-center gap-6 pt-1">
							<label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
								<input
									type="radio"
									name="agUnderlag"
									checked={formData.agUnderlag === true}
									onChange={() => onUpdateField("agUnderlag", true)}
									className="h-4 w-4 text-slate-900 border-slate-300 focus:ring-slate-900"
								/>
								<Translate text={localizationConstants.yesLabel} />
							</label>
							<label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
								<input
									type="radio"
									name="agUnderlag"
									checked={formData.agUnderlag === false}
									onChange={() => onUpdateField("agUnderlag", false)}
									className="h-4 w-4 text-slate-900 border-slate-300 focus:ring-slate-900"
								/>
								<Translate text={localizationConstants.noLabel} />
							</label>
						</div>
					</div>
				</div>

				{/* Row 7: Semestergrundad & AGI - KOD */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					<div className="space-y-2">
						<label className="font-semibold text-slate-800 block">
							<Translate text={localizationConstants.wageTypeSemestergrundadLabel} />
						</label>
						<div className="flex items-center gap-6 pt-1">
							<label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
								<input
									type="radio"
									name="semestergrundad"
									checked={formData.semestergrundad === true}
									onChange={() => onUpdateField("semestergrundad", true)}
									className="h-4 w-4 text-slate-900 border-slate-300 focus:ring-slate-900"
								/>
								<Translate text={localizationConstants.yesLabel} />
							</label>
							<label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
								<input
									type="radio"
									name="semestergrundad"
									checked={formData.semestergrundad === false}
									onChange={() => onUpdateField("semestergrundad", false)}
									className="h-4 w-4 text-slate-900 border-slate-300 focus:ring-slate-900"
								/>
								<Translate text={localizationConstants.noLabel} />
							</label>
						</div>
					</div>

					<div className="space-y-1.5">
						<label className="font-semibold text-slate-800 block">
							<Translate text={localizationConstants.wageTypeAgiCodeLabel} />
						</label>
						<Input
							value={formData.agiKod}
							onChange={(e) => onUpdateField("agiKod", e.target.value)}
							placeholder={localizationConstants.wageTypeAgiCodePlaceholder}
							className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs"
						/>
					</div>
				</div>

				{/* Row 8: Beskrivning */}
				<div className="space-y-1.5">
					<label className="font-semibold text-slate-800 block">
						<Translate text={localizationConstants.wageTypeDescriptionLabel} />
					</label>
					<Input
						value={formData.beskrivning}
						onChange={(e) => onUpdateField("beskrivning", e.target.value)}
						placeholder={localizationConstants.wageTypeDescriptionPlaceholder}
						className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs"
					/>
				</div>
			</div>
		</div>
	);
}
