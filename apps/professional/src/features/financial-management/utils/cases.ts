import type { SortDir } from "@/utils/tableSort";
import type { TranslationKeys } from "@/utils/translation/constants";
import { getCategoryLabelKey } from "../components/cases/shared/getCategoryLabel";
import { CASE_STATUS_META } from "../constants/cases.constants";
import type { CaseCategory, CaseItem, CaseStatus } from "../types/cases.types";

/** The columns the register sorts on, in the frame's order. */
export type CaseSortField = "caseNumber" | "category" | "createdBy" | "date" | "status";

export interface CaseListFilters {
	status: CaseStatus | "all";
	category: CaseCategory | "all";
}

/** Turns a translation key into the reader's text. */
export type CaseLabel = (key: TranslationKeys) => string;

/**
 * Whether a case belongs in the register as filtered and searched. Search
 * reads what the reader sees: its number, its title and who raised it.
 */
export function matchesCase(item: CaseItem, filters: CaseListFilters, query: string): boolean {
	if (filters.status !== "all" && item.status !== filters.status) return false;
	if (filters.category !== "all" && item.category !== filters.category) return false;

	const needle = query.trim().toLowerCase();
	if (!needle) return true;

	return [item.caseNumber, item.title, item.createdBy].join(" ").toLowerCase().includes(needle);
}

/** Kategori and Status compare as the words on screen, not as their codes. */
function sortValue(item: CaseItem, field: CaseSortField, label: CaseLabel): string {
	if (field === "category") return label(getCategoryLabelKey(item.category));
	if (field === "status") return label(CASE_STATUS_META[item.status].labelKey);
	return item[field];
}

/**
 * Cases in header order, compared in the app's language with numbers inside a
 * value read as numbers, so #5010 follows #5009 and Swedish å, ä and ö sort
 * after z. With no sort the register's own order stands.
 */
export function sortCases(
	items: CaseItem[],
	field: CaseSortField | null,
	dir: SortDir,
	label: CaseLabel,
	locale: string,
): CaseItem[] {
	if (!field || !dir) return items;

	const factor = dir === "asc" ? 1 : -1;
	return [...items].sort(
		(a, b) =>
			factor *
			sortValue(a, field, label).localeCompare(sortValue(b, field, label), locale, {
				sensitivity: "base",
				numeric: true,
			}),
	);
}
