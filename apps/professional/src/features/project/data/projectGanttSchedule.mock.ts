import { mockDate } from "@/features/widgetdashboard/utils/mockDates";
import { GanttSegment } from "./projectDetail.mock";

export interface GanttScheduleNode {
	id: string;
	nr?: string;
	name: string;
	startDate: string;
	endDate: string;
	segments: GanttSegment[];
	children?: GanttScheduleNode[];
}

export const PROJECT_GANTT_SCHEDULE: GanttScheduleNode[] = [
	{
		id: "5000",
		nr: "5000",
		name: "Köksrenov",
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
		children: [
			{
				id: "5000-siteworks",
				name: "Siteworks",
				startDate: mockDate(-40),
				endDate: mockDate(-33),
				segments: [{ from: 0, to: 4, colorClass: "bg-yellow-500" }],
				children: [
					{
						id: "5000-clear-lot",
						name: "Clear lot",
						startDate: mockDate(-40),
						endDate: mockDate(-38),
						segments: [
							{ from: 0, to: 2, colorClass: "bg-yellow-300" },
						],
					},
					{
						id: "5000-stakeout",
						name: "Stakeout",
						startDate: mockDate(-37),
						endDate: mockDate(-37),
						segments: [
							{ from: 3, to: 3, colorClass: "bg-yellow-300" },
						],
					},
					{
						id: "5000-excavation",
						name: "Excavation",
						startDate: mockDate(-36),
						endDate: mockDate(-32),
						segments: [
							{ from: 4, to: 8, colorClass: "bg-yellow-300" },
						],
					},
				],
			},
		],
	},
	{
		id: "5001",
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
				id: "5001-form",
				name: "Form",
				startDate: mockDate(-32),
				endDate: mockDate(-29),
				segments: [{ from: 8, to: 11, colorClass: "bg-green-500" }],
			},
			{
				id: "5001-mesh-rebar",
				name: "Mesh & Rebar",
				startDate: mockDate(-28),
				endDate: mockDate(-25),
				segments: [{ from: 12, to: 15, colorClass: "bg-green-500" }],
			},
			{
				id: "5001-pour-concrete",
				name: "Pour concrete",
				startDate: mockDate(-24),
				endDate: mockDate(-21),
				segments: [],
			},
		],
	},
	{
		id: "5002",
		nr: "5002",
		name: "Rough framing",
		startDate: mockDate(-30),
		endDate: mockDate(30),
		segments: [{ from: 18, to: 27, colorClass: "bg-red-600" }],
		children: [
			{
				id: "5002-form",
				name: "Form",
				startDate: mockDate(-21),
				endDate: mockDate(-21),
				segments: [{ from: 19, to: 19, colorClass: "bg-red-500" }],
			},
			{
				id: "5002-mesh-rebar",
				name: "Mesh & Rebar",
				startDate: mockDate(-20),
				endDate: mockDate(-13),
				segments: [{ from: 20, to: 27, colorClass: "bg-red-400" }],
			},
			{
				id: "5002-pour-concrete-1",
				name: "Pour concrete",
				startDate: mockDate(-12),
				endDate: mockDate(-9),
				segments: [],
			},
			{
				id: "5002-pour-concrete-2",
				name: "Pour concrete",
				startDate: mockDate(-8),
				endDate: mockDate(-5),
				segments: [],
			},
		],
	},
	{
		id: "5003",
		nr: "5003",
		name: "HVAC",
		startDate: mockDate(-25),
		endDate: mockDate(35),
		segments: [],
		children: [
			{
				id: "5003-pour-concrete",
				name: "Pour concrete",
				startDate: mockDate(-24),
				endDate: mockDate(-20),
				segments: [],
				children: [
					{
						id: "5003-excavation",
						name: "Excavation",
						startDate: mockDate(-24),
						endDate: mockDate(-22),
						segments: [],
					},
					{
						id: "5003-pour-concrete-child",
						name: "Pour concrete",
						startDate: mockDate(-21),
						endDate: mockDate(-20),
						segments: [],
					},
				],
			},
		],
	},
];
