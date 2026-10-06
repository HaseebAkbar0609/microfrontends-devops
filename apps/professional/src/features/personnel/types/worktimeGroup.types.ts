export type GroupByMode = "person" | "project" | "overhead";
export type GroupViewTab = "kalender" | "list" | "gantt";
export type GanttTimeRange = "vecka" | "manad";

export type EmployeeDayStatus = "approved" | "submitted" | "missing" | "rejected";

export interface EmployeeDayBreakdown {
	id: string;
	date: string;
	dayLabel: string;
	dayName: string;
	dayDate: string;
	dayOfWeek: number; // 0 = Mon, ..., 6 = Sun
	plannedHours: number;
	loggedHours: number;
	otHours: number;
	ataHours: number;
	travelKm: number;
	timeRange?: string;
	status: EmployeeDayStatus;
	actionStatus?: "approved" | "rejected" | "none";
}

export interface GanttTaskItem {
	id: string;
	title: string;
	project: string;
	startDayIndex: number; // 0..9
	durationDays: number; // in days
	colorClass: string;
	subLabel?: string;
}

export interface EmployeeGroupSummary {
	id: string;
	name: string;
	empCode?: string;
	role: string;
	team: string;
	initials: string;
	avatarColor?: string;
	plannedHours: number;
	loggedHours: number;
	otHours: number;
	ataHours: number;
	travelKm: number;
	status: "godkand" | "inkickad" | "mangler" | "returned";
	statusCount?: string; // e.g. "0/5"
	hasDeviation?: boolean;
	days: EmployeeDayBreakdown[];
	ganttTasks: GanttTaskItem[];
}

export interface DailyGroupTotal {
	dayIndex: number;
	dayLabel: string;
	dayDate?: string;
	totalHours: number;
	otHours: number;
	ataHours: number;
	otLabel?: string;
}

export interface WorktimeGroupTotals {
	totalPlanned: number;
	totalLogged: number;
	totalOt: number;
	totalAta: number;
	totalTravel: number;
	dailyTotals: DailyGroupTotal[];
}

export interface WorktimeGroupData {
	weekNumber: number;
	year: number;
	dateRange: string;
	employees: EmployeeGroupSummary[];
	totals: WorktimeGroupTotals;
}

export interface ProjectDayEntry {
	dayIndex: number; // 0..6
	dayLabel: string; // e.g. "MÅN"
	dayDate: string; // e.g. "23 Dec"
	hours: number; // e.g. 17
	otHours?: number; // e.g. 1
	personCount: number; // e.g. 2
}

export interface ProjectEmployeeItem {
	id: string;
	name: string;
	empCode: string; // e.g. "EMP-001"
	initials: string; // e.g. "EA"
	avatarColor?: string;
	loggedHours: number; // e.g. 17
	otHours: number; // e.g. 1
	ataHours: number; // e.g. 2
	daysWorked: number; // e.g. 2
	flags?: number; // e.g. 1
	status: "inkickad" | "godkand" | "mangler" | "returned";
}

export interface ProjectGroupSummary {
	id: string;
	code: string; // e.g. "P-001"
	name: string; // e.g. "Projekt 2025-001"
	customer: string; // e.g. "AB Bygg Stockholm"
	type: "project" | "order";
	loggedHours: number; // e.g. 49
	otHours: number; // e.g. 1
	ataHours: number; // e.g. 2
	personCount: number; // e.g. 3
	travelKm: number; // e.g. 115
	flags?: number; // e.g. 1
	hasDeviation?: boolean;
	days: ProjectDayEntry[];
	employees: ProjectEmployeeItem[];
}

export interface ProjectGanttTaskBar {
	id: string;
	title: string;
	startDayIndex: number;
	durationDays: number;
	colorClass: string;
}

export interface ProjectGanttRowItem {
	id: string;
	projectId?: string;
	code: string;
	name: string;
	tasks: ProjectGanttTaskBar[];
}

export interface WorktimeProjectTotals {
	totalLogged: number; // 125
	totalOt: number; // 7
	totalAta: number; // 6
	dailyTotals: DailyGroupTotal[];
}

export interface WorktimeProjectGroupData {
	weekNumber: number;
	year: number;
	dateRange: string;
	projects: ProjectGroupSummary[];
	ganttRows: ProjectGanttRowItem[];
	totals: WorktimeProjectTotals;
}

