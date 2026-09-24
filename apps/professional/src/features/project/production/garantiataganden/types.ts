/**
 * A file hung on a commitment — the frame's "Garanti åtgärder", "Drift
 * underlag" and "Rapport". `url` is the `blob:` the store minted for an upload;
 * a seeded row has none and cannot be opened.
 */
export interface WarrantyDocument {
	id: string;
	/** `yyyy-MM-dd`. */
	date: string;
	/** Benämning, as the reader writes it. */
	name: string;
	fileName: string;
	url?: string;
}

/**
 * A warranty commitment: a day the project has promised something after
 * handover — a two-year follow-up, a five-year inspection — and what it is
 * called. The list's table draws only `date` and `name`; the rest is what the
 * detail page's cards show. The create form owns `reminderDate`,
 * `reminderEmails` and `documents` (TFS-712); `responsible`, `approvedDate`,
 * `periodLabel`, `endDate` and `reminderContacts` have no source in the project
 * data and no frame that asks for them, so they stay seeded and read-only.
 */
export interface WarrantyCommitment {
	id: string;
	projectId: string;
	/** `yyyy-MM-dd`. */
	date: string;
	/** Benämning, as the reader writes it. */
	name: string;
	/** Garantiansvarig. */
	responsible: string;
	/** Godkänd — the day the work behind the warranty was approved. */
	approvedDate: string;
	/** Garantitid's first half, e.g. "5 år". Free text: the periods are not a fixed set. */
	periodLabel: string;
	/** Garantitid's second half — the day the warranty runs out. */
	endDate: string;
	/** Påminnelse datum. */
	reminderDate: string;
	/** Påminnelse mail, one per line in the frame. */
	reminderEmails: string[];
	/** Kontaktperson, one per line in the frame. */
	reminderContacts: string[];
	documents: WarrantyDocument[];
}

/**
 * A document as the create form holds it before it is stored: an existing one
 * carried by its id, or a picked file not yet stored. Never a URL — the store
 * mints those.
 */
export interface WarrantyDocumentDraft {
	id: string;
	/** Benämning — the file's name without its extension, as the reader may rewrite it. */
	name: string;
	/** The file's own name, which is what a second pick of it is compared against. */
	fileName: string;
	file?: File;
}

/** A commitment as the list's dialog hands it over — the frame's five fields. */
export interface WarrantyCommitmentInput {
	date: string;
	name: string;
	/** Påminnelse regel, which the frame fills with a date. */
	reminderDate: string;
	/** Påminnelse mail, blank rows already dropped. */
	reminderEmails: string[];
	documents: WarrantyDocumentDraft[];
}

/** A document as the detail page's dialog hands it over. */
export interface WarrantyDocumentInput {
	name: string;
	file: File;
}
