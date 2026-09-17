/** The five line-item sections of "Detaljerad information". */
export type AtaSection = "staff" | "material" | "machines" | "ue" | "supplierAta";

/**
 * Where an ÄTA stands. A saved ÄTA is `utkast`; Skicka moves it to
 * `forhandling`. `ok` and `redovisad` come from the customer's approval and
 * invoicing, which are not drawn — only seeded rows carry them.
 */
export type AtaStatus = "utkast" | "forhandling" | "ok" | "redovisad";

/**
 * Where a subcontractor's or supplier's ÄTA stands with the project. It
 * arrives `ej_granskad`; Godkänna makes it `ok`. `forhandling` and
 * `redovisad` (invoiced) are not reached from any drawn control — only seeded
 * rows carry them.
 */
export type SupplierAtaStatus = "ej_granskad" | "forhandling" | "ok" | "redovisad";

export type AtaAttested = "ja" | "ej_klart";

/**
 * One row of any section. Staff rows name a person, the others a supplier with
 * an invoice number. Belopp and Nettosumma are never stored — `ataMath`
 * derives them — so a table, the rail and the list cannot disagree.
 */
export interface AtaLineItem {
	id: string;
	/** `yyyy-MM-dd`. */
	date: string;
	/** Person on a staff row, Leverantör on the others. */
	party: string;
	/** Resnr. */
	resourceNo: string;
	description: string;
	/** Antal, above 0 with at most two decimals. */
	quantity: number;
	/** Fakt.nr; `""` on staff rows. */
	invoiceNo: string;
	/** Enhet, e.g. "tim" or "st". */
	unit: string;
	/** Nettopris per unit, whole kronor. */
	netPrice: number;
	/** Påslag in %, a whole number. */
	markupPercent: number;
	/** %2 — shown as entered, never part of the maths (its meaning is not drawn). */
	secondaryPercent: number | null;
	activity: string;
	/** Läge. */
	location: string;
}

export type AtaLineItems = Record<AtaSection, AtaLineItem[]>;

export interface AtaClient {
	client: string;
	name: string;
	address: string;
	postalCode: string;
	city: string;
}

export interface AtaProjectInfo {
	heading: string;
	/** The frame draws "Rubrik" twice; the second is an Underrubrik. */
	subheading: string;
	proposedAction: string;
	action: string;
	qualityStatus: string;
	reason: string;
	economyStatus: string;
	location: string;
	description: string;
}

export interface AtaDocument {
	id: string;
	/** `yyyy-MM-dd` the file was attached. */
	date: string;
	documentName: string;
	fileName: string;
	/** A `blob:` URL the store minted on save. Seeded documents have none. */
	url?: string;
}

/** A document as the form holds it: stored (no file) or picked this session. Never a URL. */
export interface AtaDocumentInput {
	id: string;
	date: string;
	documentName: string;
	fileName: string;
	file?: File;
}

export interface AtaReferenceOption {
	id: string;
	label: string;
}

export interface ProjectAta {
	id: string;
	projectId: string;
	number: number;
	status: AtaStatus;
	attested: AtaAttested;
	client: AtaClient;
	info: AtaProjectInfo;
	createdBy: string;
	createdDate: string;
	/** `""` until the ÄTA is changed after it was sent. */
	revisedDate: string;
	lineItems: AtaLineItems;
	documents: AtaDocument[];
	supplierInvoiceIds: string[];
	timeReportIds: string[];
}

/** What the form edits and hands to the store. */
export interface AtaInput {
	client: AtaClient;
	info: AtaProjectInfo;
	lineItems: AtaLineItems;
	documents: AtaDocumentInput[];
	supplierInvoiceIds: string[];
	timeReportIds: string[];
}
