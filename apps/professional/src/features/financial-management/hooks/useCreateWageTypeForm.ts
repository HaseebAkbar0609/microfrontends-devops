"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	WageTypeFormData,
	WageTypeFormErrors,
} from "../types/wageTypes.types";
import {
	createWageTypeAPIAction,
	wageTypesRepository,
} from "../utils/wageTypesRepository";
import { WAGE_TYPES_BASE_ROUTE } from "../constants/wageTypes.constants";

const INITIAL_FORM_DATA: WageTypeFormData = {
	loneartId: "",
	benamning: "",
	personalTyp: "tjansteman",
	loneform: "fastlon",
	transaktionstyp: "bruttolon",
	enhet: "manad",
	preliminarskatt: "Ja 30%",
	arbetsgivaravgift: "Ja 30%",
	kontoDebet: "7010",
	kontoKredit: "2820",
	motKontoAG: "2710",
	agUnderlag: true,
	semestergrundad: true,
	agiKod: "001",
	beskrivning: "",
	status: "active",
};

export function useCreateWageTypeForm() {
	const t = useTranslate();
	const router = useRouter();

	const [formData, setFormData] = useState<WageTypeFormData>(INITIAL_FORM_DATA);
	const [errors, setErrors] = useState<WageTypeFormErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const updateField = useCallback(
		<K extends keyof WageTypeFormData>(field: K, value: WageTypeFormData[K]) => {
			setFormData((prev) => ({ ...prev, [field]: value }));
			setErrors((prev) => {
				if (prev[field]) {
					const next = { ...prev };
					delete next[field];
					return next;
				}
				return prev;
			});
		},
		[],
	);

	const validateForm = useCallback((): boolean => {
		const newErrors: WageTypeFormErrors = {};

		if (!formData.loneartId.trim()) {
			newErrors.loneartId = t(localizationConstants.validationWageTypeCodeRequired);
		} else if (wageTypesRepository.existsCode(formData.loneartId.trim())) {
			newErrors.loneartId = t(localizationConstants.wageTypeDuplicateCodeError);
		}

		if (!formData.benamning.trim()) {
			newErrors.benamning = t(localizationConstants.validationWageTypeNameRequired);
		}

		if (!formData.enhet) {
			newErrors.enhet = t(localizationConstants.validationWageTypeUnitRequired);
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [formData, t]);

	const submitForm = useCallback(async () => {
		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);
		try {
			await createWageTypeAPIAction({
				...formData,
				loneartId: formData.loneartId.trim(),
				benamning: formData.benamning.trim(),
			});

			showToast("success", t(localizationConstants.wageTypeCreatedSuccess));
			router.push(WAGE_TYPES_BASE_ROUTE);
		} catch {
			showToast("error", t(localizationConstants.wageTypeFetchError));
		} finally {
			setIsSubmitting(false);
		}
	}, [formData, router, t, validateForm]);

	const cancel = useCallback(() => {
		router.push(WAGE_TYPES_BASE_ROUTE);
	}, [router]);

	return {
		formData,
		errors,
		isSubmitting,
		updateField,
		submitForm,
		cancel,
	};
}
