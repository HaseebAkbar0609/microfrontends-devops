import { t } from "i18next";
import axiosInstance from "@/lib/axiosInstance";
import { ActionResult, ApiError, ApiResponse } from "@/types/api";
import { MediaUploadResponse } from "@/features/quote/types/api";
import { showToast } from "@/lib/toast";
import { API_PATH } from "@/constants/api";
import localizationConstants from "@/utils/translation/constants";

const UPLOAD_PATH = API_PATH.MEDIA.UPLOAD;

export const uploadMediaAPIAction = async (
	file: File,
): Promise<ActionResult<MediaUploadResponse>> => {
	try {
		const formData = new FormData();
		formData.append("file", file);

		const response = await axiosInstance.post<
			ApiResponse<MediaUploadResponse> | { data: MediaUploadResponse }
		>(UPLOAD_PATH, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		const apiData =
			"data" in response.data
				? (response.data.data as MediaUploadResponse)
				: (response.data as MediaUploadResponse);

		if (!apiData) {
			const errorMsg = t(localizationConstants.errorInvalidServerResponse);
			showToast("error", errorMsg);
			return { success: false, data: null, error: errorMsg };
		}

		const row = apiData as MediaUploadResponse & {
			media_id?: string;
			uuid?: string;
		};
		const id = String(row.id ?? row.media_id ?? row.uuid ?? "").trim();
		if (!id) {
			const errorMsg = t(localizationConstants.mediaUploadMissingId);
			showToast("error", errorMsg);
			return { success: false, data: null, error: errorMsg };
		}

		return {
			success: true,
			data: {
				...row,
				id,
				file_name: row.file_name?.trim() || "file",
			},
			error: null,
		};
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorResponse = apiError.response?.data;
		const errorMessage =
			errorResponse?.message || t(localizationConstants.mediaUploadFailed);

		showToast("error", errorMessage);
		return {
			success: false,
			data: null,
			error: errorMessage,
		};
	}
};
