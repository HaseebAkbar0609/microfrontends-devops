import { mockDate } from "../../../constants/mockData";
import { ataTotal } from "../ataMath";
import type { AtaLineItem, AtaLineItems, AtaProjectInfo, AtaSection, ProjectAta } from "../types";

/**
 * Helpers for the ÄTA seeds. Only the mock files import these.
 *
 * The frame gives each ÄTA's Belopp but not its rows, and Belopp is derived
 * from rows. `balancedLineItems` therefore adds one ÄTA-leverantör row that
 * brings a seed's rows to exactly its frame total — at 0 % påslag, since a
 * marked-up row cannot land on every whole krona. A seed whose rows already
 * exceed its total throws when the module loads, so a wrong seed fails loudly
 * rather than showing a quiet wrong number.
 */

type RowSpec = Partial<AtaLineItem> & Pick<AtaLineItem, "party" | "quantity" | "netPrice">;

export function seedRow(id: string, spec: RowSpec): AtaLineItem {
	return {
		id,
		date: mockDate(-30),
		resourceNo: "00032",
		description: "",
		invoiceNo: "",
		unit: "tim",
		markupPercent: 10,
		secondaryPercent: null,
		activity: "",
		location: "",
		...spec,
	};
}

export function emptyLineItems(): AtaLineItems {
	return { staff: [], material: [], machines: [], ue: [], supplierAta: [] };
}

export function balancedLineItems(
	key: string,
	target: number,
	rows: Partial<AtaLineItems>,
	balance: { supplier: string; invoiceNo: string },
	/** Where the balancing row goes — ÄTA leverantör unless a seed says otherwise. */
	section: AtaSection = "supplierAta",
): AtaLineItems {
	const items = { ...emptyLineItems(), ...rows };
	const remainder = target - ataTotal(items);
	if (remainder <= 0) throw new Error(`ÄTA seed ${key} overshoots its total of ${target}`);

	items[section] = [
		...items[section],
		seedRow(`${key}-balance`, {
			party: balance.supplier,
			invoiceNo: balance.invoiceNo,
			quantity: 1,
			unit: "st",
			netPrice: remainder,
			markupPercent: 0,
		}),
	];
	return items;
}

export const SEED_INFO: AtaProjectInfo = {
	heading: "Extra jobb i badrum",
	subheading: "",
	proposedAction: "",
	action: "",
	qualityStatus: "Tilläggsarbete",
	reason: "Fel mått på bänkskivan i köket",
	economyStatus: "Överlämnad",
	location: "Kök",
	description: "",
};

/** The fields every seeded ÄTA shares, with the frame's Beställare. */
export function seedAta(
	spec: Pick<ProjectAta, "id" | "projectId" | "number" | "status" | "attested" | "lineItems"> &
		Partial<ProjectAta>,
): ProjectAta {
	return {
		client: {
			client: "Fastighetsbolaget AB",
			name: "Kalle Andersson",
			address: "Storgatan 10",
			postalCode: "171 63",
			city: "Solna",
		},
		info: SEED_INFO,
		createdBy: "Kalle Andersson",
		createdDate: mockDate(-40),
		revisedDate: "",
		documents: [],
		supplierInvoiceIds: [],
		timeReportIds: [],
		...spec,
	};
}
