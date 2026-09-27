export type CostCategoryType = "konsulter" | "arbete" | "material" | "uc" | "custom";

export interface TemplateSectionRow {
	id: string;
	artikel: string;
	levArtikel?: string;
	leverantor?: string;
	benamning: string;
	antal: string;
	enhet: string;
	aPris: string;
	paslagPct: string;
}

export interface TemplateCostSection {
	id: string;
	categoryType: CostCategoryType;
	title: string;
	isOpen: boolean;
	rows: TemplateSectionRow[];
}

export interface OverheadRow {
	id: string;
	artikel: string;
	benamning: string;
	antal: string;
	enhet: string;
	aPris: string;
	paslagPct: string;
	justering: string;
}

export interface SectionSummaryAdjustment {
	sectionId: string;
	markupPct: string;
	adjustmentKr: string;
}

export interface CalculationTemplateOption {
	id: string;
	name: string;
	description?: string;
	sektionCount?: number;
	mallType?: string;
	datum?: string;
	sections: TemplateCostSection[];
}

export interface SupplierPriceListItem {
	id: string;
	articleNo: string;
	supplier: string;
	name: string;
	unit: string;
	price: number;
}
