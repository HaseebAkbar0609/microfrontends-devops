import localizationConstants from "@/utils/translation/constants";
import type {
	MachineListDetail,
	MachineListRow,
} from "../types/machineHandling.types";
import type { ExternalBookingRow } from "../book/types/bookMachine.types";
import { MOCK_MACHINE_LISTS } from "./machineHandling.mock";

/**
 * In-memory repository for Machine Lists and Details (Standard #6 & #7)
 * Ensures dynamic data resolution for each machine list and persists
 * additions/bookings/deletions within the client session.
 */

type RepositoryListener = () => void;
const listeners = new Set<RepositoryListener>();

function notify() {
	listeners.forEach((l) => {
		try {
			l();
		} catch (e) {
			console.error("Machine handling repo notification error", e);
		}
	});
}

// Initial Mock Details for each list item
const initialDetails: Record<string, MachineListDetail> = {
	"p2025-001": {
		id: "p2025-001",
		projectNo: "P2025-001",
		projectName: "Ombyggnad Fastighet",
		projectAddress: "Storgatan 10",
		postalCode: "175 63",
		city: "Solna",
		startDate: "2024-01-01",
		endDate: "2024-01-01",
		responsibleName: "Kalle Andersson",
		responsibleEmail: "kalle@byggbolaget.se",
		responsiblePhone: "070-563 30 30",
		totalCost: "45 630",
		internalCost: "25 360",
		externalCost: "20 120",
		internalGroups: [
			{
				id: "int-est-p1",
				titleKey: localizationConstants.machineCategoryEstablishment,
				rows: [
					{
						id: "int-est-1",
						machineNo: "M1001",
						name: "Borrmaskin",
						rate: "150 kr / dag",
						deliveryDate: "2025-09-01",
						returnDate: "2025-12-01",
						days: 125,
						cost: "18 750",
						status: "overtime",
					},
					{
						id: "int-est-2",
						machineNo: "K002",
						name: "Skruvdragare",
						rate: "50 kr / dag",
						deliveryDate: "2024-01-01",
						returnDate: "2024-01-01",
						days: 85,
						cost: "4 250",
						status: "returned",
					},
				],
			},
		],
		externalGroups: [
			{
				id: "ext-est-p1",
				titleKey: localizationConstants.machineCategoryEstablishment,
				rows: [
					{
						id: "ext-1",
						machineNo: "M1001",
						name: "Borrmaskin",
						supplier: "Oremo",
						rate: "250 kr / dag",
						deliveryDate: "2025-09-01",
						returnDate: "2025-12-01",
						days: 15,
						cost: "1 850",
						status: "overtime",
					},
				],
			},
		],
	},
	"order-501": {
		id: "order-501",
		projectNo: "Order 501",
		projectName: "Badrumsrenovering",
		projectAddress: "Kungsgatan 14",
		postalCode: "111 43",
		city: "Stockholm",
		startDate: "2025-12-13",
		endDate: "2026-03-01",
		responsibleName: "Anders Larsson",
		responsibleEmail: "anders.larsson@badrum.se",
		responsiblePhone: "070-123 45 67",
		totalCost: "28 400",
		internalCost: "16 000",
		externalCost: "12 400",
		internalGroups: [
			{
				id: "int-hand-501",
				titleKey: localizationConstants.machineCategoryHandTool,
				rows: [
					{
						id: "int-501-1",
						machineNo: "K002",
						name: "Skruvdragare",
						rate: "50 kr / dag",
						deliveryDate: "2025-12-13",
						returnDate: "2026-01-15",
						days: 33,
						cost: "1 650",
						status: "active",
					},
					{
						id: "int-501-2",
						machineNo: "K004",
						name: "Blandare",
						rate: "100 kr / dag",
						deliveryDate: "2025-12-13",
						returnDate: "2026-01-20",
						days: 38,
						cost: "3 800",
						status: "active",
					},
				],
			},
		],
		externalGroups: [
			{
				id: "ext-conc-501",
				titleKey: localizationConstants.machineCategoryConcreteMachines,
				rows: [
					{
						id: "ext-501-1",
						machineNo: "M2040",
						name: "Betongslip",
						supplier: "Ramirent",
						rate: "350 kr / dag",
						deliveryDate: "2025-12-15",
						returnDate: "2026-01-10",
						days: 26,
						cost: "9 100",
						status: "active",
					},
				],
			},
		],
	},
	"servicebil-1": {
		id: "servicebil-1",
		projectNo: "Servicebil 1",
		projectName: "Utryckningsfordon Norr",
		projectAddress: "Hamnvägen 8",
		postalCode: "131 34",
		city: "Nacka",
		startDate: "2025-12-13",
		endDate: "2026-12-31",
		responsibleName: "Erik Lindqvist",
		responsibleEmail: "erik.l@service.se",
		responsiblePhone: "073-987 65 43",
		totalCost: "14 200",
		internalCost: "14 200",
		externalCost: "0",
		internalGroups: [
			{
				id: "int-serv-1",
				titleKey: localizationConstants.machineCategoryHandTool,
				rows: [
					{
						id: "serv1-1",
						machineNo: "M1001",
						name: "Borrmaskin",
						rate: "150 kr / dag",
						deliveryDate: "2025-12-13",
						returnDate: "2026-12-31",
						days: 383,
						cost: "14 200",
						status: "active",
					},
				],
			},
		],
		externalGroups: [],
	},
	"servicebil-2": {
		id: "servicebil-2",
		projectNo: "Servicebil 2",
		projectName: "Installationsfordon Väst",
		projectAddress: "Vasagatan 22",
		postalCode: "753 13",
		city: "Uppsala",
		startDate: "2025-12-13",
		endDate: "2026-12-31",
		responsibleName: "Mikael Berg",
		responsibleEmail: "mikael.berg@service.se",
		responsiblePhone: "076-555 44 33",
		totalCost: "19 500",
		internalCost: "19 500",
		externalCost: "0",
		internalGroups: [
			{
				id: "int-serv-2",
				titleKey: localizationConstants.machineCategoryHandTool,
				rows: [
					{
						id: "serv2-1",
						machineNo: "K005",
						name: "Bilmaskin",
						rate: "180 kr / dag",
						deliveryDate: "2025-12-13",
						returnDate: "2026-12-31",
						days: 108,
						cost: "19 500",
						status: "active",
					},
				],
			},
		],
		externalGroups: [],
	},
	"p2025-002": {
		id: "p2025-002",
		projectNo: "P2025-002",
		projectName: "Köksrenovering Villa",
		projectAddress: "Ringvägen 5",
		postalCode: "118 23",
		city: "Stockholm",
		startDate: "2025-12-13",
		endDate: "2026-04-30",
		responsibleName: "Stina Svensson",
		responsibleEmail: "stina@svenssonbygg.se",
		responsiblePhone: "070-444 33 22",
		totalCost: "34 800",
		internalCost: "22 000",
		externalCost: "12 800",
		internalGroups: [
			{
				id: "int-p2-est",
				titleKey: localizationConstants.machineCategoryEstablishment,
				rows: [
					{
						id: "p2-1",
						machineNo: "K003",
						name: "Byggställning",
						rate: "250 kr / dag",
						deliveryDate: "2025-12-13",
						returnDate: "2026-04-30",
						days: 88,
						cost: "22 000",
						status: "active",
					},
				],
			},
		],
		externalGroups: [
			{
				id: "ext-p2-est",
				titleKey: localizationConstants.machineCategoryEstablishment,
				rows: [
					{
						id: "ext-p2-1",
						machineNo: "K006",
						name: "Taklift",
						supplier: "Lambertsson",
						rate: "400 kr / dag",
						deliveryDate: "2025-12-15",
						returnDate: "2026-01-16",
						days: 32,
						cost: "12 800",
						status: "active",
					},
				],
			},
		],
	},
	"order-502": {
		id: "order-502",
		projectNo: "Order 502",
		projectName: "Dörrbyte & Fönsterrenovering",
		projectAddress: "Linnégatan 12",
		postalCode: "413 04",
		city: "Göteborg",
		startDate: "2025-12-13",
		endDate: "2026-02-15",
		responsibleName: "Johan Larsson",
		responsibleEmail: "johan@larssonbygg.se",
		responsiblePhone: "072-111 22 33",
		totalCost: "15 900",
		internalCost: "11 400",
		externalCost: "4 500",
		internalGroups: [
			{
				id: "int-502-hand",
				titleKey: localizationConstants.machineCategoryHandTool,
				rows: [
					{
						id: "int-502-1",
						machineNo: "K002",
						name: "Skruvdragare",
						rate: "50 kr / dag",
						deliveryDate: "2025-12-13",
						returnDate: "2026-02-15",
						days: 64,
						cost: "3 200",
						status: "active",
					},
					{
						id: "int-502-2",
						machineNo: "M1001",
						name: "Borrmaskin",
						rate: "150 kr / dag",
						deliveryDate: "2025-12-13",
						returnDate: "2026-02-15",
						days: 54,
						cost: "8 200",
						status: "active",
					},
				],
			},
		],
		externalGroups: [
			{
				id: "ext-502-est",
				titleKey: localizationConstants.machineCategoryEstablishment,
				rows: [
					{
						id: "ext-502-1",
						machineNo: "E102",
						name: "Byggfläkt",
						supplier: "Cramo",
						rate: "150 kr / dag",
						deliveryDate: "2025-12-13",
						returnDate: "2026-01-12",
						days: 30,
						cost: "4 500",
						status: "active",
					},
				],
			},
		],
	},
};

