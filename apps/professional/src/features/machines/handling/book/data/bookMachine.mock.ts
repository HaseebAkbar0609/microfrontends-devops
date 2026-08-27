import { MOCK_MACHINES } from "../../../data/machines.mock";
import type { BookedMachineRow, BookingKind } from "../types/bookMachine.types";

/** A machine offered in the "Maskin" select, before it is booked. */
export interface BookableMachine {
	id: string;
	machineNo: string;
	name: string;
	/** "Leverantör" — only set on hired-in machines. */
	supplier?: string;
}

/**
 * Own fleet, reused from the machine register so the wizard and the
 * "Maskin - Översikt" list can never drift apart.
 */
const INTERNAL_MACHINES: BookableMachine[] = MOCK_MACHINES.map((machine) => ({
	id: machine.id,
	machineNo: machine.machineNo,
	name: machine.name,
}));

/**
 * Machines hired in from suppliers. Mocked until the suppliers endpoint exposes
 * a rental catalogue.
 */
const EXTERNAL_MACHINES: BookableMachine[] = [
	{ id: "ext-c100", machineNo: "C100", name: "Minigrävare", supplier: "Cramo" },
	{ id: "ext-c101", machineNo: "C101", name: "Bygghiss", supplier: "Cramo" },
	{ id: "ext-r200", machineNo: "R200", name: "Byggtork", supplier: "Ramirent" },
	{ id: "ext-r201", machineNo: "R201", name: "Vibratorplatta", supplier: "Ramirent" },
];

export function bookableMachines(kind: BookingKind): BookableMachine[] {
	return kind === "external" ? EXTERNAL_MACHINES : INTERNAL_MACHINES;
}

/**
 * Machines already booked onto the list, as shown in the design. Replaced by
 * the machine list's own bookings once the endpoint exists.
 */
export const INITIAL_BOOKED_MACHINES: BookedMachineRow[] = [
	{
		id: "booked-m1001",
		machineNo: "M1001",
		name: "Borrmaskin",
		deliveryDate: "2025-09-01",
		status: "booked",
	},
	{
		id: "booked-k002",
		machineNo: "K002",
		name: "Skruvdragare",
		deliveryDate: "2025-09-01",
		status: "booked",
	},
];
