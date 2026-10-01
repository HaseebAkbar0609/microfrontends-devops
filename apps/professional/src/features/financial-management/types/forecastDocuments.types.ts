/** What a document is about; the register's Kategori badge. */
export type DocumentCategory = "agreement" | "report" | "invoice" | "budget" | "other";

/** One document in the register. */
export interface ForecastDocument {
	id: string;
	/** The register's own number, as the frame's ID column shows it. */
	documentNo: string;
	category: DocumentCategory;
	fileName: string;
	/** The file's size in bytes; absent on a seeded row, which holds no file. */
	fileSize?: number;
	/** ISO date, YYYY-MM-DD, the day it was uploaded. */
	date: string;
	/**
	 * A `blob:` URL for a file uploaded this session. A seeded row has none,
	 * and neither has an uploaded row after a reload.
	 */
	url?: string;
}

/**
 * A file the create page holds but has not filed yet.
 *
 * Its URL is minted when the file is taken off the chip row, not when the page
 * is saved, because the staged table offers "Se fil" on a row that is not a
 * register row yet. The shape is the one the shared staged table reads.
 */
export interface StagedDocument {
	id: string;
	name: string;
	date: string;
	fileSize: number;
	url: string;
}

/**
 * What the create page hands the register: one category for a whole batch.
 * Unlike the report and template registers, which file one document at a time
 * from a dialog, this screen uploads many at once.
 */
export interface DocumentUploadInput {
	category: DocumentCategory;
	staged: StagedDocument[];
}

export interface DocumentListFilters {
	category: DocumentCategory | null;
}

export type DocumentSortField = "documentNo" | "category" | "fileName" | "date";
