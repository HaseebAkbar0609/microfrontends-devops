"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import type { MarkupRow, LaborRow } from "../types/kalkyl";
import {
	DEFAULT_MARKUP_ROWS,
	DEFAULT_BASE_COST_ROWS,
	DEFAULT_LABOR_ROWS,
} from "../constants/standardMock";
import {
	getStandardCalculationAPIAction,
	saveStandardMarkupAPIAction,
	saveStandardBaseCostsAPIAction,
	saveStandardLaborCostsAPIAction,
	deleteStandardCostSectionAPIAction,
} from "../api/standardCalculation";

export type LaborSortField = keyof Pick<
	LaborRow,
	"item" | "description" | "quantity" | "unit" | "aPrice"
>;

export interface UseStandardCalculationOptions {
	calculationId?: string;
	initialMarkups?: MarkupRow[];
	initialBaseCosts?: MarkupRow[];
	initialLaborCosts?: LaborRow[];
}

export function useStandardCalculation(options: UseStandardCalculationOptions = {}) {
	const {
		calculationId = "default",
		initialMarkups = DEFAULT_MARKUP_ROWS,
		initialBaseCosts = DEFAULT_BASE_COST_ROWS,
		initialLaborCosts = DEFAULT_LABOR_ROWS,
	} = options;

	const t = useTranslate();
	const idCounterRef = useRef(100);

	// Markup state
	const [markupRows, setMarkupRows] = useState<MarkupRow[]>(initialMarkups);
	const [savedMarkupRows, setSavedMarkupRows] = useState<MarkupRow[]>(initialMarkups);

	// Base Costs state
	const [baseCostRows, setBaseCostRows] = useState<MarkupRow[]>(initialBaseCosts);
	const [savedBaseCostRows, setSavedBaseCostRows] = useState<MarkupRow[]>(initialBaseCosts);

	// Labor Costs state
	const [laborRows, setLaborRows] = useState<LaborRow[]>(initialLaborCosts);
	const [savedLaborRows, setSavedLaborRows] = useState<LaborRow[]>(initialLaborCosts);
	const [isLaborOpen, setIsLaborOpen] = useState(true);
	const [isLaborDeleted, setIsLaborDeleted] = useState(false);

	// UI feedback state
	const [isLoading, setIsLoading] = useState(false);
	const [isSavingMarkup, setIsSavingMarkup] = useState(false);
	const [isSavingBaseCosts, setIsSavingBaseCosts] = useState(false);
	const [isSavingLabor, setIsSavingLabor] = useState(false);

	// Table Sorting for Labor Rows
	const { sortField, sortDir, toggleSort } = useTableSort<LaborSortField>();

	// Initial data fetch from API
	const fetchData = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await getStandardCalculationAPIAction(calculationId);
			if (data) {
				if (data.markups && data.markups.length > 0) {
					setMarkupRows(data.markups);
					setSavedMarkupRows(data.markups);
				}
				if (data.baseCosts && data.baseCosts.length > 0) {
					setBaseCostRows(data.baseCosts);
					setSavedBaseCostRows(data.baseCosts);
				}
				if (data.laborCosts && data.laborCosts.length > 0) {
					setLaborRows(data.laborCosts);
					setSavedLaborRows(data.laborCosts);
				}
			}
		} catch {
			// Fallback initialized
		} finally {
			setIsLoading(false);
		}
	}, [calculationId]);

	useEffect(() => {
		void fetchData();
	}, [fetchData]);

	// Sorted Labor Rows
	const sortedLaborRows = useMemo(() => {
		return sortItems(
			laborRows,
			sortField,
			sortDir,
			(item, field) => item[field as keyof LaborRow] as string,
		);
	}, [laborRows, sortField, sortDir]);

	// ─── MARKUP ACTIONS ────────────────────────────────────────────────────────
	const handleAddMarkupRow = useCallback(() => {
		const newId = `markup_${Date.now()}_${++idCounterRef.current}`;
		const newRow: MarkupRow = {
			id: newId,
			title: "",
			markupPercentage: "10",
		};
		setMarkupRows((prev) => [...prev, newRow]);
	}, []);

	const handleChangeMarkupTitle = useCallback((id: string, value: string) => {
		setMarkupRows((prev) =>
			prev.map((row) => (row.id === id ? { ...row, title: value } : row)),
		);
	}, []);

	const handleChangeMarkupPercentage = useCallback((id: string, value: string) => {
		setMarkupRows((prev) =>
			prev.map((row) => (row.id === id ? { ...row, markupPercentage: value } : row)),
		);
	}, []);

	const handleDeleteMarkupRow = useCallback((id: string) => {
		setMarkupRows((prev) => prev.filter((row) => row.id !== id));
		showToast("info", t(localizationConstants.confirmRemove));
	}, [t]);

	const handleSaveMarkup = useCallback(async () => {
		setIsSavingMarkup(true);
		try {
			await saveStandardMarkupAPIAction(calculationId, markupRows);
			setSavedMarkupRows(markupRows);
			showToast("success", t(localizationConstants.save));
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsSavingMarkup(false);
		}
	}, [calculationId, markupRows, t]);

	const handleCancelMarkup = useCallback(() => {
		setMarkupRows(savedMarkupRows);
	}, [savedMarkupRows]);

	// ─── BASE COSTS ACTIONS ───────────────────────────────────────────────────
	const handleAddBaseCostRow = useCallback(() => {
		const newId = `base_${Date.now()}_${++idCounterRef.current}`;
		const newRow: MarkupRow = {
			id: newId,
			title: "",
			markupPercentage: "10",
		};
		setBaseCostRows((prev) => [...prev, newRow]);
	}, []);

	const handleChangeBaseCostTitle = useCallback((id: string, value: string) => {
		setBaseCostRows((prev) =>
			prev.map((row) => (row.id === id ? { ...row, title: value } : row)),
		);
	}, []);

	const handleChangeBaseCostPercentage = useCallback((id: string, value: string) => {
		setBaseCostRows((prev) =>
			prev.map((row) => (row.id === id ? { ...row, markupPercentage: value } : row)),
		);
	}, []);

	const handleDeleteBaseCostRow = useCallback((id: string) => {
		setBaseCostRows((prev) => prev.filter((row) => row.id !== id));
		showToast("info", t(localizationConstants.confirmRemove));
	}, [t]);

	const handleSaveBaseCosts = useCallback(async () => {
		setIsSavingBaseCosts(true);
		try {
			await saveStandardBaseCostsAPIAction(calculationId, baseCostRows);
			setSavedBaseCostRows(baseCostRows);
			showToast("success", t(localizationConstants.save));
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsSavingBaseCosts(false);
		}
	}, [calculationId, baseCostRows, t]);

	const handleCancelBaseCosts = useCallback(() => {
		setBaseCostRows(savedBaseCostRows);
	}, [savedBaseCostRows]);

	// ─── LABOR COSTS ACTIONS ──────────────────────────────────────────────────
	const handleAddLaborRow = useCallback(() => {
		const newId = `labor_${Date.now()}_${++idCounterRef.current}`;
		const newRow: LaborRow = {
			id: newId,
			item: "",
			description: "",
			quantity: "1",
			unit: "hour",
			aPrice: "0",
		};
		setLaborRows((prev) => [...prev, newRow]);
	}, []);

	const handleChangeLaborCell = useCallback(
		(id: string, field: keyof LaborRow, value: string) => {
			setLaborRows((prev) =>
				prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
			);
		},
		[],
	);

	const handleDeleteLaborRow = useCallback((id: string) => {
		setLaborRows((prev) => prev.filter((row) => row.id !== id));
		showToast("info", t(localizationConstants.confirmRemove));
	}, [t]);

	const handleSaveLaborCosts = useCallback(async () => {
		setIsSavingLabor(true);
		try {
			await saveStandardLaborCostsAPIAction(calculationId, laborRows);
			setSavedLaborRows(laborRows);
			showToast("success", t(localizationConstants.save));
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsSavingLabor(false);
		}
	}, [calculationId, laborRows, t]);

	const handleCancelLaborCosts = useCallback(() => {
		setLaborRows(savedLaborRows);
	}, [savedLaborRows]);

	const handleDeleteLaborSectionConfirm = useCallback(async () => {
		setIsLaborDeleted(true);
		showToast("info", t(localizationConstants.calcDeleteSection));
		try {
			await deleteStandardCostSectionAPIAction(calculationId, "labor");
		} catch {
			// Optimistic
		}
	}, [calculationId, t]);

	return {
		// General
		isLoading,
		// Markup
		markupRows,
		isSavingMarkup,
		handleAddMarkupRow,
		handleChangeMarkupTitle,
		handleChangeMarkupPercentage,
		handleDeleteMarkupRow,
		handleSaveMarkup,
		handleCancelMarkup,
		// Base Costs
		baseCostRows,
		isSavingBaseCosts,
		handleAddBaseCostRow,
		handleChangeBaseCostTitle,
		handleChangeBaseCostPercentage,
		handleDeleteBaseCostRow,
		handleSaveBaseCosts,
		handleCancelBaseCosts,
		// Labor Costs
		laborRows,
		sortedLaborRows,
		isLaborOpen,
		setIsLaborOpen,
		isLaborDeleted,
		isSavingLabor,
		sortField,
		sortDir,
		toggleSort,
		handleAddLaborRow,
		handleChangeLaborCell,
		handleDeleteLaborRow,
		handleSaveLaborCosts,
		handleCancelLaborCosts,
		handleDeleteLaborSectionConfirm,
		refetch: fetchData,
	};
}
