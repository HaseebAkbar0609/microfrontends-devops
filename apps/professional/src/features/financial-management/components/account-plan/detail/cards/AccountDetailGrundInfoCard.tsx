"use client";

import React from "react";
import { UserCheck, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { AccountPlanItem, CreateAccountFormData } from "@/features/financial-management/types/accountPlan.types";
import { AKTIVT_OPTIONS } from "@/features/financial-management/constants/accountPlan.constants";

interface AccountDetailGrundInfoCardProps {
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

export function AccountDetailGrundInfoCard({
	account,
	isEditing,
	editFormData,
	isSaving,
	onStartEdit,
	onCancelEdit,
	onSave,
	onUpdateField,
}: AccountDetailGrundInfoCardProps) {
	return (
		<div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col gap-6">
			{/* Card Header with Icon, Title & Edit Button */}
			<div className="flex items-center justify-between border-b border-slate-100 pb-4">
				<div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
					<UserCheck className="h-5 w-5 text-slate-700" />
					<Translate text={localizationConstants.basicInfoSection} />
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
				<div className="grid grid-cols-1 md:grid-cols-4 gap-5">
					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.accountNumberField} />
						</label>
						<input
							type="text"
							value={editFormData.kontoNr}
							onChange={(e) => onUpdateField("kontoNr", e.target.value)}
							className="h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.designationField} />
						</label>
						<input
							type="text"
							value={editFormData.benamning}
							onChange={(e) => onUpdateField("benamning", e.target.value)}
							className="h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.incomingBalanceField} />
						</label>
						<input
							type="text"
							value={editFormData.ingaendeBalans}
							onChange={(e) => onUpdateField("ingaendeBalans", e.target.value)}
							className="h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.activeField} />
						</label>
						<select
							value={editFormData.aktivt}
							onChange={(e) => onUpdateField("aktivt", e.target.value)}
							className="h-10 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
						>
							{AKTIVT_OPTIONS.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
					<div className="flex flex-col gap-1">
						<span className="text-xs font-semibold text-slate-900">
							<Translate text={localizationConstants.accountNumberField} />
						</span>
						<span className="text-xs text-slate-600 font-normal">
							{account.kontoNr || "-"}
						</span>
					</div>

					<div className="flex flex-col gap-1">
						<span className="text-xs font-semibold text-slate-900">
							<Translate text={localizationConstants.designationField} />
						</span>
						<span className="text-xs text-slate-600 font-normal">
							{account.benamning || "-"}
						</span>
					</div>

					<div className="flex flex-col gap-1">
						<span className="text-xs font-semibold text-slate-900">
							<Translate text={localizationConstants.incomingBalanceField} />
						</span>
						<span className="text-xs text-slate-600 font-normal">
							{account.ingaendeBalans || "0"}
						</span>
					</div>

					<div className="flex flex-col gap-1">
						<span className="text-xs font-semibold text-slate-900">
							<Translate text={localizationConstants.activeField} />
						</span>
						<span className="text-xs text-slate-600 font-normal">
							{account.aktivt || (account.status === "active" ? "Aktiv" : "Inaktiv")}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}
