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
import type {
	MaterialTransactionType,
	WithdrawalLinkType,
	WithdrawalTargetType,
} from "../types/materialTransaction.types";

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
	/** Prefix of every key below: invalidate it after anything that changes stock. */
	all: ["material-storage"],
	depots: ["material-storage", "depots"],
	articles: ["material-storage", "articles"],
	suppliers: ["material-storage", "suppliers"],
	kpis: ["material-storage", "stock-kpis"],
	stock: ["material-storage", "stock"],
	stockLevel: ["material-storage", "stock-level"],
	depotArticles: ["material-storage", "depot-articles"],
	linkTargets: ["material-storage", "link-targets"],
	workSteps: ["material-storage", "work-steps"],
	article: ["material-storage", "article"],
	articleEvents: ["material-storage", "article-events"],
	priceHistory: ["material-storage", "price-history"],
} as const;

/** Counted units: a quantity in these must be a whole number. */
export const MATERIAL_DISCRETE_UNITS: readonly MaterialUnit[] = ["pcs", "pkg"];

export const MATERIAL_TEXT_LIMITS = {
	supplierOrderNo: 50,
	comment: 500,
} as const;

/** Prefix of a transaction's reference: INL-2026-0001 (Inleverans), UTT-2026-0001 (Uttag), JUS-2026-0001 (Justering). */
export const MATERIAL_TRANSACTION_PREFIXES: Record<MaterialTransactionType, string> = {
	receipt: "INL",
	withdrawal: "UTT",
	adjustment: "JUS",
};

/** "Koppla till" in "Ta ut material", in the Figma order. Projekt is chosen when the dialog opens. */
export const WITHDRAWAL_LINK_OPTIONS: SegmentedToggleOption<WithdrawalLinkType>[] = [
	{ id: "order", labelKey: localizationConstants.materialLinkOrder },
	{ id: "project", labelKey: localizationConstants.materialLinkProject },
	{ id: "invoice", labelKey: localizationConstants.materialLinkInvoice },
	{ id: "internal", labelKey: localizationConstants.materialLinkInternal },
];

export const WITHDRAWAL_LINK_TYPES = WITHDRAWAL_LINK_OPTIONS.map((option) => option.id) as [
	WithdrawalLinkType,
	...WithdrawalLinkType[],
];

export const WITHDRAWAL_DEFAULT_LINK_TYPE: WithdrawalLinkType = "project";

/** The record field under "Koppla till": its label, placeholder and the error when it is left empty. */
export const WITHDRAWAL_TARGET_TEXT: Record<
	WithdrawalTargetType,
	{ label: TranslationKeys; placeholder: TranslationKeys; required: TranslationKeys }
> = {
	order: {
		label: localizationConstants.materialFieldOrder,
		placeholder: localizationConstants.materialOrderPlaceholder,
		required: localizationConstants.materialErrorOrderRequired,
	},
	project: {
		label: localizationConstants.materialFieldProject,
		placeholder: localizationConstants.materialProjectPlaceholder,
		required: localizationConstants.materialErrorProjectRequired,
	},
	invoice: {
		label: localizationConstants.materialFieldInvoice,
		placeholder: localizationConstants.materialInvoicePlaceholder,
		required: localizationConstants.materialErrorInvoiceRequired,
	},
};

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
	/** The article "Visa artikel" shows; its figures are for the depot above. */
	article: "article",
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
