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
import {
	DEFAULT_SUPPLIERS,
	DEFAULT_OBJECTS,
} from "../../../constants/claims.constants";

interface ClaimConnectionCardProps {
	formData: ClaimFormData;
	onChange: (field: keyof ClaimFormData, val: ClaimFormData[keyof ClaimFormData]) => void;
	errors: Record<string, string>;
}

export function ClaimConnectionCard({
	formData,
	onChange,
	errors,
}: ClaimConnectionCardProps) {
	const handleObjectChange = (objectId: string) => {
		const matched = DEFAULT_OBJECTS.find((o) => o.id === objectId);
		onChange("object", objectId);
		if (matched) {
			onChange("objectId", matched.objectId);
			onChange("objectName", matched.name);
		}
	};

	return (
		<div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
			<div className="px-6 py-3.5 border-b border-slate-200">
				<h2 className="text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.claimsSectionConnection} />
				</h2>
			</div>

			<div className="p-6 space-y-4">
				{/* Row 1: ID (half-width) */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-xs font-medium text-slate-700 mb-1.5">
							<Translate text={localizationConstants.claimsFieldId} />
						</label>
						<Input
							type="text"
							value={formData.id || ""}
							disabled
							readOnly
							placeholder={formData.id || "007"}
							className="h-9 text-xs bg-slate-100/80 border-slate-200 rounded-md text-slate-700 cursor-not-allowed"
						/>
					</div>
					<div className="hidden md:block" />
				</div>

				{/* Row 2: Leverantör & Kopplad Faktura */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-xs font-medium text-slate-700 mb-1.5">
							<Translate text={localizationConstants.claimsFieldSupplier} />
						</label>
						<Select
							value={formData.supplier || undefined}
							onValueChange={(val) => onChange("supplier", val)}
						>
							<SelectTrigger className="h-9 text-xs bg-white border-slate-200 rounded-lg text-slate-700">
								<SelectValue placeholder="info" />
							</SelectTrigger>
							<SelectContent>
								{DEFAULT_SUPPLIERS.map((sup) => (
									<SelectItem key={sup} value={sup} className="text-xs">
										{sup}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.supplier && (
							<p className="text-[11px] text-rose-500 mt-1">{errors.supplier}</p>
						)}
					</div>

					<div>
						<label className="block text-xs font-medium text-slate-700 mb-1.5">
							<Translate text={localizationConstants.claimsFieldLinkedInvoice} />
						</label>
						<Select
							value={formData.linkedInvoice || undefined}
							onValueChange={(val) => onChange("linkedInvoice", val)}
						>
							<SelectTrigger className="h-9 text-xs bg-white border-slate-200 rounded-lg text-slate-700">
								<SelectValue placeholder="info" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="FA-2026-001" className="text-xs">FA-2026-001</SelectItem>
								<SelectItem value="FA-2026-002" className="text-xs">FA-2026-002</SelectItem>
								<SelectItem value="FA-2026-003" className="text-xs">FA-2026-003</SelectItem>
								<SelectItem value="FA-2026-004" className="text-xs">FA-2026-004</SelectItem>
							</SelectContent>
						</Select>
						{errors.linkedInvoice && (
							<p className="text-[11px] text-rose-500 mt-1">{errors.linkedInvoice}</p>
						)}
					</div>
				</div>

				{/* Row 3: Objekt & Object ID */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-xs font-medium text-slate-700 mb-1.5">
							<Translate text={localizationConstants.claimsFieldObject} />
						</label>
						<Select
							value={formData.object || undefined}
							onValueChange={handleObjectChange}
						>
							<SelectTrigger className="h-9 text-xs bg-white border-slate-200 rounded-lg text-slate-700">
								<SelectValue placeholder="info" />
							</SelectTrigger>
							<SelectContent>
								{DEFAULT_OBJECTS.map((obj) => (
									<SelectItem key={obj.id} value={obj.id} className="text-xs">
										{obj.id}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.object && (
							<p className="text-[11px] text-rose-500 mt-1">{errors.object}</p>
						)}
					</div>

					<div>
						<label className="block text-xs font-medium text-slate-700 mb-1.5">
							<Translate text={localizationConstants.claimsFieldObjectId} />
						</label>
						<Input
							type="text"
							value={formData.objectId || ""}
							onChange={(e) => onChange("objectId", e.target.value)}
							placeholder="Info"
							className="h-9 text-xs bg-white border-slate-200 rounded-lg text-slate-700"
						/>
					</div>
				</div>

				{/* Row 4: Objekt Namn (half-width) */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-xs font-medium text-slate-700 mb-1.5">
							<Translate text={localizationConstants.claimsFieldObjectName} />
						</label>
						<Select
							value={formData.objectName || undefined}
							onValueChange={(val) => onChange("objectName", val)}
						>
							<SelectTrigger className="h-9 text-xs bg-white border-slate-200 rounded-md text-slate-700">
								<SelectValue placeholder="info" />
							</SelectTrigger>
							<SelectContent>
								{DEFAULT_OBJECTS.map((obj) => (
									<SelectItem key={obj.name} value={obj.name} className="text-xs">
										{obj.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="hidden md:block" />
				</div>
			</div>
		</div>
	);
}

export default ClaimConnectionCard;
