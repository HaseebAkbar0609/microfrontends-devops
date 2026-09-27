"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	WageTypeItem,
	WageTypeFormData,
	WageTypeFormErrors,
} from "../types/wageTypes.types";
import {
	getWageTypeDetailAPIAction,
	updateWageTypeAPIAction,
	deleteWageTypeAPIAction,
	wageTypesRepository,
} from "../utils/wageTypesRepository";
import { WAGE_TYPES_BASE_ROUTE } from "../constants/wageTypes.constants";

export function useWageTypeDetail(id: string) {
	const t = useTranslate();
	const router = useRouter();

	const [wageType, setWageType] = useState<WageTypeItem | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [editData, setEditData] = useState<WageTypeFormData | null>(null);
	const [errors, setErrors] = useState<WageTypeFormErrors>({});

	const fetchDetail = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await getWageTypeDetailAPIAction(id);
			setWageType(res);
			if (res) {
				setEditData({
					loneartId: res.loneartId,
					benamning: res.benamning,
					personalTyp: res.personalTyp,
					loneform: res.loneform,
					transaktionstyp: res.transaktionstyp,
					enhet: res.enhet,
					preliminarskatt: res.preliminarskatt,
					arbetsgivaravgift: res.arbetsgivaravgift,
					kontoDebet: res.konto,
					kontoKredit: res.kontoKredit || "2820",
					motKontoAG: res.motKontoAG || "2710",
					agUnderlag: res.agUnderlag ?? true,
					semestergrundad: res.semestergrundad ?? true,
					agiKod: res.agiKod || "001",
					beskrivning: res.beskrivning || "",
					status: res.status,
				});
			}
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchDetail();
	}, [fetchDetail]);

	const updateEditField = useCallback(
		<K extends keyof WageTypeFormData>(field: K, value: WageTypeFormData[K]) => {
			setEditData((prev) => (prev ? { ...prev, [field]: value } : prev));
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

	const startEdit = useCallback(() => {
		setIsEditing(true);
	}, []);

	const cancelEdit = useCallback(() => {
		if (wageType) {
			setEditData({
				loneartId: wageType.loneartId,
				benamning: wageType.benamning,
				personalTyp: wageType.personalTyp,
				loneform: wageType.loneform,
				transaktionstyp: wageType.transaktionstyp,
				enhet: wageType.enhet,
				preliminarskatt: wageType.preliminarskatt,
				arbetsgivaravgift: wageType.arbetsgivaravgift,
				kontoDebet: wageType.konto,
				kontoKredit: wageType.kontoKredit || "2820",
				motKontoAG: wageType.motKontoAG || "2710",
				agUnderlag: wageType.agUnderlag ?? true,
				semestergrundad: wageType.semestergrundad ?? true,
				agiKod: wageType.agiKod || "001",
				beskrivning: wageType.beskrivning || "",
				status: wageType.status,
			});
		}
		setErrors({});
		setIsEditing(false);
	}, [wageType]);

	const validateForm = useCallback((): boolean => {
		if (!editData) return false;
		const newErrors: WageTypeFormErrors = {};

		if (!editData.loneartId.trim()) {
			newErrors.loneartId = t(localizationConstants.validationWageTypeCodeRequired);
		} else if (wageTypesRepository.existsCode(editData.loneartId.trim(), wageType?.id)) {
			newErrors.loneartId = t(localizationConstants.wageTypeDuplicateCodeError);
		}

		if (!editData.benamning.trim()) {
			newErrors.benamning = t(localizationConstants.validationWageTypeNameRequired);
		}

		if (!editData.enhet) {
			newErrors.enhet = t(localizationConstants.validationWageTypeUnitRequired);
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [editData, t, wageType?.id]);

	const saveEdit = useCallback(async () => {
		if (!editData || !wageType) return;
		if (!validateForm()) return;

		setIsSubmitting(true);
		try {
			const updated = await updateWageTypeAPIAction(wageType.id, {
				loneartId: editData.loneartId.trim(),
				benamning: editData.benamning.trim(),
				personalTyp: editData.personalTyp,
				loneform: editData.loneform,
				transaktionstyp: editData.transaktionstyp,
				enhet: editData.enhet,
				preliminarskatt: editData.preliminarskatt,
				arbetsgivaravgift: editData.arbetsgivaravgift,
				konto: editData.kontoDebet,
				kontoKredit: editData.kontoKredit,
				motKontoAG: editData.motKontoAG,
				agUnderlag: editData.agUnderlag,
				semestergrundad: editData.semestergrundad,
				agiKod: editData.agiKod,
				beskrivning: editData.beskrivning,
				status: editData.status,
			});

			if (updated) {
				setWageType(updated);
				setIsEditing(false);
				showToast("success", t(localizationConstants.wageTypeUpdatedSuccess));
			}
		} catch {
			showToast("error", t(localizationConstants.wageTypeFetchError));
		} finally {
			setIsSubmitting(false);
		}
	}, [editData, t, validateForm, wageType]);

	const handleDelete = useCallback(async () => {
		if (!wageType) return;
		const success = await deleteWageTypeAPIAction(wageType.id);
		if (success) {
			showToast("success", t(localizationConstants.wageTypeDeletedSuccess));
			router.push(WAGE_TYPES_BASE_ROUTE);
		}
	}, [router, t, wageType]);

	return {
		wageType,
		isLoading,
		isEditing,
		isSubmitting,
		editData,
		errors,
		updateEditField,
		startEdit,
		cancelEdit,
		saveEdit,
		handleDelete,
		refresh: fetchDetail,
	};
}
