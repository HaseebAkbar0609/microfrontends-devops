export type PlanningTab = "overview" | "order" | "personnel";

export type PlanningStatus =
	| "not_started"
	| "in_progress"
	| "waiting"
	| "completed"
	| "cancelled"
	| "due";

export interface PlanningAssignee {
	id: string;
	name: string;
	initials: string;
	avatarUrl?: string;
	hours: number;
}

export interface PlanningTask {
	id: string;
	orderId: string;
	orderNumber: string;
	orderName: string;
	name?: string;

	startDate: string;
	endDate: string;

	startTime?: string;
	endTime?: string;

	status: PlanningStatus;

	color: string;

	assignees: PlanningAssignee[];

	projectName?: string;
	label?: string;

	isMilestone?: boolean;
	parentId?: string | null;
	durationDays?: number;
	startDayIndex?: number;
}

export interface PlanningOrder {
	id: string;
	orderNumber: string;
	orderName: string;
	startDate?: string;
	endDate?: string;
	status?: PlanningStatus;
	tasks: PlanningTask[];
}

export interface PlanningResource {
	id: string;
	name: string;
	initials: string;
	avatarUrl?: string;
	role?: string;

	totalHours: number;
	allocatedHours: number;
	percentage: number;
	assignedTasks?: PlanningTask[];
}

export interface PlanningStatistics {
	totalProjects: number;
	assignedProjects: number;
	totalHours: number;
}

export interface PlanningResponse {
	orders: PlanningOrder[];
	resources: PlanningResource[];
	statistics: PlanningStatistics;
}

export interface PlanningQuery {
	startDate: string;
	endDate: string;
	search?: string;
	status?: PlanningStatus | "all";
	assigneeId?: string;
	projectId?: string;
}

export interface PlanningGanttRow {
	id: string;
	parentId?: string | null;
	name: string;
	startDate: string;
	level: 0 | 1 | 2; // 0 = main category, 1 = subcategory, 2 = leaf task
	hasChildren?: boolean;
	durationDays?: number;
	startDayIndex?: number;
	color?: string;
}

export interface OrderPlanningCardItem {
	id: string;
	orderNumber: string;
	orderName: string;
	timeRange: string;
	dayDate: string;
	dayIndex: number;
	startHour: number;
	endHour: number;
	colIndex?: number;
	totalCols?: number;
	status: PlanningStatus;
	color: string;
	bgClass: string;
	borderClass: string;
	statusBadgeBg: string;
	statusBadgeText: string;
	totalHours: number;
	assignees: {
		id: string;
		name: string;
		avatarUrl?: string;
		initials: string;
		hours: number;
	}[];
}
