import { editBlockReason, supplierApproveBlockReason } from "../../ataRules";
import type { SupplierAtaLinkRef } from "../../ataView";
import { SEEDED_ATA_SUPPLIERS } from "../data/ataSuppliers.mock";
import { SEEDED_SUPPLIER_ATAS } from "../data/supplierAtas.mock";
import type { AtaSupplier, SupplierAta, SupplierAtaInput } from "../types";

/**
 * The ÄTAs subcontractors and suppliers have sent each project, in memory.
 *
 * There is no endpoint, so this stands in for one, as `projectAtaService` does
 * for the project's own ÄTAs: module-level arrays every read goes through, each
 * mutator reassigning them. Nothing is persisted to browser storage (AGENTS.md
 * rule 6); a hard reload resets to the seed.
 *
 * It never imports the customer-ÄTA store. A link is checked against the ids
 * the caller passes in, and removing a customer ÄTA calls `unlinkCustomerAta`
 * from the caller — so neither store depends on the other.
 */
const suppliers: AtaSupplier[] = SEEDED_ATA_SUPPLIERS.map((supplier) => ({ ...supplier }));
let atas: SupplierAta[] = SEEDED_SUPPLIER_ATAS.map((ata) => structuredClone(ata));

const order = new Map(suppliers.map((supplier, index) => [supplier.id, index]));
const byRegistryThenNumber = (a: SupplierAta, b: SupplierAta) =>
	(order.get(a.supplierId) ?? 0) - (order.get(b.supplierId) ?? 0) || a.number - b.number;

function find(projectId: string, id: string): SupplierAta | undefined {
	return atas.find((ata) => ata.projectId === projectId && ata.id === id);
}

function replace(next: SupplierAta): SupplierAta {
	atas = atas.map((ata) => (ata.id === next.id ? next : ata));
	return next;
}

export function listSuppliers(projectId: string): AtaSupplier[] {
	return suppliers.filter((supplier) => supplier.projectId === projectId);
}

export function getSupplier(projectId: string, supplierId: string): AtaSupplier | undefined {
	return suppliers.find((supplier) => supplier.projectId === projectId && supplier.id === supplierId);
}

/** In the grouped frame's supplier order, then by the sender's number. */
export function listSupplierAtas(projectId: string, supplierId?: string): SupplierAta[] {
	return atas
		.filter((ata) => ata.projectId === projectId && (!supplierId || ata.supplierId === supplierId))
		.sort(byRegistryThenNumber);
}

/** Scoped to the project, so another project's ÄTA is not found. */
export function getSupplierAta(projectId: string, id: string): SupplierAta | undefined {
	return find(projectId, id);
}

/** Every link to a customer ÄTA, for the customer list's "Kopplad Lev-äta". */
export function listCustomerLinks(projectId: string): SupplierAtaLinkRef[] {
	return listSupplierAtas(projectId).flatMap((ata) =>
		ata.linkedCustomerAtaId
			? [{ customerAtaId: ata.linkedCustomerAtaId, supplierName: getSupplier(projectId, ata.supplierId)?.name ?? "", number: ata.number }]
			: [],
	);
}

/**
 * Saves what the project may change: rows, document names (stored documents
 * only, by id — there is no removal here) and the link. Refused once locked, or
 * when the link names an ÄTA that is not among `customerAtaIds`.
 */
export function updateSupplierAta(
	projectId: string,
	id: string,
	input: SupplierAtaInput,
	context: { today: string; customerAtaIds: readonly string[] },
): SupplierAta | undefined {
	const ata = find(projectId, id);
	if (!ata || editBlockReason(ata.status)) return undefined;
	if (input.linkedCustomerAtaId !== null && !context.customerAtaIds.includes(input.linkedCustomerAtaId)) return undefined;

	const names = new Map(input.documents.map((doc) => [doc.id, doc.documentName]));
	return replace({
		...ata,
		lineItems: structuredClone(input.lineItems),
		documents: ata.documents.map((doc) => ({ ...doc, documentName: names.get(doc.id) ?? doc.documentName })),
		linkedCustomerAtaId: input.linkedCustomerAtaId,
		revisedDate: context.today,
	});
}

/** Godkänna: OK, attested today. Refused when already settled or with nothing to price. */
export function approveSupplierAta(projectId: string, id: string, today: string): SupplierAta | undefined {
	const ata = find(projectId, id);
	if (!ata || supplierApproveBlockReason(ata.status, ata.lineItems)) return undefined;
	return replace({ ...ata, status: "ok", attested: "ja", attestDate: today });
}

/**
 * A customer ÄTA was deleted: every supplier ÄTA pointing at it becomes
 * unlinked, settled ones included — a dangling link helps no one.
 */
export function unlinkCustomerAta(projectId: string, customerAtaId: string): number {
	let cleared = 0;
	atas = atas.map((ata) => {
		if (ata.projectId !== projectId || ata.linkedCustomerAtaId !== customerAtaId) return ata;
		cleared += 1;
		return { ...ata, linkedCustomerAtaId: null };
	});
	return cleared;
}
