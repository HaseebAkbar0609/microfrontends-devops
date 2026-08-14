export type KmaType = "order" | "project";
export type KmaStatus = "ongoing" | "overdue" | "done";
export type KmaSecureStatus = "ok" | "warning" | "critical";

export interface KmaItem {
	id: string;
	object: string;
	description: string;
	startDate: string;
	endDate: string;
	customer: string;
	responsible: string;
	activitiesCompleted: number;
	activitiesTotal: number;
	secureCheck: number;
	secureStatus: KmaSecureStatus;
	safetyRounds: number;
	type: KmaType;
	status: KmaStatus;
}
