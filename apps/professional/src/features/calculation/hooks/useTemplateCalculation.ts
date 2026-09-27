"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import type {
	CalculationTemplateOption,
	OverheadRow,
	SectionSummaryAdjustment,
	SupplierPriceListItem,
	TemplateCostSection,
	TemplateSectionRow,
} from "../types/templateCalculation";
import {
	getCalculationTemplatesAPIAction,
	getTemplateDetailsAPIAction,
	saveTemplateCalculationAPIAction,
} from "../api/calculationTemplateApi";
import {
	DEFAULT_BLANK_SECTIONS,
	DEFAULT_OVERHEAD_ROWS,
	DEFAULT_TEMPLATE_SECTIONS,
} from "../constants/templateCalculationMock";

export function parseCalculationNumber(value: string | number | undefined): number {
	if (typeof value === "number") return isNaN(value) ? 0 : value;
	if (!value) return 0;
	const cleaned = String(value).replace(/\s/g, "").replace(",", ".");
	const num = parseFloat(cleaned);
	return isNaN(num) ? 0 : num;
}

export function computeRowDelsumma(row: TemplateSectionRow): number {
	const antal = parseCalculationNumber(row.antal);
	const aPris = parseCalculationNumber(row.aPris);
	const paslagPct = parseCalculationNumber(row.paslagPct);
	return antal * aPris * (1 + paslagPct / 100);
}

export interface SectionSummaryComputedRow {
	id: string;
	categoryType?: string;
	title: string;
	calculation: number;
	markupPct: string;
	markupKr: number;
	subtotal: number;
	adjustment: string;
}

export interface OverheadComputedRow extends OverheadRow {
	summering: number;
	paslagKr: number;
	delsumma: number;
}

