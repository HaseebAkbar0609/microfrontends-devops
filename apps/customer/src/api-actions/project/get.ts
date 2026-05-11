import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError } from "@/types/api";

/**
 * GET /api/v1/project/:projectId — project payload shape is normalized in
 * `mapProjectDetailToFormHydration`.
 */
export async function getProjectByIdAPIAction(
	projectId: string,
): Promise<ActionResult<Record<string, unknown>>> {
	if (!projectId?.trim()) {
		return { success: false, data: null, error: "Missing project id" };
	}

	try {
		const { data: body } = await axiosInstance.get<unknown>(
			API_PATH.PROJECT.detail(projectId.trim()),
		);

		const response =
			body &&
			typeof body === "object" &&
			"data" in body &&
			(body as { data?: unknown }).data != null &&
			typeof (body as { data: unknown }).data === "object" &&
			!Array.isArray((body as { data: unknown }).data)
				? ((body as { data: Record<string, unknown> }).data as Record<
						string,
						unknown
					>)
				: body && typeof body === "object" && !Array.isArray(body)
					? (body as Record<string, unknown>)
					: null;

		if (!response) {
			return {
				success: false,
				data: null,
				error: "Invalid project response",
			};
		}

		return { success: true, data:response , error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: false,
			data: null,
			error:
				apiError.response?.data?.message || "Failed to load project",
		};
	}
}
