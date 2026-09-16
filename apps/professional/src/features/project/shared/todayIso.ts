/**
 * Today as `yyyy-MM-dd` in the user's own calendar.
 *
 * Call it from an event handler only. Evaluated during render it would differ
 * between the server and the client, and around midnight between two renders.
 * Shared by the project record's sections that stamp a date on what the user
 * does — a reply, an invoice, a revision.
 */
export function todayIso(): string {
	const now = new Date();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	return `${now.getFullYear()}-${month}-${day}`;
}
