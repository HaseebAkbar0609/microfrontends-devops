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
