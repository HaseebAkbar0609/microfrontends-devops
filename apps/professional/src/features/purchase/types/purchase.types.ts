export type PurchaseStatus =
	| "not_started"
	| "ongoing"
	| "delayed"
	| "completed";

export type PurchaseType =
	| "total"
	| "general"
	| "running"
	| "collaboration";

export type PurchaseCategory = "service" | "contracting" | "running";

export interface PurchaseRow {
	id: string;
	/** Purchase number shown in the first column, e.g. "I500". */
	purchaseNo: string;
	name: string;
	/** The order or project the purchase belongs to. */
	object: string;
	orderer: string;
	type: PurchaseType;
	category: PurchaseCategory;
	status: PurchaseStatus;
}

export type PurchaseSupplierStatus = "active" | "inactive";

/**
 * One row of the module's supplier list. Columns follow the Figma's headers;
 * its sample cells are placeholder data copied from the overview frame.
 */
export interface PurchaseSupplierRow {
	id: string;
	name: string;
	/** "Beställare" — who orders from this supplier. */
	orderer: string;
	postalCode: string;
	city: string;
	email: string;
	phone: string;
	status: PurchaseSupplierStatus;
}

/**
 * A supplier on the API integrations tab. The two lists in the design are
 * derived from this one flag rather than held as separate arrays, so they
 * cannot drift apart.
 */
export interface PurchaseApiSupplier {
	id: string;
	name: string;
	connected: boolean;
}

/** A purchasable API integration category. */
export interface PurchaseApiCategory {
	id: string;
	name: string;
	active: boolean;
}

export type PurchaseComplaintStatus = "not_sent" | "sent" | "approved";

export type PurchaseComplaintType = "damaged" | "wrong_delivery";

/** One row of the Reklamationer list. */
export interface PurchaseComplaintRow {
	id: string;
	complaintNo: string;
	/** The purchase the complaint was raised against. */
	purchaseNo: string;
	/** The order or project the purchase belongs to. */
	object: string;
	name: string;
	supplier: string;
	type: PurchaseComplaintType;
	/** ISO date the complaint was raised. */
	date: string;
	status: PurchaseComplaintStatus;
	/** Archived rows drop out of the list; the module has its own Arkiv tab. */
	archived: boolean;
}

export type PurchaseDocumentFileType = "pdf" | "doc";

/** One row of the supplier agreements ("Avtal") document table. */
export interface PurchaseAgreementDocument {
	id: string;
	/** ISO date the document was attached. */
	date: string;
	supplier: string;
	documentName: string;
	/**
	 * The frame's "Typ" column, e.g. "A500-10". It reads as an agreement or
	 * document reference rather than a file type — the adjacent "Fil" column
	 * already carries the format.
	 */
	reference: string;
	fileType: PurchaseDocumentFileType;
	fileUrl?: string;
}

/** Timeline granularity of the Gantt schedule. */
export type PurchaseGanttZoom = "day" | "week" | "month";

/**
 * One bar on the Gantt schedule. The planned window is drawn as a pale track
 * and the actual window as a solid bar on top of it, matching the design.
 */
export interface PurchaseGanttRow {
	id: string;
	purchaseNo: string;
	objectName: string;
	/** The order or project the purchase hangs off ("Koppling"). */
	connection: string;
	orderer: string;
	status: PurchaseStatus;
	/** ISO dates, all inclusive. */
	orderDate: string;
	estimatedDelivery: string;
	delivery: string;
	monitoring: string;
	/** Sub-rows shown when the row is expanded. */
	children?: PurchaseGanttRow[];
}
