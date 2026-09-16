/**
 * An inspection's kind. Stored as a code, not the Swedish text the Order
 * module stores, so the label follows the reader's language.
 */
export type InspectionType =
	| "byggmote"
	| "forbesiktning"
	| "slutbesiktning"
	| "efterbesiktning"
	| "garantibesiktning"
	| "sarskild";

export interface ProjectInspectionDocument {
	id: string;
	name: string;
	/** A `blob:` URL the store minted for a file added this session. Seeds have none. */
	url?: string;
}

export interface ProjectInspection {
	id: string;
	projectId: string;
	/** `yyyy-MM-dd`. */
	date: string;
	type: InspectionType;
	/** `yyyy-MM-dd`, or `""` when it is not set. */
	inspectionDate: string;
	/** In the order added; the table shows the first. */
	documents: ProjectInspectionDocument[];
	archived: boolean;
}

/**
 * A document as the dialog hands it over: one already stored (id and name
 * only) or a file picked in this dialog. It never carries a URL — the store
 * mints those, so nothing typed into a form can become one.
 */
export interface InspectionDocumentInput {
	id: string;
	name: string;
	file?: File;
}

export interface InspectionInput {
	date: string;
	type: InspectionType;
	inspectionDate: string;
	documents: InspectionDocumentInput[];
}
