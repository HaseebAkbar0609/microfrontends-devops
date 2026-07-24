import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import { handleApiError } from "@/utils/apiError";

export interface TicketMessageItem {
	id: string;
	sender_id: string;
	sender_type: string;
	message: string;
	attachment_url: string | null;
	created_at: number;
}

export interface TicketItem {
	id: string;
	subject: string;
	category: string | null;
	status: string;
	created_at: number;
	last_activity_at: number | null;
	messages?: TicketMessageItem[];
}

export interface QuestionsListPayload {
	items: TicketItem[];
	total_items: number;
	total_pages: number;
	current_page: number;
	page_size: number;
}

export interface GetQuestionsListParams {
	page?: number;
	page_size?: number;
	search?: string;
	status?: string;
	category?: string;
}

interface ApiQuestionsListResponse {
	success: boolean;
	message?: string;
	data: TicketItem[];
	total_items?: number;
	total_pages?: number;
	current_page?: number;
	page_size?: number;
}

export async function getQuestionsListAPIAction(
	params: GetQuestionsListParams = {},
): Promise<ActionResult<QuestionsListPayload>> {
	const { page = 1, page_size = 20, search, status, category } = params;

	const queryParams = new URLSearchParams();
	queryParams.set("page", String(page));
	queryParams.set("page_size", String(page_size));
	if (search?.trim()) queryParams.set("search", search.trim());
	if (status) queryParams.set("status", status);
	if (category) queryParams.set("category", category);

	try {
		const { data: res } = await axiosInstance.get<ApiQuestionsListResponse>(
			`${API_PATH.QUESTIONS.LIST}?${queryParams.toString()}`,
		);

		if (!res || res.success === false || res.data == null || !Array.isArray(res.data)) {
			return {
				success: false,
				data: null,
				error: res?.message || "Invalid response format",
			};
		}

		const total_items = res.total_items ?? res.data.length;
		const effective_page_size = res.page_size ?? page_size;
		const fallback_total_pages =
			effective_page_size > 0 ? Math.ceil(total_items / effective_page_size) : 0;

		return {
			success: true,
			data: {
				items: res.data,
				total_items,
				total_pages: res.total_pages ?? fallback_total_pages,
				current_page: res.current_page ?? page,
				page_size: effective_page_size,
			},
			error: null,
		};
	} catch (error: unknown) {
		return handleApiError(error, "Failed to load questions");
	}
}
