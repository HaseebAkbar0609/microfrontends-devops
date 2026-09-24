"use client";

import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	CreateAccountFormData,
	RadioMode,
} from "@/features/financial-management/types/accountPlan.types";
import {
	MOMSKOD_OPTIONS,
	KOSTNADSSTALLE_OPTIONS,
} from "@/features/financial-management/constants/accountPlan.constants";

interface CreateAccountAdditionalInfoCardProps {
	readonly formData: CreateAccountFormData;
	readonly isOpen: boolean;
	readonly onToggle: () => void;
	readonly onUpdateField: <K extends keyof CreateAccountFormData>(
		field: K,
		value: CreateAccountFormData[K],
	) => void;
}

export function CreateAccountAdditionalInfoCard({
	formData,
	isOpen,
	onToggle,
	onUpdateField,
}: CreateAccountAdditionalInfoCardProps) {
	return (
		<div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col gap-5">
			<button
				type="button"
				onClick={onToggle}
				className="flex items-center justify-between text-left cursor-pointer w-full"
			>
				<h3 className="text-sm font-bold text-slate-900">
					<Translate text={localizationConstants.additionalDetailsSection} />
				</h3>
				{isOpen ? (
					<ChevronUp className="h-4 w-4 text-slate-500" />
				) : (
					<ChevronDown className="h-4 w-4 text-slate-500" />
				)}
			</button>

			{isOpen && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
					{/* SRU-kod */}
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.sruLabel} />
						</label>
						<input
							type="text"
							value={formData.sru}
							onChange={(e) => onUpdateField("sru", e.target.value)}
							placeholder="info"
							className="h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-900 transition-colors focus:bg-white focus:border-slate-900 focus:outline-none"
						/>
					</div>

					{/* Momkod */}
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.vatCodeLabel} />
						</label>
						<select
							value={formData.momskod}
							onChange={(e) => onUpdateField("momskod", e.target.value)}
							className="h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-900 transition-colors focus:bg-white focus:border-slate-900 focus:outline-none"
						>
							{MOMSKOD_OPTIONS.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					</div>

					{/* Kostnadsställe (Radio) */}
					<div className="flex flex-col gap-2">
						<label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.costCenterLabel} />
						</label>
						<div className="flex flex-wrap items-center gap-4">
							<label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
								<input
									type="radio"
									name="kostnadsstalleMode"
									checked={formData.kostnadsstalleMode === "obligatoriskt"}
									onChange={() =>
										onUpdateField("kostnadsstalleMode", "obligatoriskt" as RadioMode)
									}
									className="h-4 w-4 text-slate-900 focus:ring-slate-900"
								/>
								<Translate text={localizationConstants.radioObligatoriskt} />
							</label>
							<label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
								<input
									type="radio"
									name="kostnadsstalleMode"
									checked={formData.kostnadsstalleMode === "tillatet"}
									onChange={() =>
										onUpdateField("kostnadsstalleMode", "tillatet" as RadioMode)
									}
									className="h-4 w-4 text-slate-900 focus:ring-slate-900"
								/>
								<Translate text={localizationConstants.radioTillatet} />
							</label>
							<label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
								<input
									type="radio"
									name="kostnadsstalleMode"
									checked={formData.kostnadsstalleMode === "ej_tillatet"}
									onChange={() =>
										onUpdateField("kostnadsstalleMode", "ej_tillatet" as RadioMode)
									}
									className="h-4 w-4 text-slate-900 focus:ring-slate-900"
								/>
								<Translate text={localizationConstants.radioEjTillatet} />
							</label>
						</div>
					</div>

					{/* Projekt (Radio) */}
					<div className="flex flex-col gap-2">
						<label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.projectLabel} />
						</label>
						<div className="flex flex-wrap items-center gap-4">
							<label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
								<input
									type="radio"
									name="projektMode"
									checked={formData.projektMode === "obligatoriskt"}
									onChange={() =>
										onUpdateField("projektMode", "obligatoriskt" as RadioMode)
									}
									className="h-4 w-4 text-slate-900 focus:ring-slate-900"
								/>
								<Translate text={localizationConstants.radioObligatoriskt} />
							</label>
							<label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
								<input
									type="radio"
									name="projektMode"
									checked={formData.projektMode === "tillatet"}
									onChange={() =>
										onUpdateField("projektMode", "tillatet" as RadioMode)
									}
									className="h-4 w-4 text-slate-900 focus:ring-slate-900"
								/>
								<Translate text={localizationConstants.radioTillatet} />
							</label>
							<label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
								<input
									type="radio"
									name="projektMode"
									checked={formData.projektMode === "ej_tillatet"}
									onChange={() =>
										onUpdateField("projektMode", "ej_tillatet" as RadioMode)
									}
									className="h-4 w-4 text-slate-900 focus:ring-slate-900"
								/>
								<Translate text={localizationConstants.radioEjTillatet} />
							</label>
						</div>
					</div>

					{/* Föreslå kostnadsställe */}
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.suggestedCostCenterLabel} />
						</label>
						<select
							value={formData.foreslaKostnadsstalle}
							onChange={(e) =>
								onUpdateField("foreslaKostnadsstalle", e.target.value)
							}
							className="h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-900 transition-colors focus:bg-white focus:border-slate-900 focus:outline-none"
						>
							{KOSTNADSSTALLE_OPTIONS.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					</div>

					{/* Föreslå projekt */}
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.suggestedProjectLabel} />
						</label>
						<input
							type="text"
							value={formData.foreslaProjekt}
							onChange={(e) => onUpdateField("foreslaProjekt", e.target.value)}
							placeholder=""
							className="h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-900 transition-colors focus:bg-white focus:border-slate-900 focus:outline-none"
						/>
					</div>
				</div>
			)}
		</div>
	);
}
