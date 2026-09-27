"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CreateAccountFormData } from "../types/accountPlan.types";
import { accountPlanRepository } from "../utils/accountPlanRepository";
import { ACCOUNT_PLAN_BASE_ROUTE } from "../constants/accountPlan.constants";

const INITIAL_FORM_DATA: CreateAccountFormData = {
	kontoNr: "",
	benamning: "",
	ingaendeBalans: "",
	aktivt: "Aktiv",
	sru: "",
	momskod: "-",
	kostnadsstalleMode: "obligatoriskt",
	projektMode: "obligatoriskt",
	foreslaKostnadsstalle: "Kontor 10",
	foreslaProjekt: "",
};

export function useCreateAccountForm() {
	const t = useTranslate();
	const router = useRouter();

	const [formData, setFormData] = useState<CreateAccountFormData>(INITIAL_FORM_DATA);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isAdditionalInfoOpen, setIsAdditionalInfoOpen] = useState(true);

	const updateField = useCallback(
		<K extends keyof CreateAccountFormData>(
			field: K,
			value: CreateAccountFormData[K],
		) => {
			setFormData((prev) => ({ ...prev, [field]: value }));
			setErrors((prev) => {
				if (!prev[field]) return prev;
				const next = { ...prev };
				delete next[field];
				return next;
			});
		},
		[],
	);

	const validate = useCallback((): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.kontoNr.trim()) {
			newErrors.kontoNr = t(localizationConstants.validationAccountNumberRequired);
		} else if (!/^\d+$/.test(formData.kontoNr.trim())) {
			newErrors.kontoNr = t(localizationConstants.validationAccountNumberRequired);
		} else {
			// Check uniqueness
			const existing = accountPlanRepository.getById(formData.kontoNr.trim());
			if (existing) {
				newErrors.kontoNr = t(localizationConstants.validationAccountNumberUnique);
			}
		}

		if (!formData.benamning.trim()) {
			newErrors.benamning = t(localizationConstants.validationAccountNameRequired);
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [formData, t]);

	const handleSubmit = useCallback(async () => {
		if (!validate()) {
			showToast("error", t(localizationConstants.validationAccountNumberRequired));
			return;
		}

		setIsSubmitting(true);
		try {
			accountPlanRepository.create(formData);
			showToast("success", t(localizationConstants.accountCreatedSuccess));
			router.push(ACCOUNT_PLAN_BASE_ROUTE);
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsSubmitting(false);
		}
	}, [validate, formData, router, t]);

	const handleCancel = useCallback(() => {
		router.push(ACCOUNT_PLAN_BASE_ROUTE);
	}, [router]);

	const toggleAdditionalInfo = useCallback(() => {
		setIsAdditionalInfoOpen((prev) => !prev);
	}, []);

	return {
		formData,
		errors,
		isSubmitting,
		isAdditionalInfoOpen,
		updateField,
		handleSubmit,
		handleCancel,
		toggleAdditionalInfo,
	};
}
