export type DirectOrderStatus = "pending" | "opened" | "ongoing" | "completed" | "cancelled";

export interface DirectOrderItem {
	id: string;
	productId: string;
	productName: string;
	quantity: number;
	unitPrice: number;
	discountPercent: number;
	vatPercent: number;
	lineTotal: number;
}

export interface DirectOrderRow {
	id: string;
	serialNo: string;
	orderName: string;
	customer: string;
	projectId?: string;
	projectName?: string;
	start: string;
	deliveryDate?: string;
	status: DirectOrderStatus;
	referenceNo?: string;
	items?: DirectOrderItem[];
	subtotal?: number;
	vatTotal?: number;
	grandTotal?: number;
}

export interface CreateDirectOrderFormValues {
	customerId: string;
	customerName: string;
	projectId: string;
	projectName: string;
	orderDate: string;
	deliveryDate: string;
	referenceNo: string;
	notes: string;
	items: Omit<DirectOrderItem, "lineTotal">[];
}
