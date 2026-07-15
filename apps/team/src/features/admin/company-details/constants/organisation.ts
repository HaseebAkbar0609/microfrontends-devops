import localizationConstants from "@/utils/translation/constants";

export type EmploymentType = "full-time" | "part-time";

export type EmployeeStatus =
	| "active"
	| "probation"
	| "sick-leave"
	| "on-leave"
	| "termination";

export interface OrganisationMember {
	id: string;
	contactNo: string;
	name: string;
	position: string;
	idNumber: string;
	status: EmployeeStatus;
	type: EmploymentType;
	startDate: string;
	location: string;
}

export const EMPLOYEE_STATUS_CONFIG: Record<
	EmployeeStatus,
	{ labelKey: string; className: string }
> = {
	active: {
		labelKey: localizationConstants.activeLabel,
		className: "bg-[#DCFCE7] text-[#16A34A]",
	},
	probation: {
		labelKey: localizationConstants.adminStatusProbation,
		className: "bg-[#DBEAFE] text-[#2563EB]",
	},
	"sick-leave": {
		labelKey: localizationConstants.adminStatusSickLeave,
		className: "bg-[#FEF3C7] text-[#D97706]",
	},
	"on-leave": {
		labelKey: localizationConstants.adminStatusOnLeave,
		className: "bg-slate-100 text-slate-600",
	},
	termination: {
		labelKey: localizationConstants.adminStatusTermination,
		className: "bg-[#FEE2E2] text-[#DC2626]",
	},
};

export const EMPLOYMENT_TYPE_LABEL: Record<EmploymentType, string> = {
	"full-time": localizationConstants.adminFullTimeLabel,
	"part-time": localizationConstants.adminPartTimeLabel,
};

export const DUMMY_ORGANISATION_MEMBERS: OrganisationMember[] = [
	{
		id: "1",
		contactNo: "A001",
		name: "Anna Svensson",
		position: "VD",
		idNumber: "196808-0500",
		status: "active",
		type: "full-time",
		startDate: "2026-01-28",
		location: "Stockholm",
	},
	{
		id: "2",
		contactNo: "A002",
		name: "Erik Holm",
		position: "Säljare",
		idNumber: "198608-0300",
		status: "probation",
		type: "full-time",
		startDate: "2024-01-08",
		location: "Göteborg",
	},
	{
		id: "3",
		contactNo: "A003",
		name: "Sara Nilsson",
		position: "Support",
		idNumber: "199005-0100",
		status: "sick-leave",
		type: "part-time",
		startDate: "2021-09-20",
		location: "Malmö",
	},
	{
		id: "4",
		contactNo: "A004",
		name: "Lisa Larsson",
		position: "Marknad",
		idNumber: "198503-0100",
		status: "active",
		type: "full-time",
		startDate: "2020-08-11",
		location: "Stockholm",
	},
	{
		id: "5",
		contactNo: "A005",
		name: "Erik Holm",
		position: "IT-dev",
		idNumber: "199308-0100",
		status: "on-leave",
		type: "full-time",
		startDate: "2023-08-01",
		location: "Uppsala",
	},
	{
		id: "6",
		contactNo: "A006",
		name: "Anna Svensson",
		position: "Event",
		idNumber: "198905-0100",
		status: "termination",
		type: "full-time",
		startDate: "2025-01-02",
		location: "Västerås",
	},
];
