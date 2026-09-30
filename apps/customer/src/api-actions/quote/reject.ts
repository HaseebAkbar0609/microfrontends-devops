import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import { showToast } from "@/lib/toast";
import type { ActionResult } from "@/types/api";
import { handleApiError } from "@/utils/apiError";

export async function rejectQuoteAPIAction(mappingId: string): Promise<ActionResult<null>> {
	try {
		await axiosInstance.patch(API_PATH.QUOTE.reject(mappingId));
		showToast("success", "Quote rejected");
		return { success: true, data: null, error: null };
	} catch (error: unknown) {
		const result = handleApiError(error, "Failed to reject quote");
		showToast("error", result.error || "Failed to reject quote");
		return { ...result, data: null };
	}
}
