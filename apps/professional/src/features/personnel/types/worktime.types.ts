export type WorktimeViewMode = "calendar" | "table";
export type WorktimeSubModule = "worktime" | "timesheet";
export type WorktimeStatus = "submitted" | "approved" | "returned";

export interface CalendarEventBlock {
	id: string;
	dayIndex: number; // 0 = Mon, 1 = Tue, etc.
	dateStr: string;
	title: string;
	startTime: string; // "07:00"
	endTime: string; // "12:00"
	startHour: number; // 7
	durationHours: number; // 5
	type: "project" | "ata" | "overtime";
	totalHours: number;
	ataHours?: number;
}

export interface DayCalendarColumn {
	dayIndex: number;
	dayNumber: number;
	dayName: string;
	dayNameKey?: string;
	totalHours: number;
	percentage: number;
	hasOvertime?: boolean;
}

export interface FieldLogEntry {
	id: string;
	title: string;
	time: string;
	duration: string;
	ot?: string;
	ata?: string;
	travel?: string;
}

export interface WorktimeAllocationItem {
	id: string;
	object: string;
	regularHours: number;
	otHours: number;
	ataNr: string;
	ataHours: number;
	travelKm: number;
	isModified?: boolean;
}

export interface WorktimeDayRecord {
	id: string;
	dayOfWeek: number; // 0 = Mon, 1 = Tue, etc.
	date: string;
	dayLabel: string;
	dayNameKey?: string;
	originalHours: number;
	finalHours: number;
	deviationHours: number;
	isModified: boolean;
	fieldLogs: FieldLogEntry[];
	allocations: WorktimeAllocationItem[];
}

export interface WeeklyTimesheetData {
	id: string;
	employeeId: string;
	employeeName: string;
	weekNumber: number;
	year: number;
	dateRange: string;
	status: WorktimeStatus;
	// KPI originals
	originalTotalHours: number;
	originalOtHours: number;
	originalAtaHours: number;
	originalTravelKm: number;
	// KPI adjusted / finals
	finalTotalHours: number;
	finalOtHours: number;
	finalAtaHours: number;
	finalTravelKm: number;
	deviationHours: number;
	// Breakdown
	days: WorktimeDayRecord[];
	calendarEvents: CalendarEventBlock[];
}
