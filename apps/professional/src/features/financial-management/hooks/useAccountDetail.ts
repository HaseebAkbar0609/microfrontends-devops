"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { AccountPlanItem, CreateAccountFormData } from "../types/accountPlan.types";
import { accountPlanRepository } from "../utils/accountPlanRepository";
import { ACCOUNT_PLAN_BASE_ROUTE } from "../constants/accountPlan.constants";

export function useAccountDetail(id: string) {
	const t = useTranslate();
	const router = useRouter();

	const [account, setAccount] = useState<AccountPlanItem | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Section editing states
	const [isEditingGrundInfo, setIsEditingGrundInfo] = useState(false);
	const [isEditingAdditionalInfo, setIsEditingAdditionalInfo] = useState(false);

	// Form edit state
	const [editFormData, setEditFormData] = useState<CreateAccountFormData>({
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
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSaving, setIsSaving] = useState(false);

	const loadAccount = useCallback(() => {
		setIsLoading(true);
		try {
			const found = accountPlanRepository.getById(id);
			if (found) {
				setAccount(found);
				setEditFormData({
					kontoNr: found.kontoNr,
					benamning: found.benamning,
					ingaendeBalans: found.ingaendeBalans || "",
					aktivt: found.aktivt || (found.status === "active" ? "Aktiv" : "Inaktiv"),
					sru: found.sru || "",
					momskod: found.momskod || "-",
					kostnadsstalleMode: found.kostnadsstalleMode || "obligatoriskt",
					projektMode: found.projektMode || "obligatoriskt",
					foreslaKostnadsstalle: found.foreslaKostnadsstalle || "Kontor 10",
					foreslaProjekt: found.foreslaProjekt || "",
				});
			} else {
				showToast("error", t(localizationConstants.genericError));
			}
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsLoading(false);
		}
	}, [id, t]);

	useEffect(() => {
		loadAccount();
		const unsubscribe = accountPlanRepository.subscribe(loadAccount);
		return () => {
			unsubscribe();
		};
	}, [loadAccount]);

	const updateEditField = useCallback(
		<K extends keyof CreateAccountFormData>(
			field: K,
			value: CreateAccountFormData[K],
		) => {
			setEditFormData((prev) => ({ ...prev, [field]: value }));
			setErrors((prev) => {
				if (!prev[field]) return prev;
				const next = { ...prev };
				delete next[field];
				return next;
			});
		},
		[],
	);

	const saveGrundInfo = useCallback(async () => {
		if (!account) return;
		if (!editFormData.kontoNr.trim()) {
			showToast("error", t(localizationConstants.validationAccountNumberRequired));
			return;
		}
		if (!editFormData.benamning.trim()) {
			showToast("error", t(localizationConstants.validationAccountNameRequired));
			return;
		}

		setIsSaving(true);
		try {
			accountPlanRepository.update(account.id, {
				kontoNr: editFormData.kontoNr,
				benamning: editFormData.benamning,
				ingaendeBalans: editFormData.ingaendeBalans,
				aktivt: editFormData.aktivt,
				status: editFormData.aktivt === "Inaktiv" ? "inactive" : "active",
			});
			setIsEditingGrundInfo(false);
			showToast("success", t(localizationConstants.accountUpdatedSuccess));
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsSaving(false);
		}
	}, [account, editFormData, t]);

	const saveAdditionalInfo = useCallback(async () => {
		if (!account) return;

		setIsSaving(true);
		try {
			accountPlanRepository.update(account.id, {
				sru: editFormData.sru,
				momskod: editFormData.momskod,
				kostnadsstalleMode: editFormData.kostnadsstalleMode,
				projektMode: editFormData.projektMode,
				foreslaKostnadsstalle: editFormData.foreslaKostnadsstalle,
				foreslaProjekt: editFormData.foreslaProjekt,
			});
			setIsEditingAdditionalInfo(false);
			showToast("success", t(localizationConstants.accountUpdatedSuccess));
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsSaving(false);
		}
	}, [account, editFormData, t]);

	const handleBack = useCallback(() => {
		router.push(ACCOUNT_PLAN_BASE_ROUTE);
	}, [router]);

	return {
		account,
		isLoading,
		isEditingGrundInfo,
		setIsEditingGrundInfo,
		isEditingAdditionalInfo,
		setIsEditingAdditionalInfo,
		editFormData,
		errors,
		isSaving,
		updateEditField,
		saveGrundInfo,
		saveAdditionalInfo,
		handleBack,
	};
}
