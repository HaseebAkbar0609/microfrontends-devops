import { MOCK_MACHINES } from "../../../data/machines.mock";
import type {
	BookableMachine,
	BookingKind,
	ExternalBookingRow,
} from "../types/bookMachine.types";

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
	{
		id: "ext-c100",
		machineNo: "C100",
		name: "Minigravare",
		supplier: "Cramo",
		rate: "250 kr / dag",
	},
	{
		id: "ext-c101",
		machineNo: "C101",
		name: "Bygghiss",
		supplier: "Cramo",
		rate: "480 kr / dag",
	},
	{
		id: "ext-r200",
		machineNo: "R200",
		name: "Byggtork",
		supplier: "Ramirent",
		rate: "180 kr / dag",
	},
	{
		id: "ext-r201",
		machineNo: "R201",
		name: "Vibratorplatta",
		supplier: "Ramirent",
		rate: "320 kr / dag",
	},
];

/** Suppliers offered in the booking form, derived from the hire catalogue. */
export const SUPPLIERS = Array.from(
	new Set(EXTERNAL_MACHINES.map((machine) => machine.supplier as string))
);

/**
 * Hired-in machines already booked onto the list, reproducing the two rows in
 * the TFS-809 frame: one kept past its return date, one still out.
 */
export const INITIAL_EXTERNAL_BOOKINGS: ExternalBookingRow[] = [
	{
		id: "ext-booking-1",
		machineNo: "M1001",
		name: "Borrmaskin",
		supplier: "Cramo",
		rate: "250 kr / dag",
		deliveryDate: "2025-09-01",
		returnDate: "2025-12-01",
		status: "overtime",
	},
	{
		id: "ext-booking-2",
		machineNo: "M1001",
		name: "Borrmaskin",
		supplier: "Cramo",
		rate: "250 kr / dag",
		deliveryDate: "2025-09-15",
		returnDate: "",
		status: "active",
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
