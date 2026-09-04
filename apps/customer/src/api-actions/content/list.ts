import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import { handleApiError } from "@/utils/apiError";

export interface ContentItem {
	id: string;
	title: string;
	summary: string | null;
	category: string;
	tags: string[];
	thumbnail_url: string | null;
	author: string | null;
	reading_time: number | null;
	publish_date: number | null;
	target_url: string | null;
	detail_id: string | null;
	content_type: string;
	created_at: number;
}

export interface ContentListPayload {
	items: ContentItem[];
	total_items: number;
	total_pages: number;
	current_page: number;
	page_size: number;
}

export interface GetContentListParams {
	page?: number;
	page_size?: number;
	search?: string;
	category?: string;
	content_type?: string;
}

interface ApiContentListResponse {
	success: boolean;
	message?: string;
	data: ContentItem[];
	total_items?: number;
	total_pages?: number;
	current_page?: number;
	page_size?: number;
}

export async function getContentListAPIAction(
	params: GetContentListParams = {},
): Promise<ActionResult<ContentListPayload>> {
	const { page = 1, page_size = 20, search, category, content_type } = params;

	const queryParams = new URLSearchParams();
	queryParams.set("page", String(page));
	queryParams.set("page_size", String(page_size));
	if (search?.trim()) {
		queryParams.set("search", search.trim());
	}
	if (category) {
		queryParams.set("category", category);
	}
	if (content_type) {
		queryParams.set("content_type", content_type);
	}

	try {
		const { data: res } = await axiosInstance.get<ApiContentListResponse>(
			`${API_PATH.CONTENT.LIST}?${queryParams.toString()}`,
		);

		if (!res || res.success === false || res.data == null || !Array.isArray(res.data)) {
			return {
				success: false,
				data: null,
				error: res?.message || "Invalid response format from content API",
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
		return handleApiError(error, "Failed to load content");
	}
}
