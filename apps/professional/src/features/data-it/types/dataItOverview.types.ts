export type DataItEmployeeStatus = "ACTIVE" | "INACTIVE";

export interface DataItEquipmentItem {
	id: string;
	category: string;
	type: string;
	brand: string;
	model: string;
	serialNumber: string;
	monthlyCost: number;
}

export interface DataItSystemItem {
	id: string;
	category: string;
	programName: string;
	email: string;
	passwordStatus: string;
	monthlyCost: number;
}

export interface DataItEmployeeOverview {
	id: string;
	personCode: string;
	name: string;
	email: string;
	role: string;
	phone: string;
	status: DataItEmployeeStatus;
	equipment: DataItEquipmentItem[];
	systems: DataItSystemItem[];
}

export type DataItOverviewFilterStatus = "ALL" | "ACTIVE" | "INACTIVE";

export type DataItOverviewSortField =
	| "id"
	| "name"
	| "email"
	| "role"
	| "equipment"
	| "system"
	| "cost"
	| "status";

export type SortDirection = "asc" | "desc";

export interface DataItSortState {
	field: DataItOverviewSortField;
	direction: SortDirection;
}

export type DataItDetailTab = "basic" | "equipment" | "system";