export function useTemplateCalculation(calcNo: string = "Kalkyl 3001") {
	const t = useTranslate();

	// Navigation & flow states
	const [flowState, setFlowState] = useState<"choose" | "workspace">("choose");
	const [selectedMode, setSelectedMode] = useState<"mall" | "ny" | null>(null);
	const [activeTab, setActiveTab] = useState<"kalkyl" | "sammanfattning">("kalkyl");

	// Templates & Sections
	const [templates, setTemplates] = useState<CalculationTemplateOption[]>([]);
	const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
	const [sections, setSections] = useState<TemplateCostSection[]>(DEFAULT_TEMPLATE_SECTIONS);
	const [overheadRows, setOverheadRows] = useState<OverheadRow[]>(DEFAULT_OVERHEAD_ROWS);
	const [sectionAdjustments, setSectionAdjustments] = useState<
		Record<string, SectionSummaryAdjustment>
	>({});
	const [vinstPct, setVinstPct] = useState<string>("10");
	const [saveAsTemplate, setSaveAsTemplate] = useState<boolean>(false);

	const [isLoading, setIsLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	// Dialog & Action states
	const [isPriceListOpen, setIsPriceListOpen] = useState(false);
	const [deleteSectionTarget, setDeleteSectionTarget] = useState<string | null>(null);

	// Fetch available templates on mount
	useEffect(() => {
		async function fetchTemplates() {
			setIsLoading(true);
			try {
				const res = await getCalculationTemplatesAPIAction();
				setTemplates(res);
			} finally {
				setIsLoading(false);
			}
		}
		void fetchTemplates();
	}, []);

	// Handle template switch
	const handleSelectTemplate = useCallback(
		async (templateId: string) => {
			setSelectedTemplateId(templateId);
			setIsLoading(true);
			try {
				const loadedSections = await getTemplateDetailsAPIAction(templateId);
				setSections(JSON.parse(JSON.stringify(loadedSections)));
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	// Start workspace flow based on mode
	const handleStartWorkspace = useCallback(() => {
		if (selectedMode === "mall") {
			void handleSelectTemplate(selectedTemplateId || "mall-standard-bygg");
			setOverheadRows(DEFAULT_OVERHEAD_ROWS);
		} else if (selectedMode === "ny") {
			// Initialize with single clean default section
			setSections(JSON.parse(JSON.stringify(DEFAULT_BLANK_SECTIONS)));
			setOverheadRows(JSON.parse(JSON.stringify(DEFAULT_OVERHEAD_ROWS)));
			setSelectedTemplateId("");
		}
		setFlowState("workspace");
		setActiveTab("kalkyl");
	}, [selectedMode, selectedTemplateId, handleSelectTemplate]);

	// Section Toggling
	const handleToggleSection = useCallback((sectionId: string) => {
		setSections((prev) =>
			prev.map((sec) => (sec.id === sectionId ? { ...sec, isOpen: !sec.isOpen } : sec)),
		);
	}, []);

	// Row Mutations
	const handleAddRow = useCallback((sectionId: string) => {
		setSections((prev) =>
			prev.map((sec) => {
				if (sec.id !== sectionId) return sec;
				const newRow: TemplateSectionRow = {
					id: `row_${Date.now()}_${sec.rows.length}`,
					artikel: "",
					benamning: "",
					antal: "1",
					enhet: "tim",
					aPris: "0",
					paslagPct: "10",
					...(sec.categoryType === "material" ? { levArtikel: "", leverantor: "" } : {}),
				};
				return { ...sec, rows: [...sec.rows, newRow] };
			}),
		);
	}, []);

	const handleUpdateRow = useCallback(
		(sectionId: string, rowId: string, patch: Partial<TemplateSectionRow>) => {
			setSections((prev) =>
				prev.map((sec) => {
					if (sec.id !== sectionId) return sec;
					return {
						...sec,
						rows: sec.rows.map((row) => (row.id === rowId ? { ...row, ...patch } : row)),
					};
				}),
			);
		},
		[],
	);

	const handleDeleteRow = useCallback((sectionId: string, rowId: string) => {
		setSections((prev) =>
			prev.map((sec) => {
				if (sec.id !== sectionId) return sec;
				return {
					...sec,
					rows: sec.rows.filter((row) => row.id !== rowId),
				};
			}),
		);
	}, []);

	// Section Mutations
	const handleAddSection = useCallback(() => {
		const newSection: TemplateCostSection = {
			id: `sec_${Date.now()}`,
			categoryType: "custom",
			title: "Ny sektion",
			isOpen: true,
			rows: [
				{
					id: `row_${Date.now()}_0`,
					artikel: "",
					benamning: "",
					antal: "1",
					enhet: "tim",
					aPris: "0",
					paslagPct: "10",
				},
			],
		};
		setSections((prev) => [...prev, newSection]);
	}, []);

	const handleConfirmDeleteSection = useCallback(() => {
		if (!deleteSectionTarget) return;
		setSections((prev) => prev.filter((sec) => sec.id !== deleteSectionTarget));
		setDeleteSectionTarget(null);
		showToast("info", t(localizationConstants.deleteConfirmationTitle));
	}, [deleteSectionTarget, t]);

	// Overhead Row Mutations
	const handleAddOverheadRow = useCallback(() => {
		const newRow: OverheadRow = {
			id: `oh_${Date.now()}`,
			artikel: "",
			benamning: "",
			antal: "1",
			enhet: "st",
			aPris: "0",
			paslagPct: "10",
			justering: "0",
		};
		setOverheadRows((prev) => [...prev, newRow]);
	}, []);

	const handleUpdateOverheadRow = useCallback(
		(rowId: string, patch: Partial<OverheadRow>) => {
			setOverheadRows((prev) =>
				prev.map((row) => (row.id === rowId ? { ...row, ...patch } : row)),
			);
		},
		[],
	);

	const handleDeleteOverheadRow = useCallback((rowId: string) => {
		setOverheadRows((prev) => prev.filter((row) => row.id !== rowId));
	}, []);

	// Summary section adjustments
	const handleUpdateSectionAdjustment = useCallback(
		(sectionId: string, patch: Partial<SectionSummaryAdjustment>) => {
			setSectionAdjustments((prev) => {
				const current = prev[sectionId] || {
					sectionId,
					markupPct: "10",
					adjustmentKr: "0",
				};
				return {
					...prev,
					[sectionId]: { ...current, ...patch },
				};
			});
		},
		[],
	);

	// Import from supplier price lists
	const handleImportPriceListItem = useCallback(
		(targetSectionId: string, item: SupplierPriceListItem) => {
			setSections((prev) =>
				prev.map((sec) => {
					if (sec.id !== targetSectionId) return sec;
					const newRow: TemplateSectionRow = {
						id: `row-sp-${Date.now()}-${item.id}`,
						artikel: item.articleNo,
						benamning: item.name,
						antal: "1",
						enhet: item.unit,
						aPris: String(item.price),
						paslagPct: "10",
						...(sec.categoryType === "material"
							? { levArtikel: item.articleNo, leverantor: item.supplier }
							: {}),
					};
					return { ...sec, rows: [...sec.rows, newRow] };
				}),
			);
			showToast("success", `${item.name} ${t(localizationConstants.calcTemplateAddedToast)}`);
		},
		[t],
	);

	// Section base totals
	const sectionTotals = useMemo(() => {
		const map: Record<string, number> = {};
		for (const sec of sections) {
			map[sec.id] = sec.rows.reduce((sum, r) => sum + computeRowDelsumma(r), 0);
		}
		return map;
	}, [sections]);

	const totalCalculationSum = useMemo(() => {
		return Object.values(sectionTotals).reduce((sum, val) => sum + val, 0);
	}, [sectionTotals]);

	// Summary tab computed rows
	const summaryComputedRows = useMemo<SectionSummaryComputedRow[]>(() => {
		return sections.map((sec) => {
			const baseCalc = sectionTotals[sec.id] || 0;
			const adj = sectionAdjustments[sec.id];
			const markupPct = adj?.markupPct ?? "10";
			const markupPctNum = parseCalculationNumber(markupPct);
			const markupKr = baseCalc * (markupPctNum / 100);
			const adjustmentVal = adj?.adjustmentKr ?? "0";
			const adjustmentNum = parseCalculationNumber(adjustmentVal);
			const subtotal = baseCalc + markupKr + adjustmentNum;

			return {
				id: sec.id,
				categoryType: sec.categoryType,
				title: sec.title,
				calculation: baseCalc,
				markupPct,
				markupKr,
				subtotal,
				adjustment: adjustmentVal,
			};
		});
	}, [sections, sectionTotals, sectionAdjustments]);

	const calculationSummaryTotals = useMemo(() => {
		return summaryComputedRows.reduce(
			(acc, row) => ({
				totalCalculation: acc.totalCalculation + row.calculation,
				totalMarkupKr: acc.totalMarkupKr + row.markupKr,
				totalSubtotal: acc.totalSubtotal + row.subtotal,
				totalAdjustment: acc.totalAdjustment + parseCalculationNumber(row.adjustment),
			}),
			{ totalCalculation: 0, totalMarkupKr: 0, totalSubtotal: 0, totalAdjustment: 0 },
		);
	}, [summaryComputedRows]);

	// Overhead computed rows
	const overheadComputedRows = useMemo<OverheadComputedRow[]>(() => {
		return overheadRows.map((row) => {
			const antal = parseCalculationNumber(row.antal);
			const aPris = parseCalculationNumber(row.aPris);
			const paslagPct = parseCalculationNumber(row.paslagPct);
			const justering = parseCalculationNumber(row.justering);

			const summering = antal * aPris;
			const paslagKr = summering * (paslagPct / 100);
			const delsumma = summering + paslagKr + justering;

			return {
				...row,
				summering,
				paslagKr,
				delsumma,
			};
		});
	}, [overheadRows]);

	const overheadTotals = useMemo(() => {
		return overheadComputedRows.reduce(
			(acc, row) => ({
				totalSummering: acc.totalSummering + row.summering,
				totalPaslagKr: acc.totalPaslagKr + row.paslagKr,
				totalDelsumma: acc.totalDelsumma + row.delsumma,
			}),
			{ totalSummering: 0, totalPaslagKr: 0, totalDelsumma: 0 },
		);
	}, [overheadComputedRows]);

	// Combined summary and offer totals
	const totalCombinedDelsumma = useMemo(() => {
		return calculationSummaryTotals.totalSubtotal + overheadTotals.totalDelsumma;
	}, [calculationSummaryTotals.totalSubtotal, overheadTotals.totalDelsumma]);

	const finalOfferSum = useMemo(() => {
		const vinstNum = parseCalculationNumber(vinstPct);
		return totalCombinedDelsumma * (1 + vinstNum / 100);
	}, [totalCombinedDelsumma, vinstPct]);

	// Save calculation action
	const handleSave = useCallback(async () => {
		setIsSaving(true);
		try {
			const res = await saveTemplateCalculationAPIAction({
				calcNo,
				mode: selectedMode,
				templateId: selectedTemplateId,
				sections,
				overheadRows,
				vinstPct: parseCalculationNumber(vinstPct),
				totalSum: totalCombinedDelsumma,
				finalOfferSum,
				saveAsTemplate,
			});
			if (res.success) {
				showToast("success", t(localizationConstants.calcTemplateSavedSuccessfully));
			} else {
				showToast("error", t(localizationConstants.calcDetailSaveError));
			}
		} catch {
			showToast("error", t(localizationConstants.calcDetailSaveError));
		} finally {
			setIsSaving(false);
		}
	}, [
		calcNo,
		selectedMode,
		selectedTemplateId,
		sections,
		overheadRows,
		vinstPct,
		totalCombinedDelsumma,
		finalOfferSum,
		saveAsTemplate,
		t,
	]);

	return {
		calcNo,
		flowState,
		setFlowState,
		selectedMode,
		setSelectedMode,
		activeTab,
		setActiveTab,
		templates,
		selectedTemplateId,
		setSelectedTemplateId,
		sections,
		overheadRows,
		vinstPct,
		setVinstPct,
		saveAsTemplate,
		setSaveAsTemplate,
		isLoading,
		isSaving,
		isPriceListOpen,
		setIsPriceListOpen,
		deleteSectionTarget,
		setDeleteSectionTarget,
		sectionTotals,
		totalCalculationSum,
		summaryComputedRows,
		calculationSummaryTotals,
		overheadComputedRows,
		overheadTotals,
		totalCombinedDelsumma,
		finalOfferSum,
		handleStartWorkspace,
		handleSelectTemplate,
		handleToggleSection,
		handleAddRow,
		handleUpdateRow,
		handleDeleteRow,
		handleAddSection,
		handleConfirmDeleteSection,
		handleAddOverheadRow,
		handleUpdateOverheadRow,
		handleDeleteOverheadRow,
		handleUpdateSectionAdjustment,
		handleImportPriceListItem,
		handleSave,
	};
}
