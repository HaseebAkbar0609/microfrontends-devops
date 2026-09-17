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
import { DEFAULT_DESIRED_ACTIONS } from "../../../constants/claims.constants";

interface ClaimDemandCardProps {
	formData: ClaimFormData;
	onChange: (field: keyof ClaimFormData, val: ClaimFormData[keyof ClaimFormData]) => void;
	errors: Record<string, string>;
}

export function ClaimDemandCard({
	formData,
	onChange,
	errors,
}: ClaimDemandCardProps) {
	return (
		<div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
			<div className="px-6 py-3.5 border-b border-slate-200">
				<h2 className="text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.claimsSectionDemand} />
				</h2>
			</div>

			<div className="p-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-xs font-medium text-slate-700 mb-1.5">
						<Translate text={localizationConstants.claimsFieldDisputedAmount} />
					</label>
					<Input
						type="text"
						value={formData.disputedAmount === 0 ? "" : formData.disputedAmount}
						onChange={(e) => onChange("disputedAmount", e.target.value)}
						placeholder="info"
						className="h-9 text-xs bg-white border-slate-200 rounded-lg text-slate-700"
					/>
					{errors.disputedAmount && (
						<p className="text-[11px] text-rose-500 mt-1">{errors.disputedAmount}</p>
					)}
				</div>

				<div>
					<label className="block text-xs font-medium text-slate-700 mb-1.5">
						<Translate text={localizationConstants.claimsFieldDesiredAction} />
					</label>
					<Select
						value={formData.desiredAction || undefined}
						onValueChange={(val) => onChange("desiredAction", val)}
					>
						<SelectTrigger className="h-9 text-xs bg-white border-slate-200 rounded-lg text-slate-700">
							<SelectValue placeholder="info" />
						</SelectTrigger>
						<SelectContent>
							{DEFAULT_DESIRED_ACTIONS.map((act) => (
								<SelectItem key={act} value={act} className="text-xs">
									{act}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.desiredAction && (
						<p className="text-[11px] text-rose-500 mt-1">{errors.desiredAction}</p>
					)}
				</div>
			</div>
		</div>
		</div>
	);
}

export default ClaimDemandCard;
