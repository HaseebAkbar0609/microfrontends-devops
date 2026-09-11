import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";

export const BUDGETS_BASE_ROUTE = "/module/financial-management/economy/budget";
export const CREATE_BUDGET_ROUTE = `${BUDGETS_BASE_ROUTE}/create`;

export const BUDGET_STORAGE_KEY = "tfs_economy_budgets";

export const BUDGET_DEFAULT_PAGE_SIZE = 10;
export const BUDGET_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const MONTHS_COUNT = 12;

export const MONTH_KEYS: TranslationKeys[] = [
	localizationConstants.monthJanuary,
	localizationConstants.monthFebruary,
	localizationConstants.monthMarch,
	localizationConstants.monthApril,
	localizationConstants.monthMay,
	localizationConstants.monthJune,
	localizationConstants.monthJuly,
	localizationConstants.monthAugust,
	localizationConstants.monthSeptember,
	localizationConstants.monthOctober,
	localizationConstants.monthNovember,
	localizationConstants.monthDecember,
];

export const DISTRIBUTION_OPTIONS = [
	{ value: "KR", label: "KR" },
	{ value: "%", label: "%" },
	{ value: "even", label: "Jämn fördelning" },
] as const;

export const ACCOUNT_OPTIONS = [
	{ value: "3011", label: "3011 - Försäljning inom Sverige" },
	{ value: "3012", label: "3012 - Försäljning export" },
	{ value: "4010", label: "4010 - Inköp av material" },
	{ value: "5010", label: "5010 - Lokalhyra" },
	{ value: "6071", label: "6071 - Representation" },
	{ value: "7010", label: "7010 - Löner för tjänstemän" },
	{ value: "7210", label: "7210 - Löner till företagsledare" },
	{ value: "7510", label: "7510 - Arbetsgivaravgifter" },
] as const;

export const COST_CENTER_OPTIONS = [
	{ value: "10 - Stockholm", label: "10 - Stockholm" },
	{ value: "20 - Göteborg", label: "20 - Göteborg" },
	{ value: "30 - Malmö", label: "30 - Malmö" },
	{ value: "40 - Uppsala", label: "40 - Uppsala" },
	{ value: "50 - Västerås", label: "50 - Västerås" },
] as const;
