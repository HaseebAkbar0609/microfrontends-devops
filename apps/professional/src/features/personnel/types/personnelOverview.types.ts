export type EmployeeStatus =
	| "active"
	| "probation"
	| "sick"
	| "leave"
	| "not_started";

export type EmploymentType = "full_time" | "part_time";

export interface EmployeeOverviewItem {
	id: string;
	contractNumber: string;
	name: string;
	role: string;
	idNumber: string;
	status: EmployeeStatus;
	employmentType: EmploymentType;
	startDate: string;
	location: string;
	email: string;
	phone: string;
	department: string;
}

export type SortField =
	| "contractNumber"
	| "name"
	| "role"
	| "idNumber"
	| "status"
	| "employmentType"
	| "startDate"
	| "location";

export type SortOrder = "asc" | "desc";

export interface PersonnelFilterState {
	search: string;
	status: string;
	employmentType: string;
	location: string;
	role: string;
}
