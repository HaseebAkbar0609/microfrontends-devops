"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CreateCostCenterFormData } from "../types/costCenters.types";
import { createCostCenterAPIAction } from "../utils/costCentersRepository";
import { COST_CENTERS_BASE_ROUTE } from "../constants/costCenters.constants";

export interface CostCenterFormErrors {
	kod?: string;
	benamning?: string;
	anteckningar?: string;
}

export function useCreateCostCenterForm() {
	const t = useTranslate();
	const router = useRouter();

	const [isSubmitting, setIsSubmitting] = useState(false);

	const initialFormData: CreateCostCenterFormData = {
		kod: "",
		benamning: "",
		anteckningar: "",
		status: "active",
	};

	const [formData, setFormData] = useState<CreateCostCenterFormData>(initialFormData);
	const [errors, setErrors] = useState<CostCenterFormErrors>({});

	const updateField = useCallback(
		<K extends keyof CreateCostCenterFormData>(
			field: K,
			value: CreateCostCenterFormData[K],
		) => {
			setFormData((prev) => ({ ...prev, [field]: value }));
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		},
		[],
	);

	const validate = useCallback((): boolean => {
		const newErrors: CostCenterFormErrors = {};

		if (!formData.kod?.trim()) {
			newErrors.kod = t(localizationConstants.validationCostCenterCodeRequired);
		}
		if (!formData.benamning?.trim()) {
			newErrors.benamning = t(localizationConstants.validationCostCenterNameRequired);
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [formData, t]);

	const submitForm = useCallback(async () => {
		if (!validate()) {
			return;
		}

		setIsSubmitting(true);
		try {
			await createCostCenterAPIAction(formData);
			showToast("success", t(localizationConstants.costCenterCreatedSuccess));
			router.push(COST_CENTERS_BASE_ROUTE);
		} catch {
			showToast("error", "Kunde inte spara kostnadsställe");
		} finally {
			setIsSubmitting(false);
		}
	}, [formData, validate, router, t]);

	const cancel = useCallback(() => {
		router.push(COST_CENTERS_BASE_ROUTE);
	}, [router]);

	return useMemo(
		() => ({
			formData,
			errors,
			isSubmitting,
			updateField,
			submitForm,
			cancel,
		}),
		[formData, errors, isSubmitting, updateField, submitForm, cancel],
	);
}
