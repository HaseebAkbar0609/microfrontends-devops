import type { ProtocolType } from "@/features/project/production/protokoll/types";

/**
 * One protocol in the register.
 *
 * The names carry a `Forecast` prefix because the project module already
 * exports a `ProtocolSortField` of its own; these are a different register's.
 */
export interface ForecastProtocol {
	id: string;
	/**
	 * `yyyy-MM-dd` — the day the meeting took place. Unlike the module's other
	 * registers this is not the day the row was filed: minutes are written up
	 * after the meeting, so the reader supplies it.
	 */
	date: string;
	type: ProtocolType;
	fileName: string;
	/** The file's size in bytes; absent on a seeded row, which holds no file. */
	fileSize?: number;
	/**
	 * A `blob:` URL for a file uploaded this session. A seeded row has none,
	 * and neither has an uploaded row after a reload.
	 */
	url?: string;
}

/** What the upload dialog hands the register. */
export interface ForecastProtocolUploadInput {
	date: string;
	type: ProtocolType;
	file: File;
}

export interface ForecastProtocolListFilters {
	type: ProtocolType | null;
}

export type ForecastProtocolSortField = "date" | "type" | "fileName";
