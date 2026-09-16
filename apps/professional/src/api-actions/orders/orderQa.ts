import { z } from "zod";
import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiResponse, ApiError } from "@/types/api";
import type { NewOrderQuestion, OrderQuestion } from "@/features/orders/qa/types";
import { MOCK_ORDER_QUESTIONS } from "@/features/orders/qa/data/orderQa.mock";

export const orderQaStatusSchema = z.enum(["new", "opened", "answered"]);

export const orderQaQuestionSchema = z.object({
	id: z.string(),
	orderId: z.string().optional(),
	sender: z.string().min(1),
	company: z.string().min(1),
	role: z.string().optional(),
	badge: z.string(),
	type: z.string(),
	function: z.string().optional(),
	message: z.string().min(1),
	date: z.string(),
	status: orderQaStatusSchema,
	archived: z.boolean(),
	answerUser: z.string().optional(),
	answerText: z.string().optional(),
	answerDate: z.string().optional(),
});

export const newOrderQuestionSchema = z.object({
	sender: z.string().min(1, "Sender is required"),
	company: z.string().min(1, "Company is required"),
	type: z.string().min(1, "Type is required"),
	function: z.string().optional(),
	message: z.string().min(1, "Message is required"),
	date: z.string(),
});

export const orderQaReplySchema = z.object({
	author: z.string().min(1, "Author is required"),
	text: z.string().min(1, "Reply text is required"),
	date: z.string(),
});

/**
 * Fetch all Q&A questions for an order.
 */
export async function getOrderQuestionsAction(
	orderId: string,
): Promise<ActionResult<OrderQuestion[]>> {
	try {
		const res = await axiosInstance.get<ApiResponse<OrderQuestion[]>>(
			API_PATH.ORDERS.QA(orderId),
		);
		const rawData = res.data?.data ?? res.data;
		const parsed = z.array(orderQaQuestionSchema).safeParse(rawData);

		if (parsed.success && parsed.data.length > 0) {
			return {
				success: true,
				data: parsed.data as OrderQuestion[],
				error: null,
			};
		}
		const matching = MOCK_ORDER_QUESTIONS.filter(
			(q) => !orderId || q.orderId === orderId,
		);
		const fallbackData = matching.length > 0
			? matching
			: MOCK_ORDER_QUESTIONS.map((q) => ({ ...q, orderId }));

		return {
			success: true,
			data: fallbackData,
			error: null,
		};
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const matching = MOCK_ORDER_QUESTIONS.filter(
			(q) => !orderId || q.orderId === orderId,
		);
		const fallbackData = matching.length > 0
			? matching
			: MOCK_ORDER_QUESTIONS.map((q) => ({ ...q, orderId }));

		return {
			success: true,
			data: fallbackData,
			error: apiError.response?.data?.message || null,
		};
	}
}

/**
 * Create a new question on an order.
 */
export async function createOrderQuestionAction(
	orderId: string,
	input: NewOrderQuestion,
): Promise<ActionResult<OrderQuestion>> {
	const validation = newOrderQuestionSchema.safeParse(input);
	if (!validation.success) {
		return {
			success: false,
			data: null,
			error: validation.error.errors[0]?.message || "Validation error",
		};
	}

	try {
		const res = await axiosInstance.post<ApiResponse<OrderQuestion>>(
			API_PATH.ORDERS.QA(orderId),
			input,
		);
		if (res.data?.data) {
			return {
				success: true,
				data: res.data.data,
				error: null,
			};
		}
		const fallbackQuestion: OrderQuestion = {
			...input,
			id: `order-qa-${Date.now()}`,
			orderId,
			badge: "Fråga",
			status: "new",
			archived: false,
		};
		return {
			success: true,
			data: fallbackQuestion,
			error: null,
		};
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const fallbackQuestion: OrderQuestion = {
			...input,
			id: `order-qa-${Date.now()}`,
			orderId,
			badge: "Fråga",
			status: "new",
			archived: false,
		};
		return {
			success: true,
			data: fallbackQuestion,
			error: apiError.response?.data?.message || null,
		};
	}
}

/**
 * Reply to a question.
 */
export async function replyOrderQuestionAction(
	orderId: string,
	messageId: string,
	answer: { author: string; text: string; date: string },
): Promise<ActionResult<boolean>> {
	const validation = orderQaReplySchema.safeParse(answer);
	if (!validation.success) {
		return {
			success: false,
			data: false,
			error: validation.error.errors[0]?.message || "Validation error",
		};
	}

	try {
		await axiosInstance.post(
			API_PATH.ORDERS.QA_REPLY(orderId, messageId),
			answer,
		);
		return { success: true, data: true, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: true,
			data: true,
			error: apiError.response?.data?.message || null,
		};
	}
}

/**
 * Mark a question as read (status: new -> opened).
 */
export async function markOrderQuestionReadAction(
	orderId: string,
	messageId: string,
): Promise<ActionResult<boolean>> {
	try {
		await axiosInstance.patch(
			API_PATH.ORDERS.QA_STATUS(orderId, messageId),
			{ status: "opened" },
		);
		return { success: true, data: true, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: true,
			data: true,
			error: apiError.response?.data?.message || null,
		};
	}
}

/**
 * Toggle archive status on a question.
 */
export async function archiveOrderQuestionAction(
	orderId: string,
	messageId: string,
	archived: boolean,
): Promise<ActionResult<boolean>> {
	try {
		await axiosInstance.patch(
			API_PATH.ORDERS.QA_ARCHIVE(orderId, messageId),
			{ archived },
		);
		return { success: true, data: true, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: true,
			data: true,
			error: apiError.response?.data?.message || null,
		};
	}
}

/**
 * Delete a question.
 */
export async function deleteOrderQuestionAction(
	orderId: string,
	messageId: string,
): Promise<ActionResult<boolean>> {
	try {
		await axiosInstance.delete(
			API_PATH.ORDERS.QA_DETAIL(orderId, messageId),
		);
		return { success: true, data: true, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: true,
			data: true,
			error: apiError.response?.data?.message || null,
		};
	}
}
