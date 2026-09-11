export const BANK_BASE_ROUTE = "/module/financial-management/economy/bank";
export const BANK_LOANS_BASE_ROUTE = `${BANK_BASE_ROUTE}/loans`;

export const BANK_STORAGE_KEY = "tfs_economy_bank_data";

export const BANK_DEFAULT_PAGE_SIZE = 10;
export const BANK_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const BANK_ACCOUNT_TYPE_OPTIONS = [
	{ value: "Företagskonto", label: "Företagskonto" },
	{ value: "Sparkonto", label: "Sparkonto" },
	{ value: "Transaktionskonto", label: "Transaktionskonto" },
] as const;

export const LOAN_TYPE_OPTIONS = [
	{ value: "Fastighetsfinansiering", label: "Fastighetsfinansiering" },
	{ value: "Hårdvara", label: "Hårdvara" },
	{ value: "Företagslån", label: "Företagslån" },
	{ value: "Leasing", label: "Leasing" },
] as const;

export const BANK_NAME_OPTIONS = [
	{ value: "SEB", label: "SEB (Skandinaviska Enskilda Banken)" },
	{ value: "Nordea", label: "Nordea" },
	{ value: "Swedbank", label: "Swedbank" },
	{ value: "Handelsbanken", label: "Handelsbanken" },
] as const;
