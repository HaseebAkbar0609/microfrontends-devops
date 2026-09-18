import { generateTempId } from "@/lib/tempId";
import { SEEDED_WARRANTY_COMMITMENTS } from "../data/projectWarrantyCommitments.mock";
import type { WarrantyCommitment, WarrantyCommitmentInput } from "../types";

/**
 * The project's warranty commitments, in memory.
 *
 * There is no warranty endpoint for a project — the order module's guarantee
 * paths are order-scoped — so this stands in for one, as the record's other
 * sections' services do: a module-level array every read goes through, each
 * mutator reassigning it. A change survives a visit to another section; a hard
 * reload resets to the seed. Nothing is persisted to browser storage
 * (AGENTS.md rule 6).
 */
let commitments: WarrantyCommitment[] = SEEDED_WARRANTY_COMMITMENTS.map((row) => ({ ...row }));

const clean = (input: WarrantyCommitmentInput) => ({ date: input.date, name: input.name.trim() });

/** Newest day first: ISO dates sort as text, and ties keep their stored order. */
export function listCommitments(projectId: string): WarrantyCommitment[] {
	return commitments
		.filter((row) => row.projectId === projectId)
		.sort((a, b) => b.date.localeCompare(a.date))
		.map((row) => ({ ...row }));
}

/** Refused (`undefined`) when the dialog's checks were somehow skipped. */
export function createCommitment(projectId: string, input: WarrantyCommitmentInput): WarrantyCommitment | undefined {
	const values = clean(input);
	if (!values.date || !values.name) return undefined;

	const commitment: WarrantyCommitment = { id: generateTempId(), projectId, ...values };
	commitments = [...commitments, commitment];
	return { ...commitment };
}

export function updateCommitment(
	projectId: string,
	id: string,
	input: WarrantyCommitmentInput,
): WarrantyCommitment | undefined {
	const previous = commitments.find((row) => row.projectId === projectId && row.id === id);
	const values = clean(input);
	if (!previous || !values.date || !values.name) return undefined;

	const next: WarrantyCommitment = { ...previous, ...values };
	commitments = commitments.map((row) => (row === previous ? next : row));
	return { ...next };
}

/** Permanent. Keep it behind a confirm. */
export function removeCommitment(projectId: string, id: string): void {
	commitments = commitments.filter((row) => !(row.projectId === projectId && row.id === id));
}
