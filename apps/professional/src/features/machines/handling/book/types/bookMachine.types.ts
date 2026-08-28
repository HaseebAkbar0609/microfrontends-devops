/**
 * Whether the machine comes out of the company's own fleet or is hired in from
 * a supplier. Chosen by the radio row at the top of the wizard.
 */
export type BookingKind = "internal" | "external";

/** A machine offered in the "Tillgangliga maskiner" pane. */
export interface BookableMachine {
	id: string;
	/** "ID-nr" — machine number, e.g. M1001. */
	machineNo: string;
	/** Machine name, e.g. Borrmaskin. */
	name: string;
	/** "Leverantor" — only set on hired-in machines. */
	supplier?: string;
}

/** A machine moved across into "Mina bokade maskiner". */
export interface BookedMachine extends BookableMachine {
	/** "bokas till kl" — the day the booking runs until, ISO yyyy-mm-dd. */
	bookedUntil: string;
}
