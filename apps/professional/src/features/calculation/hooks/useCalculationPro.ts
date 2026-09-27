"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import type {
	CalculationProData,
	CalculationProDefaultSettings,
	IndustryCategoryItem,
	IndustrySettingRow,
} from "../types/pro";
import {
	DEFAULT_CATEGORY_ITEMS,
	DEFAULT_PRO_SETTINGS,
	DEFAULT_INDUSTRY_TYPES,
	DEFAULT_INDUSTRY_ROWS,
} from "../constants/proMock";
import {
	getCalculationProAPIAction,
	saveCalculationProSettingsAPIAction,
	purchaseIndustryLicenseAPIAction,
	deleteIndustrySettingRowAPIAction,
} from "../api/calculationPro";

export interface UseCalculationProOptions {
	initialData?: Partial<CalculationProData>;
}

export function useCalculationPro(options: UseCalculationProOptions = {}) {
	const { initialData } = options;
	const t = useTranslate();
	const idCounterRef = useRef(100);

	// State
	const [categories, setCategories] = useState<IndustryCategoryItem[]>(
		initialData?.categories ?? DEFAULT_CATEGORY_ITEMS,
	);
	const [savedCategories, setSavedCategories] = useState<IndustryCategoryItem[]>(
		initialData?.categories ?? DEFAULT_CATEGORY_ITEMS,
	);

	const [defaultSettings, setDefaultSettings] = useState<CalculationProDefaultSettings>(
		initialData?.defaultSettings ?? DEFAULT_PRO_SETTINGS,
	);
	const [savedDefaultSettings, setSavedDefaultSettings] = useState<CalculationProDefaultSettings>(
		initialData?.defaultSettings ?? DEFAULT_PRO_SETTINGS,
	);

	const [selectedType, setSelectedType] = useState<string>(
		initialData?.selectedType ?? "Cleaning industry",
	);
	const [savedSelectedType, setSavedSelectedType] = useState<string>(
		initialData?.selectedType ?? "Cleaning industry",
	);

	const [industryTypes, setIndustryTypes] = useState<string[]>(
		initialData?.industryTypes ?? DEFAULT_INDUSTRY_TYPES,
	);

	const [industryRows, setIndustryRows] = useState<IndustrySettingRow[]>(
		initialData?.industryRows ?? DEFAULT_INDUSTRY_ROWS,
	);
	const [savedIndustryRows, setSavedIndustryRows] = useState<IndustrySettingRow[]>(
		initialData?.industryRows ?? DEFAULT_INDUSTRY_ROWS,
	);

	const [isLoading, setIsLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isPurchasing, setIsPurchasing] = useState(false);

	// Fetch data
	const fetchData = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await getCalculationProAPIAction();
			if (data) {
				if (data.categories?.length) {
					setCategories(data.categories);
					setSavedCategories(data.categories);
				}
				if (data.defaultSettings) {
					setDefaultSettings(data.defaultSettings);
					setSavedDefaultSettings(data.defaultSettings);
				}
				if (data.selectedType) {
					setSelectedType(data.selectedType);
					setSavedSelectedType(data.selectedType);
				}
				if (data.industryTypes?.length) {
					setIndustryTypes(data.industryTypes);
				}
				if (data.industryRows?.length) {
					setIndustryRows(data.industryRows);
					setSavedIndustryRows(data.industryRows);
				}
			}
		} catch {
			// Fallback to default
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void fetchData();
	}, [fetchData]);

	// Handlers
	const handleToggleSetting = useCallback((field: keyof CalculationProDefaultSettings) => {
		setDefaultSettings((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	}, []);

	const handleSelectType = useCallback((type: string) => {
		setSelectedType(type);
	}, []);

	const handleToggleRow = useCallback((id: string) => {
		setIndustryRows((prev) =>
			prev.map((row) => (row.id === id ? { ...row, checked: !row.checked } : row)),
		);
	}, []);

	const handleAddRow = useCallback(() => {
		const newRow: IndustrySettingRow = {
			id: `irow-${Date.now()}-${++idCounterRef.current}`,
			label: t(localizationConstants.calcProVacant),
			checked: false,
		};
		setIndustryRows((prev) => [...prev, newRow]);
	}, [t]);

	const handleDeleteRow = useCallback(
		async (id: string) => {
			setIndustryRows((prev) => prev.filter((row) => row.id !== id));
			showToast("info", t(localizationConstants.confirmRemove));
			try {
				await deleteIndustrySettingRowAPIAction(id);
			} catch {
				// Optimistic
			}
		},
		[t],
	);

	const handlePurchaseLicense = useCallback(async () => {
		setIsPurchasing(true);
		try {
			const res = await purchaseIndustryLicenseAPIAction(selectedType);
			if (res.success) {
				const newCat: IndustryCategoryItem = {
					id: res.id ?? `cat-${Date.now()}`,
					label: selectedType,
					active: true,
				};
				setCategories((prev) => [...prev, newCat]);
				setSavedCategories((prev) => [...prev, newCat]);
				showToast("success", t(localizationConstants.save));
			}
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsPurchasing(false);
		}
	}, [selectedType, t]);

	const handleSave = useCallback(async () => {
		setIsSaving(true);
		try {
			const payload: CalculationProData = {
				categories,
				defaultSettings,
				selectedType,
				industryTypes,
				industryRows,
			};
			await saveCalculationProSettingsAPIAction(payload);
			setSavedCategories(categories);
			setSavedDefaultSettings(defaultSettings);
			setSavedSelectedType(selectedType);
			setSavedIndustryRows(industryRows);
			showToast("success", t(localizationConstants.save));
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsSaving(false);
		}
	}, [categories, defaultSettings, selectedType, industryTypes, industryRows, t]);

	const handleCancel = useCallback(() => {
		setCategories(savedCategories);
		setDefaultSettings(savedDefaultSettings);
		setSelectedType(savedSelectedType);
		setIndustryRows(savedIndustryRows);
	}, [savedCategories, savedDefaultSettings, savedSelectedType, savedIndustryRows]);

	return {
		isLoading,
		isSaving,
		isPurchasing,
		categories,
		defaultSettings,
		selectedType,
		industryTypes,
		industryRows,
		handleToggleSetting,
		handleSelectType,
		handleToggleRow,
		handleAddRow,
		handleDeleteRow,
		handlePurchaseLicense,
		handleSave,
		handleCancel,
		refetch: fetchData,
	};
}
