"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	ImportAccountRow,
	ImportAccountSettings,
} from "../types/accountPlan.types";
import { accountPlanRepository } from "../utils/accountPlanRepository";
import { parseAccountPlanFile } from "../utils/accountPlanFileParser";
import { ACCOUNT_PLAN_BASE_ROUTE } from "../constants/accountPlan.constants";

export function useAccountPlanImport() {
	const t = useTranslate();
	const router = useRouter();

	const [step, setStep] = useState<1 | 2>(1);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [settings, setSettings] = useState<ImportAccountSettings>({
		importeraEndastAnvanda: "alla",
		anvandBenamningFran: "sie_fil",
		anvandSruFran: "sie_fil",
	});

	const [mappingRows, setMappingRows] = useState<ImportAccountRow[]>([]);

	useEffect(() => {
		const rows = accountPlanRepository.getImportRows();
		setMappingRows(rows);
	}, []);

	const handleFileSelect = useCallback(
		async (file: File) => {
			setSelectedFile(file);
			try {
				const existingAccounts = accountPlanRepository.getAll();
				const existingSet = new Set(existingAccounts.map((a) => a.kontoNr));
				const rows = await parseAccountPlanFile(file, existingSet);
				setMappingRows(rows);
			} catch (e) {
				console.error("File parse error:", e);
			}
			setStep(2);
			showToast(
				"success",
				`${file.name} ${t(localizationConstants.fileUploadedSuccess || localizationConstants.saveSuccessMessage)}`,
			);
		},
		[t],
	);

	const updateSettings = useCallback(
		<K extends keyof ImportAccountSettings>(
			key: K,
			value: ImportAccountSettings[K],
		) => {
			setSettings((prev) => ({ ...prev, [key]: value }));
		},
		[],
	);

	const updateMappingRow = useCallback(
		(id: string, updates: Partial<ImportAccountRow>) => {
			setMappingRows((prev) =>
				prev.map((row) => (row.id === id ? { ...row, ...updates } : row)),
			);
		},
		[],
	);

	const handleExecuteImport = useCallback(async () => {
		setIsSubmitting(true);
		try {
			const importedCount = accountPlanRepository.executeImport(
				settings,
				mappingRows,
			);
			showToast(
				"success",
				`${importedCount} ${t(localizationConstants.importSuccessMessage)}`,
			);
			router.push(ACCOUNT_PLAN_BASE_ROUTE);
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsSubmitting(false);
		}
	}, [settings, mappingRows, router, t]);

	const handleCancel = useCallback(() => {
		router.push(ACCOUNT_PLAN_BASE_ROUTE);
	}, [router]);

	const handleBackToStep1 = useCallback(() => {
		setStep(1);
		setSelectedFile(null);
	}, []);

	return {
		step,
		selectedFile,
		settings,
		mappingRows,
		isSubmitting,
		handleFileSelect,
		updateSettings,
		updateMappingRow,
		handleExecuteImport,
		handleCancel,
		handleBackToStep1,
	};
}
