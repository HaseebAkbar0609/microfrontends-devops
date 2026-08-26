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

/**
 * A horizontal span on the Gantt timeline, expressed in day indices into the
 * visible window (0-based, inclusive on both ends).
 */
export interface MachineScheduleSpan {
	from: number;
	to: number;
	color: string;
	/**
	 * Optional distinct colour for the first day of a bar. The design shades the
	 * opening day green-600 and the remainder green-700.
	 */
	leadColor?: string;
}

export interface MachineScheduleRow {
	id: string;
	/** "Objekt nr" — project, order or service vehicle the machines are booked to. */
	objectNo: string;
	/** "Benämning" — what the booking is for. */
	label: string;
	/** "Start" — booking start date as displayed. */
	start: string;
	/** "Antal maskin" — how many machines the booking covers. */
	machineCount: number;
	/** Tinted band behind the bar: the planned/reserved window. */
	window?: MachineScheduleSpan;
	/** Solid bar: the actual assignment or maintenance block. */
	bar?: MachineScheduleSpan;
}
