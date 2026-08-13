import { mockDate } from "@/features/widgetdashboard/utils/mockDates";

export interface GanttSegment {
	from: number;
	to: number;
	colorClass: string;
}

export interface ProjectDetailRow {
	id: string;
	projectNr: string;
	name: string;
	startDate: string;
	endDate: string;
	segments: GanttSegment[];
}

export interface GanttWeek {
	label: string;
	days: number[];
}

export const PROJECT_DETAIL_MONTH_LABEL = "Mars 2026";

export const PROJECT_DETAIL_WEEKS: GanttWeek[] = [
	{ label: "Vecka 10", days: [8, 9, 10, 11, 12, 13, 14] },
	{ label: "Vecka 11", days: [8, 9, 10, 11, 12, 13, 14] },
	{ label: "Vecka 12", days: [8, 9, 10, 11, 12, 13, 14] },
	{ label: "Vecka 13", days: [8, 9, 10, 11, 12, 13, 14] },
];

export const PROJECT_DETAIL_ROWS: ProjectDetailRow[] = [
	{
		id: "5000",
		projectNr: "5000",
		name: "Ombyggnad kök",
		startDate: mockDate(-40),
		endDate: mockDate(20),
		segments: [
			{ from: 0, to: 2, colorClass: "bg-yellow-600" },
			{
				from: 3,
				to: 27,
				colorClass: "bg-yellow-600 border-y-2 border-yellow-300",
			},
		],
	},
	{
		id: "5001",
		projectNr: "5001",
		name: "Foundation",
		startDate: mockDate(-35),
		endDate: mockDate(25),
		segments: [
			{ from: 1, to: 27, colorClass: "bg-green-200" },
			{ from: 10, to: 17, colorClass: "bg-green-700" },
		],
	},
	{
		id: "5002",
		projectNr: "5002",
		name: "Rough framing",
		startDate: mockDate(-30),
		endDate: mockDate(30),
		segments: [{ from: 16, to: 27, colorClass: "bg-red-600" }],
	},
	{
		id: "5003",
		projectNr: "5003",
		name: "HVAC",
		startDate: mockDate(-25),
		endDate: mockDate(35),
		segments: [],
	},
];
