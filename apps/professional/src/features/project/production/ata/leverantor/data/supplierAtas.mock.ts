import { mockDate } from "../../../../constants/mockData";
import { padAtaNumber } from "../../ataMath";
import { balancedLineItems, SEED_INFO, seedRow } from "../../data/ataSeed";
import type { AtaAttested, AtaDocument, AtaLineItems, SupplierAtaStatus } from "../../types";
import type { SupplierAta } from "../types";

/**
 * ÄTAs each project's subcontractors and suppliers have sent it.
 *
 * Pelle Målare follows the detail frame exactly — six ÄTAs with its amounts,
 * statuses and attestations — with fuller rows and invoice documents so View
 * ÄTA reads like a real one. The other five follow the grouped frame's totals
 * and status mix; the frames disagree on Pelle Målare's count and total, and
 * the detail frame wins. Every Belopp is derived from rows: a balancing
 * material row brings each ÄTA to its total (see `ataSeed`). Links point at
 * 5001's customer ÄTAs 100–105. Dates come from `mockDate` — never `new Date()`.
 */

interface Spec {
	number: number;
	amount: number;
	status: SupplierAtaStatus;
	attested?: AtaAttested;
	link?: string | null;
	rows?: Partial<AtaLineItems>;
	documents?: AtaDocument[];
}

const ATTEST_OFFSET = -20;

/** The project as the supplier's Beställare, in Järfälla — hence the rail's second town. */
const CLIENT = { client: "Fastighetsbolaget AB", name: "Kalle Andersson", address: "Storgatan 10", postalCode: "177 38", city: "Järfälla" };

function build(projectId: string, supplierId: string, supplierName: string, specs: Spec[]): SupplierAta[] {
	return specs.map((spec, index) => {
		const id = `${supplierId}-${padAtaNumber(spec.number)}`;
		const attested = spec.attested ?? (spec.status === "ok" || spec.status === "redovisad" ? "ja" : "ej_klart");
		return {
			id,
			projectId,
			supplierId,
			number: spec.number,
			status: spec.status,
			attested,
			attestDate: attested === "ja" ? mockDate(ATTEST_OFFSET + index) : "",
			linkedCustomerAtaId: spec.link ?? null,
			client: CLIENT,
			info: SEED_INFO,
			createdBy: supplierName,
			createdDate: mockDate(-60 + index),
			revisedDate: "",
			lineItems: balancedLineItems(id, spec.amount, spec.rows ?? {}, { supplier: supplierName, invoiceNo: `F-${padAtaNumber(spec.number)}` }, "material"),
			documents: spec.documents ?? [],
		};
	});
}

const painter = (id: string, name: string, hours: number) =>
	seedRow(id, { party: name, quantity: hours, netPrice: 620, description: "Målning", activity: "Målning", location: "Kök" });
const invoice = (number: number): AtaDocument => ({
	id: `pelle-doc-${number}`,
	date: mockDate(-50 + number),
	documentName: `Faktura ${padAtaNumber(number)}`,
	fileName: `Faktura-${padAtaNumber(number)}.pdf`,
});

const PELLE: Spec[] = [
	{ number: 1, amount: 158_680, status: "ok", link: "ata-5001-100", rows: { staff: [painter("p1-s1", "Pelle Andersson", 60), painter("p1-s2", "Nils Ek", 40)] },
		documents: [invoice(1), { id: "pelle-doc-order", date: mockDate(-51), documentName: "Arbetsorder", fileName: "Arbetsorder-001.docx" }] },
	{ number: 2, amount: 145_630, status: "redovisad", rows: { staff: [painter("p2-s1", "Pelle Andersson", 40), painter("p2-s2", "Nils Ek", 40)] }, documents: [invoice(2)] },
	{ number: 3, amount: 56_250, status: "ok", link: "ata-5001-101", rows: { staff: [painter("p3-s1", "Pelle Andersson", 24)] }, documents: [invoice(3)] },
	{ number: 4, amount: 25_690, status: "forhandling", link: "ata-5001-100", rows: { staff: [painter("p4-s1", "Nils Ek", 16)] }, documents: [invoice(4)] },
	{ number: 5, amount: 158_680, status: "ok", attested: "ej_klart", link: "ata-5001-101", rows: { staff: [painter("p5-s1", "Pelle Andersson", 80)] }, documents: [invoice(5)] },
	{ number: 6, amount: 158_680, status: "ej_granskad", attested: "ej_klart", rows: { staff: [painter("p6-s1", "Pelle Andersson", 40), painter("p6-s2", "Nils Ek", 60)] }, documents: [invoice(6)] },
];

const ROR: Spec[] = [
	{ number: 1, amount: 48_000, status: "ok", link: "ata-5001-102" },
	{ number: 2, amount: 36_500, status: "redovisad", link: "ata-5001-103" },
	{ number: 3, amount: 27_130, status: "forhandling", link: "ata-5001-104" },
	{ number: 4, amount: 18_000, status: "ej_granskad", link: "ata-5001-105" },
	{ number: 5, amount: 16_000, status: "ej_granskad" },
];

const range = (count: number, spec: (number: number) => Spec) => Array.from({ length: count }, (_, i) => spec(i + 1));

export const SEEDED_SUPPLIER_ATAS: SupplierAta[] = [
	...build("5001", "5001-lev-1", "Pelle Målare", PELLE),
	...build("5001", "5001-lev-2", "Rörmokare", ROR),
	...build("5001", "5001-lev-3", "Elektriker", range(25, (n) => ({ number: n, amount: 2_250, status: n <= 20 ? "ok" : "redovisad" }))),
	...build("5001", "5001-lev-4", "Städare", [8_560, 8_560, 8_570].map((amount, i) => ({ number: i + 1, amount, status: "forhandling" as const }))),
	...build("5001", "5001-lev-5", "Köksleverantör", [{ number: 1, amount: 158_680, status: "ok" }]),
	...build("5001", "5001-lev-6", "Sotare", range(2, (n) => ({ number: n, amount: 79_340, status: "ok" }))),
	...build("5000", "5000-lev-1", "Pelles Måleri", [
		{ number: 1, amount: 12_400, status: "ej_granskad", link: "ata-5000-2" },
		{ number: 2, amount: 7_800, status: "ok" },
	]),
];
