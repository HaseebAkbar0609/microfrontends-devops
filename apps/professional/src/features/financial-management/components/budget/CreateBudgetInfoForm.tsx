"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import type { BudgetFormData } from "../../types/budget.types";

interface CreateBudgetInfoFormProps {
	formData: BudgetFormData;
	onChange: (updates: Partial<BudgetFormData>) => void;
	errors: Record<string, string>;
}

export function CreateBudgetInfoForm({
	formData,
	onChange,
	errors,
}: CreateBudgetInfoFormProps) {
	const { t } = useTranslation();

	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-5">
			<h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
				<Translate text={localizationConstants.sectionBudgetInfo} />
			</h2>

			{/* Budget nr */}
			<div className="max-w-xs">
				<label
					htmlFor="budgetnr"
					className="block text-xs font-semibold text-slate-700 mb-1"
				>
					<Translate text={localizationConstants.fieldBudgetNr} />
				</label>
				{/* The number the budget will carry; the register assigns it, so the
				    form shows it rather than asking for it. */}
				<Input
					id="budgetnr"
					type="text"
					value={formData.budgetnr}
					disabled
					placeholder={t(localizationConstants.budgetNrPlaceholder)}
					className="h-10 rounded-lg border-slate-200 bg-slate-50/70 text-sm disabled:cursor-not-allowed disabled:text-slate-600 disabled:opacity-100"
				/>
			</div>

			{/* Row: Budget name & Beskrivning */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				<div>
					<label
						htmlFor="budgetName"
						className="block text-xs font-semibold text-slate-700 mb-1"
					>
						<Translate text={localizationConstants.fieldBudgetName} />{" "}
						<span className="text-rose-500">*</span>
					</label>
					<Input
						id="budgetName"
						type="text"
						value={formData.budgetName}
						onChange={(e) => onChange({ budgetName: e.target.value })}
						placeholder={t(localizationConstants.budgetNamePlaceholder)}
						className={`h-10 text-sm rounded-lg ${
							errors.budgetName ? "border-rose-500 bg-rose-50/20" : "border-slate-200"
						}`}
					/>
					{errors.budgetName && (
						<p className="text-xs text-rose-600 mt-1">{errors.budgetName}</p>
					)}
				</div>

				<div>
					<label
						htmlFor="description"
						className="block text-xs font-semibold text-slate-700 mb-1"
					>
						<Translate text={localizationConstants.fieldBudgetDescription} />
					</label>
					<Input
						id="description"
						type="text"
						value={formData.description || ""}
						onChange={(e) => onChange({ description: e.target.value })}
						placeholder={t(localizationConstants.budgetDescriptionPlaceholder)}
						className="h-10 border-slate-200 text-sm rounded-lg"
					/>
				</div>
			</div>

			{/* Kommentar */}
			<div>
				<label
					htmlFor="comment"
					className="block text-xs font-semibold text-slate-700 mb-1"
				>
					<Translate text={localizationConstants.fieldBudgetComment} />
				</label>
				<Input
					id="comment"
					type="text"
					value={formData.comment || ""}
					onChange={(e) => onChange({ comment: e.target.value })}
					placeholder={t(localizationConstants.budgetKommentarPlaceholder)}
					className="h-10 border-slate-200 text-sm rounded-lg"
				/>
			</div>

			{/* Taggar */}
			<div>
				<label
					htmlFor="tags"
					className="block text-xs font-semibold text-slate-700 mb-1"
				>
					<Translate text={localizationConstants.fieldBudgetTags} />
				</label>
				<Input
					id="tags"
					type="text"
					value={formData.tags || ""}
					onChange={(e) => onChange({ tags: e.target.value })}
					placeholder={t(localizationConstants.budgetTaggarPlaceholder)}
					className="h-10 border-slate-200 text-sm rounded-lg"
				/>
			</div>

			{/* Checkboxes: Aktiv budget & Overhead budget */}
			<div className="flex flex-wrap items-center gap-6 pt-2">
				<label className="flex items-center gap-2 text-sm text-slate-700 font-medium cursor-pointer">
					<Checkbox
						checked={formData.status === "active"}
						onCheckedChange={(checked) =>
							onChange({ status: checked ? "active" : "inactive" })
						}
						className="cursor-pointer"
					/>
					<Translate text={localizationConstants.fieldActiveBudget} />
				</label>

				<label className="flex items-center gap-2 text-sm text-slate-700 font-medium cursor-pointer">
					<Checkbox
						checked={formData.isOverhead}
						onCheckedChange={(checked) =>
							onChange({ isOverhead: Boolean(checked) })
						}
						className="cursor-pointer"
					/>
					<Translate text={localizationConstants.fieldOverheadBudget} />
				</label>
			</div>
		</div>
	);
}
