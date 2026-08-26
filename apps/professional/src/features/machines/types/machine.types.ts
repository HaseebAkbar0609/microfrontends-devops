/** Lifecycle state of a machine, rendered as a solid status badge in the list. */
export type MachineStatus = "active" | "repair" | "ended";

/** Machine grouping shown as a neutral pill in the "Kategori" column. */
export type MachineCategory = "hand_tool" | "establishment" | "concrete";

/** Billing unit the internal rent is charged per ("Enhet" column). */
export type MachineUnit = "hour" | "day" | "week" | "month";

export interface MachineRow {
	id: string;
	/** "ID-nr" — human-facing machine number, e.g. M1001. */
	machineNo: string;
	/** "Maskin" — machine name, e.g. Borrmaskin. */
	name: string;
	/** "Fabrik" — manufacturer. */
	factory: string;
	/** "Beteckning" — manufacturer model designation. */
	designation: string;
	category: MachineCategory;
	/** "Intern hyra" — internal rental price, pre-formatted for display. */
	internalRent: string;
	unit: MachineUnit;
	/** "Inköp" — purchase date, ISO yyyy-mm-dd. */
	purchaseDate: string;
	/** "Placering" — current location: warehouse, order, project or service vehicle. */
	location: string;
	status: MachineStatus;
}
