import { t } from "i18next";
import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import { showToast } from "@/lib/toast";
import type { ActionResult } from "@/types/api";
import { handleApiError } from "@/utils/apiError";
import localizationConstants from "@/utils/translation/constants";

export async function approveQuoteAPIAction(
	quoteId: string,
): Promise<ActionResult<unknown>> {
	if (!quoteId?.trim()) {
		return { success: false, data: null, error: "Missing quote id" };
	}

	try {
		await axiosInstance.patch(API_PATH.QUOTE.approve(quoteId.trim()));
		showToast("success", t(localizationConstants.quoteApprovedSuccess));
		return { success: true, data: null, error: null };
	} catch (error: unknown) {
		const result = handleApiError(error, t(localizationConstants.quoteApproveFailed));
		showToast("error", result.error || t(localizationConstants.quoteApproveFailed));
		return result;
	}
}
