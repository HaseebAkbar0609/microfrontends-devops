import type { AccessTypeId } from "./access.types";

/** Step 1 form: the object link and the access information. */
export interface AccessNewInfo {
	/** A project or order, or "" when the access is not tied to one. */
	objectRef: string;
	name: string;
	address: string;
	postalCode: string;
	city: string;
}

/** A contact person added on step 1 (a row of "Added Contact Persons"). */
export interface AccessNewContact {
	/** Unique row key. */
	id: string;
	name: string;
	email: string;
	mobile: string;
}

/** The contact form above that table, before it is added. */
export interface AccessNewContactDraft {
	person: string;
	email: string;
	mobile: string;
}

/** The key form of step 2, before it is saved. The places it opens are kept as separate tags. */
export interface AccessNewKeyForm {
	type: AccessTypeId | "";
	regNo: string;
	startDate: string;
	returnDate: string;
	company: string;
	person: string;
}

/** A saved key (a row of "Saved Keys"). */
export interface AccessNewKey {
	/** Unique row key. */
	id: string;
	/** The number shown to people, e.g. "N001". */
	keyId: string;
	type: AccessTypeId;
	regNo: string;
	startDate: string;
	returnDate: string;
	accessTo: string[];
	company: string;
	person: string;
}

export type AccessFieldError =
	| "required"
	| "tooLong"
	| "postalCode"
	| "email"
	| "dateOrder"
	| "duplicate"
	| "noTags";

export type AccessInfoErrors = Partial<Record<"name" | "address" | "postalCode" | "city", AccessFieldError>>;

export type AccessContactErrors = Partial<Record<"person" | "email" | "mobile", AccessFieldError>>;

export type AccessKeyErrors = Partial<
	Record<"type" | "regNo" | "startDate" | "returnDate" | "accessTo" | "company" | "person", AccessFieldError>
>;
