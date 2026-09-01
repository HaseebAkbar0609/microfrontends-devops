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
	/** Archived rows drop out of the list; the module has its own Arkiv tab. */
	archived: boolean;
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

export type PurchaseComplaintPriority = "high" | "medium" | "low";

/** One row of the Reklamationer list. */
export interface PurchaseComplaintRow {
	id: string;
	complaintNo: string;
	/** The purchase the complaint was raised against. */
	purchaseNo: string;
	/**
	 * The purchase line, where the complaint is against one. A list already
	 * scoped to a purchase shows this instead of `purchaseNo`, which would
	 * otherwise repeat on every row.
	 */
	lineNo?: string;
	/** The order or project the purchase belongs to. */
	object: string;
	name: string;
	supplier: string;
	type: PurchaseComplaintType;
	/** ISO date the complaint was raised. */
	date: string;
	status: PurchaseComplaintStatus;
	priority: PurchaseComplaintPriority;
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
	/**
	 * The purchase the document belongs to. Goods reception lists this where the
	 * agreements table lists the supplier, so it stays optional.
	 */
	purchaseNo?: string;
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

/**
 * Delivery shape of a goods reception. Taken from the frame's "Ordertyp"
 * column: a whole delivery, one instalment of several, or a re-send of what a
 * previous delivery was short.
 */
export type PurchaseGoodsReceptionOrderType =
	| "normal"
	| "partial"
	| "backorder";

/** Goods category, from the ticket's "Category" badge. */
export type PurchaseGoodsCategory =
	| "spare_parts"
	| "raw_materials"
	| "machinery";

/** One step of the ticket's "Bulk Discount tiers". */
export interface PurchaseGoodsDiscountTier {
	/** Smallest quantity that unlocks the tier. */
	quantity: number;
	/** Percentage off the unit price. */
	percentage: number;
}

/**
 * A technical specification or brochure, from the ticket's "Attachments".
 * `url` is absent until the file is uploaded in this session.
 */
export interface PurchaseGoodsAttachment {
	id: string;
	name: string;
	fileType: PurchaseDocumentFileType;
	url?: string;
}

/**
 * One row of the Godsmottagning list, plus the goods detail the ticket
 * description asks the drawer to show.
 *
 * Prices are in SEK. The description writes "€1,200", but every other money
 * value in this app is SEK — flagged on the ticket rather than mixing currencies.
 */
export interface PurchaseGoodsReceptionRow {
	id: string;
	/** The order or project the purchase belongs to. */
	object: string;
	purchaseNo: string;
	name: string;
	supplier: string;
	/** ISO date the delivery is expected. */
	expectedDelivery: string;
	orderType: PurchaseGoodsReceptionOrderType;
	/** Archived rows drop out of the list; the module has its own Arkiv tab. */
	archived: boolean;

	// Drawer: general info
	description: string;
	category: PurchaseGoodsCategory;
	/** Part number. */
	sku: string;

	// Drawer: pricing and logistics
	unitPrice: number;
	leadTimeDays: number;
	/** Minimum order quantity (MOQ). */
	minimumOrderQuantity: number;
	bulkDiscounts: PurchaseGoodsDiscountTier[];

	attachments: PurchaseGoodsAttachment[];
}

/**
 * Status of a single line within a purchase, from the frame's Status column.
 * Distinct from `PurchaseStatus`, which describes the whole purchase.
 */
export type PurchaseLineStatus =
	| "ordered"
	| "in_progress"
	| "delivered"
	| "monitoring";

/**
 * One line of a purchase — the rows of the record page's Inköpslista.
 *
 * Dates are ISO or empty; the frame prints "-" for a missing one, which is a
 * rendering concern rather than something to store.
 */
export interface PurchaseLineRow {
	id: string;
	/** The purchase this line belongs to, e.g. "I501". */
	purchaseId: string;
	/** Line number, numbered from the parent purchase: "I501-001". */
	lineNo: string;
	designation: string;
	supplier: string;
	purchaseDate: string;
	deliveryDate: string;
	estimatedDelivery: string;
	/** Set only while the line is being chased. */
	monitoringDate: string;
	status: PurchaseLineStatus;
	/** Archived rows drop out of the list; the module has its own Arkiv tab. */
	archived: boolean;
}

/**
 * One row of a purchase order's Specifikation table.
 *
 * Quantity and unit price are held as strings because they are edited through
 * text inputs; parsing at the edge keeps an empty or non-numeric entry from
 * silently becoming 0 or NaN in the totals. The frame prints a Delsumma that
 * does not match its own inputs, so it is always computed, never stored.
 */
export interface PurchaseOrderSpecLine {
	id: string;
	/** The buyer's own article number. */
	articleNo: string;
	supplierArticleNo: string;
	designation: string;
	quantity: string;
	unit: string;
	unitPrice: string;
}

/**
 * A named contact on a purchase document — a complaint's reporter, a purchase
 * order's orderer. One shape, because every screen collects the same fields.
 */
export interface PurchaseContactPerson {
	/** Id of the picked existing contact, or "" when entering a new one. */
	contactId: string;
	firstName: string;
	lastName: string;
	address: string;
	postalCode: string;
	email: string;
	phone: string;
	city: string;
	role: string;
}

/**
 * The Calculation card on a purchase's Information section. Every field is a
 * display string; absent values are stored empty and dashed at render.
 */
export interface PurchaseCalculationInfo {
	calculationNo: string;
	orderer: string;
	/** ISO 8601 date (`YYYY-MM-DD`), or `""` when none is recorded. */
	quoteDate: string;
	type: string;
	/** Already-formatted amount, e.g. `"486 000"`. Not parsed or summed. */
	quoteAmount: string;
	category: string;
	status: PurchaseStatus;
}

/** The Quote card. */
export interface PurchaseQuoteInfo {
	idNo: string;
	job: string;
	/** ISO 8601 date (`YYYY-MM-DD`), or `""` when none is recorded. */
	date: string;
	type: string;
	inquiry: string;
	municipality: string;
	category: string;
}

/** The Order card. */
export interface PurchaseOrderInfo {
	orderNo: string;
	orderName: string;
	customer: string;
	type: string;
	status: string;
	telephone: string;
	/** Already-formatted amount, e.g. `"486 000"`. Not parsed or summed. */
	orderAmount: string;
	projectManager: string;
	/** ISO 8601 date (`YYYY-MM-DD`), or `""` when none is recorded. */
	startDate: string;
	/** ISO 8601 date (`YYYY-MM-DD`), or `""` when none is recorded. */
	endDate: string;
}

/** Everything the record's Information section shows, for one purchase. */
export interface PurchaseInformation {
	purchaseId: string;
	calculation: PurchaseCalculationInfo;
	quote: PurchaseQuoteInfo;
	order: PurchaseOrderInfo;
}
