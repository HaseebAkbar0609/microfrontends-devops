export interface AccessContact {
	/** Unique row key. Two contacts can share a name. */
	id: string;
	name: string;
	email: string;
	mobile: string;
}

/** What the details page shows beyond the list row (the list has no address or contacts). */
export interface AccessDetailsExtra {
	address: string;
	postalCode: string;
	contacts: AccessContact[];
}

/** One access record as the details page shows it: the list row plus its extra fields. */
export interface AccessDetails {
	id: string;
	idNumber: string;
	/** Project or order the access belongs to; null when it is not tied to one. */
	projectOrder: string | null;
	accessName: string;
	address: string;
	postalCode: string;
	city: string;
	contacts: AccessContact[];
}

export type AccessContactSortField = "name" | "email" | "mobile";
