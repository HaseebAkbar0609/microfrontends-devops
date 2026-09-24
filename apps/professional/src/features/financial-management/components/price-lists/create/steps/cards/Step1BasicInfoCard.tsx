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
import type { CreatePriceListFormData } from "../../../../../types/priceLists.types";
import type { FormErrors } from "../../../../../hooks/useCreatePriceListForm";

interface Step1BasicInfoCardProps {
	readonly formData: CreatePriceListFormData;
	readonly errors: FormErrors;
	readonly onUpdateField: <K extends keyof CreatePriceListFormData>(
		field: K,
		value: CreatePriceListFormData[K],
	) => void;
}

export function Step1BasicInfoCard({
	formData,
	errors,
	onUpdateField,
}: Step1BasicInfoCardProps) {
	return (
		<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
			<h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
				<Translate text={localizationConstants.priceListBasicInfoTab} />
			</h3>

			<div className="space-y-4">
				{/* Row 1: Kod nr & Benämning */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					<div className="space-y-1.5">
						<label className="text-xs font-semibold text-slate-800">
							<Translate text={localizationConstants.priceListCodeLabel} />
						</label>
						<Input
							value={formData.code}
							onChange={(e) => onUpdateField("code", e.target.value)}
							placeholder="P001"
							className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-semibold text-slate-800">
							<Translate text={localizationConstants.priceListNameLabel} />
							<span className="text-red-500 ml-1">*</span>
						</label>
						<Input
							value={formData.name}
							onChange={(e) => onUpdateField("name", e.target.value)}
							className={`h-10 w-full bg-white border-slate-200 text-sm shadow-2xs ${
								errors.name ? "border-red-500 focus-visible:ring-red-500" : ""
							}`}
						/>
						{errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
					</div>
				</div>

				{/* Row 2: Datum & Skapad av */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					<div className="space-y-1.5">
						<label className="text-xs font-semibold text-slate-800">
							<Translate text={localizationConstants.priceListDateLabel} />
							<span className="text-red-500 ml-1">*</span>
						</label>
						<Input
							type="date"
							value={formData.date}
							onChange={(e) => onUpdateField("date", e.target.value)}
							className={`h-10 w-full bg-white border-slate-200 text-sm shadow-2xs ${
								errors.date ? "border-red-500 focus-visible:ring-red-500" : ""
							}`}
						/>
						{errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-semibold text-slate-800">
							<Translate text={localizationConstants.priceListCreatedByLabel} />
							<span className="text-red-500 ml-1">*</span>
						</label>
						<Select
							value={formData.createdBy}
							onValueChange={(val) => onUpdateField("createdBy", val)}
						>
							<SelectTrigger className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs">
								<SelectValue placeholder="Välj användare" />
							</SelectTrigger>
							<SelectContent className="bg-white border-slate-200">
								<SelectItem value="Kalle Andersson">Kalle Andersson</SelectItem>
								<SelectItem value="Anna Svensson">Anna Svensson</SelectItem>
								<SelectItem value="Admin User">Admin User</SelectItem>
							</SelectContent>
						</Select>
						{errors.createdBy && <p className="text-xs text-red-500">{errors.createdBy}</p>}
					</div>
				</div>

				{/* Row 3: Kommentar */}
				<div className="space-y-1.5">
					<label className="text-xs font-semibold text-slate-800">
						<Translate text={localizationConstants.priceListCommentLabel} />
					</label>
					<Input
						value={formData.comment}
						onChange={(e) => onUpdateField("comment", e.target.value)}
						className="h-10 w-full bg-white border-slate-200 text-sm shadow-2xs"
					/>
				</div>
			</div>
		</div>
	);
}
