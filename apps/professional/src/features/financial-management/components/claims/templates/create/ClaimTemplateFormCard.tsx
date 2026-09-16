"use client";

import React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ClaimTemplateFormData } from "@/features/financial-management/types/claims.types";
import {
	DEFAULT_TEMPLATE_DATES,
	DEFAULT_TEMPLATE_TITLES,
} from "@/features/financial-management/constants/claims.constants";

interface ClaimTemplateFormCardProps {
	templateId: string;
	formData: ClaimTemplateFormData;
	errors: Record<string, string>;
	onChange: (field: keyof ClaimTemplateFormData, value: string) => void;
}

export function ClaimTemplateFormCard({
	templateId,
	formData,
	errors,
	onChange,
}: ClaimTemplateFormCardProps) {
	return (
		<div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-6 space-y-6">
			{/* Card Title */}
			<div className="text-sm font-semibold text-slate-900">
				<Translate text={localizationConstants.claimTplTabGrunduppgifter} />
			</div>

			<div className="space-y-4">
				{/* ID Field (Read-only / disabled) */}
				<div className="space-y-1.5 max-w-sm">
					<label className="block text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.claimTplFieldId} />
					</label>
					<Input
						type="text"
						value={templateId}
						disabled
						className="h-9 bg-slate-100/80 border-slate-200 text-slate-700 text-sm font-medium cursor-not-allowed"
					/>
				</div>

				{/* 2-Column Row: Datum & Title */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Datum */}
					<div className="space-y-1.5">
						<label className="block text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.claimTplFieldDatum} />
						</label>
						<Select
							value={formData.date}
							onValueChange={(val) => onChange("date", val)}
						>
							<SelectTrigger className="h-9 bg-white border-slate-200 text-sm rounded-md shadow-2xs">
								<SelectValue placeholder="info" />
							</SelectTrigger>
							<SelectContent className="bg-white border-slate-200 text-sm shadow-md">
								{DEFAULT_TEMPLATE_DATES.map((date: string) => (
									<SelectItem key={date} value={date} className="text-sm">
										{date}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Title */}
					<div className="space-y-1.5">
						<label className="block text-xs font-medium text-slate-700">
							<Translate text={localizationConstants.claimTplFieldTitle} />
						</label>
						<Select
							value={formData.title}
							onValueChange={(val) => onChange("title", val)}
						>
							<SelectTrigger
								className={`h-9 bg-white border text-sm rounded-md shadow-2xs ${
									errors.title ? "border-rose-400 ring-1 ring-rose-400" : "border-slate-200"
								}`}
							>
								<SelectValue placeholder="info" />
							</SelectTrigger>
							<SelectContent className="bg-white border-slate-200 text-sm shadow-md">
								{DEFAULT_TEMPLATE_TITLES.map((title: string) => (
									<SelectItem key={title} value={title} className="text-sm">
										{title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.title && (
							<p className="text-xs text-rose-500">{errors.title}</p>
						)}
					</div>
				</div>

				{/* Beskrivning (Full Width) */}
				<div className="space-y-1.5">
					<label className="block text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.claimTplFieldBeskrivning} />
					</label>
					<Input
						type="text"
						value={formData.description}
						onChange={(e) => onChange("description", e.target.value)}
						placeholder="info"
						className={`h-9 bg-white border text-sm rounded-md shadow-2xs ${
							errors.description ? "border-rose-400 ring-1 ring-rose-400" : "border-slate-200"
						}`}
					/>
					{errors.description && (
						<p className="text-xs text-rose-500">{errors.description}</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default ClaimTemplateFormCard;
