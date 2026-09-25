/** What a report covers; the register's Kategori badge. */
export type ReportCategory = "result" | "liquidity" | "risk" | "personnel" | "other";

/** One report document in the register. */
export interface ReportDocument {
	id: string;
	/** The register's own number, as the frame's ID column shows it. */
	reportNo: string;
	category: ReportCategory;
	fileName: string;
	/** The file's size in bytes; absent on a seeded row, which holds no file. */
	fileSize?: number;
	/** ISO date, YYYY-MM-DD, the day it was added. */
	date: string;
	/**
	 * A `blob:` URL for a file uploaded this session. A seeded row has none,
	 * and neither has an uploaded row after a reload.
	 */
	url?: string;
}

/** What the upload dialog hands the register. */
export interface ReportUploadInput {
	category: ReportCategory;
	file: File;
}

export interface ReportListFilters {
	category: ReportCategory | null;
}

export type ReportSortField = "reportNo" | "category" | "fileName" | "date";
