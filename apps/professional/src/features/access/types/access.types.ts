export type AccessTypeId = "accessCard" | "keys" | "passCard" | "tag";

export type AccessStatusId = "active" | "scheduled" | "inProgress";

export type AccessSortField =
	| "idNumber"
	| "objectRef"
	| "name"
	| "type"
	| "city"
	| "assignedTo"
	| "lastAssignedAt"
	| "status";

export type SortOrder = "asc" | "desc";

export interface AccessPoint {
	/** Unique row key. Names repeat (two "Utrustningsförråd"), so never key by name. */
	id: string;
	idNumber: string;
	/** Project or order the access belongs to; null when it is not tied to one. */
	objectRef: string | null;
	name: string;
	type: AccessTypeId;
	city: string;
	assignees: string[];
	/** Local ISO date-time without offset, e.g. "2025-12-12T08:30:00". Null when never assigned. */
	lastAssignedAt: string | null;
	status: AccessStatusId;
	archived: boolean;
}

export interface AccessListParams {
	search: string;
	status: AccessStatusId | null;
	type: AccessTypeId | null;
	sortBy: AccessSortField | null;
	sortOrder: SortOrder;
	/** 1-based. */
	page: number;
	pageSize: number;
}

export interface AccessListPage {
	rows: AccessPoint[];
	totalItems: number;
	/** The page actually returned, clamped into range. */
	page: number;
}
