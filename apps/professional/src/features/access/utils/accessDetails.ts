import type { AccessPoint, SortOrder } from "../types/access.types";
import type {
	AccessContact,
	AccessContactSortField,
	AccessDetails,
	AccessDetailsExtra,
} from "../types/accessDetails.types";

/**
 * Details of one access record: the list row joined with its extra fields.
 * Pure and free of runtime imports, so it can be tested alone and swapped for
 * a server fetch later without touching the page.
 */
export function findAccessDetails(
	id: string,
	rows: AccessPoint[],
	extras: Record<string, AccessDetailsExtra>,
): AccessDetails | null {
	const row = rows.find((candidate) => candidate.id === id);
	if (!row) return null;
	const extra = extras[id] ?? { address: "", postalCode: "", contacts: [] };
	return {
		id: row.id,
		idNumber: row.idNumber,
		projectOrder: row.objectRef,
		accessName: row.name,
		address: extra.address,
		postalCode: extra.postalCode,
		city: row.city,
		contacts: extra.contacts,
	};
}

/** Contacts in Swedish order; a contact with no value in the sorted column goes last in both directions. */
export function sortContacts(
	contacts: AccessContact[],
	field: AccessContactSortField | null,
	order: SortOrder,
): AccessContact[] {
	if (!field) return contacts;
	return [...contacts].sort((a, b) => {
		const left = a[field];
		const right = b[field];
		if (!left && !right) return 0;
		if (!left) return 1;
		if (!right) return -1;
		const result = left.localeCompare(right, "sv", { numeric: true });
		return order === "asc" ? result : -result;
	});
}
