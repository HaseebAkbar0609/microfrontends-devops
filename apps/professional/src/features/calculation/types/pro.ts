export interface IndustryCategoryItem {
	id: string;
	label: string;
	active: boolean;
}

export interface CalculationProDefaultSettings {
	markupByCalc: boolean;
	baseCosts: boolean;
	aPriceList: boolean;
}

export interface IndustrySettingRow {
	id: string;
	label: string;
	checked: boolean;
}

export interface CalculationProData {
	id?: string;
	categories: IndustryCategoryItem[];
	defaultSettings: CalculationProDefaultSettings;
	selectedType: string;
	industryTypes: string[];
	industryRows: IndustrySettingRow[];
}
