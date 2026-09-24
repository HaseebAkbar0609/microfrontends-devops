export const ACCOUNT_PLAN_STORAGE_KEY = "tfs_account_plan_register_data";

export const ACCOUNT_PLAN_BASE_ROUTE = "/module/financial-management/economy/account-plan";
export const ACCOUNT_PLAN_IMPORT_ROUTE = "/module/financial-management/economy/account-plan/import";
export const ACCOUNT_PLAN_CREATE_ROUTE = "/module/financial-management/economy/account-plan/create";

export const DEFAULT_PAGE_SIZE = 10;

export const MOMSKOD_OPTIONS = [
	{ label: "-", value: "-" },
	{ label: "25%", value: "25%" },
	{ label: "12%", value: "12%" },
	{ label: "6%", value: "6%" },
	{ label: "0%", value: "0%" },
] as const;

export const AKTIVT_OPTIONS = [
	{ label: "Aktiv", value: "Aktiv" },
	{ label: "Inaktiv", value: "Inaktiv" },
	{ label: "Beijer", value: "Beijer" },
] as const;

export const KOSTNADSSTALLE_OPTIONS = [
	{ label: "Kontor 10", value: "Kontor 10" },
	{ label: "Stockholm", value: "Stockholm" },
	{ label: "105", value: "105" },
	{ label: "Göteborg", value: "Göteborg" },
	{ label: "Malmö", value: "Malmö" },
] as const;

export const IMPORT_ACTION_OPTIONS = [
	{ label: "Koppla", value: "koppla" },
	{ label: "Skapa nytt", value: "skapa_nytt" },
	{ label: "Ignorera", value: "ignorera" },
] as const;
