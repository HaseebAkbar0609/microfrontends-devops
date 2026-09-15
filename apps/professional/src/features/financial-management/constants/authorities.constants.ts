import { ECONOMY_EXPENSE_BASE_URL } from "./economyNav.config";

export const AUTHORITIES_STORAGE_KEY = "tfs_authorities_data_v1";

export const ECONOMY_AUTHORITIES_BASE_URL = `${ECONOMY_EXPENSE_BASE_URL}/authorities`;
export const AUTHORITIES_BASE_ROUTE = ECONOMY_AUTHORITIES_BASE_URL;
export const AUTHORITIES_CREATE_ROUTE = `${AUTHORITIES_BASE_ROUTE}/create`;

export const AUTHORITIES_DEFAULT_PAGE_SIZE = 10;
export const AUTHORITIES_PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

export const KNOWN_AUTHORITIES_LIST = [
	"Skatteverket",
	"Bolagsverket",
	"Försäkringskassan",
	"Kronofogden",
	"Pensionsmyndigheten",
	"Tullverket",
	"Arbetsmiljöverket",
	"Statistiska centralbyrån (SCB)",
	"Finansinspektionen",
	"Länsstyrelsen",
] as const;

export const AUTHORITY_CATEGORIES_LIST = [
	"Govt Docs",
	"Financial",
	"Tax",
	"Legal",
	"Insurance",
] as const;

export const AUTHORITY_DEFAULT_VAT_RATE = 0.25;
