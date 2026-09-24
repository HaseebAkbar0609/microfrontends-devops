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
	ExpenseCurrency,
	SupplierInfo,
} from "../../types/expense.types";
import {
	EXPENSE_CATEGORIES,
	DEFAULT_PROJECTS_LIST,
	DEFAULT_COST_CENTERS_LIST,
} from "../../constants/expense.constants";
import { SupplierSearchableDropdown } from "./SupplierSearchableDropdown";
import { CheckCircle2, Building, CreditCard, MapPin } from "lucide-react";

interface RegisterExpenseHeaderFormProps {
	formData: RegisterExpenseFormData;
	updateField: <K extends keyof RegisterExpenseFormData>(
		field: K,
		value: RegisterExpenseFormData[K],
	) => void;
	suppliers: string[];
	selectedSupplierDetails?: SupplierInfo | null;
	onAddSupplier: (name: string, details?: Partial<SupplierInfo>) => void;
	onOpenAddSupplier: () => void;
	errors: RegisterExpenseErrors;
}

const CURRENCY_OPTIONS: ExpenseCurrency[] = ["SEK", "EUR", "USD", "NOK", "DKK"];

export function RegisterExpenseHeaderForm({
	formData,
	updateField,
	suppliers,
	selectedSupplierDetails,
	onAddSupplier,
	onOpenAddSupplier,
	errors,
}: RegisterExpenseHeaderFormProps) {
	const { t } = useTranslation();

	return (
		<div className="bg-white rounded-lg border border-slate-200 p-6 mb-6 shadow-2xs font-sans">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
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

				{/* Supplier Verified Details Badge Strip (when supplier is selected) */}
				{formData.supplier && selectedSupplierDetails && (
					<div className="lg:col-span-12 -mt-2 bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600">
						<div className="flex items-center gap-1.5 font-medium text-slate-800">
							<CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
							<Translate text={localizationConstants.registerExpenseSupplierVerified} />
						</div>
						{selectedSupplierDetails.orgNo && (
							<div className="flex items-center gap-1">
								<Building className="h-3.5 w-3.5 text-slate-400 shrink-0" />
								<span className="text-slate-500"><Translate text={localizationConstants.registerExpenseSupplierOrgNo} />:</span>
								<span className="font-semibold text-slate-700">{selectedSupplierDetails.orgNo}</span>
							</div>
						)}
						{selectedSupplierDetails.bankgiro && (
							<div className="flex items-center gap-1">
								<CreditCard className="h-3.5 w-3.5 text-slate-400 shrink-0" />
								<span className="text-slate-500"><Translate text={localizationConstants.registerExpenseSupplierBankgiro} />:</span>
								<span className="font-semibold text-slate-700">{selectedSupplierDetails.bankgiro}</span>
							</div>
						)}
						{selectedSupplierDetails.address && (
							<div className="flex items-center gap-1">
								<MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
								<span className="text-slate-500"><Translate text={localizationConstants.registerExpenseSupplierAddress} />:</span>
								<span className="font-medium text-slate-700">
									{selectedSupplierDetails.address}
									{selectedSupplierDetails.postalCity ? `, ${selectedSupplierDetails.postalCity}` : ""}
								</span>
							</div>
						)}
					</div>
				)}

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

				{/* 6. Currency */}
				<div className="lg:col-span-3">
					<Label className="text-xs font-semibold text-slate-700 block mb-1.5 h-5 flex items-center">
						<Translate text={localizationConstants.registerExpenseCurrencyLabel} />
					</Label>
					<Select
						value={formData.currency}
						onValueChange={(val) => updateField("currency", val as ExpenseCurrency)}
					>
						<SelectTrigger className="h-9 text-xs border-slate-200 bg-white rounded-md">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="bg-white">
							{CURRENCY_OPTIONS.map((curr) => (
								<SelectItem key={curr} value={curr} className="text-xs cursor-pointer">
									{curr}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* 7. Reference (Vår referens) */}
				<div className="lg:col-span-3">
					<Label className="text-xs font-semibold text-slate-700 block mb-1.5 h-5 flex items-center">
						<Translate text={localizationConstants.registerExpenseReferenceLabel} />
					</Label>
					<Input
						type="text"
						value={formData.reference || ""}
						onChange={(e) => updateField("reference", e.target.value)}
						placeholder={t(localizationConstants.registerExpenseReferencePlaceholder)}
						className="h-9 text-xs border-slate-200 bg-white rounded-md"
					/>
				</div>

				{/* 8. Project (Optional) */}
				<div className="lg:col-span-6">
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

				{/* 9. Cost Center (Optional) */}
				<div className="lg:col-span-6">
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

				{/* 10. Notes / Message (full width 12 cols, single-line input) */}
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
