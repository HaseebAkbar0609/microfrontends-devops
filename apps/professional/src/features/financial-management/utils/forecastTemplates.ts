import type { SortDir } from "@/utils/tableSort";
import type { TranslationKeys } from "@/utils/translation/constants";
import { TEMPLATE_CATEGORY_LABELS } from "../constants/forecastTemplates.constants";
import type {
	TemplateDocument,
	TemplateListFilters,
	TemplateSortField,
} from "../types/forecastTemplates.types";

/** Turns a translation key into the reader's text. */
export type TemplateLabel = (key: TranslationKeys) => string;

/**
 * Whether a template belongs in the register as filtered and searched. Search
 * reads what the reader sees: the number, both names and the category's label.
 * The description is not a column, so it is not searched either.
 */
export function matchesTemplate(
	template: TemplateDocument,
	filters: TemplateListFilters,
	query: string,
	label: TemplateLabel,
): boolean {
	if (filters.category && template.category !== filters.category) return false;

	const needle = query.trim().toLowerCase();
	if (!needle) return true;

	return [
		template.templateNo,
		template.documentName,
		template.fileName,
		label(TEMPLATE_CATEGORY_LABELS[template.category]),
	]
		.join(" ")
		.toLowerCase()
		.includes(needle);
}

function sortValue(template: TemplateDocument, field: TemplateSortField, label: TemplateLabel): string {
	if (field === "category") return label(TEMPLATE_CATEGORY_LABELS[template.category]);
	return template[field];
}

/**
 * Templates in header order, compared in the app's language with numbers
 * inside a name read as numbers, so v2 follows v1 and Swedish å, ä and ö sort
 * after z. With no sort the register's own order — newest first — stands.
 */
export function sortTemplates(
	templates: TemplateDocument[],
	field: TemplateSortField | null,
	dir: SortDir,
	label: TemplateLabel,
	locale: string,
): TemplateDocument[] {
	if (!field || !dir) return templates;

	const factor = dir === "asc" ? 1 : -1;
	return [...templates].sort(
		(a, b) =>
			factor *
			sortValue(a, field, label).localeCompare(sortValue(b, field, label), locale, {
				sensitivity: "base",
				numeric: true,
			}),
	);
}
