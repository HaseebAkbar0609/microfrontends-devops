import type {
	MarketingField,
	MarketingRow,
	MarketingRowValues,
	MarketingSection,
	MarketingSelectOption,
} from "../types";
import { formatNumber } from "./marketingFormatters";

/** Reads a stored id back to its option; unknown ids fall through to null. */
export function findOption(
	field: MarketingField,
	value: string,
): MarketingSelectOption | null {
	return field.options?.find((option) => option.id === value) ?? null;
}

export function readValue(
	values: MarketingRowValues,
	field: MarketingField,
): string {
	const raw = values[field.name];
	if (raw === undefined || raw === null) return "";
	return String(raw);
}

/** Display text for a non-select, non-link cell. */
export function formatCell(
	values: MarketingRowValues,
	field: MarketingField,
): string {
	const raw = values[field.name];
	if (raw === undefined || raw === null || raw === "") return "";
	if (field.type === "number") {
		const numeric = Number(raw);
		return Number.isFinite(numeric) ? formatNumber(numeric) : String(raw);
	}
	return String(raw);
}

/**
 * Free-text search across every cell, matching the prototype's behaviour but
 * over the values object rather than `Object.values(row).join(" ")` on a bare
 * record. Select cells are searched by their stored id, which is what the user
 * sees filtered in the toolbar dropdown alongside.
 */
export function rowMatchesQuery(row: MarketingRow, query: string): boolean {
	if (!query) return true;
	const needle = query.trim().toLowerCase();
	if (!needle) return true;
	return Object.values(row.values).some((value) =>
		String(value).toLowerCase().includes(needle),
	);
}

/** The select fields offered as toolbar filters, capped to keep the row readable. */
export function getFilterFields(
	section: MarketingSection,
	limit: number,
): MarketingField[] {
	return section.fields.filter((field) => field.type === "select").slice(0, limit);
}
