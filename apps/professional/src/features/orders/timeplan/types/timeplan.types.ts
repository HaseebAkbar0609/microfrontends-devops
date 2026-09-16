export type TimeplanKind = "Huvudtidsplan" | "Deltidsplan";

export interface OrderTimeplan {
	id: string;
	date: string;
	kind: TimeplanKind;
	name?: string;
	createdBy: string;
	customer?: string;
	startDate?: string;
	endDate?: string;
	revisedDate?: string;
	description?: string;
}

export type TimeplanColumnKey = "date" | "kind" | "createdBy";

export interface OrderTimeplanFormData {
	planName: string;
	type: string;
	startDate: string;
	endDate: string;
	orderNr: string;
	customer: string;
	createdBy: string;
	date: string;
	revisedDate: string;
	description: string;
}

export interface OrderTimeplanTask {
	id: string;
	name: string;
	startDate: string;
	endDate?: string;
	level?: 0 | 1 | 2;
	hasChildren?: boolean;
	parentId?: string;
	durationDays?: number;
	startDayIndex?: number;
	color?: string;
	tag?: string;
	tagPosition?: "left" | "right";
	isMilestone?: boolean;
	kind?: "phase" | "subtask" | "milestone";
	children?: OrderTimeplanTask[];
	expanded?: boolean;
}
