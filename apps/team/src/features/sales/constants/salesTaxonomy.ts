import type { TranslationKeys } from "@/utils/translation/constants";
import localizationConstants from "@/utils/translation/constants";

export type SalesTaxonomyOption = {
	id: string;
	labelKey: TranslationKeys;
};

/** Trades the Swedish sales organisation sells into. */
export const SALES_CATEGORIES: SalesTaxonomyOption[] = [
	{ id: "cleaning", labelKey: localizationConstants.salesCategoryCleaning },
	{
		id: "construction",
		labelKey: localizationConstants.salesCategoryConstruction,
	},
	{ id: "electrical", labelKey: localizationConstants.salesCategoryElectrical },
	{ id: "plumbing", labelKey: localizationConstants.salesCategoryPlumbing },
	{ id: "painting", labelKey: localizationConstants.salesCategoryPainting },
	{ id: "roofing", labelKey: localizationConstants.salesCategoryRoofing },
	{
		id: "groundworks",
		labelKey: localizationConstants.salesCategoryGroundworks,
	},
	{ id: "transport", labelKey: localizationConstants.salesCategoryTransport },
	{ id: "other", labelKey: localizationConstants.salesCategoryOther },
];

/** Sales regions. City names read the same in both languages. */
export const SALES_REGIONS: SalesTaxonomyOption[] = [
	{ id: "stockholm", labelKey: localizationConstants.salesRegionStockholm },
	{ id: "jarfalla", labelKey: localizationConstants.salesRegionJarfalla },
	{ id: "solna", labelKey: localizationConstants.salesRegionSolna },
	{ id: "sodertalje", labelKey: localizationConstants.salesRegionSodertalje },
	{ id: "uppsala", labelKey: localizationConstants.salesRegionUppsala },
	{ id: "goteborg", labelKey: localizationConstants.salesRegionGoteborg },
	{ id: "malmo", labelKey: localizationConstants.salesRegionMalmo },
	{ id: "helsingborg", labelKey: localizationConstants.salesRegionHelsingborg },
	{ id: "orebro", labelKey: localizationConstants.salesRegionOrebro },
	{ id: "umea", labelKey: localizationConstants.salesRegionUmea },
	{ id: "other", labelKey: localizationConstants.salesRegionOther },
];

const CATEGORY_LABEL_BY_ID = new Map(
	SALES_CATEGORIES.map((option) => [option.id, option.labelKey]),
);

const REGION_LABEL_BY_ID = new Map(
	SALES_REGIONS.map((option) => [option.id, option.labelKey]),
);

export function getSalesCategoryLabelKey(id: string): TranslationKeys | null {
	return CATEGORY_LABEL_BY_ID.get(id) ?? null;
}

export function getSalesRegionLabelKey(id: string): TranslationKeys | null {
	return REGION_LABEL_BY_ID.get(id) ?? null;
}

export function isSalesCategoryId(id: string): boolean {
	return CATEGORY_LABEL_BY_ID.has(id);
}

export function isSalesRegionId(id: string): boolean {
	return REGION_LABEL_BY_ID.has(id);
}
