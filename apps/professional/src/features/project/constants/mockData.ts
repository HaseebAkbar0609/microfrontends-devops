export const MOCK_REFERENCE_DATE = "2026-07-24";

export function mockDate(offsetDays: number): string {
	const date = new Date(`${MOCK_REFERENCE_DATE}T00:00:00Z`);
	date.setUTCDate(date.getUTCDate() + offsetDays);
	return date.toISOString().slice(0, 10);
}

export function mockDateTime(offsetDays: number, time: string): string {
	return `${mockDate(offsetDays)} ${time}`;
}

export const PROJECT_WEEK_DAYS = [
	{ id: "mon", label: "M" },
	{ id: "tue", label: "T" },
	{ id: "wed", label: "O" },
	{ id: "thu", label: "T" },
	{ id: "fri", label: "F" },
	{ id: "sat", label: "L" },
	{ id: "sun", label: "S" },
];

const CALENDAR_LEADING_BLANKS = 2;
const CALENDAR_DAYS_IN_MONTH = 31;

export const PROJECT_CALENDAR_DAYS: (number | null)[] = [
	...Array.from<null>({ length: CALENDAR_LEADING_BLANKS }).fill(null),
	...Array.from({ length: CALENDAR_DAYS_IN_MONTH }, (_, i) => i + 1),
];

export const PROJECT_CALENDAR_HIGHLIGHTS: Record<number, string> = {
	15: "bg-blue-600",
	22: "bg-amber-500",
	28: "bg-red-600",
};

export interface ProjectMapPin {
	id: string;
	label: string;
	color: string;
	x: number;
	y: number;
}

const PIN_STATUS_COLOR = {
	onTrack: "bg-green-500",
	atRisk: "bg-amber-400",
	delayed: "bg-red-500",
} as const;

export const PROJECT_MAP_PINS: ProjectMapPin[] = [
	{
		id: "a",
		label: "Projekt A",
		color: PIN_STATUS_COLOR.onTrack,
		x: 30,
		y: 25,
	},
	{
		id: "b",
		label: "Projekt B",
		color: PIN_STATUS_COLOR.atRisk,
		x: 52,
		y: 38,
	},
	{
		id: "c",
		label: "Projekt C",
		color: PIN_STATUS_COLOR.onTrack,
		x: 41,
		y: 55,
	},
	{
		id: "d",
		label: "Projekt D",
		color: PIN_STATUS_COLOR.delayed,
		x: 63,
		y: 62,
	},
	{
		id: "e",
		label: "Projekt E",
		color: PIN_STATUS_COLOR.onTrack,
		x: 24,
		y: 68,
	},
	{
		id: "f",
		label: "Projekt F",
		color: PIN_STATUS_COLOR.onTrack,
		x: 70,
		y: 30,
	},
	{
		id: "g",
		label: "Projekt G",
		color: PIN_STATUS_COLOR.atRisk,
		x: 46,
		y: 78,
	},
	{
		id: "h",
		label: "Projekt H",
		color: PIN_STATUS_COLOR.onTrack,
		x: 57,
		y: 15,
	},
];
