import type { TranslationKeys } from "@/utils/translation/constants";

export type SliderField = {
	type: "slider";
	id: string;
	labelKey: TranslationKeys;
	subtitleKey?: TranslationKeys;
	min: number;
	max: number;
	defaultValue: number;
	unit: string;
	step?: number;
};

export type NumberField = {
	type: "number";
	id: string;
	labelKey: TranslationKeys;
	subtitleKey?: TranslationKeys;
	min: number;
	max: number;
	defaultValue: number;
	unit: string;
	step?: number;
};

export type SelectField = {
	type: "select";
	id: string;
	labelKey: TranslationKeys;
	options: { value: string; labelKey: TranslationKeys }[];
	defaultValue: string;
	selectWidth?: string; // e.g., "max-w-[320px]"
};

export type CalculatorField = SliderField | NumberField | SelectField;

export type ProjectTypeConfig = {
	id: string;
	nameKey: TranslationKeys;
	titleKey: TranslationKeys;
	subtitleKey: TranslationKeys;
	fields: CalculatorField[];
	basePrice: number;
	pricePerUnit: Record<string, number>;
	materialShare: number;
};

export type PriceEstimate = {
	low: number;
	high: number;
	material: number;
	labor: number;
	materialShare: number;
	laborShare: number;
};

export type ProductPrice = {
	id: string;
	productKey: TranslationKeys;
	categoryKey: TranslationKeys;
	priceInterval: string;
	unitPrice: number;
};

export type HourlyPrice = {
	id: string;
	workTypeKey: TranslationKeys;
	categoryKey: TranslationKeys;
	priceInterval: string;
};
