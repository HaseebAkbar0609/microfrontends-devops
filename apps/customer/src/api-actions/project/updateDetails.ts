import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import { showToast } from "@/lib/toast";
import type { ActionResult, ApiError } from "@/types/api";

export interface UpdateProjectDetailsPayload {
	project_name?: string;
	start_date?: string;
	due_date?: string;
	client_no?: string;
	project_code?: string;
	order_no?: string;
	contact_person_name?: string;
	mobile_number?: string;
	email?: string;
	address?: string;
	postal_code?: string;
	company_name?: string;
}

export async function updateProjectDetailsAPIAction(
	projectId: string,
	payload: UpdateProjectDetailsPayload,
): Promise<ActionResult<unknown>> {
	if (!projectId?.trim()) {
		return { success: false, data: null, error: "Missing project id" };
	}

	try {
		const res = await axiosInstance.patch(
			API_PATH.PROJECT.details(projectId.trim()),
			payload,
		);

		showToast("success", "Project details updated successfully");
		return { success: true, data: res.data?.data || null, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage =
			apiError.response?.data?.message || "Failed to update project details";
		showToast("error", errorMessage);
		return { success: false, data: null, error: errorMessage };
	}
}