let inMemoryLists: MachineListRow[] = [...MOCK_MACHINE_LISTS];
const inMemoryDetails: Record<string, MachineListDetail> = { ...initialDetails };

export const machineHandlingRepository = {
	subscribe(listener: RepositoryListener): () => void {
		listeners.add(listener);
		return () => listeners.delete(listener);
	},

	getAllLists(): MachineListRow[] {
		return [...inMemoryLists];
	},

	getListDetail(id?: string): MachineListDetail {
		if (id && inMemoryDetails[id]) {
			return inMemoryDetails[id];
		}
		// Fallback generated detail if dynamic id not yet seeded
		const row = inMemoryLists.find((r) => r.id === id);
		if (row) {
			const generated: MachineListDetail = {
				id: row.id,
				projectNo: row.object,
				projectName: row.label,
				projectAddress: "Storgatan 1",
				postalCode: "111 22",
				city: "Stockholm",
				startDate: row.startDate,
				endDate: row.endDate,
				responsibleName: row.customer || "Kalle Andersson",
				responsibleEmail: "info@byggbolaget.se",
				responsiblePhone: "070-000 00 00",
				totalCost: "0",
				internalCost: "0",
				externalCost: "0",
				internalGroups: [],
				externalGroups: [],
			};
			inMemoryDetails[row.id] = generated;
			return generated;
		}
		return inMemoryDetails["p2025-001"];
	},

	createList(row: MachineListRow, detail: MachineListDetail): void {
		inMemoryLists = [row, ...inMemoryLists];
		inMemoryDetails[row.id] = detail;
		notify();
	},

	deleteList(id: string): void {
		inMemoryLists = inMemoryLists.filter((l) => l.id !== id);
		delete inMemoryDetails[id];
		notify();
	},

	archiveList(id: string): void {
		inMemoryLists = inMemoryLists.map((l) =>
			l.id === id ? { ...l, status: "ended" } : l
		);
		notify();
	},

	addBookings(
		listId: string,
		internalBookedMachines: {
			id: string;
			machineNo: string;
			name: string;
			rate?: string;
		}[],
		externalBookedRows: ExternalBookingRow[]
	): void {
		const detail = this.getListDetail(listId);
		if (!detail) return;

		const today = new Date().toISOString().slice(0, 10);

		// Append new internal bookings
		if (internalBookedMachines.length > 0) {
			const newInternalRows = internalBookedMachines.map((m) => ({
				id: `booked-${m.id}-${Date.now()}`,
				machineNo: m.machineNo,
				name: m.name,
				rate: m.rate || "150 kr / dag",
				deliveryDate: today,
				returnDate: detail.endDate || today,
				days: 30,
				cost: "4 500",
				status: "booked" as const,
			}));

			const currentGroups = detail.internalGroups || [];
			if (currentGroups.length > 0) {
				currentGroups[0].rows = [...currentGroups[0].rows, ...newInternalRows];
			} else {
				detail.internalGroups = [
					{
						id: `int-group-${Date.now()}`,
						titleKey: localizationConstants.machineCategoryEstablishment,
						rows: newInternalRows,
					},
				];
			}
		}

		// Append new external bookings
		if (externalBookedRows.length > 0) {
			const newExtRows = externalBookedRows.map((e) => ({
				id: `ext-booked-${e.id}`,
				machineNo: e.machineNo || "EXT-01",
				name: e.name,
				supplier: e.supplier || "Extern Leverantör",
				rate: e.rate || "250 kr / dag",
				deliveryDate: e.deliveryDate || today,
				returnDate: e.returnDate || detail.endDate || today,
				days: 15,
				cost: "3 750",
				status: "active" as const,
			}));

			const currentExtGroups = detail.externalGroups || [];
			if (currentExtGroups.length > 0) {
				currentExtGroups[0].rows = [...currentExtGroups[0].rows, ...newExtRows];
			} else {
				detail.externalGroups = [
					{
						id: `ext-group-${Date.now()}`,
						titleKey: localizationConstants.machineCategoryEstablishment,
						rows: newExtRows,
					},
				];
			}
		}

		inMemoryDetails[listId] = { ...detail };
		notify();
	},
};
