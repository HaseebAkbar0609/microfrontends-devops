import { mockDate } from "@/features/widgetdashboard/utils/mockDates";
import { GanttSegment } from "@/features/project/data/projectDetail.mock";

export interface DesignProjectItem {
	id: string;
	projectNr: string;
	name: string;
	category: string;
	department: string;
	projectManager: string;
	customer: string;
}

export const DESIGN_PROJECT_ROWS: DesignProjectItem[] = [
	{
		id: "5000",
		projectNr: "#5000",
		name: "Renovation",
		category: "Totalentreprenad",
		department: "Nyproduktion",
		projectManager: "Lindsey Philips",
		customer: "Locum",
	},
	{
		id: "5001",
		projectNr: "#5001",
		name: "Renovation",
		category: "Generalentreprenad",
		department: "ROT",
		projectManager: "Lindsey Philips",
		customer: "Locum",
	},
	{
		id: "5002",
		projectNr: "#5002",
		name: "Renovation",
		category: "Löpande",
		department: "Service",
		projectManager: "Lindsey Philips",
		customer: "Locum",
	},
	{
		id: "5003",
		projectNr: "#5003",
		name: "Renovation",
		category: "Samverkan",
		department: "ROT",
		projectManager: "Lindsey Philips",
		customer: "Locum",
	},
	{
		id: "5004",
		projectNr: "#5004",
		name: "Renovation",
		category: "Totalentreprenad",
		department: "ROT",
		projectManager: "Lindsey Philips",
		customer: "Locum",
	},
	{
		id: "5005",
		projectNr: "#5005",
		name: "Renovation",
		category: "Totalentreprenad",
		department: "ROT",
		projectManager: "Lindsey Philips",
		customer: "Locum",
	},
];

export interface DesignGanttNode {
	id: string;
	nr?: string;
	name: string;
	startDate: string;
	endDate: string;
	segments: GanttSegment[];
	children?: DesignGanttNode[];
}

export const DESIGN_GANTT_SCHEDULE: DesignGanttNode[] = [
	{
		id: "d-5000",
		nr: "5000",
		name: "Köksrenov",
		startDate: mockDate(-40),
		endDate: mockDate(20),
		segments: [
			{ from: 0, to: 2, colorClass: "bg-yellow-600" },
			{ from: 3, to: 27, colorClass: "bg-yellow-600 border-y-2 border-yellow-300" },
		],
		children: [
			{
				id: "d-5000-siteworks",
				name: "Siteworks",
				startDate: mockDate(-40),
				endDate: mockDate(-33),
				segments: [{ from: 0, to: 4, colorClass: "bg-yellow-500" }],
				children: [
					{
						id: "d-5000-clear-lot",
						name: "Clear lot",
						startDate: mockDate(-40),
						endDate: mockDate(-38),
						segments: [{ from: 0, to: 2, colorClass: "bg-yellow-300" }],
					},
					{
						id: "d-5000-stakeout",
						name: "Stakeout",
						startDate: mockDate(-37),
						endDate: mockDate(-37),
						segments: [{ from: 3, to: 3, colorClass: "bg-yellow-300" }],
					},
				],
			},
		],
	},
	{
		id: "d-5001",
		nr: "5001",
		name: "Foundation",
		startDate: mockDate(-35),
		endDate: mockDate(25),
		segments: [
			{ from: 0, to: 27, colorClass: "bg-green-200" },
			{ from: 8, to: 17, colorClass: "bg-green-700" },
		],
		children: [
			{
				id: "d-5001-form",
				name: "Form",
				startDate: mockDate(-32),
				endDate: mockDate(-29),
				segments: [{ from: 8, to: 11, colorClass: "bg-green-500" }],
			},
			{
				id: "d-5001-rebar",
				name: "Mesh & Rebar",
				startDate: mockDate(-28),
				endDate: mockDate(-25),
				segments: [{ from: 12, to: 15, colorClass: "bg-green-500" }],
			},
		],
	},
	{
		id: "d-5002",
		nr: "5002",
		name: "Rough framing",
		startDate: mockDate(-30),
		endDate: mockDate(30),
		segments: [{ from: 18, to: 27, colorClass: "bg-red-600" }],
		children: [
			{
				id: "d-5002-form",
				name: "Form",
				startDate: mockDate(-21),
				endDate: mockDate(-21),
				segments: [{ from: 19, to: 19, colorClass: "bg-red-500" }],
			},
			{
				id: "d-5002-rebar",
				name: "Mesh & Rebar",
				startDate: mockDate(-20),
				endDate: mockDate(-13),
				segments: [{ from: 20, to: 27, colorClass: "bg-red-400" }],
			},
		],
	},
	{
		id: "d-5003",
		nr: "5003",
		name: "HVAC",
		startDate: mockDate(-25),
		endDate: mockDate(35),
		segments: [],
		children: [],
	},
];
