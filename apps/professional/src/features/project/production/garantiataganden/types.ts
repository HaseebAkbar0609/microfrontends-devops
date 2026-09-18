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
 * called. The list's frame draws only `date` and `name`; the rest is what the
 * detail page's cards show, and has no source in the project data, so it is
 * seeded here and read-only (TFS-711).
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

/** A commitment as the list's dialog hands it over: the two fields it asks for. */
export interface WarrantyCommitmentInput {
	date: string;
	name: string;
}

/** A document as the detail page's dialog hands it over. */
export interface WarrantyDocumentInput {
	name: string;
	file: File;
}
