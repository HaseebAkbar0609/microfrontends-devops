import { MOCK_MACHINES } from "../../../data/machines.mock";
import type { BookableMachine, BookingKind } from "../types/bookMachine.types";

/**
 * Own fleet, reused from the machine register so the wizard and the
 * "Maskin - Oversikt" list can never drift apart.
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
	{ id: "ext-c100", machineNo: "C100", name: "Minigravare", supplier: "Cramo" },
	{ id: "ext-c101", machineNo: "C101", name: "Bygghiss", supplier: "Cramo" },
	{ id: "ext-r200", machineNo: "R200", name: "Byggtork", supplier: "Ramirent" },
	{
		id: "ext-r201",
		machineNo: "R201",
		name: "Vibratorplatta",
		supplier: "Ramirent",
	},
];

export function bookableMachines(kind: BookingKind): BookableMachine[] {
	return kind === "external" ? EXTERNAL_MACHINES : INTERNAL_MACHINES;
}

/**
 * Machines already booked onto the list when the screen opens, as shown in the
 * design. Replaced by the machine list's own bookings once the endpoint exists.
 */
export const INITIALLY_BOOKED_IDS: Record<BookingKind, string[]> = {
	internal: ["m1001", "k002"],
	external: [],
};
