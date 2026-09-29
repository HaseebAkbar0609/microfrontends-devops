import type { SegmentedToggleOption } from "@/components/ui/SegmentedToggle";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import type {
	MaterialCategoryId,
	MaterialStockSortField,
	MaterialUnit,
	StockFilter,
	StockStatus,
} from "../types/materialStorage.types";

/** Simulated round trip of the mock service, so loading states show as they will against the API. */
export const MATERIAL_MOCK_LATENCY_MS = 300;

export const MATERIAL_CURRENCY = "SEK";

export const MATERIAL_NUMBER_LOCALES: Record<string, string> = {
	sv: "sv-SE",
	en: "en-US",
};

export const MATERIAL_DEFAULT_PAGE_SIZE = 10;

export const MATERIAL_PAGE_SIZE_OPTIONS = [5, 10, 20, 30, 50] as const;

export const MATERIAL_QUERY_KEYS = {
	depots: ["material-storage", "depots"],
	kpis: ["material-storage", "stock-kpis"],
	stock: ["material-storage", "stock"],
} as const;

/** URL query parameter names for the overview's filter, sort and paging state. */
export const MATERIAL_OVERVIEW_PARAMS = {
	depot: "depot",
	search: "search",
	category: "category",
	stock: "stock",
	sortBy: "sortBy",
	sortOrder: "sortOrder",
	page: "page",
	pageSize: "limit",
} as const;

export const MATERIAL_CATEGORY_LABELS: Record<MaterialCategoryId, TranslationKeys> = {
	boards: localizationConstants.materialCategoryBoards,
	timber: localizationConstants.materialCategoryTimber,
	pipes: localizationConstants.materialCategoryPipes,
	electrical: localizationConstants.materialCategoryElectrical,
	paint: localizationConstants.materialCategoryPaint,
	fasteners: localizationConstants.materialCategoryFasteners,
	insulation: localizationConstants.materialCategoryInsulation,
};

export const MATERIAL_CATEGORY_IDS = Object.keys(
	MATERIAL_CATEGORY_LABELS,
) as MaterialCategoryId[];

export const MATERIAL_UNIT_LABELS: Record<MaterialUnit, TranslationKeys> = {
	pcs: localizationConstants.materialUnitPcs,
	m: localizationConstants.materialUnitMeter,
	m2: localizationConstants.materialUnitSquareMeter,
	kg: localizationConstants.materialUnitKg,
	l: localizationConstants.materialUnitLiter,
	pkg: localizationConstants.materialUnitPackage,
};

export const STOCK_STATUS_LABELS: Record<StockStatus, TranslationKeys> = {
	inStock: localizationConstants.materialStatusInStock,
	lowStock: localizationConstants.materialStatusLowStock,
	outOfStock: localizationConstants.materialStatusOutOfStock,
};

export const STOCK_FILTER_OPTIONS: SegmentedToggleOption<StockFilter>[] = [
	{ id: "all", labelKey: localizationConstants.materialFilterAll },
	{ id: "lowStock", labelKey: localizationConstants.materialFilterLowStock },
	{ id: "reserved", labelKey: localizationConstants.materialFilterReserved },
];

export const STOCK_FILTER_IDS = STOCK_FILTER_OPTIONS.map((option) => option.id);

export const MATERIAL_SORT_FIELDS: readonly MaterialStockSortField[] = [
	"articleNo",
	"name",
	"categoryId",
	"depotName",
	"inStock",
	"reserved",
	"available",
	"purchasePrice",
	"salesPrice",
	"stockValue",
	"status",
];
