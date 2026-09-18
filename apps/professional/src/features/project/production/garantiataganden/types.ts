/**
 * A warranty commitment: a day the project has promised something after
 * handover — a two-year follow-up, a five-year inspection — and what it is
 * called. The frame draws only these two columns.
 */
export interface WarrantyCommitment {
	id: string;
	projectId: string;
	/** `yyyy-MM-dd`. */
	date: string;
	/** Benämning, as the reader writes it. */
	name: string;
}

/** A commitment as the dialog hands it over. */
export interface WarrantyCommitmentInput {
	date: string;
	name: string;
}
