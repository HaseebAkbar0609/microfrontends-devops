export type StaffRole =
	| "Snickare"
	| "Målare"
	| "Elektriker"
	| "Rörmokare"
	| "Städare"
	| "Projektledare"
	| "Platschef"
	| "Tekniker"
	| string;

export type StaffAssignmentStatus = "active" | "pending" | "completed";

export interface StaffLedgerItem {
	id: string;
	date: string; // e.g., "2025-10-01"
	personNumber: string; // e.g., "1978-10-16-1010"
	name: string; // e.g., "Kalle Svensson"
	role: StaffRole; // e.g., "Snickare"
	isOwnStaff: boolean; // e.g., true (renders badge "Ja")
	ue: string; // e.g., "Pelles bygg", "Elektriker AB"
	timeIn: string; // e.g., "07.00"
	timeOut: string; // e.g., "16:36"
	tool: string; // e.g., "App Timeflow Work"
	phone?: string;
	email?: string;
	status?: StaffAssignmentStatus;
}

export interface StaffFilterState {
	supplier: string;
	startDate: string;
	endDate: string;
	isLoggedInNow: boolean;
	searchQuery: string;
}

export interface StaffPaginationState {
	page: number;
	pageSize: number;
	totalCount: number;
	totalPages: number;
}

export interface AddStaffPayload {
	name: string;
	role: StaffRole;
	personNumber: string;
	isOwnStaff?: boolean;
	ue?: string;
	date?: string;
	timeIn?: string;
	timeOut?: string;
	tool?: string;
	phone?: string;
	email?: string;
}
