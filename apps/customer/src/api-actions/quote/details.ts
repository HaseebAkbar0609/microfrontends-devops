import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import { API_PATH } from "@/constants/api";
import { handleApiError } from "@/utils/apiError";

export async function getQuoteDetailsAPIAction(quoteId: string): Promise<ActionResult<unknown>> {
	if (!quoteId?.trim()) {
		return { success: false, data: null, error: "Missing quote id" };
	}

	try {
		const url = API_PATH.QUOTE.details(quoteId.trim());
		const { data } = await axiosInstance.get(url);
		return {
			success: true,
			data: data?.data ?? data,
			error: null,
		};
	} catch (error: unknown) {
		return handleApiError(error, "Failed to fetch quote details");
	}
}
