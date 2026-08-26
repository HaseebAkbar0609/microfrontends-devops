/** Lifecycle of a machine booking on a project's machine list. */
export type MachineRentalStatus =
	| "active"
	| "booked"
	| "delivered"
	| "returned"
	| "overtime";

/** A row on the Maskinhantering list: one machine list per project or order. */
export interface MachineListRow {
	id: string;
	/** "Objekt" — the project, order or service vehicle the list belongs to. */
	object: string;
	/** "Benämning" — what the list covers. */
	label: string;
	/** "Kund" — customer; blank for internal objects such as service vehicles. */
	customer: string;
	startDate: string;
	endDate: string;
	status: "active";
}

/** A machine booked onto a project, internal fleet or hired in. */
export interface MachineBookingRow {
	id: string;
	machineNo: string;
	name: string;
	/** Internal bookings carry an internal rate, external ones a supplier rate. */
	rate: string;
	/** "Leverantör" — only set on external bookings. */
	supplier?: string;
	deliveryDate: string;
	/** "Återlämning" — blank while the machine is still out. */
	returnDate: string;
	/** "Antal dagar" */
	days: number;
	/** "Hyr kostnad" — pre-formatted for display. */
	cost: string;
	status: MachineRentalStatus;
}

/** A collapsible category group inside the internal or external section. */
export interface MachineBookingGroup {
	id: string;
	/** Category name, e.g. Etablering / Handmaskin / Betongmaskiner. */
	titleKey: string;
	rows: MachineBookingRow[];
}

export interface MachineListDetail {
	id: string;
	projectNo: string;
	projectName: string;
	projectAddress: string;
	postalCode: string;
	city: string;
	startDate: string;
	endDate: string;
	responsibleName: string;
	responsibleEmail: string;
	responsiblePhone: string;
	totalCost: string;
	internalCost: string;
	externalCost: string;
	internalGroups: MachineBookingGroup[];
	externalGroups: MachineBookingGroup[];
}
