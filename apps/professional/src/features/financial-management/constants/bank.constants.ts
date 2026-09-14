import localizationConstants from "@/utils/translation/constants";

export const BANK_BASE_ROUTE = "/module/financial-management/economy/bank";
export const BANK_CREATE_ROUTE = `${BANK_BASE_ROUTE}/create`;
export const BANK_LOANS_BASE_ROUTE = `${BANK_BASE_ROUTE}/loans`;
export const BANK_LOANS_CREATE_ROUTE = `${BANK_LOANS_BASE_ROUTE}/create`;

export const BANK_STORAGE_KEY = "tfs_economy_bank_data";

export const BANK_DEFAULT_PAGE_SIZE = 10;
export const BANK_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const BANK_ACCOUNT_TYPE_OPTIONS = [
	{ value: "Företagskonto", labelKey: localizationConstants.accountTypeForetagskonto },
	{ value: "Sparkonto", labelKey: localizationConstants.accountTypeSparkonto },
	{ value: "Transaktionskonto", labelKey: localizationConstants.accountTypeTransaktionskonto },
] as const;

export const LOAN_TYPE_OPTIONS = [
	{ value: "Fastighetsfinansiering", labelKey: localizationConstants.loanTypeFastighetsfinansiering },
	{ value: "Hårdvara", labelKey: localizationConstants.loanTypeHardvara },
	{ value: "Företagslån", labelKey: localizationConstants.loanTypeForetagslan },
	{ value: "Leasing", labelKey: localizationConstants.loanTypeLeasing },
] as const;

export const BANK_NAME_OPTIONS = [
	{ value: "SEB (Skandinaviska Enskilda Banken)", label: "SEB (Skandinaviska Enskilda Banken)" },
	{ value: "Nordea", label: "Nordea" },
	{ value: "Swedbank", label: "Swedbank" },
	{ value: "Handelsbanken", label: "Handelsbanken" },
	{ value: "Danske Bank", label: "Danske Bank" },
	{ value: "Länsförsäkringar", label: "Länsförsäkringar" },
	{ value: "ICA Banken", label: "ICA Banken" },
	{ value: "Skandiabanken", label: "Skandiabanken" },
] as const;

export const SUPPORTED_BANKS_LIST = [
	{
		id: "seb",
		name: "SEB (Skandinaviska Enskilda Banken)",
		shortName: "SEB",
		bic: "ESSESESS",
		badgeBg: "bg-emerald-600",
		badgeText: "text-white",
		isPopular: true,
	},
	{
		id: "swedbank",
		name: "Swedbank",
		shortName: "Swedbank",
		bic: "SWEDSESS",
		badgeBg: "bg-orange-500",
		badgeText: "text-white",
		isPopular: true,
	},
	{
		id: "nordea",
		name: "Nordea",
		shortName: "Nordea",
		bic: "NDEASESS",
		badgeBg: "bg-blue-600",
		badgeText: "text-white",
		isPopular: true,
	},
	{
		id: "handelsbanken",
		name: "Handelsbanken",
		shortName: "Handelsbanken",
		bic: "HANDSESS",
		badgeBg: "bg-sky-700",
		badgeText: "text-white",
		isPopular: true,
	},
	{
		id: "danskebank",
		name: "Danske Bank",
		shortName: "Danske Bank",
		bic: "DABASESS",
		badgeBg: "bg-slate-800",
		badgeText: "text-white",
		isPopular: false,
	},
	{
		id: "lansforsakringar",
		name: "Länsförsäkringar",
		shortName: "Länsförsäkringar",
		bic: "LANFSESS",
		badgeBg: "bg-blue-700",
		badgeText: "text-white",
		isPopular: false,
	},
	{
		id: "icabanken",
		name: "ICA Banken",
		shortName: "ICA Banken",
		bic: "ICABSESS",
		badgeBg: "bg-rose-600",
		badgeText: "text-white",
		isPopular: false,
	},
	{
		id: "skandiabanken",
		name: "Skandiabanken",
		shortName: "Skandiabanken",
		bic: "SKANSESS",
		badgeBg: "bg-teal-700",
		badgeText: "text-white",
		isPopular: false,
	},
] as const;


