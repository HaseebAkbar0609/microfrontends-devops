import { ECONOMY_EXPENSE_BASE_URL } from "./economyNav.config";
import type { YearEndCategory } from "../types/yearEnd.types";

export const YEAR_END_STORAGE_KEY = "tfs_year_end_data_v1";

export const ECONOMY_YEAR_END_BASE_URL = `${ECONOMY_EXPENSE_BASE_URL}/year-end`;
export const YEAR_END_BASE_ROUTE = ECONOMY_YEAR_END_BASE_URL;

export const AVAILABLE_FISCAL_YEARS = [2025, 2024, 2023, 2022] as const;
export const DEFAULT_FISCAL_YEAR = 2025;

export const YEAR_END_DEFAULT_PAGE_SIZE = 10;
export const YEAR_END_PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

export const YEAR_END_CATEGORIES_LIST: YearEndCategory[] = [
	"Årsredovisning",
	"Deklaration",
	"Balans & Resultat",
	"Huvudbok",
	"Leverantörslista",
	"Kundfordringar",
	"Moms & Skatt",
	"Övrigt",
];
