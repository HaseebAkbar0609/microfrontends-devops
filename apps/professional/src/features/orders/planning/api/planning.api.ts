import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type {
	PlanningQuery,
	PlanningResponse,
	PlanningTask,
} from "../types/planning.types";
import { MOCK_PLANNING_RESPONSE } from "../data/planning.mock";

export type CreatePlanningTaskPayload = Omit<PlanningTask, "id">;
export type UpdatePlanningTaskPayload = Partial<PlanningTask>;

export async function getPlanning(
	params: PlanningQuery,
): Promise<PlanningResponse> {
	try {
		const res = await axiosInstance.get(API_PATH.PLANNING.LIST, {
			params: {
				startDate: params.startDate,
				endDate: params.endDate,
				search: params.search,
				status: params.status,
				assigneeId: params.assigneeId,
				projectId: params.projectId,
			},
		});
		if (res.data?.data) {
			return res.data.data;
		}
		return res.data;
	} catch (error) {
		console.warn(
			"[Planning API] getPlanning request failed, using mock data fallback:",
			error instanceof Error ? error.message : error
		);
		return MOCK_PLANNING_RESPONSE;
	}
}

export async function createPlanningTask(
	payload: CreatePlanningTaskPayload,
): Promise<PlanningTask> {
	const res = await axiosInstance.post(API_PATH.PLANNING.CREATE, payload);
	return res.data?.data ?? res.data;
}

export async function updatePlanningTask({
	taskId,
	payload,
}: {
	taskId: string;
	payload: UpdatePlanningTaskPayload;
}): Promise<PlanningTask> {
	const res = await axiosInstance.put(
		API_PATH.PLANNING.UPDATE(taskId),
		payload,
	);
	return res.data?.data ?? res.data;
}

export async function deletePlanningTask(taskId: string): Promise<void> {
	await axiosInstance.delete(API_PATH.PLANNING.DELETE(taskId));
}
