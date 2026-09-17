import type {
	AtaAttested,
	AtaClient,
	AtaDocument,
	AtaLineItems,
	AtaProjectInfo,
	SupplierAtaStatus,
} from "../types";

/** A subcontractor or supplier working on the project. */
export interface AtaSupplier {
	id: string;
	projectId: string;
	name: string;
}

/**
 * An ÄTA a subcontractor or supplier sent the project. The project reviews its
 * rows, links it to one of its own customer ÄTAs, and approves it. Belopp is
 * derived from the rows, as on a customer ÄTA.
 */
export interface SupplierAta {
	id: string;
	projectId: string;
	supplierId: string;
	/** The sender's own number, shown "001". */
	number: number;
	status: SupplierAtaStatus;
	attested: AtaAttested;
	/** `yyyy-MM-dd`, or `""` until attested. */
	attestDate: string;
	/** The project's customer ÄTA this one belongs to — the one place the link is stored. */
	linkedCustomerAtaId: string | null;
	client: AtaClient;
	info: AtaProjectInfo;
	createdBy: string;
	createdDate: string;
	revisedDate: string;
	lineItems: AtaLineItems;
	documents: AtaDocument[];
}

/** What the project may change before approving: rows, document names, the link. */
export interface SupplierAtaInput {
	lineItems: AtaLineItems;
	documents: { id: string; documentName: string }[];
	linkedCustomerAtaId: string | null;
}

/** One company row of the grouped table. */
export interface SupplierGroupRow {
	supplier: AtaSupplier;
	total: number;
	count: number;
	approved: number;
	inReview: number;
	notApproved: number;
}

/** One ÄTA row of a selected supplier's table. */
export interface SupplierAtaRow {
	ata: SupplierAta;
	amount: number;
	/** The linked customer ÄTA's number, or `null` when unlinked or the link no longer resolves. */
	linkedNumber: number | null;
}
