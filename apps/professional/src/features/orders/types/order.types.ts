export type OrderStatus = "assigned" | "ongoing" | "completed" | "cancelled";
export type OrderType = "ongoing" | "fixed_price";

export interface OrderRow {
	id: string;
	orderNo: string;
	orderName: string;
	customer: string;
	type: OrderType;
	status: OrderStatus;
	orderSum: string;
	projectManager: string;
	start: string;
	end: string;
}

export interface GanttItem {
	id: string;
	orderNo: string;
	orderNoText?: string;
	orderName: string;
	start: string;
	end: string;
	color: string;
	startDayIndex: number;
	durationDays: number;
	children?: GanttItem[];
}
