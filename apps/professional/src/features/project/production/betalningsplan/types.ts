/** A plan is edited as a draft until it is sent to the client. */
export type PaymentPlanStatus = "draft" | "sent";

/**
 * The plan's commercial terms, as the Betalningsplan card shows them.
 *
 * Amounts are whole kronor held as integers, so sums never accumulate
 * floating-point error; percentages are whole numbers.
 */
export interface PaymentTerms {
	contractSum: number;
	/** Retained from each aconto — "Innehållna medel per aconto". */
	retentionPerAcontoPercent: number;
	/** The retention ceiling — "Totalt innehållet av kontrakt summa". */
	retentionTotalPercent: number;
	/**
	 * The "Belopp" under the per-aconto panel: a fixed amount retained per
	 * aconto in place of the percentage. 0 means the percentage applies.
	 */
	retentionFixedAmount: number;
}

/** One row of Innehöll medel — a payment request against the contract. */
export interface PaymentAconto {
	id: string;
	/** `yyyy-MM-dd`. */
	date: string;
	activity: string;
	/** "Lyft" — the stage the payment is for, e.g. Grund or Stomme. */
	lift: string;
	amount: number;
	/** Held back from this aconto; stored, not derived, so it cannot drift. */
	retained: number;
	/** Set once the aconto has been invoiced — the frame's "Skickad". */
	invoicedDate?: string;
	/** Paid by the client. Only meaningful once invoiced. */
	paid: boolean;
}

export interface PaymentPlanDocument {
	id: string;
	/** `yyyy-MM-dd`. */
	date: string;
	/** Translation key naming the kind of document. */
	typeKey: string;
	fileName: string;
}

export interface ProjectPaymentPlan {
	id: string;
	projectId: string;
	planNumber: number;
	name: string;
	/** The contract attached when the plan was created, if any. */
	contractFileName?: string;
	createdBy: string;
	/** `yyyy-MM-dd`. */
	createdDate: string;
	/** `yyyy-MM-dd`, moved on every save. */
	revisedDate: string;
	status: PaymentPlanStatus;
	terms: PaymentTerms;
	acontos: PaymentAconto[];
	documents: PaymentPlanDocument[];
}

/** What an aconto's form supplies; retention is worked out from the terms. */
export interface AcontoValues {
	date: string;
	activity: string;
	lift: string;
	amount: number;
}
