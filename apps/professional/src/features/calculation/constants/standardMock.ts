import type { MarkupRow, LaborRow, StandardCalculationData } from "../types/kalkyl";

export const DEFAULT_MARKUP_ROWS: MarkupRow[] = [
	{
		id: "markup-1",
		title: "Markup subcontractor",
		markupPercentage: "10",
	},
	{
		id: "markup-2",
		title: "Markup subcontractor",
		markupPercentage: "10",
	},
	{
		id: "markup-3",
		title: "Markup subcontractor",
		markupPercentage: "10",
	},
];

export const DEFAULT_BASE_COST_ROWS: MarkupRow[] = [
	{
		id: "base-1",
		title: "Markup subcontractor",
		markupPercentage: "10",
	},
	{
		id: "base-2",
		title: "Markup subcontractor",
		markupPercentage: "10",
	},
];

export const DEFAULT_LABOR_ROWS: LaborRow[] = [
	{
		id: "labor-1",
		item: "1001",
		description: "Carpenter",
		quantity: "1",
		unit: "hour",
		aPrice: "350",
	},
	{
		id: "labor-2",
		item: "1002",
		description: "Architect",
		quantity: "0",
		unit: "hour",
		aPrice: "750",
	},
];

export const DEFAULT_STANDARD_CALCULATION_DATA: StandardCalculationData = {
	id: "std-calc-1",
	calcNo: "K001",
	projectName: "Standard Calculation",
	markups: DEFAULT_MARKUP_ROWS,
	baseCosts: DEFAULT_BASE_COST_ROWS,
	laborCosts: DEFAULT_LABOR_ROWS,
};
