"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import { AVAILABLE_FISCAL_YEARS } from "../../../constants/yearEnd.constants";
import {
	YEAR_END_CATEGORY_OPTIONS,
	getYearEndCategoryLabel,
	type YearEndCategoryOption,
} from "../../../utils/yearEndLocalization";
import type { YearEndCategory, YearEndTabType } from "../../../types/yearEnd.types";

interface YearEndBasicInfoCardProps {
	tab: YearEndTabType;
	category: YearEndCategory;
	onCategoryChange: (cat: YearEndCategory) => void;
	fiscalYear: number;
	onFiscalYearChange: (year: number) => void;
	name: string;
	onNameChange: (val: string) => void;
	errorMessage?: string;
}

export function YearEndBasicInfoCard({
	tab,
	category,
	onCategoryChange,
	fiscalYear,
	onFiscalYearChange,
	name,
	onNameChange,
	errorMessage,
}: YearEndBasicInfoCardProps) {
	const { t } = useTranslation();

	const labelKey =
		tab === "checklist"
			? localizationConstants.fieldNameOrTask
			: localizationConstants.fieldNameOrPeriod;

	const placeholderText =
		tab === "checklist"
			? t(localizationConstants.placeholderChecklistName)
			: t(localizationConstants.placeholderBokslutName);

	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
			<div className="px-6 py-4 border-b border-slate-100 bg-white">
				<h2 className="text-sm font-bold text-slate-900">
					<Translate text={localizationConstants.sectionBasicInfoYearEnd} />
				</h2>
			</div>

			<div className="p-6 space-y-4 text-xs">
				{/* Category & Fiscal Year */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
							<Translate text={localizationConstants.fieldCategory} /> <span className="text-rose-500">*</span>
						</Label>
						<select
							value={category}
							onChange={(e) => onCategoryChange(e.target.value as YearEndCategory)}
							className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer shadow-2xs"
						>
							{YEAR_END_CATEGORY_OPTIONS.map((opt: YearEndCategoryOption) => (
								<option key={opt.value} value={opt.value}>
									{getYearEndCategoryLabel(opt.value, t)}
								</option>
							))}
						</select>
					</div>

					<div>
						<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
							<Translate text={localizationConstants.fieldFiscalYear} /> <span className="text-rose-500">*</span>
						</Label>
						<select
							value={fiscalYear}
							onChange={(e) => onFiscalYearChange(Number(e.target.value))}
							className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer shadow-2xs"
						>
							{AVAILABLE_FISCAL_YEARS.map((y: number) => (
								<option key={y} value={y}>
									{y}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Description / Period / Task */}
				<div>
					<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
						<Translate text={labelKey} /> <span className="text-rose-500">*</span>
					</Label>
					<Input
						type="text"
						value={name}
						onChange={(e) => onNameChange(e.target.value)}
						placeholder={placeholderText}
						className={`h-10 text-xs rounded-lg ${
							errorMessage ? "border-rose-500 focus-visible:ring-rose-400" : "border-slate-200"
						}`}
					/>
					{errorMessage && (
						<p className="text-[11px] text-rose-500 mt-1">{errorMessage}</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default YearEndBasicInfoCard;
