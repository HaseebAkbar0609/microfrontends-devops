import { z } from "zod";
import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiResponse, ApiError } from "@/types/api";
import type { OrderTimeplan, OrderTimeplanTask } from "@/features/orders/timeplan/types/timeplan.types";
import { MOCK_ORDER_TIMEPLANS, MOCK_GANTT_TASKS_FIGMA } from "@/features/orders/timeplan/data/timeplan.mock";
import { TIMEPLAN_CONSTANTS } from "@/features/orders/timeplan/constants/timeplan.constants";

/* -------------------------------------------------------------------------- */
/* Zod Schemas                                                                */
/* -------------------------------------------------------------------------- */
export const orderTimeplanSchema = z.object({
	id: z.string(),
	name: z.string().default(""),
	kind: z.string().default(TIMEPLAN_CONSTANTS.KINDS.MAIN),
	date: z.string().default(""),
	createdBy: z.string().default(""),
	customer: z.string().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	revisedDate: z.string().optional(),
	description: z.string().optional(),
});

export const orderTimeplanTaskSchema = z.object({
	id: z.string(),
	parentId: z.string().optional(),
	name: z.string(),
	startDate: z.string(),
	endDate: z.string().optional(),
	level: z.number().default(1),
	hasChildren: z.boolean().default(false),
	durationDays: z.number().default(1),
	startDayIndex: z.number().default(0),
	color: z.string().default("bg-cyan-500"),
	tag: z.string().optional(),
	tagPosition: z.enum(["left", "right"]).optional(),
	kind: z.enum(["subtask", "milestone"]).default("subtask"),
	expanded: z.boolean().default(true),
});

/* -------------------------------------------------------------------------- */
/* API Actions                                                                */
/* -------------------------------------------------------------------------- */
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

export async function getOrderTimeplanDetailAction(
	orderId: string,
	planId: string
): Promise<ActionResult<OrderTimeplan>> {
	try {
		const res = await axiosInstance.get<ApiResponse<OrderTimeplan>>(
			API_PATH.ORDERS.TIMEPLAN_DETAIL(orderId, planId)
		);
		if (res.data?.data) {
			return {
				success: true,
				data: res.data.data,
				error: null,
			};
		}
		const matchedMock = MOCK_ORDER_TIMEPLANS.find((p) => p.id === planId) || MOCK_ORDER_TIMEPLANS[0];
		return {
			success: true,
			data: matchedMock,
			error: null,
		};
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const matchedMock = MOCK_ORDER_TIMEPLANS.find((p) => p.id === planId) || MOCK_ORDER_TIMEPLANS[0];
		return {
			success: true,
			data: matchedMock,
			error: apiError.response?.data?.message || null,
		};
	}
}

export async function getOrderTimeplanTasksAction(
	orderId: string,
	planId?: string
): Promise<ActionResult<OrderTimeplanTask[]>> {
	try {
		const endpoint = planId
			? `${API_PATH.ORDERS.TIMEPLAN_DETAIL(orderId, planId)}/tasks`
			: `${API_PATH.ORDERS.TIMEPLANS(orderId)}/tasks`;

		const res = await axiosInstance.get<ApiResponse<OrderTimeplanTask[]>>(endpoint);
		if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
			return {
				success: true,
				data: res.data.data,
				error: null,
			};
		}
		return {
			success: true,
			data: MOCK_GANTT_TASKS_FIGMA,
			error: null,
		};
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: true,
			data: MOCK_GANTT_TASKS_FIGMA,
			error: apiError.response?.data?.message || null,
		};
	}
}

export async function createOrderTimeplanAction(
	orderId: string,
	planData: Partial<OrderTimeplan>
): Promise<ActionResult<OrderTimeplan>> {
	try {
		const res = await axiosInstance.post<ApiResponse<OrderTimeplan>>(
			API_PATH.ORDERS.TIMEPLANS(orderId),
			planData
		);
		if (res.data?.data) {
			return {
				success: true,
				data: res.data.data,
				error: null,
			};
		}
		const fallbackPlan: OrderTimeplan = {
			id: `plan-${Date.now()}`,
			name: planData.name || "Ny Tidsplan",
			kind: planData.kind || TIMEPLAN_CONSTANTS.KINDS.MAIN,
			date: planData.date || new Date().toISOString().slice(0, 10).replace(/-/g, "/"),
			createdBy: planData.createdBy || TIMEPLAN_CONSTANTS.AUTHORS[0].name,
			...planData,
		};
		return {
			success: true,
			data: fallbackPlan,
			error: null,
		};
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const fallbackPlan: OrderTimeplan = {
			id: `plan-${Date.now()}`,
			name: planData.name || "Ny Tidsplan",
			kind: planData.kind || TIMEPLAN_CONSTANTS.KINDS.MAIN,
			date: planData.date || new Date().toISOString().slice(0, 10).replace(/-/g, "/"),
			createdBy: planData.createdBy || TIMEPLAN_CONSTANTS.AUTHORS[0].name,
			...planData,
		};
		return {
			success: true,
			data: fallbackPlan,
			error: apiError.response?.data?.message || null,
		};
	}
}

export async function addOrderTimeplanTaskAction(
	orderId: string,
	planId: string,
	taskData: Partial<OrderTimeplanTask>
): Promise<ActionResult<OrderTimeplanTask>> {
	try {
		const endpoint = `${API_PATH.ORDERS.TIMEPLAN_DETAIL(orderId, planId)}/tasks`;
		const res = await axiosInstance.post<ApiResponse<OrderTimeplanTask>>(endpoint, taskData);
		if (res.data?.data) {
			return {
				success: true,
				data: res.data.data,
				error: null,
			};
		}
		const fallbackTask: OrderTimeplanTask = {
			id: `task-${Date.now()}`,
			name: taskData.name || "Ny uppgift",
			startDate: taskData.startDate || new Date().toISOString().slice(0, 10).replace(/-/g, "/"),
			endDate: taskData.endDate || new Date().toISOString().slice(0, 10).replace(/-/g, "/"),
			level: taskData.level || 1,
			hasChildren: false,
			durationDays: taskData.durationDays || 3,
			startDayIndex: taskData.startDayIndex || 0,
			color: taskData.color || "bg-cyan-500",
			tag: taskData.name || "Ny uppgift",
			kind: taskData.kind || "subtask",
			expanded: true,
			children: [],
			...taskData,
		};
		return {
			success: true,
			data: fallbackTask,
			error: null,
		};
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const fallbackTask: OrderTimeplanTask = {
			id: `task-${Date.now()}`,
			name: taskData.name || "Ny uppgift",
			startDate: taskData.startDate || new Date().toISOString().slice(0, 10).replace(/-/g, "/"),
			endDate: taskData.endDate || new Date().toISOString().slice(0, 10).replace(/-/g, "/"),
			level: taskData.level || 1,
			hasChildren: false,
			durationDays: taskData.durationDays || 3,
			startDayIndex: taskData.startDayIndex || 0,
			color: taskData.color || "bg-cyan-500",
			tag: taskData.name || "Ny uppgift",
			kind: taskData.kind || "subtask",
			expanded: true,
			children: [],
			...taskData,
		};
		return {
			success: true,
			data: fallbackTask,
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
			success: false,
			data: false,
			error: apiError.response?.data?.message || null,
		};
	}
}



