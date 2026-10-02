export type AccessDocumentFileType = "pdf";

export type AccessDocumentSortField = "date" | "name" | "fileType";

/** A document attached to an access item (a row of the Documents card). */
export interface AccessDocument {
	id: string;
	/** Local ISO date, e.g. "2024-05-10". */
	date: string;
	name: string;
	fileType: AccessDocumentFileType;
}

/** An image attached to an access item (a thumbnail of the Images card). */
export interface AccessImage {
	/** Unique key. Captions repeat. */
	id: string;
	caption: string;
}

/** What the item details page shows beyond the item row itself. */
export interface AccessItemExtra {
	company: string;
	/** The document shown in the Assigned Access table; null when there is none. */
	assignmentDocument: string | null;
	documents: AccessDocument[];
	images: AccessImage[];
}

/** Extras per access item id. */
export type AccessItemExtrasById = Record<string, AccessItemExtra>;
