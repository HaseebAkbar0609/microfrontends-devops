import { generateTempId } from "@/lib/tempId";
import { fileRejection, mintTypedUrl, revokeUrls } from "../../../shared/recordFiles";
import { SEEDED_WARRANTY_COMMITMENTS } from "../data/projectWarrantyCommitments.mock";
import { WARRANTY_FILE_RULES, WARRANTY_NAME_MAX_LENGTH } from "../projectWarranty.config";
import type { WarrantyCommitment, WarrantyCommitmentInput, WarrantyDocument, WarrantyDocumentInput } from "../types";

/** A copy, so neither the seed nor a caller holding a row can be written through. */
const copy = (row: WarrantyCommitment): WarrantyCommitment => ({
	...row,
	reminderEmails: [...row.reminderEmails],
	reminderContacts: [...row.reminderContacts],
	documents: row.documents.map((doc) => ({ ...doc })),
});

/**
 * The project's warranty commitments, in memory.
 *
 * There is no warranty endpoint for a project — the order module's guarantee
 * paths are order-scoped — so this stands in for one, as the record's other
 * sections' services do: a module-level array every read goes through, each
 * mutator reassigning it. A change survives a visit to another section; a hard
 * reload resets to the seed. Nothing is persisted to browser storage
 * (AGENTS.md rule 6).
 *
 * It also stands in for the upload endpoint, so it owns the documents' `blob:`
 * URLs: minted when one is stored, revoked when it is deleted.
 */
let commitments: WarrantyCommitment[] = SEEDED_WARRANTY_COMMITMENTS.map(copy);

const clean = (input: WarrantyCommitmentInput) => ({ date: input.date, name: input.name.trim() });

/** Newest day first: ISO dates sort as text, and ties keep their stored order. */
export function listCommitments(projectId: string): WarrantyCommitment[] {
	return commitments
		.filter((row) => row.projectId === projectId)
		.sort((a, b) => b.date.localeCompare(a.date))
		.map(copy);
}

/** The detail page's read. `undefined` for an id that is not this project's, which 404s. */
export function getCommitment(projectId: string, id: string): WarrantyCommitment | undefined {
	const row = commitments.find((item) => item.projectId === projectId && item.id === id);
	return row ? copy(row) : undefined;
}

/**
 * Refused (`undefined`) when the dialog's checks were somehow skipped. The
 * detail page's fields start empty: the frame's create dialog asks only for the
 * day and the name, and nothing else has a source to fill them from.
 */
export function createCommitment(projectId: string, input: WarrantyCommitmentInput): WarrantyCommitment | undefined {
	const values = clean(input);
	if (!values.date || !values.name) return undefined;

	const commitment: WarrantyCommitment = {
		id: generateTempId(),
		projectId,
		...values,
		responsible: "",
		approvedDate: "",
		periodLabel: "",
		endDate: "",
		reminderDate: "",
		reminderEmails: [],
		reminderContacts: [],
		documents: [],
	};
	commitments = [...commitments, commitment];
	return copy(commitment);
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
	return copy(next);
}

/** Permanent, the documents' files included. Keep it behind a confirm. */
export function removeCommitment(projectId: string, id: string): void {
	const target = commitments.find((row) => row.projectId === projectId && row.id === id);
	if (!target) return;
	commitments = commitments.filter((row) => row !== target);
	revokeUrls(target.documents);
}

/** Replaces one commitment, leaving the rest of the store alone. */
function writeCommitment(previous: WarrantyCommitment, next: WarrantyCommitment): WarrantyCommitment {
	commitments = commitments.map((row) => (row === previous ? next : row));
	return copy(next);
}

/**
 * Stores a document dated today, or refuses one the dialog should already have
 * stopped: a blank or overlong name, or a file of the wrong type or size. The
 * form's checks run in the browser; these stand where the endpoint's would.
 */
export function addDocument(
	projectId: string,
	id: string,
	input: WarrantyDocumentInput,
	today: string,
): WarrantyCommitment | undefined {
	const previous = commitments.find((row) => row.projectId === projectId && row.id === id);
	const name = input.name.trim();
	if (!previous || !name || name.length > WARRANTY_NAME_MAX_LENGTH) return undefined;
	if (fileRejection(input.file, WARRANTY_FILE_RULES)) return undefined;

	const document: WarrantyDocument = {
		id: generateTempId(),
		date: today,
		name,
		fileName: input.file.name,
		url: mintTypedUrl(input.file, WARRANTY_FILE_RULES.types),
	};
	return writeCommitment(previous, { ...previous, documents: [document, ...previous.documents] });
}

/** Redigera changes the Benämning only — the stored file stays as it is. */
export function renameDocument(
	projectId: string,
	id: string,
	documentId: string,
	name: string,
): WarrantyCommitment | undefined {
	const previous = commitments.find((row) => row.projectId === projectId && row.id === id);
	const trimmed = name.trim();
	if (!previous || !trimmed || trimmed.length > WARRANTY_NAME_MAX_LENGTH) return undefined;
	if (!previous.documents.some((doc) => doc.id === documentId)) return undefined;

	return writeCommitment(previous, {
		...previous,
		documents: previous.documents.map((doc) => (doc.id === documentId ? { ...doc, name: trimmed } : doc)),
	});
}

/** Permanent, file included. Keep it behind a confirm. */
export function removeDocument(projectId: string, id: string, documentId: string): WarrantyCommitment | undefined {
	const previous = commitments.find((row) => row.projectId === projectId && row.id === id);
	const target = previous?.documents.find((doc) => doc.id === documentId);
	if (!previous || !target) return undefined;

	const next = writeCommitment(previous, { ...previous, documents: previous.documents.filter((doc) => doc !== target) });
	revokeUrls([target]);
	return next;
}
