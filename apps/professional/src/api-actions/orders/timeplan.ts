import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiResponse, ApiError } from "@/types/api";
import type { OrderTimeplan } from "@/features/orders/timeplan/types/timeplan.types";
import { MOCK_ORDER_TIMEPLANS } from "@/features/orders/timeplan/data/timeplan.mock";

export async function getOrderTimeplansAction(
	orderId: string
): Promise<ActionResult<OrderTimeplan[]>> {
	try {
		const res = await axiosInstance.get<ApiResponse<OrderTimeplan[]>>(
			API_PATH.ORDERS.TIMEPLANS(orderId)
		);
		if (res.data?.data && Array.isArray(res.data.data)) {
			return {
				success: true,
				data: res.data.data,
				error: null,
			};
		}
		return {
			success: true,
			data: MOCK_ORDER_TIMEPLANS,
			error: null,
		};
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: true,
			data: MOCK_ORDER_TIMEPLANS,
			error: apiError.response?.data?.message || null,
		};
	}
}

export async function deleteOrderTimeplanAction(
	orderId: string,
	planId: string
): Promise<ActionResult<boolean>> {
	try {
		await axiosInstance.delete(API_PATH.ORDERS.TIMEPLAN_DETAIL(orderId, planId));
		return { success: true, data: true, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: true,
			data: true,
			error: apiError.response?.data?.message || null,
		};
	}
}

