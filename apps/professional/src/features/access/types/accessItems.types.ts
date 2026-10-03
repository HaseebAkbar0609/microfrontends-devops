import type { AccessTypeId } from "./access.types";

export type AccessItemStatusId = "active" | "returned";

export type AccessItemSortField =
	| "nycId"
	| "regNo"
	| "type"
	| "accessTo"
	| "startDate"
	| "endDate"
	| "status";

/** One key, card or tag a person holds on an access record (a row of the Access tab table). */
export interface AccessItem {
	/** Unique row key. NYC-IDs and registration numbers are data and can repeat. */
	id: string;
	nycId: string;
	regNo: string;
	type: AccessTypeId;
	/** What it opens: a door, another key or a project, as free text. */
	accessTo: string;
	/** Local ISO date, e.g. "2026-01-01". */
	startDate: string;
	endDate: string;
	status: AccessItemStatusId;
}

/** A person on an access record, with their items (an accordion of the Access tab). */
export interface AccessHolder {
	/** Unique key. Two people can share a name. */
	id: string;
	name: string;
	items: AccessItem[];
}

/** Holders per access record id. */
export type AccessHoldersByRecord = Record<string, AccessHolder[]>;
