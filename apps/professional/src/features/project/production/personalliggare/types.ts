/**
 * One line in the personnel ledger: a person, on site, on a day.
 *
 * A personalliggare records what happened rather than who belongs to the team,
 * which is why nothing here is editable and there is no status. Entries are
 * append-only in a real system; here they are seeded.
 *
 * Nothing in the app modelled check-in and check-out before this — greps for
 * `Inloggad`, `Utloggad`, `checkIn` and `ID06` return nothing — so this type is
 * the first description of it.
 */
export interface StaffLedgerEntry {
	id: string;
	/** ISO `yyyy-MM-dd`, so it sorts and compares correctly as text. */
	date: string;
	/** A personnummer, in the `YYYY-MM-DD-NNNN` shape the app already stores. */
	personalNo: string;
	name: string;
	role: string;
	/**
	 * On our own payroll.
	 *
	 * Mutually exclusive with `supplier`: a person is either ours or came
	 * through a subcontractor. The frame shows "Ja" beside a UE company on
	 * every row, which cannot both be true — flagged on the ticket.
	 */
	ownStaff: boolean;
	/** The subcontractor they came through. Empty when `ownStaff`. */
	supplier: string;
	/** `HH:mm`. */
	loggedIn: string;
	/** `HH:mm`, empty while the person is still on site. */
	loggedOut: string;
	/** How the check-in was made. */
	tool: string;
}
