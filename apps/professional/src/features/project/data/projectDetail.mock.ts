export interface GanttSegment {
	from: number;
	to: number;
	colorClass: string;
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
