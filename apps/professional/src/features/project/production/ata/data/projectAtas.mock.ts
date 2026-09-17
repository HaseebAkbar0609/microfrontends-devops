import { mockDate } from "../../../constants/mockData";
import type { ProjectAta } from "../types";
import { balancedLineItems, emptyLineItems, seedAta, seedRow } from "./ataSeed";

/**
 * ÄTAs on each project's record.
 *
 * 5001 carries the frame's six rows with their exact Belopp, statuses and
 * attestations; each is built from staff, material, machine and UE rows plus a
 * balancing ÄTA-leverantör row (see `ataSeed`). Their "Kopplad Lev-äta" is not
 * stored here: it is read from the supplier ÄTAs that link to them.
 * 5000 has a draft and one sent for negotiation; 5002 has none, for the empty
 * state. Dates come from `mockDate` — never `new Date()` in a mock.
 */

const PELLE = { supplier: "Pelle Målare", invoiceNo: "001" };
const ROR = { supplier: "Rörmokare", invoiceNo: "017" };

const alex = (id: string, hours: number) =>
	seedRow(id, { party: "Alex Miller", quantity: hours, netPrice: 650, description: "Arbete badrum", activity: "Montage", location: "Badrum" });
const sara = (id: string, hours: number) =>
	seedRow(id, { party: "Sara Lind", quantity: hours, netPrice: 650, description: "Arbete kök", activity: "Montage", location: "Kök" });
const johan = (id: string, hours: number) =>
	seedRow(id, { party: "Johan Berg", quantity: hours, netPrice: 600, description: "Rivning", activity: "Rivning", location: "Kök" });
const material = (id: string, net: number, supplier = "Beijer Byggmaterial") =>
	seedRow(id, { party: supplier, quantity: 1, unit: "st", netPrice: net, invoiceNo: "F-2041", description: "Material enligt faktura" });
const machine = (id: string, days: number) =>
	seedRow(id, { party: "Ramirent", quantity: days, unit: "dag", netPrice: 1_800, invoiceNo: "R-5520", description: "Hyra lift" });
const ue = (id: string, net: number) =>
	seedRow(id, { party: "Elektriker AB", quantity: 1, unit: "st", netPrice: net, invoiceNo: "E-118", description: "Elarbeten" });

export const SEEDED_PROJECT_ATAS: ProjectAta[] = [
	seedAta({
		id: "ata-5001-100", projectId: "5001", number: 100, status: "ok", attested: "ja",
		createdDate: mockDate(-60),
		lineItems: balancedLineItems("5001-100", 158_680, {
			staff: [alex("a100-s1", 40), sara("a100-s2", 24)],
			material: [material("a100-m1", 42_000)],
			machines: [machine("a100-k1", 5)],
			ue: [ue("a100-u1", 30_000)],
		}, PELLE),
		documents: [
			{ id: "a100-d1", date: mockDate(-55), documentName: "Tidrapport", fileName: "Tidrapport.pdf" },
			{ id: "a100-d2", date: mockDate(-55), documentName: "El-faktura", fileName: "Faktura Elektriker.pdf" },
		],
		supplierInvoiceIds: ["inv-5001-001", "inv-5001-002"],
		timeReportIds: ["tr-5001-01", "tr-5001-02"],
	}),
	seedAta({
		id: "ata-5001-101", projectId: "5001", number: 101, status: "redovisad", attested: "ja",
		createdDate: mockDate(-52),
		lineItems: balancedLineItems("5001-101", 145_630, {
			staff: [alex("a101-s1", 16), sara("a101-s2", 16)],
			material: [material("a101-m1", 38_500)],
			machines: [machine("a101-k1", 3)],
		}, PELLE),
	}),
	seedAta({
		id: "ata-5001-102", projectId: "5001", number: 102, status: "ok", attested: "ja",
		createdDate: mockDate(-45),
		lineItems: balancedLineItems("5001-102", 56_250, {
			staff: [alex("a102-s1", 8)],
			material: [material("a102-m1", 12_000, "Dahl")],
		}, ROR),
	}),
	seedAta({
		id: "ata-5001-103", projectId: "5001", number: 103, status: "forhandling", attested: "ej_klart",
		createdDate: mockDate(-30),
		revisedDate: mockDate(-25),
		lineItems: balancedLineItems("5001-103", 25_690, {
			staff: [sara("a103-s1", 6)],
			material: [material("a103-m1", 4_000, "Dahl")],
		}, ROR),
	}),
	seedAta({
		id: "ata-5001-104", projectId: "5001", number: 104, status: "ok", attested: "ej_klart",
		createdDate: mockDate(-20),
		lineItems: balancedLineItems("5001-104", 158_680, {
			staff: [alex("a104-s1", 40), sara("a104-s2", 40), johan("a104-s3", 20)],
			machines: [machine("a104-k1", 10)],
		}, ROR),
	}),
	seedAta({
		id: "ata-5001-105", projectId: "5001", number: 105, status: "redovisad", attested: "ej_klart",
		createdDate: mockDate(-10),
		lineItems: balancedLineItems("5001-105", 158_680, {
			material: [material("a105-m1", 80_000)],
			ue: [ue("a105-u1", 40_000)],
		}, ROR),
	}),
	seedAta({
		id: "ata-5000-1", projectId: "5000", number: 1, status: "utkast", attested: "ej_klart",
		createdDate: mockDate(-6),
		lineItems: { ...emptyLineItems(), staff: [johan("a5000-1-s1", 8)], material: [material("a5000-1-m1", 2_000)] },
	}),
	seedAta({
		id: "ata-5000-2", projectId: "5000", number: 2, status: "forhandling", attested: "ej_klart",
		createdDate: mockDate(-3),
		lineItems: { ...emptyLineItems(), ue: [ue("a5000-2-u1", 15_000)], machines: [machine("a5000-2-k1", 2)] },
	}),
];
