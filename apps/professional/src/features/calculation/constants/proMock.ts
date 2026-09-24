import type {
	CalculationProData,
	CalculationProDefaultSettings,
	IndustryCategoryItem,
	IndustrySettingRow,
} from "../types/pro";

export const DEFAULT_CATEGORY_ITEMS: IndustryCategoryItem[] = [
	{ id: "cat-1", label: "Cleaning industry", active: true },
	{ id: "cat-2", label: "Cleaning industry", active: true },
];

export const DEFAULT_PRO_SETTINGS: CalculationProDefaultSettings = {
	markupByCalc: false,
	baseCosts: true,
	aPriceList: true,
};

export const DEFAULT_INDUSTRY_TYPES: string[] = [
	"Cleaning industry",
	"Construction",
	"Manufacturing",
];

export const DEFAULT_INDUSTRY_ROWS: IndustrySettingRow[] = [
	{ id: "irow-1", label: "Vacant", checked: true },
	{ id: "irow-2", label: "Vacant", checked: true },
	{ id: "irow-3", label: "Vacant", checked: false },
];

export const DEFAULT_PRO_DATA: CalculationProData = {
	id: "pro-calc-1",
	categories: DEFAULT_CATEGORY_ITEMS,
	defaultSettings: DEFAULT_PRO_SETTINGS,
	selectedType: "Cleaning industry",
	industryTypes: DEFAULT_INDUSTRY_TYPES,
	industryRows: DEFAULT_INDUSTRY_ROWS,
};
