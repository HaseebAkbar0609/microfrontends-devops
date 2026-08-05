import { mockDate } from "@/features/widgetdashboard/utils/mockDates";
import localizationConstants from "@/utils/translation/constants";

export type TimeEntryType = "order" | "project" | "overhead";
export type TravelUnit = "time" | "km";
export type WorkDayStatus = "pending" | "approved";

export interface TimeRow {
	id: string;
	start: string;
	end: string;
	type: TimeEntryType;
	refNr: string;
	projectName: string;
	ata: boolean;
	ataNr: string;
	travelUnit: TravelUnit;
	travelValue: string;
	allowance: boolean;
	title: string;
	description: string;
}

export interface WorkDay {
	id: string;
	date: string;
	status: WorkDayStatus;
	rows: TimeRow[];
}

export const TIME_TYPE_KEY: Record<TimeEntryType, string> = {
	order: localizationConstants.timeTypeOrder,
	project: localizationConstants.timeTypeProject,
	overhead: localizationConstants.timeTypeOverhead,
};

export const TIME_TYPE_CLASS: Record<TimeEntryType, string> = {
	order: "bg-blue-600 text-white",
	project: "bg-slate-900 text-white",
	overhead: "bg-green-600 text-white",
};

export const ATA_BADGE_CLASS = "bg-red-600 text-white";

export const WORK_DAY_STATUS_KEY: Record<WorkDayStatus, string> = {
	pending: localizationConstants.timeStatusPending,
	approved: localizationConstants.timeStatusApproved,
};

export const WORK_DAY_STATUS_CLASS: Record<WorkDayStatus, string> = {
	pending: "border border-slate-300 bg-slate-50 text-slate-600",
	approved: "bg-green-50 text-green-600",
};

export const STANDARD_WORKDAY = {
	start: "07:00",
	end: "16:00",
	hours: 8,
};

export const MOCK_OB_MINUTES = 120;

export const ORDER_OPTIONS = ["2025-001", "2025-002", "2025-003", "2025-004"];
export const PROJECT_OPTIONS = ["2025001", "1001", "1005", "0002"];
export const ATA_OPTIONS = ["10", "15", "20"];

const rowDefaults = {
	ata: false,
	ataNr: "",
	travelUnit: "time" as TravelUnit,
	travelValue: "",
	allowance: false,
	title: "",
	description: "",
};

export const WORK_DAYS: WorkDay[] = [
	{
		id: "w-1",
		date: mockDate(-1),
		status: "pending",
		rows: [
			{
				id: "r-1",
				start: "09:00",
				end: "17:00",
				type: "project",
				refNr: "0001",
				projectName: "Projekt namn 1",
				...rowDefaults,
				ata: true,
				ataNr: "10",
			},
		],
	},
	{
		id: "w-2",
		date: mockDate(-3),
		status: "approved",
		rows: [
			{
				id: "r-2",
				start: "09:00",
				end: "13:00",
				type: "order",
				refNr: "2025-001",
				projectName: "Projekt namn 2",
				...rowDefaults,
			},
			{
				id: "r-3",
				start: "13:00",
				end: "17:00",
				type: "project",
				refNr: "2025-002",
				projectName: "Order namn 1",
				...rowDefaults,
				ata: true,
				ataNr: "10",
			},
		],
	},
	{
		id: "w-3",
		date: mockDate(-4),
		status: "approved",
		rows: [
			{
				id: "r-4",
				start: "09:00",
				end: "17:00",
				type: "overhead",
				refNr: "0002",
				projectName: "Projekt namn 3",
				...rowDefaults,
			},
		],
	},
	{
		id: "w-4",
		date: mockDate(-7),
		status: "approved",
		rows: [
			{
				id: "r-5",
				start: "09:00",
				end: "17:00",
				type: "project",
				refNr: "2025-004",
				projectName: "Projekt namn 4",
				...rowDefaults,
			},
		],
	},
	{
		id: "w-5",
		date: mockDate(-13),
		status: "pending",
		rows: [
			{
				id: "r-6",
				start: "09:00",
				end: "17:00",
				type: "order",
				refNr: "0003",
				projectName: "Order namn 1",
				...rowDefaults,
			},
		],
	},
];
