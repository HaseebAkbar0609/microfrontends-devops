"use client";

import React, { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import { BUDGETS_BASE_ROUTE } from "../../constants/budget.constants";
import type { EconomyBudgetItem, BudgetFormData } from "../../types/budget.types";
import { useBudgets } from "../../hooks/useBudgets";
import { CreateBudgetInfoForm } from "./CreateBudgetInfoForm";
import { CreateBudgetSpreadsheet } from "./CreateBudgetSpreadsheet";
import { CreateBudgetSummaryCard } from "./CreateBudgetSummaryCard";

interface CreateBudgetPageProps {
	initialItem?: EconomyBudgetItem;
	isEditMode?: boolean;
}

export function CreateBudgetPage({
	initialItem,
	isEditMode = false,
}: CreateBudgetPageProps) {
	const router = useRouter();
	const { t } = useTranslation();
	const { createBudget, updateBudget } = useBudgets();

	const [formData, setFormData] = useState<BudgetFormData>({
		id: initialItem?.id || "",
		budgetnr: initialItem?.budgetnr || "",
		budgetName: initialItem?.budgetName || "",
		description: initialItem?.description || "",
		comment: initialItem?.comment || "",
		tags: initialItem?.tags || "",
		status: initialItem?.status || "active",
		isOverhead: initialItem?.isOverhead || false,
		distributionType: initialItem?.distributionType || "KR",
		rows: initialItem?.rows || [
			{
				id: "r1",
				konto: "3011",
				kontoName: "3011 - Försäljning inom Sverige",
				kostnadsstalle: "10 - Stockholm",
				arsbudget: 500000,
				fordelning: 0,
				procent: 0,
				months: {
					0: 100000,
					1: 100000,
					2: 0,
					3: 0,
					4: 0,
					5: 42,
					6: 0,
					7: 0,
					8: 0,
					9: 0,
					10: 0,
					11: 0,
				},
			},
			{
				id: "r2",
				konto: "4010",
				kontoName: "4010 - Inköp av material",
				kostnadsstalle: "10 - Stockholm",
				arsbudget: 300000,
				fordelning: 12,
				procent: 0,
				months: {
					0: -50000,
					1: -50000,
					2: 0,
					3: 0,
					4: 0,
					5: 60,
					6: 0,
					7: 0,
					8: 0,
					9: 0,
					10: 0,
					11: 0,
				},
			},
		],
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleFormUpdates = (updates: Partial<BudgetFormData>) => {
		setFormData((prev) => ({ ...prev, ...updates }));
		// Clear errors for modified fields
		if (updates.budgetName && errors.budgetName) {
			setErrors((prev) => {
				const copy = { ...prev };
				delete copy.budgetName;
				return copy;
			});
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.budgetName.trim()) {
			newErrors.budgetName = t(localizationConstants.valBudgetNameRequired);
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;

		setIsSubmitting(true);
		try {
			if (isEditMode && initialItem) {
				updateBudget(initialItem.id, formData);
				router.push(`${BUDGETS_BASE_ROUTE}/${initialItem.id}`);
			} else {
				const created = createBudget(formData);
				router.push(`${BUDGETS_BASE_ROUTE}/${created.id}`);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-1 flex-col bg-slate-50/50 min-h-screen"
		>
			{/* Top Bar Header */}
			<div className="bg-white border-b border-slate-200 px-6 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={() => router.push(BUDGETS_BASE_ROUTE)}
							className="p-1.5 -ml-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
							aria-label={t(localizationConstants.backAriaLabel)}
						>
							<ArrowLeft className="w-5 h-5" />
						</button>
						<h1 className="text-xl font-bold text-slate-900">
							<Translate
								text={
									isEditMode
										? localizationConstants.titleEditBudget
										: localizationConstants.titleNewBudget
								}
							/>
						</h1>
					</div>

					<div className="flex items-center gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={() => router.push(BUDGETS_BASE_ROUTE)}
							className="h-9 px-4 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
						>
							<Translate text={localizationConstants.btnCancelBudget} />
						</Button>

						<Button
							type="submit"
							disabled={isSubmitting}
							className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg shadow-sm gap-1.5 cursor-pointer disabled:opacity-50"
						>
							<Save className="w-3.5 h-3.5" />
							<Translate text={localizationConstants.btnSaveBudget} />
						</Button>
					</div>
				</div>

				{/* Tabs: Budget */}
				<div className="flex gap-6 mt-4 -mb-4">
					<button
						type="button"
						className="pb-3 border-b-2 border-slate-900 font-semibold text-sm text-slate-900 cursor-pointer"
					>
						<Translate text={localizationConstants.tabBudget} />
					</button>
				</div>
			</div>

			{/* Form Body */}
			<div className="p-6 max-w-6xl mx-auto w-full space-y-6">
				{/* Section 1: Budget Information */}
				<CreateBudgetInfoForm
					formData={formData}
					onChange={handleFormUpdates}
					errors={errors}
				/>

				{/* Section 2: Budget 12-Month Spreadsheet */}
				<CreateBudgetSpreadsheet
					formData={formData}
					onChange={handleFormUpdates}
				/>

				{/* Summary Card */}
				<CreateBudgetSummaryCard rows={formData.rows || []} />

				{/* Footer buttons */}
				<div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
					<Button
						type="button"
						variant="outline"
						onClick={() => router.push(BUDGETS_BASE_ROUTE)}
						className="h-10 px-5 text-sm font-medium border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
					>
						<Translate text={localizationConstants.btnCancelBudget} />
					</Button>

					<Button
						type="submit"
						disabled={isSubmitting}
						className="h-10 px-6 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-sm gap-2 cursor-pointer disabled:opacity-50"
					>
						<Save className="w-4 h-4" />
						<Translate text={localizationConstants.btnSaveBudget} />
					</Button>
				</div>
			</div>
		</form>
	);
}

export default CreateBudgetPage;
