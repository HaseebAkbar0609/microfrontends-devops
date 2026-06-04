import axiosInstance from "@/lib/axiosInstance";
import { ActionResult, ApiError, ApiResponse } from "@/types/api";
import { SaveProjectPayload, SaveProjectResponse } from "@/features/quote/types/api";
import { showToast } from "@/lib/toast";
import { projectMessages } from "@/constants/messages";
import { API_PATH } from "@/constants/api";

const SAVE_PROJECT_PATH = API_PATH.PROJECT.SAVE;

/**
 * Persist wizard progress with `is_send` forced to false (Save / draft only).
 * Use {@link saveProjectAPIAction} when the caller must set `is_send` (e.g. Next on step 4).
 */
export async function saveProjectDraftAPIAction(
	payload: SaveProjectPayload,
): Promise<ActionResult<SaveProjectResponse>> {
	return saveProjectAPIAction({ ...payload, is_send: false });
}

export const saveProjectAPIAction = async (
	payload: SaveProjectPayload,
	options: { showSuccessToast?: boolean } = {},
): Promise<ActionResult<SaveProjectResponse>> => {
	try {
		const response = await axiosInstance.post<
			ApiResponse<SaveProjectResponse> | { data: SaveProjectResponse }
		>(SAVE_PROJECT_PATH, payload);

		const apiData =
			"data" in response.data
				? (response.data.data as SaveProjectResponse)
				: (response.data as SaveProjectResponse);

		if (!apiData) {
			const errorMsg = projectMessages.save.invalidResponse;
			showToast("error", errorMsg);
			return { success: false, data: null, error: errorMsg };
		}

		if (options.showSuccessToast !== false) {
			showToast("success", projectMessages.save.success);
		}
		return { success: true, data: apiData, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorResponse = apiError.response?.data;
		const errorMessage = errorResponse?.message || projectMessages.save.failed;

		showToast("error", errorMessage);
		return {
			success: false,
			data: null,
			error: errorMessage,
		};
	}
};
