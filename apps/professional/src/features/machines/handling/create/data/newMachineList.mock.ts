import type {
	LinkableObject,
	MachineSection,
	MachineSectionRow,
} from "../types/newMachineList.types";

/**
 * Objects a machine list can be linked to. Mocked until the projects/orders
 * endpoints exist; the design shows the project P2025-001 already linked.
 */
export const LINKABLE_OBJECTS: LinkableObject[] = [
	{
		id: "p2025-001",
		type: "project",
		objectNo: "P2025-001",
		objectName: "Ombyggnad kök",
		address: "Storgatan 10",
		postalCode: "175 63",
		city: "Solna",
		startDate: "2025-12-24",
		endDate: "2026-02-28",
	},
	{
		id: "p2025-002",
		type: "project",
		objectNo: "P2025-002",
		objectName: "Köksrenovering",
		address: "Vasagatan 4",
		postalCode: "111 20",
		city: "Stockholm",
		startDate: "2026-01-10",
		endDate: "2026-04-30",
	},
	{
		id: "order-501",
		type: "order",
		objectNo: "Order 501",
		objectName: "Badrum",
		address: "Sturegatan 22",
		postalCode: "114 36",
		city: "Stockholm",
		startDate: "2025-12-13",
		endDate: "2026-02-01",
	},
	{
		id: "order-502",
		type: "order",
		objectNo: "Order 502",
		objectName: "Dörr",
		address: "Hamngatan 8",
		postalCode: "111 47",
		city: "Stockholm",
		startDate: "2025-12-13",
		endDate: "2026-01-20",
	},
	{
		id: "servicebil-1",
		type: "service_vehicle",
		objectNo: "Servicebil 1",
		objectName: "Bil 1",
		address: "Verkstadsgatan 1",
		postalCode: "171 54",
		city: "Solna",
		startDate: "2025-12-13",
		endDate: "2026-12-13",
	},
];

/** People selectable as "Maskin ansvarig". */
export const RESPONSIBLE_PEOPLE = [
	{ value: "kalle", label: "Kalle Andersson", email: "kalle@byggbolaget.se", phone: "070-563 30 30" },
	{ value: "stina", label: "Stina Svensson", email: "stina@byggbolaget.se", phone: "070-114 22 10" },
	{ value: "johan", label: "Johan Larsson", email: "johan@byggbolaget.se", phone: "070-998 41 05" },
];

const ownRows = (prefix: string): MachineSectionRow[] => [
	{
		id: `${prefix}-1`,
		machineNo: "M1001",
		name: "Borrmaskin",
		rate: "150 kr / dag",
		fromDate: "2025-09-01",
		returnDate: "2025-12-01",
		days: 125,
		cost: "18 750",
	},
	{
		id: `${prefix}-2`,
		machineNo: "K002",
		name: "Skruvdragare",
		rate: "50 kr / dag",
		fromDate: "2025-09-01",
		returnDate: "2025-12-01",
		days: 125,
		cost: "18 750",
	},
];

/** Own-machine sections as laid out in the design. */
export const INITIAL_OWN_SECTIONS: MachineSection[] = [
	{ id: "own-establishment", title: "Etablering", rows: ownRows("own-est") },
	{ id: "own-hand-tools", title: "Handmaskiner", rows: ownRows("own-hand") },
];

/** External sections carry a supplier block above the table. */
export const INITIAL_EXTERNAL_SECTIONS: MachineSection[] = [
	{
		id: "ext-establishment",
		title: "Etablering",
		supplier: {
			companyName: "Ombyggnad kök",
			companyAddress: "Storgatan 10",
			startDate: "2025-12-24",
			endDate: "2026-02-28",
		},
		rows: [
			{
				id: "ext-est-1",
				machineNo: "M1001",
				name: "Borrmaskin",
				supplier: "Cramo",
				rate: "250 kr / dag",
				fromDate: "2025-12-01",
				returnDate: "2025-12-01",
				days: 125,
				cost: "18 750",
			},
			{
				id: "ext-est-2",
				machineNo: "K002",
				name: "Skruvdragare",
				supplier: "Cramo",
				rate: "250 kr / dag",
				fromDate: "2025-12-01",
				returnDate: "2025-12-01",
				days: 125,
				cost: "18 750",
			},
		],
	},
];

/** A blank row added by "Ny maskin". */
export function emptySectionRow(id: string, external: boolean): MachineSectionRow {
	return {
		id,
		machineNo: "",
		name: "",
		rate: "",
		...(external ? { supplier: "" } : {}),
		fromDate: "",
		returnDate: "",
		days: 0,
		cost: "",
	};
}
