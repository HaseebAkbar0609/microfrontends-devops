import { generateTempId } from "@/lib/tempId";
import { mintTypedUrl, revokeUrls } from "../../../shared/recordFiles";
import { editBlockReason, deleteBlockReason, sendBlockReason } from "../ataRules";
import { SEEDED_SUPPLIER_INVOICES, SEEDED_TIME_REPORTS } from "../data/ataReferences.mock";
import { SEEDED_PROJECT_ATAS } from "../data/projectAtas.mock";
import { ATA_FILE_RULES } from "../projectAta.config";
import type { AtaDocument, AtaDocumentInput, AtaInput, AtaReferenceOption, ProjectAta } from "../types";

/**
 * The project ÄTAs, in memory.
 *
 * There is no project ÄTA endpoint, so this stands in for one, as the
 * Besiktning store does: a module-level array every read goes through, with
 * each mutator reassigning it. A change survives a visit to another section
 * of the record; a hard reload resets to the seed. Nothing is persisted to
 * browser storage (AGENTS.md rule 6).
 *
 * Status rules live in `ataRules` and are enforced here as well as in the UI.
 * The store also stands in for the upload endpoint: a file gets its `blob:`
 * URL only when a save stores it, and loses it when removed or deleted.
 */
let atas: ProjectAta[] = SEEDED_PROJECT_ATAS.map((ata) => structuredClone(ata));

function find(projectId: string, id: string): ProjectAta | undefined {
	return atas.find((ata) => ata.projectId === projectId && ata.id === id);
}

function replace(next: ProjectAta): void {
	atas = atas.map((ata) => (ata.id === next.id ? next : ata));
}

/** New files get a typed URL; stored documents keep theirs by id; ids this ÄTA never had are dropped. */
function storeDocuments(inputs: AtaDocumentInput[], previous: AtaDocument[] = []): AtaDocument[] {
	const stored = new Map(previous.map((doc) => [doc.id, doc]));
	return inputs.flatMap((input): AtaDocument[] => {
		const { file, ...fields } = input;
		if (file) return [{ ...fields, url: mintTypedUrl(file, ATA_FILE_RULES.types) }];
		const kept = stored.get(input.id);
		return kept ? [{ ...kept, documentName: input.documentName }] : [];
	});
}

/** Only ids the project's registers actually hold. */
function keepKnown(ids: string[], options: AtaReferenceOption[]): string[] {
	const known = new Set(options.map((option) => option.id));
	return ids.filter((id) => known.has(id));
}

function fieldsOf(projectId: string, input: AtaInput) {
	return {
		client: { ...input.client },
		info: { ...input.info },
		lineItems: structuredClone(input.lineItems),
		supplierInvoiceIds: keepKnown(input.supplierInvoiceIds, listSupplierInvoiceOptions(projectId)),
		timeReportIds: keepKnown(input.timeReportIds, listTimeReportOptions(projectId)),
	};
}

/** In ÄTA-number order, as the frame lists them. */
export function listAtas(projectId: string): ProjectAta[] {
	return atas.filter((ata) => ata.projectId === projectId).sort((a, b) => a.number - b.number);
}

/** Scoped to the project, so another project's ÄTA is not found. */
export function getAta(projectId: string, id: string): ProjectAta | undefined {
	return find(projectId, id);
}

export function nextAtaNumber(projectId: string): number {
	return listAtas(projectId).reduce((max, ata) => Math.max(max, ata.number), 0) + 1;
}

export function createAta(projectId: string, input: AtaInput, meta: { createdBy: string; today: string }): ProjectAta {
	const ata: ProjectAta = {
		...fieldsOf(projectId, input),
		id: generateTempId(),
		projectId,
		number: nextAtaNumber(projectId),
		status: "utkast",
		attested: "ej_klart",
		createdBy: meta.createdBy,
		createdDate: meta.today,
		revisedDate: "",
		documents: storeDocuments(input.documents),
	};
	atas = [...atas, ata];
	return ata;
}

/** Refused once the ÄTA is locked. A change after it was sent stamps Reviderad datum. */
export function updateAta(projectId: string, id: string, input: AtaInput, today: string): ProjectAta | undefined {
	const previous = find(projectId, id);
	if (!previous || editBlockReason(previous.status)) return undefined;

	const documents = storeDocuments(input.documents, previous.documents);
	const next: ProjectAta = {
		...previous,
		...fieldsOf(projectId, input),
		documents,
		revisedDate: previous.status === "forhandling" ? today : previous.revisedDate,
	};
	replace(next);

	const kept = new Set(documents.map((doc) => doc.id));
	revokeUrls(previous.documents.filter((doc) => !kept.has(doc.id)));
	return next;
}

/** Draft → Förhandling, awaiting the customer's attestation. */
export function sendAta(projectId: string, id: string): ProjectAta | undefined {
	const ata = find(projectId, id);
	if (!ata || sendBlockReason(ata.status, ata.lineItems)) return undefined;
	const next: ProjectAta = { ...ata, status: "forhandling", attested: "ej_klart" };
	replace(next);
	return next;
}

/** Permanent, files included. Keep it behind a confirm. */
export function removeAta(projectId: string, id: string): boolean {
	const ata = find(projectId, id);
	if (!ata || deleteBlockReason(ata.status)) return false;
	atas = atas.filter((row) => row !== ata);
	revokeUrls(ata.documents);
	return true;
}

export function listSupplierInvoiceOptions(projectId: string): AtaReferenceOption[] {
	return SEEDED_SUPPLIER_INVOICES[projectId] ?? [];
}

export function listTimeReportOptions(projectId: string): AtaReferenceOption[] {
	return SEEDED_TIME_REPORTS[projectId] ?? [];
}
