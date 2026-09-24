import type {
	QuickAiCalcData,
	QuickAiComponentItem,
	QuickAiDefaultSettings,
	QuickAiDocumentSection,
	QuickAiLicenseItem,
} from "../types/quickAi";

export const DEFAULT_QUICK_AI_LICENSES: QuickAiLicenseItem[] = [
	{ id: "lic-1", label: "QuickAICalc - Build (1)", active: true },
	{ id: "lic-2", label: "QuickAICalc - EL (1)", active: true },
];

export const DEFAULT_QUICK_AI_SETTINGS: QuickAiDefaultSettings = {
	markupByCalc: false,
	baseCosts: true,
	aPriceList: true,
};

export const DEFAULT_QUICK_AI_COMPONENTS: QuickAiComponentItem[] = [
	{ id: "comp-1", label: "Door", icon: "door" },
	{ id: "comp-2", label: "Window", icon: "window" },
	{ id: "comp-3", label: "Wall type", icon: "wall" },
];

export const DEFAULT_QUICK_AI_SECTIONS: QuickAiDocumentSection[] = [
	{
		id: "sec-drawings",
		title: "Drawings",
		selectAll: true,
		rows: [
			{ id: "row-d1", label: "Architectural drawings", checked: true },
			{ id: "row-d2", label: "K-drawings", checked: true },
			{ id: "row-d3", label: "HVAC drawings", checked: true },
		],
	},
	{
		id: "sec-documents",
		title: "Documents",
		selectAll: true,
		rows: [
			{ id: "row-doc1", label: "Administrative regulations", checked: true },
			{ id: "row-doc2", label: "Room description", checked: true },
			{ id: "row-doc3", label: "Construction description", checked: true },
		],
	},
];

export const DEFAULT_QUICK_AI_DATA: QuickAiCalcData = {
	id: "quick-ai-1",
	licenses: DEFAULT_QUICK_AI_LICENSES,
	defaultSettings: DEFAULT_QUICK_AI_SETTINGS,
	components: DEFAULT_QUICK_AI_COMPONENTS,
	sections: DEFAULT_QUICK_AI_SECTIONS,
};
