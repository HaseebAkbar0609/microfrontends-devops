"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
import { SupplierSearchableDropdown } from "./SupplierSearchableDropdown";

interface RegisterExpenseHeaderFormProps {
	formData: RegisterExpenseFormData;
	updateField: <K extends keyof RegisterExpenseFormData>(
		field: K,
		value: RegisterExpenseFormData[K],
	) => void;
	suppliers: string[];
	onAddSupplier: (name: string) => void;
	onOpenAddSupplier: () => void;
	errors: RegisterExpenseErrors;
}

export function RegisterExpenseHeaderForm({
	formData,
	updateField,
	suppliers,
	onAddSupplier,
	onOpenAddSupplier,
	errors,
}: RegisterExpenseHeaderFormProps) {
	const { t } = useTranslation();

	return (
		<div className="bg-white rounded-lg border border-slate-200 p-6 mb-5 shadow-2xs">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
				{/* 1. Supplier Field (Searchable Combobox Dropdown to select or add new) */}
				<div className="lg:col-span-4">
					<div className="flex items-center justify-between mb-1.5 h-5">
						<Label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.registerExpenseSupplierLabel} />{" "}
							<span className="text-rose-500">*</span>
						</Label>
					</div>
					<SupplierSearchableDropdown
						value={formData.supplier}
						onChange={(val) => updateField("supplier", val)}
						suppliers={suppliers}
						onAddSupplier={onAddSupplier}
						onOpenAddSupplierModal={onOpenAddSupplier}
						hasError={Boolean(errors.supplier)}
					/>
					{errors.supplier && (
						<p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.supplier}</p>
					)}
				</div>

				{/* 2. Invoice / Receipt Number */}
				<div className="lg:col-span-4">
					<div className="flex items-center justify-between mb-1.5 h-5">
						<Label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.registerExpenseInvoiceNoLabel} />{" "}
							<span className="text-rose-500">*</span>
						</Label>
					</div>
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
				<div className="lg:col-span-4">
					<div className="flex items-center justify-between mb-1.5 h-5">
						<Label className="text-xs font-semibold text-slate-700">
							<Translate text={localizationConstants.registerExpenseCategoryLabel} />{" "}
							<span className="text-rose-500">*</span>
						</Label>
					</div>
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
									{t(cat.labelKey)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.category && (
						<p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.category}</p>
					)}
				</div>

				{/* 4. Invoice Date */}
				<div className="lg:col-span-3">
					<Label className="text-xs font-semibold text-slate-700 block mb-1.5 h-5 flex items-center">
						<Translate text={localizationConstants.registerExpenseDateLabel} />{" "}
						<span className="text-rose-500 ml-0.5">*</span>
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
				<div className="lg:col-span-3">
					<Label className="text-xs font-semibold text-slate-700 block mb-1.5 h-5 flex items-center">
						<Translate text={localizationConstants.registerExpenseDueDateLabel} />{" "}
						<span className="text-rose-500 ml-0.5">*</span>
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
				<div className="lg:col-span-3">
					<Label className="text-xs font-semibold text-slate-700 block mb-1.5 h-5 flex items-center">
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
				<div className="lg:col-span-3">
					<Label className="text-xs font-semibold text-slate-700 block mb-1.5 h-5 flex items-center">
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

				{/* 8. Notes / Message (full width 12 cols, single-line input) */}
				<div className="lg:col-span-12">
					<Label className="text-xs font-semibold text-slate-700 block mb-1.5 h-5 flex items-center">
						<Translate text={localizationConstants.registerExpenseNotesLabel} />
					</Label>
					<Input
						type="text"
						value={formData.notes}
						onChange={(e) => updateField("notes", e.target.value)}
						placeholder={t(localizationConstants.registerExpenseNotesPlaceholder)}
						className="h-9 text-xs border-slate-200 bg-white rounded-md"
					/>
				</div>
			</div>
		</div>
	);
}

export default RegisterExpenseHeaderForm;
