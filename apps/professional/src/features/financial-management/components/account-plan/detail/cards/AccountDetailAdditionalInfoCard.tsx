"use client";

import React from "react";
import { UserCheck, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	AccountPlanItem,
	CreateAccountFormData,
	RadioMode,
} from "@/features/financial-management/types/accountPlan.types";
import {
	MOMSKOD_OPTIONS,
	KOSTNADSSTALLE_OPTIONS,
} from "@/features/financial-management/constants/accountPlan.constants";

interface AccountDetailAdditionalInfoCardProps {
	readonly account: AccountPlanItem;
	readonly isEditing: boolean;
	readonly editFormData: CreateAccountFormData;
	readonly isSaving: boolean;
	readonly onStartEdit: () => void;
	readonly onCancelEdit: () => void;
	readonly onSave: () => void;
	readonly onUpdateField: <K extends keyof CreateAccountFormData>(
		field: K,
		value: CreateAccountFormData[K],
	) => void;
}

export function AccountDetailAdditionalInfoCard({
	account,
	isEditing,
	editFormData,
	isSaving,
	onStartEdit,
	onCancelEdit,
	onSave,
	onUpdateField,
}: AccountDetailAdditionalInfoCardProps) {
	const getRadioLabel = (mode?: RadioMode) => {
		if (mode === "obligatoriskt") return localizationConstants.mandatoryOption;
		if (mode === "tillatet") return localizationConstants.allowedOption;
		if (mode === "ej_tillatet") return localizationConstants.notAllowedOption;
		return localizationConstants.mandatoryOption;
	};

	return (
		<div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col gap-6">
			{/* Card Header with Icon, Title & Edit Button */}
			<div className="flex items-center justify-between border-b border-slate-100 pb-4">
				<div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
					<UserCheck className="h-5 w-5 text-slate-700" />
					<Translate text={localizationConstants.additionalInfoSection} />
				</div>

				{isEditing ? (
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={onCancelEdit}
							className="h-8 px-3 text-xs gap-1 border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
						>
							<X className="h-3.5 w-3.5" />
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button
							type="button"
							size="sm"
							disabled={isSaving}
							onClick={onSave}
							className="h-8 px-3 text-xs gap-1 bg-[#111721] text-white hover:bg-slate-800 cursor-pointer"
						>
							<Check className="h-3.5 w-3.5" />
							<Translate text={localizationConstants.save} />
						</Button>
					</div>
				) : (
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onStartEdit}
						className="h-8 px-3 text-xs gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
					>
						<Edit2 className="h-3.5 w-3.5 text-slate-600" />
						<Translate text={localizationConstants.editLabel} />
					</Button>
				)}
			</div>

			{/* Form Fields or Readonly View */}
			{isEditing ? (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.sruCodeField} />
						</label>
						<input
							type="text"
							value={editFormData.sru}
							onChange={(e) => onUpdateField("sru", e.target.value)}
							className="h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.vatCodeField} />
						</label>
						<select
							value={editFormData.momskod}
							onChange={(e) => onUpdateField("momskod", e.target.value)}
							className="h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
						>
							{MOMSKOD_OPTIONS.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.costCenterField} />
						</label>
						<div className="flex flex-wrap items-center gap-4">
							<label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
								<input
									type="radio"
									name="detailKostnadsstalleMode"
									checked={editFormData.kostnadsstalleMode === "obligatoriskt"}
									onChange={() =>
										onUpdateField("kostnadsstalleMode", "obligatoriskt" as RadioMode)
									}
									className="h-4 w-4 text-slate-900 focus:ring-slate-900"
								/>
								<Translate text={localizationConstants.mandatoryOption} />
							</label>
							<label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
								<input
									type="radio"
									name="detailKostnadsstalleMode"
									checked={editFormData.kostnadsstalleMode === "tillatet"}
									onChange={() =>
										onUpdateField("kostnadsstalleMode", "tillatet" as RadioMode)
									}
									className="h-4 w-4 text-slate-900 focus:ring-slate-900"
								/>
								<Translate text={localizationConstants.allowedOption} />
							</label>
							<label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
								<input
									type="radio"
									name="detailKostnadsstalleMode"
									checked={editFormData.kostnadsstalleMode === "ej_tillatet"}
									onChange={() =>
										onUpdateField("kostnadsstalleMode", "ej_tillatet" as RadioMode)
									}
									className="h-4 w-4 text-slate-900 focus:ring-slate-900"
								/>
								<Translate text={localizationConstants.notAllowedOption} />
							</label>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.projectField} />
						</label>
						<div className="flex flex-wrap items-center gap-4">
							<label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
								<input
									type="radio"
									name="detailProjektMode"
									checked={editFormData.projektMode === "obligatoriskt"}
									onChange={() =>
										onUpdateField("projektMode", "obligatoriskt" as RadioMode)
									}
									className="h-4 w-4 text-slate-900 focus:ring-slate-900"
								/>
								<Translate text={localizationConstants.mandatoryOption} />
							</label>
							<label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
								<input
									type="radio"
									name="detailProjektMode"
									checked={editFormData.projektMode === "tillatet"}
									onChange={() =>
										onUpdateField("projektMode", "tillatet" as RadioMode)
									}
									className="h-4 w-4 text-slate-900 focus:ring-slate-900"
								/>
								<Translate text={localizationConstants.allowedOption} />
							</label>
							<label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
								<input
									type="radio"
									name="detailProjektMode"
									checked={editFormData.projektMode === "ej_tillatet"}
									onChange={() =>
										onUpdateField("projektMode", "ej_tillatet" as RadioMode)
									}
									className="h-4 w-4 text-slate-900 focus:ring-slate-900"
								/>
								<Translate text={localizationConstants.notAllowedOption} />
							</label>
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.suggestCostCenterField} />
						</label>
						<select
							value={editFormData.foreslaKostnadsstalle}
							onChange={(e) =>
								onUpdateField("foreslaKostnadsstalle", e.target.value)
							}
							className="h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
						>
							{KOSTNADSSTALLE_OPTIONS.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.suggestProjectField} />
						</label>
						<input
							type="text"
							value={editFormData.foreslaProjekt}
							onChange={(e) => onUpdateField("foreslaProjekt", e.target.value)}
							className="h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
						/>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
					<div className="flex flex-col gap-1">
						<span className="text-xs font-semibold text-slate-900">
							<Translate text={localizationConstants.sruCodeField} />
						</span>
						<span className="text-xs text-slate-600 font-normal">
							{account.sru || "-"}
						</span>
					</div>

					<div className="flex flex-col gap-1">
						<span className="text-xs font-semibold text-slate-900">
							<Translate text={localizationConstants.vatCodeField} />
						</span>
						<span className="text-xs text-slate-600 font-normal">
							{account.momskod || "-"}
						</span>
					</div>

					<div className="flex flex-col gap-1">
						<span className="text-xs font-semibold text-slate-900">
							<Translate text={localizationConstants.costCenterField} />
						</span>
						<span className="text-xs text-slate-600 font-normal">
							<Translate text={getRadioLabel(account.kostnadsstalleMode)} />
						</span>
					</div>

					<div className="flex flex-col gap-1">
						<span className="text-xs font-semibold text-slate-900">
							<Translate text={localizationConstants.projectField} />
						</span>
						<span className="text-xs text-slate-600 font-normal">
							<Translate text={getRadioLabel(account.projektMode)} />
						</span>
					</div>

					<div className="flex flex-col gap-1">
						<span className="text-xs font-semibold text-slate-900">
							<Translate text={localizationConstants.suggestCostCenterField} />
						</span>
						<span className="text-xs text-slate-600 font-normal">
							{account.foreslaKostnadsstalle || "-"}
						</span>
					</div>

					<div className="flex flex-col gap-1">
						<span className="text-xs font-semibold text-slate-900">
							<Translate text={localizationConstants.suggestProjectField} />
						</span>
						<span className="text-xs text-slate-600 font-normal">
							{account.foreslaProjekt || "-"}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}
