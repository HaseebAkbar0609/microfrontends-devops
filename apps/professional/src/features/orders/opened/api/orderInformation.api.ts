import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type { OrderOpenedData } from "../types/orderOpened.types";
import { getOrderOpenedMockById } from "../data/orderOpened.mock";

/**
 * Fetches order details with fallback to matched mock data, consistent with the rest of the project
 */
export async function getOrderInformation(orderId?: string): Promise<OrderOpenedData> {
	if (!orderId) return getOrderOpenedMockById();
	try {
		const res = await axiosInstance.get(API_PATH.ORDERS.GET(orderId));
		if (res.data?.data) {
			return {
				...getOrderOpenedMockById(orderId),
				...res.data.data,
				id: orderId,
			};
		}
		if (res.data) {
			return {
				...getOrderOpenedMockById(orderId),
				...res.data,
				id: orderId,
			};
		}
		return getOrderOpenedMockById(orderId);
	} catch (error) {
		console.warn(
			"[Order Information API] Request failed, using matched mock data fallback:",
			error instanceof Error ? error.message : error
		);
		return getOrderOpenedMockById(orderId);
	}
}

/**
 * Updates order details via API with fallback to local update
 */
export async function updateOrderInformation(
	orderId: string,
	updatedData: Partial<OrderOpenedData>
): Promise<OrderOpenedData> {
	const res = await axiosInstance.patch(API_PATH.ORDERS.GET(orderId), updatedData);
	return res.data?.data || res.data || { ...getOrderOpenedMockById(orderId), ...updatedData };
}

