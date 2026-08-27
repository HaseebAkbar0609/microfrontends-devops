/** What the machine list is attached to, chosen by the radio row. */
export type LinkableObjectType = "order" | "project" | "service_vehicle";

/** An object the list can be linked to, offered in the "Koppla objekt" select. */
export interface LinkableObject {
	id: string;
	type: LinkableObjectType;
	objectNo: string;
	objectName: string;
	address: string;
	postalCode: string;
	city: string;
	startDate: string;
	endDate: string;
}

/** One machine row inside a section, on either the own or external tab. */
export interface MachineSectionRow {
	id: string;
	machineNo: string;
	name: string;
	/** "Intern hyra" on the own tab, "Extern hyra" on the external one. */
	rate: string;
	/** "Leverantör" — external sections only. */
	supplier?: string;
	/** "Leveransdag" on own sections, "Hyrd dag" on external ones. */
	fromDate: string;
	returnDate: string;
	days: number;
	cost: string;
}

/** Supplier block shown above the table on external sections. */
export interface SupplierInfo {
	companyName: string;
	companyAddress: string;
	startDate: string;
	endDate: string;
}

export interface MachineSection {
	id: string;
	/** Section heading, e.g. Etablering or Handmaskiner. */
	title: string;
	rows: MachineSectionRow[];
	/** Only present on external sections. */
	supplier?: SupplierInfo;
}
