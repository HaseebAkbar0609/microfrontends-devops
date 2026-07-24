import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import type { TicketItem } from "./list";
import { handleApiError } from "@/utils/apiError";

export async function getQuestionDetailAPIAction(
	ticketId: string,
): Promise<ActionResult<TicketItem>> {
	try {
		const { data: res } = await axiosInstance.get<{
			success: boolean;
			message?: string;
			data: TicketItem;
		}>(API_PATH.QUESTIONS.detail(ticketId));

		if (!res || res.success === false || !res.data) {
			return {
				success: false,
				data: null,
				error: res?.message || "Question not found",
			};
		}

		return { success: true, data: res.data, error: null };
	} catch (error: unknown) {
		return handleApiError(error, "Failed to load question");
	}
}

export async function addQuestionReplyAPIAction(
	ticketId: string,
	message: string,
): Promise<ActionResult<TicketItem>> {
	try {
		const { data: res } = await axiosInstance.post<{
			success: boolean;
			message?: string;
			data: TicketItem;
		}>(API_PATH.QUESTIONS.reply(ticketId), { message });

		if (!res || res.success === false || !res.data) {
			return {
				success: false,
				data: null,
				error: res?.message || "Failed to add reply",
			};
		}

		return { success: true, data: res.data, error: null };
	} catch (error: unknown) {
		return handleApiError(error, "Failed to add reply");
	}
}
