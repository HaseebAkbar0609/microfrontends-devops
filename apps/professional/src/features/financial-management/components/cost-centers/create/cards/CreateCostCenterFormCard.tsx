"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CreateCostCenterFormData } from "../../../../types/costCenters.types";
import type { CostCenterFormErrors } from "../../../../hooks/useCreateCostCenterForm";

interface CreateCostCenterFormCardProps {
	readonly formData: CreateCostCenterFormData;
	readonly errors: CostCenterFormErrors;
	readonly onUpdateField: <K extends keyof CreateCostCenterFormData>(
		field: K,
		value: CreateCostCenterFormData[K],
	) => void;
}

export function CreateCostCenterFormCard({
	formData,
	errors,
	onUpdateField,
}: CreateCostCenterFormCardProps) {
	return (
		<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
			{/* Section Title */}
			<h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
				<Translate text={localizationConstants.grundInformationSection} />
			</h3>

			<div className="space-y-4 text-xs">
				{/* Row 1: KOD & Benämning */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					<div className="space-y-1.5">
						<label className="font-semibold text-slate-800 uppercase block">
							<Translate text={localizationConstants.costCenterCodeHeader} />
							<span className="text-red-500 ml-1">*</span>
						</label>
						<Input
							value={formData.kod}
							onChange={(e) => onUpdateField("kod", e.target.value)}
							placeholder="105"
							className={`h-10 w-full bg-slate-50/50 border-slate-200 text-sm shadow-2xs ${
								errors.kod ? "border-red-500 focus-visible:ring-red-500" : ""
							}`}
						/>
						{errors.kod && <p className="text-xs text-red-500">{errors.kod}</p>}
					</div>

					<div className="space-y-1.5">
						<label className="font-semibold text-slate-800 block">
							<Translate text={localizationConstants.costCenterNameHeader} />
							<span className="text-red-500 ml-1">*</span>
						</label>
						<Input
							value={formData.benamning}
							onChange={(e) => onUpdateField("benamning", e.target.value)}
							placeholder="info"
							className={`h-10 w-full bg-white border-slate-200 text-sm shadow-2xs ${
								errors.benamning ? "border-red-500 focus-visible:ring-red-500" : ""
							}`}
						/>
						{errors.benamning && (
							<p className="text-xs text-red-500">{errors.benamning}</p>
						)}
					</div>
				</div>

				{/* Row 2: Anteckningar */}
				<div className="space-y-1.5">
					<label className="font-semibold text-slate-800 block">
						<Translate text={localizationConstants.costCenterNotesHeader} />
					</label>
					<Input
						value={formData.anteckningar}
						onChange={(e) => onUpdateField("anteckningar", e.target.value)}
						placeholder="info"
						className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs"
					/>
				</div>
			</div>
		</div>
	);
}
