import { generateTempId } from "@/lib/tempId";
import { fileRejection, mintTypedUrl, revokeUrls } from "../../../shared/recordFiles";
import { SEEDED_PROJECT_DOCUMENTS } from "../data/projectDocuments.mock";
import { DOCUMENT_FILE_RULES, DOCUMENT_NAME_MAX_LENGTH, DRAWING_NUMBER_MAX_LENGTH } from "../projectDocuments.config";
import type { ProjectDocument, ProjectDocumentInput } from "../types";

/**
 * The project's documents, drawings and contracts, in memory.
 *
 * There is no documents endpoint, so this stands in for one, as
 * `projectInspectionService` does: a module-level array every read goes
 * through, each mutator reassigning it. A change survives a visit to another
 * section of the record; a hard reload resets to the seed. Nothing is persisted
 * to browser storage (AGENTS.md rule 6).
 *
 * It also stands in for the upload endpoint, so it owns the files' `blob:`
 * URLs: minted when an upload is stored, revoked when the file is deleted.
 * Archiving keeps them, since the file can come back.
 */
let documents: ProjectDocument[] = SEEDED_PROJECT_DOCUMENTS.map((doc) => ({ ...doc }));

/** Newest first: ISO dates sort as text, and ties keep their stored order. */
export function listDocuments(projectId: string): ProjectDocument[] {
	return documents.filter((doc) => doc.projectId === projectId).sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Stores an upload, or refuses one the dialog should already have stopped: a
 * blank or overlong name, a drawing without a category (or anything else with
 * one), or a file of the wrong type or size. The form's checks run in the
 * browser; these stand where the endpoint's would.
 */
export function createDocument(
	projectId: string,
	input: ProjectDocumentInput,
	meta: { createdBy: string; today: string },
): ProjectDocument | undefined {
	const name = input.name.trim();
	const isDrawing = input.kind === "ritning";
	const maxLength = isDrawing ? DRAWING_NUMBER_MAX_LENGTH : DOCUMENT_NAME_MAX_LENGTH;
	if (!name || name.length > maxLength) return undefined;
	if (isDrawing !== Boolean(input.category)) return undefined;
	if (fileRejection(input.file, DOCUMENT_FILE_RULES)) return undefined;

	const document: ProjectDocument = {
		id: generateTempId(),
		projectId,
		kind: input.kind,
		date: meta.today,
		name,
		category: isDrawing ? input.category : null,
		fileName: input.file.name,
		url: mintTypedUrl(input.file, DOCUMENT_FILE_RULES.types),
		createdBy: meta.createdBy,
		archived: false,
	};
	documents = [document, ...documents];
	return document;
}

export function setDocumentArchived(projectId: string, id: string, archived: boolean): void {
	documents = documents.map((doc) => (doc.projectId === projectId && doc.id === id ? { ...doc, archived } : doc));
}

/** Permanent, file included. Keep it behind a confirm. */
export function removeDocument(projectId: string, id: string): void {
	const target = documents.find((doc) => doc.projectId === projectId && doc.id === id);
	if (!target) return;
	documents = documents.filter((doc) => doc !== target);
	revokeUrls([target]);
}
