"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CreateAccountFormData } from "@/features/financial-management/types/accountPlan.types";
import { AKTIVT_OPTIONS } from "@/features/financial-management/constants/accountPlan.constants";

interface CreateAccountGrundInfoCardProps {
	readonly formData: CreateAccountFormData;
	readonly errors: Record<string, string>;
	readonly onUpdateField: <K extends keyof CreateAccountFormData>(
		field: K,
		value: CreateAccountFormData[K],
	) => void;
}

export function CreateAccountGrundInfoCard({
	formData,
	errors,
	onUpdateField,
}: CreateAccountGrundInfoCardProps) {
	return (
		<div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col gap-5">
			<h3 className="text-sm font-bold text-slate-900">
				<Translate text={localizationConstants.basicInfoSection} />
			</h3>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				{/* Kontonummer */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-semibold text-slate-700">
						<Translate text={localizationConstants.accountNumberField} />{" "}
						<span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						value={formData.kontoNr}
						onChange={(e) => onUpdateField("kontoNr", e.target.value)}
						placeholder="105"
						className={`h-10 rounded-lg border bg-slate-50/50 px-3 text-xs text-slate-900 transition-colors focus:bg-white focus:outline-none ${
							errors.kontoNr
								? "border-red-500 focus:border-red-500"
								: "border-slate-200 focus:border-slate-900"
						}`}
					/>
					{errors.kontoNr && (
						<span className="text-2xs text-red-500">{errors.kontoNr}</span>
					)}
				</div>

				{/* Benämning */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-semibold text-slate-700">
						<Translate text={localizationConstants.designationField} />{" "}
						<span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						value={formData.benamning}
						onChange={(e) => onUpdateField("benamning", e.target.value)}
						placeholder="info"
						className={`h-10 rounded-lg border bg-slate-50/50 px-3 text-xs text-slate-900 transition-colors focus:bg-white focus:outline-none ${
							errors.benamning
								? "border-red-500 focus:border-red-500"
								: "border-slate-200 focus:border-slate-900"
						}`}
					/>
					{errors.benamning && (
						<span className="text-2xs text-red-500">{errors.benamning}</span>
					)}
				</div>

				{/* Ingående balans */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-semibold text-slate-700">
						<Translate text={localizationConstants.incomingBalanceField} />
					</label>
					<input
						type="text"
						value={formData.ingaendeBalans}
						onChange={(e) => onUpdateField("ingaendeBalans", e.target.value)}
						placeholder="info"
						className="h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-900 transition-colors focus:bg-white focus:border-slate-900 focus:outline-none"
					/>
				</div>

				{/* Aktivt */}
				<div className="flex flex-col gap-1.5">
					<label className="text-xs font-semibold text-slate-700">
						<Translate text={localizationConstants.activeField} />
					</label>
					<select
						value={formData.aktivt}
						onChange={(e) => onUpdateField("aktivt", e.target.value)}
						className="h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-900 transition-colors focus:bg-white focus:border-slate-900 focus:outline-none"
					>
						{AKTIVT_OPTIONS.map((opt) => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
}
