import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import { handleApiError } from "@/utils/apiError";

export async function deleteMediaAPIAction(mediaId: string): Promise<ActionResult<unknown>> {
	if (!mediaId?.trim()) {
		return { success: false, data: null, error: "Missing media id" };
	}
	try {
		const encodedId = encodeURIComponent(mediaId.trim());
		await axiosInstance.delete(`/api/v1/media/${encodedId}`);
		return { success: true, data: null, error: null };
	} catch (error: unknown) {
		return handleApiError(error, "Failed to delete media");
	}
}
