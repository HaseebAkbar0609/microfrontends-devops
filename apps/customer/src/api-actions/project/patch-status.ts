import { API_PATH } from "@/constants/api";
import { projectMessages } from "@/constants/messages";
import axiosInstance from "@/lib/axiosInstance";
import { showToast } from "@/lib/toast";
import type { ActionResult, ApiError } from "@/types/api";

/** Values accepted by PATCH /api/v1/project/:project_id/status */
export type ProjectStatusPatchValue = "archived" | "deleted";

export async function patchProjectStatusAPIAction(
	projectId: string,
	status: ProjectStatusPatchValue,
): Promise<ActionResult<unknown>> {
	if (!projectId?.trim()) {
		return { success: false, data: null, error: "Missing project id" };
	}

	const successMessage =
		status === "archived"
			? projectMessages.archive.success
			: projectMessages.delete.success;
	const failMessage =
		status === "archived"
			? projectMessages.archive.failed
			: projectMessages.delete.failed;

	try {
		await axiosInstance.patch(API_PATH.PROJECT.status(projectId.trim()), {
			status,
		});

		showToast("success", successMessage);
		return { success: true, data: null, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage =
			apiError.response?.data?.message || failMessage;
		showToast("error", errorMessage);
		return { success: false, data: null, error: errorMessage };
	}
}
