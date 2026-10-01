import type { Role } from "@/constants/roles";
import type { CreateEmployeeFormData } from "./createEmployee.types";

export type EmployeeStatus =
	| "active"
	| "probation"
	| "sick"
	| "leave"
	| "not_started";

export type EmploymentType = "full_time" | "part_time";

export interface ContractInfo {
	signedDate: string;
	fileName: string;
	fileSize?: string;
}

export interface EmployeeOverviewItem {
	id: string;
	contractNumber: string;
	name: string;
	role: string;
	idNumber: string;
	status: EmployeeStatus;
	employmentType: EmploymentType;
	startDate: string;
	/** ISO date; absent while the employment runs on. */
	endDate?: string;
	location: string;
	email: string;
	phone: string;
	department: string;
	/** Whether the employee leads or is led; Prognos splits its ring on it. */
	level: Role;
	/** What the employee costs a month, in SEK. */
	monthlyCost: number;
	/** Complete 5-step form profile data for Personalkort / View Profile */
	details?: CreateEmployeeFormData;
	signedContract?: ContractInfo;
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
