import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError } from "@/types/api";

export interface GetActiveProjectsParams {
	limit?: number;
	cursor?: string;
	sort?: "updatedAt_desc" | "dueDate_asc" | "name_asc";
}

export interface ActiveProjectItem {
	id: string;
	name: string;
	projectCode?: string;
	status: string;
	statusLabel: string;
	progressPercent: number;
	startDate?: string;
	dueDate?: string;
	updatedAt: string;
	companyName?: string;
	company?: {
		name?: string;
	};
	primaryContact?: {
		id?: string;
		name?: string;
		companyName?: string;
	};
	summary: {
		openTasks: number;
		completedTasks: number;
		nextMilestone?: string;
	};
}

export interface ActiveProjectListPayload {
	data: ActiveProjectItem[];
	pageInfo: {
		nextCursor: string | null;
		hasNextPage: boolean;
	};
}

export async function getActiveProjectsAPIAction(
	params: GetActiveProjectsParams = {},
): Promise<ActionResult<ActiveProjectListPayload>> {
	const { limit = 30, cursor, sort } = params;

	const q = new URLSearchParams();
	q.set("limit", String(limit));
	if (cursor) q.set("cursor", cursor);
	if (sort) q.set("sort", sort);

	try {
		const { data: body } = await axiosInstance.get<ActiveProjectListPayload>(
			`${API_PATH.PROJECT.ACTIVE}?${q.toString()}`,
		);
		return {
			success: true,
			data: body,
			error: null,
		};
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: false,
			data: null,
			error: apiError.response?.data?.message || "Failed to load active projects",
		};
	}
}
