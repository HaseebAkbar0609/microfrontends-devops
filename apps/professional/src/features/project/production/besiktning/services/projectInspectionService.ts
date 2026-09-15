import { generateTempId } from "@/lib/tempId";
import { SEEDED_PROJECT_INSPECTIONS } from "../data/projectInspections.mock";
import { mimeTypeFor } from "../inspectionFiles";
import type {
	InspectionDocumentInput,
	InspectionInput,
	ProjectInspection,
	ProjectInspectionDocument,
} from "../types";

/**
 * The project inspections, in memory.
 *
 * There is no project inspection endpoint, so this stands in for one, as
 * `projectQaService` does for questions: a module-level array every read goes
 * through, with each mutator reassigning it. Holding it here keeps a change in
 * place while the reader visits another section of the record; a hard reload
 * resets to the seed. Nothing is persisted to browser storage (AGENTS.md rule 6).
 *
 * It also stands in for the upload endpoint, so it owns the files' `blob:`
 * URLs: minted only when a save stores a file, revoked when that file is
 * removed from its inspection or the inspection is deleted. Archiving keeps
 * them, since the row can come back.
 */
let inspections: ProjectInspection[] = SEEDED_PROJECT_INSPECTIONS.map((row) => ({
	...row,
	documents: row.documents.map((doc) => ({ ...doc })),
}));

function find(projectId: string, id: string): ProjectInspection | undefined {
	return inspections.find((row) => row.projectId === projectId && row.id === id);
}

function revokeUrls(documents: ProjectInspectionDocument[]): void {
	for (const doc of documents) {
		if (doc.url) URL.revokeObjectURL(doc.url);
	}
}

/**
 * Turns the dialog's documents into stored ones. A newly picked file gets a URL
 * served as its extension's content type — so a renamed file never opens as
 * HTML. A document already stored keeps its URL, looked up by id; an id this
 * inspection never had is dropped rather than trusted.
 */
function storeDocuments(
	inputs: InspectionDocumentInput[],
	previous: ProjectInspectionDocument[] = [],
): ProjectInspectionDocument[] {
	const stored = new Map(previous.map((doc) => [doc.id, doc]));

	return inputs.flatMap((input): ProjectInspectionDocument[] => {
		if (input.file) {
			const typed = input.file.slice(0, input.file.size, mimeTypeFor(input.name));
			return [{ id: input.id, name: input.name, url: URL.createObjectURL(typed) }];
		}
		const kept = stored.get(input.id);
		return kept ? [kept] : [];
	});
}

/** Newest Datum first: ISO dates sort as text, and ties keep their stored order. */
export function listInspections(projectId: string): ProjectInspection[] {
	return inspections
		.filter((row) => row.projectId === projectId)
		.sort((a, b) => b.date.localeCompare(a.date));
}

export function createInspection(projectId: string, input: InspectionInput): ProjectInspection {
	const inspection: ProjectInspection = {
		id: generateTempId(),
		projectId,
		date: input.date,
		type: input.type,
		inspectionDate: input.inspectionDate,
		documents: storeDocuments(input.documents),
		archived: false,
	};
	inspections = [inspection, ...inspections];
	return inspection;
}

export function updateInspection(
	projectId: string,
	id: string,
	input: InspectionInput,
): ProjectInspection | undefined {
	const previous = find(projectId, id);
	if (!previous) return undefined;

	const documents = storeDocuments(input.documents, previous.documents);
	const next: ProjectInspection = {
		...previous,
		date: input.date,
		type: input.type,
		inspectionDate: input.inspectionDate,
		documents,
	};
	inspections = inspections.map((row) => (row === previous ? next : row));

	const keptIds = new Set(documents.map((doc) => doc.id));
	revokeUrls(previous.documents.filter((doc) => !keptIds.has(doc.id)));
	return next;
}

export function setInspectionArchived(projectId: string, id: string, archived: boolean): void {
	inspections = inspections.map((row) =>
		row.projectId === projectId && row.id === id ? { ...row, archived } : row,
	);
}

/** Permanent, files included. Keep it behind a confirm. */
export function removeInspection(projectId: string, id: string): void {
	const target = find(projectId, id);
	if (!target) return;
	inspections = inspections.filter((row) => row !== target);
	revokeUrls(target.documents);
}
