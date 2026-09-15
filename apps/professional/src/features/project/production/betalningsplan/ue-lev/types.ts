import type { PaymentTerms } from "../types";

/** Where a subcontractor's or supplier's plan stands with the project. */
export type SupplierPlanStatus = "approved" | "under_review" | "not_ready";

/**
 * The Ekonomi column: paid, invoiced but not yet due, or nothing to say yet.
 * Stored as the supplier reported it, since the project cannot derive it.
 */
export type SupplierEconomy = "paid" | "not_due" | "not_applicable";

/** One row of Aconto lyft — a payment the project owes the supplier. */
export interface SupplierAconto {
	id: string;
	/** `yyyy-MM-dd`. */
	date: string;
	activity: string;
	lift: string;
	/** Whole kronor. */
	amount: number;
	retained: number;
	economy: SupplierEconomy;
	/** `yyyy-MM-dd`, set once paid. */
	paidDate?: string;
}

/** A payment plan document the supplier sent, with the project's review tick. */
export interface SupplierPlanDocument {
	id: string;
	planNumber: number;
	name: string;
	fileName: string;
	reviewed: boolean;
}

/** A subcontractor's or supplier's payment plan on a project. */
export interface SupplierPaymentPlan {
	id: string;
	projectId: string;
	companyName: string;
	/** The plan's total, whole kronor — the list's Total column. */
	totalAmount: number;
	status: SupplierPlanStatus;
	createdBy: string;
	/** `yyyy-MM-dd`. */
	createdDate: string;
	/** `yyyy-MM-dd`. */
	revisedDate: string;
	/** `yyyy-MM-dd`, set on approval. */
	approvedDate?: string;
	terms: PaymentTerms;
	acontos: SupplierAconto[];
	documents: SupplierPlanDocument[];
}
