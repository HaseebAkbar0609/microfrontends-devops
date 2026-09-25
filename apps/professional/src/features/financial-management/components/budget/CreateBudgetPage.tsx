"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import localizationConstants from "@/utils/translation/constants";
import { budgetRoutes } from "../../constants/budget.constants";
import { useBudgets } from "../../hooks/useBudgets";
import type { BudgetFormData, EconomyBudgetItem } from "../../types/budget.types";
import { budgetRepository } from "../../utils/budgetRepository";
import { emptyBudgetRow } from "../../utils/budgetRows";
import { BudgetSummaryCard } from "./BudgetSummaryCard";
import { CreateBudgetInfoForm } from "./CreateBudgetInfoForm";
import { CreateBudgetSpreadsheet } from "./CreateBudgetSpreadsheet";
import { BudgetFormFooter } from "./form/BudgetFormFooter";
import { BudgetFormHeader } from "./form/BudgetFormHeader";

export interface CreateBudgetPageProps {
	initialItem?: EconomyBudgetItem;
	isEditMode?: boolean;
	/** Which module the form is mounted in; every link is built from it. */
	basePath?: string;
}

export function CreateBudgetPage({
	initialItem,
	isEditMode = false,
	basePath,
}: CreateBudgetPageProps) {
	const router = useRouter();
	const { t } = useTranslation();
	const routes = budgetRoutes(basePath);
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
		/* A new budget opens on a blank line, never on sample figures. */
		rows: initialItem?.rows ?? [emptyBudgetRow()],
	});

	/* The number is assigned on save, so it is read after mount rather than
	   during render, where the server and the client would disagree. */
	useEffect(() => {
		if (isEditMode) return;
		setFormData((prev) =>
			prev.budgetnr ? prev : { ...prev, budgetnr: budgetRepository.nextBudgetNr() },
		);
	}, [isEditMode]);

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

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (!validateForm()) return;

		setIsSubmitting(true);
		try {
			if (isEditMode && initialItem) {
				updateBudget(initialItem.id, formData);
				router.push(routes.detail(initialItem.id));
			} else {
				const created = createBudget(formData);
				router.push(routes.detail(created.id));
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex min-h-screen min-w-0 flex-1 flex-col bg-slate-50/50">
			<BudgetFormHeader isEditMode={isEditMode} onBack={() => router.push(routes.list)} />

			<div className="mx-auto w-full min-w-0 max-w-6xl flex-1 space-y-6 p-6">
				<CreateBudgetInfoForm formData={formData} onChange={handleFormUpdates} errors={errors} />
				<CreateBudgetSpreadsheet formData={formData} onChange={handleFormUpdates} />
				<BudgetSummaryCard rows={formData.rows || []} />
			</div>

			<BudgetFormFooter onCancel={() => router.push(routes.list)} isSubmitting={isSubmitting} />
		</form>
	);
}

export default CreateBudgetPage;
