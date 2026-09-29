"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { CASE_CATEGORIES } from "../../../constants/cases.constants";
import type { CaseCategory, CaseFormData } from "../../../types/cases.types";
import { getCategoryLabelKey } from "../shared/getCategoryLabel";

interface BasicInfoCardProps {
	formData: CaseFormData;
	errors: Partial<Record<keyof CaseFormData, TranslationKeys>>;
	onChange: (field: keyof CaseFormData, value: string) => void;
}

export function BasicInfoCard({
	formData,
	errors,
	onChange,
}: BasicInfoCardProps) {
	const { t } = useTranslation();
	return (
		<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
			<h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
				<Translate text={localizationConstants.casesCardBasicInfoFull} />
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
				{/* ID field */}
				<div className="space-y-1.5">
					<label className="block font-medium text-slate-700">
						<Translate text={localizationConstants.casesFieldId} />
					</label>
					<input
						type="text"
						value={formData.id}
						disabled
						className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs cursor-not-allowed"
					/>
				</div>

				{/* Category field */}
				<div className="space-y-1.5">
					<label className="block font-medium text-slate-700">
						<Translate text={localizationConstants.casesFieldCategory} />
						<span className="text-rose-500 ml-0.5">*</span>
					</label>
					<select
						value={formData.category}
						onChange={(e) => onChange("category", e.target.value as CaseCategory)}
						className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
					>
						{/* The words the rest of the app shows for a category, not its code. */}
						{CASE_CATEGORIES.map((cat) => (
							<option key={cat} value={cat}>
								{t(getCategoryLabelKey(cat))}
							</option>
						))}
					</select>
					{errors.category && (
						<p className="text-[11px] text-rose-600">
							<Translate text={errors.category} />
						</p>
					)}
				</div>

				{/* Title / Benämning */}
				<div className="space-y-1.5">
					<label className="block font-medium text-slate-700">
						<Translate text={localizationConstants.casesFieldTitle} />
						<span className="text-rose-500 ml-0.5">*</span>
					</label>
					<input
						type="text"
						value={formData.title}
						onChange={(e) => onChange("title", e.target.value)}
						placeholder={t(localizationConstants.casesPlaceholderTitle)}
						className={`w-full h-9 px-3 bg-white border rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 ${
							errors.title ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
						}`}
					/>
					{errors.title && (
						<p className="text-[11px] text-rose-600">
							<Translate text={errors.title} />
						</p>
					)}
				</div>

				{/* Created By / Skapad av */}
				<div className="space-y-1.5">
					<label className="block font-medium text-slate-700">
						<Translate text={localizationConstants.casesFieldCreatedBy} />
						<span className="text-rose-500 ml-0.5">*</span>
					</label>
					<input
						type="text"
						value={formData.createdBy}
						onChange={(e) => onChange("createdBy", e.target.value)}
						placeholder={t(localizationConstants.casesPlaceholderCreatedBy)}
						className={`w-full h-9 px-3 bg-white border rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 ${
							errors.createdBy ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
						}`}
					/>
					{errors.createdBy && (
						<p className="text-[11px] text-rose-600">
							<Translate text={errors.createdBy} />
						</p>
					)}
				</div>

				{/* Description / Beskrivning */}
				<div className="space-y-1.5">
					<label className="block font-medium text-slate-700">
						<Translate text={localizationConstants.casesFieldDescription} />
						<span className="text-rose-500 ml-0.5">*</span>
					</label>
					<input
						type="text"
						value={formData.description}
						onChange={(e) => onChange("description", e.target.value)}
						placeholder={t(localizationConstants.casesPlaceholderDescription)}
						className={`w-full h-9 px-3 bg-white border rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 ${
							errors.description ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
						}`}
					/>
					{errors.description && (
						<p className="text-[11px] text-rose-600">
							<Translate text={errors.description} />
						</p>
					)}
				</div>

				{/* Date / Datum */}
				<div className="space-y-1.5">
					<label className="block font-medium text-slate-700">
						<Translate text={localizationConstants.casesFieldDate} />
					</label>
					<input
						type="date"
						value={formData.date}
						onChange={(e) => onChange("date", e.target.value)}
						className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
					/>
				</div>
			</div>
		</div>
	);
}

export default BasicInfoCard;
