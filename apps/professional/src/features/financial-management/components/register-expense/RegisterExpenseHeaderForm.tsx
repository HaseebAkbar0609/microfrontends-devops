"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	RegisterExpenseFormData,
	RegisterExpenseErrors,
	ExpenseCategory,
} from "../../types/expense.types";
import {
	EXPENSE_CATEGORIES,
	DEFAULT_PROJECTS_LIST,
	DEFAULT_COST_CENTERS_LIST,
} from "../../constants/expense.constants";

interface RegisterExpenseHeaderFormProps {
	formData: RegisterExpenseFormData;
	updateField: <K extends keyof RegisterExpenseFormData>(
		field: K,
		value: RegisterExpenseFormData[K],
	) => void;
	suppliers: string[];
	onOpenAddSupplier: () => void;
	errors: RegisterExpenseErrors;
}

export function RegisterExpenseHeaderForm({
	formData,
	updateField,
	suppliers,
	onOpenAddSupplier,
	errors,
}: RegisterExpenseHeaderFormProps) {
	const { t } = useTranslation();

	return (
		<div className="bg-white rounded-lg border border-slate-200 p-6 mb-5 shadow-2xs">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
				{/* 1. Supplier Field with "+ Lägg till ny leverantör" button */}
				<div>
					<div className="flex items-center justify-between mb-1.5">
						<Label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.registerExpenseSupplierLabel} />{" "}
							<span className="text-rose-500">*</span>
						</Label>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={onOpenAddSupplier}
							className="h-6 px-2 text-[11px] text-zinc-900 hover:text-zinc-950 font-medium cursor-pointer -mr-1 gap-1"
						>
							<Plus className="h-3 w-3" />
							<span>
								<Translate text={localizationConstants.registerExpenseAddNewSupplier} />
							</span>
						</Button>
					</div>
					<Select
						value={formData.supplier}
						onValueChange={(val) => updateField("supplier", val)}
					>
						<SelectTrigger
							className={`h-9 text-xs border-slate-200 bg-white rounded-md ${
								errors.supplier ? "border-rose-500 ring-1 ring-rose-500" : ""
							}`}
						>
							<SelectValue
								placeholder={t(localizationConstants.registerExpenseSupplierPlaceholder)}
							/>
						</SelectTrigger>
						<SelectContent className="bg-white max-h-56">
							{suppliers.map((sup) => (
								<SelectItem key={sup} value={sup} className="text-xs cursor-pointer">
									{sup}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.supplier && (
						<p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.supplier}</p>
					)}
				</div>

				{/* 2. Invoice / Receipt Number */}
				<div>
					<Label className="text-xs font-semibold text-slate-700 block mb-1.5">
						<Translate text={localizationConstants.registerExpenseInvoiceNoLabel} />{" "}
						<span className="text-rose-500">*</span>
					</Label>
					<Input
						type="text"
						value={formData.fakturaNo}
						onChange={(e) => updateField("fakturaNo", e.target.value)}
						placeholder={t(localizationConstants.registerExpenseInvoiceNoPlaceholder)}
						className={`h-9 text-xs border-slate-200 bg-white rounded-md ${
							errors.fakturaNo ? "border-rose-500 ring-1 ring-rose-500" : ""
						}`}
					/>
					{errors.fakturaNo && (
						<p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.fakturaNo}</p>
					)}
				</div>

				{/* 3. Category */}
				<div>
					<Label className="text-xs font-semibold text-slate-700 block mb-1.5">
						<Translate text={localizationConstants.registerExpenseCategoryLabel} />{" "}
						<span className="text-rose-500">*</span>
					</Label>
					<Select
						value={formData.category}
						onValueChange={(val) => updateField("category", val as ExpenseCategory)}
					>
						<SelectTrigger
							className={`h-9 text-xs border-slate-200 bg-white rounded-md ${
								errors.category ? "border-rose-500 ring-1 ring-rose-500" : ""
							}`}
						>
							<SelectValue
								placeholder={t(localizationConstants.registerExpenseCategoryPlaceholder)}
							/>
						</SelectTrigger>
						<SelectContent className="bg-white">
							{EXPENSE_CATEGORIES.map((cat) => (
								<SelectItem key={cat.value} value={cat.value} className="text-xs cursor-pointer">
									<Translate text={cat.labelKey} />
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.category && (
						<p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.category}</p>
					)}
				</div>

				{/* 4. Invoice Date */}
				<div>
					<Label className="text-xs font-semibold text-slate-700 block mb-1.5">
						<Translate text={localizationConstants.registerExpenseDateLabel} />{" "}
						<span className="text-rose-500">*</span>
					</Label>
					<Input
						type="date"
						value={formData.date}
						onChange={(e) => updateField("date", e.target.value)}
						className={`h-9 text-xs border-slate-200 bg-white rounded-md ${
							errors.date ? "border-rose-500 ring-1 ring-rose-500" : ""
						}`}
					/>
					{errors.date && (
						<p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.date}</p>
					)}
				</div>

				{/* 5. Due Date */}
				<div>
					<Label className="text-xs font-semibold text-slate-700 block mb-1.5">
						<Translate text={localizationConstants.registerExpenseDueDateLabel} />{" "}
						<span className="text-rose-500">*</span>
					</Label>
					<Input
						type="date"
						value={formData.dueDate}
						onChange={(e) => updateField("dueDate", e.target.value)}
						className={`h-9 text-xs border-slate-200 bg-white rounded-md ${
							errors.dueDate ? "border-rose-500 ring-1 ring-rose-500" : ""
						}`}
					/>
					{errors.dueDate && (
						<p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.dueDate}</p>
					)}
				</div>

				{/* 6. Project (Optional) */}
				<div>
					<Label className="text-xs font-semibold text-slate-700 block mb-1.5">
						<Translate text={localizationConstants.registerExpenseProjectLabel} />
					</Label>
					<Select
						value={formData.project}
						onValueChange={(val) => updateField("project", val)}
					>
						<SelectTrigger className="h-9 text-xs border-slate-200 bg-white rounded-md">
							<SelectValue
								placeholder={t(localizationConstants.registerExpenseProjectPlaceholder)}
							/>
						</SelectTrigger>
						<SelectContent className="bg-white">
							{DEFAULT_PROJECTS_LIST.map((proj) => (
								<SelectItem key={proj.id} value={proj.name} className="text-xs cursor-pointer">
									{proj.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* 7. Cost Center (Optional) */}
				<div>
					<Label className="text-xs font-semibold text-slate-700 block mb-1.5">
						<Translate text={localizationConstants.registerExpenseCostCenterLabel} />
					</Label>
					<Select
						value={formData.costCenter}
						onValueChange={(val) => updateField("costCenter", val)}
					>
						<SelectTrigger className="h-9 text-xs border-slate-200 bg-white rounded-md">
							<SelectValue
								placeholder={t(localizationConstants.registerExpenseCostCenterPlaceholder)}
							/>
						</SelectTrigger>
						<SelectContent className="bg-white">
							{DEFAULT_COST_CENTERS_LIST.map((cc) => (
								<SelectItem key={cc.id} value={cc.id} className="text-xs cursor-pointer">
									{cc.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* 8. Notes / Comments (spans 2 columns on lg) */}
				<div className="lg:col-span-2">
					<Label className="text-xs font-semibold text-slate-700 block mb-1.5">
						<Translate text={localizationConstants.registerExpenseNotesLabel} />
					</Label>
					<Textarea
						rows={2}
						value={formData.notes}
						onChange={(e) => updateField("notes", e.target.value)}
						placeholder={t(localizationConstants.registerExpenseNotesPlaceholder)}
						className="text-xs border-slate-200 bg-white rounded-md resize-none"
					/>
				</div>
			</div>
		</div>
	);
}

export default RegisterExpenseHeaderForm;
