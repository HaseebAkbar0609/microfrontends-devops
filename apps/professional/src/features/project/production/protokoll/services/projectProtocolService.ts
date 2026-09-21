import { generateTempId } from "@/lib/tempId";
import { fileRejection, mintTypedUrl, revokeUrls } from "../../../shared/recordFiles";
import { SEEDED_PROJECT_PROTOCOLS } from "../data/projectProtocols.mock";
import { PROTOCOL_FILE_RULES, PROTOCOL_KINDS, PROTOCOL_NAME_MAX_LENGTH, PROTOCOL_TYPES } from "../projectProtocol.config";
import type { ProjectProtocol, ProjectProtocolInput } from "../types";

/**
 * The project's protocols, in memory.
 *
 * There is no protocol endpoint for a project — the order module's are
 * order-scoped — so this stands in for one, as the record's other sections'
 * services do: a module-level array every read goes through, each mutator
 * reassigning it. A change survives a visit to another section; a hard reload
 * resets to the seed. Nothing is persisted to browser storage (AGENTS.md
 * rule 6).
 *
 * It also stands in for the upload endpoint, so it owns the PDFs' `blob:`
 * URLs: minted when an upload is stored, revoked when the protocol is deleted.
 * Archiving keeps them, since the protocol can come back.
 */
let protocols: ProjectProtocol[] = SEEDED_PROJECT_PROTOCOLS.map((row) => ({ ...row }));

/** Newest first: ISO dates sort as text, and ties keep their stored order. */
export function listProtocols(projectId: string): ProjectProtocol[] {
	return protocols
		.filter((row) => row.projectId === projectId)
		.sort((a, b) => b.date.localeCompare(a.date))
		.map((row) => ({ ...row }));
}

/**
 * Stores a protocol, or refuses one the dialog should already have stopped: a
 * missing day, an unknown kind or type, a blank or overlong name, an upload
 * without a valid PDF, or a PDF on a Standard or Action protocol. The form's
 * checks run in the browser; these stand where the endpoint's would.
 */
export function createProtocol(projectId: string, input: ProjectProtocolInput): ProjectProtocol | undefined {
	const name = input.name.trim();
	if (!input.date || !name || name.length > PROTOCOL_NAME_MAX_LENGTH) return undefined;
	if (!(PROTOCOL_KINDS as readonly string[]).includes(input.kind)) return undefined;
	if (!(PROTOCOL_TYPES as readonly string[]).includes(input.type)) return undefined;

	const upload = input.kind === "upload";
	if (upload !== Boolean(input.file)) return undefined;
	if (input.file && fileRejection(input.file, PROTOCOL_FILE_RULES)) return undefined;

	const protocol: ProjectProtocol = {
		id: generateTempId(),
		projectId,
		kind: input.kind,
		date: input.date,
		type: input.type,
		name,
		fileName: input.file?.name,
		url: input.file ? mintTypedUrl(input.file, PROTOCOL_FILE_RULES.types) : undefined,
		archived: false,
	};
	protocols = [protocol, ...protocols];
	return { ...protocol };
}

/** Reversible, so the list asks no confirm. */
export function setProtocolArchived(projectId: string, id: string, archived: boolean): void {
	protocols = protocols.map((row) => (row.projectId === projectId && row.id === id ? { ...row, archived } : row));
}

/** Permanent, file included. Keep it behind a confirm. */
export function removeProtocol(projectId: string, id: string): void {
	const target = protocols.find((row) => row.projectId === projectId && row.id === id);
	if (!target) return;
	protocols = protocols.filter((row) => row !== target);
	revokeUrls([target]);
}
