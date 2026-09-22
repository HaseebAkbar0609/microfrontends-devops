export interface QuickAiLicenseItem {
	id: string;
	label: string;
	active: boolean;
}

export interface QuickAiDefaultSettings {
	markupByCalc: boolean;
	baseCosts: boolean;
	aPriceList: boolean;
}

export interface QuickAiComponentItem {
	id: string;
	label: string;
	icon: "door" | "window" | "wall" | string;
}

export interface QuickAiDocumentRow {
	id: string;
	label: string;
	checked: boolean;
}

export interface QuickAiDocumentSection {
	id: string;
	title: string;
	selectAll: boolean;
	rows: QuickAiDocumentRow[];
}

export interface QuickAiCalcData {
	id?: string;
	licenses: QuickAiLicenseItem[];
	defaultSettings: QuickAiDefaultSettings;
	components: QuickAiComponentItem[];
	sections: QuickAiDocumentSection[];
}
