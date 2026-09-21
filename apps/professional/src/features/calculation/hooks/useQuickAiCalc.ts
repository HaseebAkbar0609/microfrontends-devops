"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import type {
	QuickAiCalcData,
	QuickAiComponentItem,
	QuickAiDefaultSettings,
	QuickAiDocumentRow,
	QuickAiDocumentSection,
	QuickAiLicenseItem,
} from "../types/quickAi";
import {
	DEFAULT_QUICK_AI_LICENSES,
	DEFAULT_QUICK_AI_SETTINGS,
	DEFAULT_QUICK_AI_COMPONENTS,
	DEFAULT_QUICK_AI_SECTIONS,
} from "../constants/quickAiMock";
import {
	getQuickAiCalcAPIAction,
	saveQuickAiCalcAPIAction,
	purchaseQuickAiLicenseAPIAction,
	addQuickAiComponentAPIAction,
	createQuickAiSectionAPIAction,
	deleteQuickAiSectionAPIAction,
	createQuickAiRowAPIAction,
	deleteQuickAiRowAPIAction,
} from "../api/quickAiCalc";

export interface UseQuickAiCalcOptions {
	initialData?: Partial<QuickAiCalcData>;
}

export function useQuickAiCalc(options: UseQuickAiCalcOptions = {}) {
	const { initialData } = options;
	const t = useTranslate();
	const idCounterRef = useRef(100);

	// State
	const [licenses, setLicenses] = useState<QuickAiLicenseItem[]>(
		initialData?.licenses ?? DEFAULT_QUICK_AI_LICENSES,
	);
	const [savedLicenses, setSavedLicenses] = useState<QuickAiLicenseItem[]>(
		initialData?.licenses ?? DEFAULT_QUICK_AI_LICENSES,
	);

	const [defaultSettings, setDefaultSettings] = useState<QuickAiDefaultSettings>(
		initialData?.defaultSettings ?? DEFAULT_QUICK_AI_SETTINGS,
	);
	const [savedDefaultSettings, setSavedDefaultSettings] = useState<QuickAiDefaultSettings>(
		initialData?.defaultSettings ?? DEFAULT_QUICK_AI_SETTINGS,
	);

	const [components, setComponents] = useState<QuickAiComponentItem[]>(
		initialData?.components ?? DEFAULT_QUICK_AI_COMPONENTS,
	);
	const [savedComponents, setSavedComponents] = useState<QuickAiComponentItem[]>(
		initialData?.components ?? DEFAULT_QUICK_AI_COMPONENTS,
	);

	const [sections, setSections] = useState<QuickAiDocumentSection[]>(
		initialData?.sections ?? DEFAULT_QUICK_AI_SECTIONS,
	);
	const [savedSections, setSavedSections] = useState<QuickAiDocumentSection[]>(
		initialData?.sections ?? DEFAULT_QUICK_AI_SECTIONS,
	);

	const [isLoading, setIsLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isPurchasing, setIsPurchasing] = useState(false);

	// Fetch Data
	const fetchData = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await getQuickAiCalcAPIAction();
			if (data) {
				if (data.licenses?.length) {
					setLicenses(data.licenses);
					setSavedLicenses(data.licenses);
				}
				if (data.defaultSettings) {
					setDefaultSettings(data.defaultSettings);
					setSavedDefaultSettings(data.defaultSettings);
				}
				if (data.components?.length) {
					setComponents(data.components);
					setSavedComponents(data.components);
				}
				if (data.sections?.length) {
					setSections(data.sections);
					setSavedSections(data.sections);
				}
			}
		} catch {
			// Fallback initialized
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void fetchData();
	}, [fetchData]);

	// Handlers
	const handleToggleSetting = useCallback((field: keyof QuickAiDefaultSettings) => {
		setDefaultSettings((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	}, []);

	const handlePurchaseLicense = useCallback(
		async (name = "QuickAICalc - Ny (1)") => {
			setIsPurchasing(true);
			try {
				const res = await purchaseQuickAiLicenseAPIAction(name);
				if (res.success) {
					const newLic: QuickAiLicenseItem = {
						id: res.id ?? `lic-${Date.now()}`,
						label: name,
						active: true,
					};
					setLicenses((prev) => [...prev, newLic]);
					setSavedLicenses((prev) => [...prev, newLic]);
					showToast("success", t(localizationConstants.save));
				}
			} catch {
				showToast("error", t(localizationConstants.genericError));
			} finally {
				setIsPurchasing(false);
			}
		},
		[t],
	);

	const handleAddComponent = useCallback(
		async (label: string, icon = "wall") => {
			if (!label.trim()) return;
			try {
				const res = await addQuickAiComponentAPIAction({ label, icon });
				const newComp: QuickAiComponentItem = res.item ?? {
					id: `comp-${Date.now()}-${++idCounterRef.current}`,
					label,
					icon,
				};
				setComponents((prev) => [...prev, newComp]);
				showToast("success", t(localizationConstants.save));
			} catch {
				showToast("error", t(localizationConstants.genericError));
			}
		},
		[t],
	);

	const handleToggleSectionSelectAll = useCallback((sectionId: string) => {
		setSections((prev) =>
			prev.map((sec) => {
				if (sec.id !== sectionId) return sec;
				const nextSelectAll = !sec.selectAll;
				return {
					...sec,
					selectAll: nextSelectAll,
					rows: sec.rows.map((row) => ({ ...row, checked: nextSelectAll })),
				};
			}),
		);
	}, []);

	const handleToggleRow = useCallback((sectionId: string, rowId: string) => {
		setSections((prev) =>
			prev.map((sec) => {
				if (sec.id !== sectionId) return sec;
				const updatedRows = sec.rows.map((row) =>
					row.id === rowId ? { ...row, checked: !row.checked } : row,
				);
				const allChecked = updatedRows.length > 0 && updatedRows.every((r) => r.checked);
				return {
					...sec,
					selectAll: allChecked,
					rows: updatedRows,
				};
			}),
		);
	}, []);

	const handleAddRow = useCallback(
		async (sectionId: string, customLabel?: string) => {
			const label = customLabel || t(localizationConstants.calcProVacant);
			const tempId = `row-${Date.now()}-${++idCounterRef.current}`;
			const initialRow: QuickAiDocumentRow = {
				id: tempId,
				label,
				checked: true,
			};

			// Optimistic add
			setSections((prev) =>
				prev.map((sec) => {
					if (sec.id !== sectionId) return sec;
					return {
						...sec,
						rows: [...sec.rows, initialRow],
					};
				}),
			);

			try {
				const res = await createQuickAiRowAPIAction(sectionId, {
					label,
					checked: true,
				});
				if (res.row?.id && res.row.id !== tempId) {
					setSections((prev) =>
						prev.map((sec) => {
							if (sec.id !== sectionId) return sec;
							return {
								...sec,
								rows: sec.rows.map((r) => (r.id === tempId ? res.row : r)),
							};
						}),
					);
				}
			} catch {
				// Retain optimistic row
			}
		},
		[t],
	);

	const handleDeleteRow = useCallback(
		async (sectionId: string, rowId: string) => {
			setSections((prev) =>
				prev.map((sec) => {
					if (sec.id !== sectionId) return sec;
					return {
						...sec,
						rows: sec.rows.filter((r) => r.id !== rowId),
					};
				}),
			);
			showToast("info", t(localizationConstants.confirmRemove));
			try {
				await deleteQuickAiRowAPIAction(rowId);
			} catch {
				// Optimistic
			}
		},
		[t],
	);

	const handleAddSection = useCallback(
		async (title?: string) => {
			const sectionTitle = title || t(localizationConstants.calcQuickAiDocuments);
			const tempId = `sec-${Date.now()}-${++idCounterRef.current}`;
			const initialSection: QuickAiDocumentSection = {
				id: tempId,
				title: sectionTitle,
				selectAll: true,
				rows: [
					{
						id: `row-${Date.now()}-1`,
						label: t(localizationConstants.calcProVacant),
						checked: true,
					},
				],
			};

			// Optimistic add
			setSections((prev) => [...prev, initialSection]);
			showToast("success", t(localizationConstants.save));

			try {
				const res = await createQuickAiSectionAPIAction(sectionTitle);
				if (res.section?.id && res.section.id !== tempId) {
					setSections((prev) =>
						prev.map((sec) => (sec.id === tempId ? res.section : sec)),
					);
				}
			} catch {
				// Retain optimistic section
			}
		},
		[t],
	);

	const handleDeleteSection = useCallback(
		async (sectionId: string) => {
			setSections((prev) => prev.filter((sec) => sec.id !== sectionId));
			showToast("info", t(localizationConstants.calcDeleteSection));
			try {
				await deleteQuickAiSectionAPIAction(sectionId);
			} catch {
				// Optimistic
			}
		},
		[t],
	);

	const handleSave = useCallback(async () => {
		setIsSaving(true);
		try {
			const payload: QuickAiCalcData = {
				licenses,
				defaultSettings,
				components,
				sections,
			};
			const res = await saveQuickAiCalcAPIAction(payload);
			if (res.data) {
				setLicenses(res.data.licenses);
				setSavedLicenses(res.data.licenses);
				setDefaultSettings(res.data.defaultSettings);
				setSavedDefaultSettings(res.data.defaultSettings);
				setComponents(res.data.components);
				setSavedComponents(res.data.components);
				setSections(res.data.sections);
				setSavedSections(res.data.sections);
			} else {
				setSavedLicenses(licenses);
				setSavedDefaultSettings(defaultSettings);
				setSavedComponents(components);
				setSavedSections(sections);
			}
			showToast("success", t(localizationConstants.save));
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsSaving(false);
		}
	}, [licenses, defaultSettings, components, sections, t]);

	const handleCancel = useCallback(() => {
		setLicenses(savedLicenses);
		setDefaultSettings(savedDefaultSettings);
		setComponents(savedComponents);
		setSections(savedSections);
	}, [savedLicenses, savedDefaultSettings, savedComponents, savedSections]);

	return {
		isLoading,
		isSaving,
		isPurchasing,
		licenses,
		defaultSettings,
		components,
		sections,
		handleToggleSetting,
		handlePurchaseLicense,
		handleAddComponent,
		handleToggleSectionSelectAll,
		handleToggleRow,
		handleAddRow,
		handleDeleteRow,
		handleAddSection,
		handleDeleteSection,
		handleSave,
		handleCancel,
		refetch: fetchData,
	};
}
