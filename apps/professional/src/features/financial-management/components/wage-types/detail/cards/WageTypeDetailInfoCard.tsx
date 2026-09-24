"use client";

import React, { useMemo } from "react";
import { Edit2, Trash2, Save, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	WageTypeItem,
	WageTypeFormData,
	WageTypeFormErrors,
} from "../../../../types/wageTypes.types";
import {
	PERSONAL_TYPE_OPTIONS,
	WAGE_FORM_OPTIONS,
	TRANSACTION_TYPE_OPTIONS,
	UNIT_OPTIONS,
	TAX_OPTIONS,
	EMPLOYER_CONTRIBUTION_OPTIONS,
} from "../../../../constants/wageTypes.constants";

interface WageTypeDetailInfoCardProps {
	readonly wageType: WageTypeItem;
	readonly isEditing: boolean;
	readonly isSubmitting: boolean;
	readonly editData: WageTypeFormData | null;
	readonly errors: WageTypeFormErrors;
	readonly onUpdateField: <K extends keyof WageTypeFormData>(
		field: K,
		value: WageTypeFormData[K],
	) => void;
	readonly onStartEdit: () => void;
	readonly onCancelEdit: () => void;
	readonly onSave: () => void;
	readonly onDelete: () => void;
}

export function WageTypeDetailInfoCard({
	wageType,
	isEditing,
	isSubmitting,
	editData,
	errors,
	onUpdateField,
	onStartEdit,
	onCancelEdit,
	onSave,
	onDelete,
}: WageTypeDetailInfoCardProps) {
	const personalTypeMap = useMemo(() => {
		const map: Record<string, string> = {};
		PERSONAL_TYPE_OPTIONS.forEach((opt) => {
			map[opt.value] = opt.labelKey;
		});
		return map;
	}, []);

	const wageFormMap = useMemo(() => {
		const map: Record<string, string> = {};
		WAGE_FORM_OPTIONS.forEach((opt) => {
			map[opt.value] = opt.labelKey;
		});
		return map;
	}, []);

	const transactionTypeMap = useMemo(() => {
		const map: Record<string, string> = {};
		TRANSACTION_TYPE_OPTIONS.forEach((opt) => {
			map[opt.value] = opt.labelKey;
		});
		return map;
	}, []);

	const unitMap = useMemo(() => {
		const map: Record<string, string> = {};
		UNIT_OPTIONS.forEach((opt) => {
			map[opt.value] = opt.labelKey;
		});
		return map;
	}, []);

	return (
		<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
			{/* Card Header */}
			<div className="flex items-center justify-between border-b border-slate-100 pb-3">
				<h3 className="text-sm font-bold text-slate-900">
					<Translate text={localizationConstants.grundInformationSection} />
				</h3>
				{!isEditing && (
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={onStartEdit}
							className="h-8 px-3 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5 cursor-pointer shadow-2xs"
						>
							<Edit2 className="h-3.5 w-3.5" />
							<Translate text={localizationConstants.editButtonText} />
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={onDelete}
							className="h-8 px-3 text-xs border-red-200 text-red-600 hover:bg-red-50 gap-1.5 cursor-pointer shadow-2xs"
						>
							<Trash2 className="h-3.5 w-3.5" />
							<Translate text={localizationConstants.deleteConfirmButton} />
						</Button>
					</div>
				)}
			</div>

			{isEditing && editData ? (
				/* Edit Mode */
				<div className="space-y-4 text-xs">
					{/* Row 1: Löneart id & Benämning */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div className="space-y-1.5">
							<label className="font-semibold text-slate-800 block">
								<Translate text={localizationConstants.wageTypeIdHeader} />
								<span className="text-red-500 ml-1">*</span>
							</label>
							<Input
								value={editData.loneartId}
								onChange={(e) => onUpdateField("loneartId", e.target.value)}
								className={`h-10 w-full bg-slate-50/50 border-slate-200 text-sm shadow-2xs ${
									errors.loneartId ? "border-red-500" : ""
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
								value={editData.benamning}
								onChange={(e) => onUpdateField("benamning", e.target.value)}
								className={`h-10 w-full bg-white border-slate-200 text-sm shadow-2xs ${
									errors.benamning ? "border-red-500" : ""
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
								value={editData.personalTyp}
								onValueChange={(val) => onUpdateField("personalTyp", val as WageTypeFormData["personalTyp"])}
							>
								<SelectTrigger className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs">
									<SelectValue />
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
								value={editData.loneform}
								onValueChange={(val) => onUpdateField("loneform", val as WageTypeFormData["loneform"])}
							>
								<SelectTrigger className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs">
									<SelectValue />
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
								value={editData.transaktionstyp}
								onValueChange={(val) => onUpdateField("transaktionstyp", val as WageTypeFormData["transaktionstyp"])}
							>
								<SelectTrigger className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs">
									<SelectValue />
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
								value={editData.enhet}
								onValueChange={(val) => onUpdateField("enhet", val as WageTypeFormData["enhet"])}
							>
								<SelectTrigger className={`h-10 w-full bg-white border-slate-200 text-sm shadow-2xs ${
									errors.enhet ? "border-red-500" : ""
								}`}>
									<SelectValue />
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
								value={editData.preliminarskatt}
								onValueChange={(val) => onUpdateField("preliminarskatt", val)}
							>
								<SelectTrigger className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs">
									<SelectValue />
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
								value={editData.arbetsgivaravgift}
								onValueChange={(val) => onUpdateField("arbetsgivaravgift", val)}
							>
								<SelectTrigger className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs">
									<SelectValue />
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
								value={editData.kontoDebet}
								onChange={(e) => onUpdateField("kontoDebet", e.target.value)}
								className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs"
							/>
						</div>

						<div className="space-y-1.5">
							<label className="font-semibold text-slate-800 block">
								<Translate text={localizationConstants.wageTypeAccountCreditLabel} />
							</label>
							<Input
								value={editData.kontoKredit}
								onChange={(e) => onUpdateField("kontoKredit", e.target.value)}
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
								value={editData.motKontoAG}
								onChange={(e) => onUpdateField("motKontoAG", e.target.value)}
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
										name="editAgUnderlag"
										checked={editData.agUnderlag === true}
										onChange={() => onUpdateField("agUnderlag", true)}
										className="h-4 w-4 text-slate-900 border-slate-300 focus:ring-slate-900"
									/>
									<Translate text={localizationConstants.yesLabel} />
								</label>
								<label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
									<input
										type="radio"
										name="editAgUnderlag"
										checked={editData.agUnderlag === false}
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
										name="editSemestergrundad"
										checked={editData.semestergrundad === true}
										onChange={() => onUpdateField("semestergrundad", true)}
										className="h-4 w-4 text-slate-900 border-slate-300 focus:ring-slate-900"
									/>
									<Translate text={localizationConstants.yesLabel} />
								</label>
								<label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
									<input
										type="radio"
										name="editSemestergrundad"
										checked={editData.semestergrundad === false}
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
								value={editData.agiKod}
								onChange={(e) => onUpdateField("agiKod", e.target.value)}
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
							value={editData.beskrivning}
							onChange={(e) => onUpdateField("beskrivning", e.target.value)}
							className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs"
						/>
					</div>

					{/* Edit Buttons */}
					<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
						<Button
							type="button"
							variant="outline"
							onClick={onCancelEdit}
							className="h-9 px-4 border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer text-xs"
						>
							<X className="h-3.5 w-3.5 mr-1.5" />
							<Translate text={localizationConstants.cancelButton} />
						</Button>
						<Button
							type="button"
							disabled={isSubmitting}
							onClick={onSave}
							className="h-9 px-4 bg-[#111721] text-white hover:bg-slate-800 gap-1.5 cursor-pointer text-xs shadow-2xs"
						>
							{isSubmitting ? (
								<Loader2 className="h-3.5 w-3.5 animate-spin" />
							) : (
								<Save className="h-3.5 w-3.5" />
							)}
							<Translate text={localizationConstants.saveButton} />
						</Button>
					</div>
				</div>
			) : (
				/* View Mode */
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
					<div>
						<span className="text-slate-400 font-medium block">
							<Translate text={localizationConstants.wageTypeIdHeader} />
						</span>
						<span className="font-bold text-slate-900 text-sm mt-0.5 block">
							{wageType.loneartId}
						</span>
					</div>

					<div>
						<span className="text-slate-400 font-medium block">
							<Translate text={localizationConstants.wageTypeNameHeader} />
						</span>
						<span className="font-semibold text-slate-900 text-sm mt-0.5 block">
							{wageType.benamning}
						</span>
					</div>

					<div>
						<span className="text-slate-400 font-medium block">
							<Translate text={localizationConstants.statusLabel} />
						</span>
						<div className="mt-1">
							{wageType.status === "active" ? (
								<span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
									<Translate text={localizationConstants.activeStatus} />
								</span>
							) : (
								<span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 border border-slate-200">
									<Translate text={localizationConstants.inactiveStatus} />
								</span>
							)}
						</div>
					</div>

					<div>
						<span className="text-slate-400 font-medium block">
							<Translate text={localizationConstants.wageTypePersonalTypeHeader} />
						</span>
						<span className="font-medium text-slate-800 mt-0.5 block">
							{personalTypeMap[wageType.personalTyp] ? (
								<Translate text={personalTypeMap[wageType.personalTyp]} />
							) : (
								wageType.personalTyp
							)}
						</span>
					</div>

					<div>
						<span className="text-slate-400 font-medium block">
							<Translate text={localizationConstants.wageTypeWageFormHeader} />
						</span>
						<span className="font-medium text-slate-800 mt-0.5 block">
							{wageFormMap[wageType.loneform] ? (
								<Translate text={wageFormMap[wageType.loneform]} />
							) : (
								wageType.loneform
							)}
						</span>
					</div>

					<div>
						<span className="text-slate-400 font-medium block">
							<Translate text={localizationConstants.wageTypeTransactionTypeHeader} />
						</span>
						<span className="font-medium text-slate-800 mt-0.5 block">
							{transactionTypeMap[wageType.transaktionstyp] ? (
								<Translate text={transactionTypeMap[wageType.transaktionstyp]} />
							) : (
								wageType.transaktionstyp
							)}
						</span>
					</div>

					<div>
						<span className="text-slate-400 font-medium block">
							<Translate text={localizationConstants.wageTypeUnitHeader} />
						</span>
						<span className="font-medium text-slate-800 mt-0.5 block">
							{unitMap[wageType.enhet] ? (
								<Translate text={unitMap[wageType.enhet]} />
							) : (
								wageType.enhet
							)}
						</span>
					</div>

					<div>
						<span className="text-slate-400 font-medium block">
							<Translate text={localizationConstants.wageTypePreliminaryTaxHeader} />
						</span>
						<span className="font-medium text-slate-800 mt-0.5 block">
							{wageType.preliminarskatt}
						</span>
					</div>

					<div>
						<span className="text-slate-400 font-medium block">
							<Translate text={localizationConstants.wageTypeEmployerContributionHeader} />
						</span>
						<span className="font-medium text-slate-800 mt-0.5 block">
							{wageType.arbetsgivaravgift}
						</span>
					</div>

					<div>
						<span className="text-slate-400 font-medium block">
							<Translate text={localizationConstants.wageTypeAccountDebitLabel} />
						</span>
						<span className="font-medium text-slate-800 mt-0.5 block">
							{wageType.konto}
						</span>
					</div>

					<div>
						<span className="text-slate-400 font-medium block">
							<Translate text={localizationConstants.wageTypeAccountCreditLabel} />
						</span>
						<span className="font-medium text-slate-800 mt-0.5 block">
							{wageType.kontoKredit || "-"}
						</span>
					</div>

					<div>
						<span className="text-slate-400 font-medium block">
							<Translate text={localizationConstants.wageTypeAccountOppositeAGLabel} />
						</span>
						<span className="font-medium text-slate-800 mt-0.5 block">
							{wageType.motKontoAG || "-"}
						</span>
					</div>

					<div>
						<span className="text-slate-400 font-medium block">
							<Translate text={localizationConstants.wageTypeAgUnderlagLabel} />
						</span>
						<span className="font-medium text-slate-800 mt-0.5 block">
							{wageType.agUnderlag ? (
								<Translate text={localizationConstants.yesLabel} />
							) : (
								<Translate text={localizationConstants.noLabel} />
							)}
						</span>
					</div>

					<div>
						<span className="text-slate-400 font-medium block">
							<Translate text={localizationConstants.wageTypeSemestergrundadLabel} />
						</span>
						<span className="font-medium text-slate-800 mt-0.5 block">
							{wageType.semestergrundad ? (
								<Translate text={localizationConstants.yesLabel} />
							) : (
								<Translate text={localizationConstants.noLabel} />
							)}
						</span>
					</div>

					<div>
						<span className="text-slate-400 font-medium block">
							<Translate text={localizationConstants.wageTypeAgiCodeLabel} />
						</span>
						<span className="font-medium text-slate-800 mt-0.5 block">
							{wageType.agiKod || "-"}
						</span>
					</div>

					<div className="sm:col-span-2 lg:col-span-3">
						<span className="text-slate-400 font-medium block">
							<Translate text={localizationConstants.wageTypeDescriptionLabel} />
						</span>
						<span className="font-normal text-slate-700 mt-0.5 block whitespace-pre-wrap">
							{wageType.beskrivning || "-"}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}
