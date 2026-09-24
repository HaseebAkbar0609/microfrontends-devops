"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import type {
	CalculationTemplateOption,
	SupplierPriceListItem,
	TemplateCostSection,
	TemplateSectionRow,
} from "../types/templateCalculation";
import {
	getCalculationTemplatesAPIAction,
	getTemplateDetailsAPIAction,
	saveTemplateCalculationAPIAction,
} from "../api/calculationTemplateApi";
import { DEFAULT_TEMPLATE_SECTIONS } from "../constants/templateCalculationMock";

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

export function useTemplateCalculation(calcNo: string = "Kalkyl 3001") {
	const t = useTranslate();
	const idCounter = useRef(Date.now());

	// Navigation & flow states
	const [flowState, setFlowState] = useState<"choose" | "workspace">("choose");
	const [selectedMode, setSelectedMode] = useState<"mall" | "ny" | null>(null);
	const [activeTab, setActiveTab] = useState<"kalkyl" | "sammanfattning">("kalkyl");

	// Templates & Sections
	const [templates, setTemplates] = useState<CalculationTemplateOption[]>([]);
	const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
	const [sections, setSections] = useState<TemplateCostSection[]>(DEFAULT_TEMPLATE_SECTIONS);
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

	// Start template workspace
	const handleStartWorkspace = useCallback(() => {
		if (selectedMode === "mall") {
			void handleSelectTemplate(selectedTemplateId || "mall-standard-bygg");
		} else if (selectedMode === "ny") {
			// Initialize with single default section
			setSections([
				{
					id: "sec-konsulter",
					categoryType: "konsulter",
					title: "Konsulter",
					isOpen: true,
					rows: [
						{
							id: `row-${++idCounter.current}`,
							artikel: "0",
							benamning: "0",
							antal: "0",
							enhet: "0",
							aPris: "0",
							paslagPct: "0",
						},
					],
				},
			]);
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
				const isMaterial = sec.categoryType === "material";
				const newRow: TemplateSectionRow = {
					id: `row-${++idCounter.current}`,
					artikel: "",
					benamning: "",
					antal: "0",
					enhet: isMaterial ? "kr" : "tim",
					aPris: "0",
					paslagPct: "10",
					...(isMaterial ? { levArtikel: "", leverantor: "" } : {}),
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
		const newId = `sec-custom-${++idCounter.current}`;
		const newSection: TemplateCostSection = {
			id: newId,
			categoryType: "custom",
			title: `Sektion ${sections.length + 1}`,
			isOpen: true,
			rows: [
				{
					id: `row-${++idCounter.current}`,
					artikel: "",
					benamning: "",
					antal: "0",
					enhet: "tim",
					aPris: "0",
					paslagPct: "10",
				},
			],
		};
		setSections((prev) => [...prev, newSection]);
	}, [sections.length]);

	const handleConfirmDeleteSection = useCallback(() => {
		if (!deleteSectionTarget) return;
		setSections((prev) => prev.filter((sec) => sec.id !== deleteSectionTarget));
		setDeleteSectionTarget(null);
		showToast("info", t(localizationConstants.deleteConfirmationTitle));
	}, [deleteSectionTarget, t]);

	const handleUpdateSectionTitle = useCallback((sectionId: string, title: string) => {
		setSections((prev) =>
			prev.map((sec) => (sec.id === sectionId ? { ...sec, title } : sec)),
		);
	}, []);

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

	// Total calculations
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

	// Save calculation
	const handleSave = useCallback(async () => {
		setIsSaving(true);
		try {
			const res = await saveTemplateCalculationAPIAction({
				calcNo,
				templateId: selectedTemplateId,
				sections,
				totalSum: totalCalculationSum,
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
	}, [calcNo, selectedTemplateId, sections, totalCalculationSum, t]);

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
		isLoading,
		isSaving,
		isPriceListOpen,
		setIsPriceListOpen,
		deleteSectionTarget,
		setDeleteSectionTarget,
		sectionTotals,
		totalCalculationSum,
		handleStartWorkspace,
		handleSelectTemplate,
		handleToggleSection,
		handleAddRow,
		handleUpdateRow,
		handleDeleteRow,
		handleAddSection,
		handleConfirmDeleteSection,
		handleUpdateSectionTitle,
		handleImportPriceListItem,
		handleSave,
	};
}
