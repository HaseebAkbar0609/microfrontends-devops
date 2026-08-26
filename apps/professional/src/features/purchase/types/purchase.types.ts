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
