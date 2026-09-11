import localizationConstants from "@/utils/translation/constants";

export const BANK_BASE_ROUTE = "/module/financial-management/economy/bank";
export const BANK_LOANS_BASE_ROUTE = `${BANK_BASE_ROUTE}/loans`;

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
] as const;

