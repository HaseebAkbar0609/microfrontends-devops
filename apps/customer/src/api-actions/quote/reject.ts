import { t } from "i18next";
import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import { showToast } from "@/lib/toast";
import type { ActionResult } from "@/types/api";
import { handleApiError } from "@/utils/apiError";
import localizationConstants from "@/utils/translation/constants";

export async function rejectQuoteAPIAction(mappingId: string): Promise<ActionResult<null>> {
	try {
		await axiosInstance.patch(API_PATH.QUOTE.reject(mappingId));
		showToast("success", t(localizationConstants.quoteRejectedSuccess));
		return { success: true, data: null, error: null };
	} catch (error: unknown) {
		const result = handleApiError(error, t(localizationConstants.quoteRejectFailed));
		showToast("error", result.error || t(localizationConstants.quoteRejectFailed));
		return { ...result, data: null };
	}
}
