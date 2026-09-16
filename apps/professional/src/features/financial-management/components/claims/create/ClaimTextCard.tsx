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
import type { ClaimFormData, ClaimTemplate } from "../../../types/claims.types";

interface ClaimTextCardProps {
	formData: ClaimFormData;
	templates: ClaimTemplate[];
	onChange: (field: keyof ClaimFormData, val: ClaimFormData[keyof ClaimFormData]) => void;
	onTemplateSelect: (templateId: string) => void;
	errors: Record<string, string>;
}

export function ClaimTextCard({
	formData,
	templates,
	onChange,
	onTemplateSelect,
	errors,
}: ClaimTextCardProps) {
	return (
		<div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
			<div className="px-6 py-3.5 border-b border-slate-200">
				<h2 className="text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.claimsSectionClaimText} />
				</h2>
			</div>

			<div className="p-6 space-y-4">
				{/* Row 1: Mallar (half-width) */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-xs font-medium text-slate-700 mb-1.5">
							<Translate text={localizationConstants.claimsFieldTemplates} />
						</label>
						<Select
							value={formData.templateId || undefined}
							onValueChange={(val) => {
								if (val) {
									onTemplateSelect(val);
								}
							}}
						>
							<SelectTrigger className="h-9 text-xs bg-white border-slate-200 rounded-md text-slate-700">
								<SelectValue placeholder="info" />
							</SelectTrigger>
							<SelectContent>
								{templates.map((tpl) => (
									<SelectItem key={tpl.id} value={tpl.id} className="text-xs">
										{tpl.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="hidden md:block" />
				</div>

				{/* Row 2: Title (half-width) */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-xs font-medium text-slate-700 mb-1.5">
							<Translate text={localizationConstants.claimsFieldTitle} />
						</label>
						<Select
							value={formData.title || undefined}
							onValueChange={(val) => onChange("title", val)}
						>
							<SelectTrigger className="h-9 text-xs bg-white border-slate-200 rounded-md text-slate-700">
								<SelectValue placeholder="info" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Reklamation avseende felaktig leverans" className="text-xs">
									Reklamation avseende felaktig leverans
								</SelectItem>
								<SelectItem value="Reklamation avseende skadat gods" className="text-xs">
									Reklamation avseende skadat gods
								</SelectItem>
								<SelectItem value="Bestridande av fakturabelopp" className="text-xs">
									Bestridande av fakturabelopp
								</SelectItem>
								<SelectItem value="Reklamation bristfälligt arbete" className="text-xs">
									Reklamation bristfälligt arbete
								</SelectItem>
							</SelectContent>
						</Select>
						{errors.title && (
							<p className="text-[11px] text-rose-500 mt-1">{errors.title}</p>
						)}
					</div>
					<div className="hidden md:block" />
				</div>

				{/* Row 3: Beskrivning */}
				<div>
					<label className="block text-xs font-medium text-slate-700 mb-1.5">
						<Translate text={localizationConstants.claimsFieldTextDesc} />
					</label>
					<Input
						type="text"
						value={formData.description || ""}
						onChange={(e) => onChange("description", e.target.value)}
						placeholder="info"
						className="h-9 text-xs bg-white border-slate-200 rounded-md text-slate-700"
					/>
				</div>
			</div>
		</div>
	);
}

export default ClaimTextCard;
