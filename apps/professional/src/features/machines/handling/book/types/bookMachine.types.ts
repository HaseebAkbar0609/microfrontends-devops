import type { MachineRentalStatus } from "../../types/machineHandling.types";

/**
 * Whether the machine comes out of the company's own fleet or is hired in from
 * a supplier. Chosen by the radio row at the top of the wizard.
 */
export type BookingKind = "internal" | "external";

/** One row in the "Bokade maskiner" table. */
export interface BookedMachineRow {
	id: string;
	/** "ID-nr" — machine number, e.g. M1001. */
	machineNo: string;
	/** "Maskin" — machine name, e.g. Borrmaskin. */
	name: string;
	/** "Leveransdag" — ISO yyyy-mm-dd. */
	deliveryDate: string;
	status: MachineRentalStatus;
}

/**
 * Column the "Bokade maskiner" table is sorted by. `null` is the initial
 * state: the design lists the machines in the order they were booked, and
 * sorting only kicks in once a header is clicked.
 */
export type BookedMachineSortKey = "machineNo" | "name" | null;
