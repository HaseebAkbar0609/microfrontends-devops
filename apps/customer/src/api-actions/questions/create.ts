import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import type { TicketItem } from "./list";
import { handleApiError } from "@/utils/apiError";

export interface CreateQuestionPayload {
	subject: string;
	message: string;
	category?: string;
}

export async function createQuestionAPIAction(
	payload: CreateQuestionPayload,
): Promise<ActionResult<TicketItem>> {
	try {
		const { data: res } = await axiosInstance.post<{
			success: boolean;
			message?: string;
			data: TicketItem;
		}>(API_PATH.QUESTIONS.CREATE, payload);

		if (!res || res.success === false || !res.data) {
			return {
				success: false,
				data: null,
				error: res?.message || "Failed to create question",
			};
		}

		return { success: true, data: res.data, error: null };
	} catch (error: unknown) {
		return handleApiError(error, "Failed to create question");
	}
}
