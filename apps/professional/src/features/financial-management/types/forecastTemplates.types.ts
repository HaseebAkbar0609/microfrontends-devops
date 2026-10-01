/** What a template is for; the register's Kategori badge. */
export type TemplateCategory = "budget" | "forecast" | "report" | "calculation" | "other";

/** One template document in the register. */
export interface TemplateDocument {
	id: string;
	/** The register's own number, as the frame's ID column shows it. */
	templateNo: string;
	category: TemplateCategory;
	/**
	 * What the register calls the template. It starts as the picked file's base
	 * name and is edited from there, so it is its own field: "Budgetmall 2026"
	 * is a better name than `Budget_mall_v3_FINAL.xlsx`.
	 */
	documentName: string;
	fileName: string;
	/** The file's size in bytes; absent on a seeded row, which holds no file. */
	fileSize?: number;
	/** ISO date, YYYY-MM-DD, the day it was added. */
	date: string;
	/** Free text the details dialog shows; the table has no column for it. */
	description?: string;
	/**
	 * A `blob:` URL for a file uploaded this session. A seeded row has none,
	 * and neither has an uploaded row after a reload.
	 */
	url?: string;
}

/** What the create dialog hands the register. */
export interface TemplateUploadInput {
	category: TemplateCategory;
	documentName: string;
	description?: string;
	file: File;
}

export interface TemplateListFilters {
	category: TemplateCategory | null;
}

export type TemplateSortField = "templateNo" | "category" | "date" | "documentName" | "fileName";

/** The `+` hides the same columns the headers sort by, so one union serves both. */
export type TemplateColumnKey = TemplateSortField;
