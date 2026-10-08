/**
 * TFS-1154: System Overview & Detail View Types
 */

export type SystemStatus = "ACTIVE" | "PAUSED" | "INACTIVE";

export type SystemCategory =
	| "CALCULATION"
	| "OVERHEAD"
	| "ECONOMY"
	| "CONTINUOUS"
	| "PROJECT"
	| "OPERATIONS"
	| "OTHER";

export interface SystemDocument {
	id: string;
	name: string;
	date: string;
	fileType: string;
	url?: string;
}

export interface SystemAssignee {
	id: string;
	name: string;
	role: string;
	email: string;
	phone: string;
}

export interface SystemItem {
	id: string;
	systemId: string; // e.g. "#5000", "5000-001"
	category: SystemCategory;
	categoryLabel: string; // e.g. "Kalkyl", "Overhead", "Ekonomi"
	program: string; // e.g. "Wikelss", "Microsoft 365", "Fortnox"
	status: SystemStatus;
	pricePerMonth: number; // e.g. 168
	email?: string;
	password?: string;
	description?: string;
	documents: SystemDocument[];
	assignedUsers: SystemAssignee[];
}

export type SystemSortField =
	| "systemId"
	| "category"
	| "program"
	| "status"
	| "price";

export interface SystemSortState {
	field: SystemSortField;
	dir: "asc" | "desc";
}

export interface SystemFilterState {
	search: string;
	category: SystemCategory | "ALL";
	status: SystemStatus | "ALL";
}
