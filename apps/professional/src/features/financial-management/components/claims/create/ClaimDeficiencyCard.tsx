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
import type { ClaimFormData } from "../../../types/claims.types";
import { DEFAULT_DEFICIENCY_TYPES } from "../../../constants/claims.constants";

interface ClaimDeficiencyCardProps {
	formData: ClaimFormData;
	onChange: (field: keyof ClaimFormData, val: ClaimFormData[keyof ClaimFormData]) => void;
	errors: Record<string, string>;
}

export function ClaimDeficiencyCard({
	formData,
	onChange,
	errors,
}: ClaimDeficiencyCardProps) {
	return (
		<div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
			<div className="px-6 py-3.5 border-b border-slate-200">
				<h2 className="text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.claimsSectionDeficiency} />
				</h2>
			</div>

			<div className="p-6 space-y-4">
				{/* Row 1: Typ av brist & Händelsedatum */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-xs font-medium text-slate-700 mb-1.5">
							<Translate text={localizationConstants.claimsFieldDeficiencyType} />
						</label>
						<Select
							value={formData.deficiencyType || undefined}
							onValueChange={(val) => onChange("deficiencyType", val)}
						>
							<SelectTrigger className="h-9 text-xs bg-white border-slate-200 rounded-lg text-slate-700">
								<SelectValue placeholder="info" />
							</SelectTrigger>
							<SelectContent>
								{DEFAULT_DEFICIENCY_TYPES.map((type) => (
									<SelectItem key={type} value={type} className="text-xs">
										{type}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.deficiencyType && (
							<p className="text-[11px] text-rose-500 mt-1">{errors.deficiencyType}</p>
						)}
					</div>

					<div>
						<label className="block text-xs font-medium text-slate-700 mb-1.5">
							<Translate text={localizationConstants.claimsFieldIncidentDate} />
						</label>
						<Input
							type="date"
							value={formData.incidentDate || ""}
							onChange={(e) => onChange("incidentDate", e.target.value)}
							placeholder="info"
							className="h-9 text-xs bg-white border-slate-200 rounded-lg text-slate-700"
						/>
						{errors.incidentDate && (
							<p className="text-[11px] text-rose-500 mt-1">{errors.incidentDate}</p>
						)}
					</div>
				</div>

				{/* Row 2: Kontaktperson & Sista svarsdatum */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-xs font-medium text-slate-700 mb-1.5">
							<Translate text={localizationConstants.claimsFieldSupplierContact} />
						</label>
						<Input
							type="text"
							value={formData.supplierContact || ""}
							onChange={(e) => onChange("supplierContact", e.target.value)}
							placeholder="info"
							className="h-9 text-xs bg-white border-slate-200 rounded-lg text-slate-700"
						/>
					</div>

					<div>
						<label className="block text-xs font-medium text-slate-700 mb-1.5">
							<Translate text={localizationConstants.claimsFieldDeadline} />
						</label>
						<Input
							type="text"
							value={formData.responseDeadline || ""}
							onChange={(e) => onChange("responseDeadline", e.target.value)}
							placeholder="info"
							className="h-9 text-xs bg-white border-slate-200 rounded-lg text-slate-700"
						/>
					</div>
				</div>

				{/* Row 3: Beskrivning */}
				<div>
					<label className="block text-xs font-medium text-slate-700 mb-1.5">
						<Translate text={localizationConstants.claimsFieldDeficiencyDesc} />
					</label>
					<Select
						value={formData.deficiencyDescription || undefined}
						onValueChange={(val) => onChange("deficiencyDescription", val)}
					>
						<SelectTrigger className="h-9 text-xs bg-white border-slate-200 rounded-lg text-slate-700">
							<SelectValue placeholder="info" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Felaktig leverans enligt följesedel" className="text-xs">
								Felaktig leverans enligt följesedel
							</SelectItem>
							<SelectItem value="Skadat material vid lossning" className="text-xs">
								Skadat material vid lossning
							</SelectItem>
							<SelectItem value="Kvalitetsbrist vid utfört arbete" className="text-xs">
								Kvalitetsbrist vid utfört arbete
							</SelectItem>
							<SelectItem value="Försenad leverans orsakade produktionsstopp" className="text-xs">
								Försenad leverans orsakade produktionsstopp
							</SelectItem>
						</SelectContent>
					</Select>
					{errors.deficiencyDescription && (
						<p className="text-[11px] text-rose-500 mt-1">{errors.deficiencyDescription}</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default ClaimDeficiencyCard;
