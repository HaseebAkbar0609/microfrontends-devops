"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CreatePriceListFormData, PriceListArticleItem } from "../types/priceLists.types";
import { priceListsRepository } from "../utils/priceListsRepository";
import { MOCK_PRICE_LIST_ARTICLES } from "../mock/priceListsMockData";
import { PRICE_LISTS_BASE_ROUTE } from "../constants/priceLists.constants";

export interface FormErrors {
	code?: string;
	name?: string;
	date?: string;
	createdBy?: string;
	category?: string;
	unit?: string;
}

export function useCreatePriceListForm() {
	const t = useTranslate();
	const router = useRouter();

	const [currentStep, setCurrentStep] = useState<1 | 2>(1);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const initialFormData: CreatePriceListFormData = {
		code: "",
		name: "",
		date: new Date().toISOString().split("T")[0],
		createdBy: "Kalle Andersson",
		comment: "",
		category: "Service",
		unit: "Styck",
		customer: "Kund 01",
		supplier: "leverantörer 01",
		selectedArticleIds: ["pla_100", "pla_101", "pla_102"],
	};

	const [formData, setFormData] = useState<CreatePriceListFormData>(initialFormData);
	const [errors, setErrors] = useState<FormErrors>({});

	// Step 2 Article list state
	const [articlesSearchQuery, setArticlesSearchQuery] = useState("");
	const [masterArticles] = useState<PriceListArticleItem[]>(MOCK_PRICE_LIST_ARTICLES);

	const updateField = useCallback(<K extends keyof CreatePriceListFormData>(
		field: K,
		value: CreatePriceListFormData[K],
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => ({ ...prev, [field]: undefined }));
	}, []);

	const validateStep1 = useCallback((): boolean => {
		const newErrors: FormErrors = {};

		if (!formData.name?.trim()) {
			newErrors.name = t(localizationConstants.validationPriceListNameRequired);
		}
		if (!formData.date?.trim()) {
			newErrors.date = t(localizationConstants.validationPriceListDateRequired);
		}
		if (!formData.createdBy?.trim()) {
			newErrors.createdBy = t(localizationConstants.validationPriceListCreatedByRequired);
		}
		if (!formData.category?.trim()) {
			newErrors.category = t(localizationConstants.validationPriceListCategoryRequired);
		}
		if (!formData.unit?.trim()) {
			newErrors.unit = t(localizationConstants.validationPriceListUnitRequired);
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [formData, t]);

	const toggleArticleSelection = useCallback((articleId: string) => {
		setFormData((prev) => {
			const exists = prev.selectedArticleIds.includes(articleId);
			const next = exists
				? prev.selectedArticleIds.filter((id) => id !== articleId)
				: [...prev.selectedArticleIds, articleId];
			return { ...prev, selectedArticleIds: next };
		});
	}, []);

	const toggleSelectAllArticles = useCallback(() => {
		setFormData((prev) => {
			const allIds = masterArticles.map((a) => a.id);
			const areAllSelected = allIds.every((id) => prev.selectedArticleIds.includes(id));
			return {
				...prev,
				selectedArticleIds: areAllSelected ? [] : allIds,
			};
		});
	}, [masterArticles]);

	const filteredArticles = useMemo(() => {
		if (!articlesSearchQuery.trim()) return masterArticles;
		const q = articlesSearchQuery.toLowerCase();
		return masterArticles.filter(
			(a) =>
				a.articleNo.toLowerCase().includes(q) ||
				a.benamning.toLowerCase().includes(q),
		);
	}, [masterArticles, articlesSearchQuery]);

	const goToNextStep = useCallback(() => {
		if (currentStep === 1) {
			if (validateStep1()) {
				setCurrentStep(2);
			}
		}
	}, [currentStep, validateStep1]);

	const goToPrevStep = useCallback(() => {
		if (currentStep === 2) {
			setCurrentStep(1);
		}
	}, [currentStep]);

	const submitForm = useCallback(async () => {
		if (!validateStep1()) {
			setCurrentStep(1);
			return;
		}

		setIsSubmitting(true);
		try {
			priceListsRepository.add(formData, masterArticles);
			showToast("success", t(localizationConstants.priceListCreatedSuccess));
			router.push(PRICE_LISTS_BASE_ROUTE);
		} catch {
			showToast("error", t(localizationConstants.priceListCreateError));
		} finally {
			setIsSubmitting(false);
		}
	}, [formData, masterArticles, validateStep1, router, t]);

	return useMemo(
		() => ({
			currentStep,
			formData,
			errors,
			isSubmitting,
			updateField,
			goToNextStep,
			goToPrevStep,
			submitForm,
			articlesSearchQuery,
			setArticlesSearchQuery,
			filteredArticles,
			toggleArticleSelection,
			toggleSelectAllArticles,
		}),
		[
			currentStep,
			formData,
			errors,
			isSubmitting,
			updateField,
			goToNextStep,
			goToPrevStep,
			submitForm,
			articlesSearchQuery,
			filteredArticles,
			toggleArticleSelection,
			toggleSelectAllArticles,
		],
	);
}
