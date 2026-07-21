import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError } from "@/types/api";
import type { Quote } from "@/features/quote/types/types";
import {
	mapProjectRowToQuote,
	parseProjectListResponse,
} from "@/features/quote/utils/projectListFromApi";

export interface GetProjectListParams {
	page?: number;
	pageSize?: number;
	search?: string;
	sortBy?: string;
	sortOrder?: string;
	quote_status?: string;
	project_type?: string;
}

export interface ProjectListPayload {
	quotes: Quote[];
	totalItems: number;
	totalPages?: number;
}

export async function getProjectListAPIAction(
	params: GetProjectListParams = {},
): Promise<ActionResult<ProjectListPayload>> {
	const {
		page = 1,
		pageSize = 10,
		search,
		sortBy,
		sortOrder,
		quote_status,
		project_type,
	} = params;

	const normalizedPageSize = pageSize > 0 ? pageSize : 10;

	const q = new URLSearchParams();
	q.set("page", String(page));
	q.set("page_size", String(normalizedPageSize));
	if (search != null && String(search).trim() !== "") {
		q.set("search", String(search).trim());
	}
	if (sortBy) q.set("sort_by", sortBy);
	if (sortOrder) q.set("sort_order", sortOrder);
	if (quote_status) q.set("quote_status", quote_status);
	if (project_type) q.set("project_type", project_type);

	try {
		const { data: body } = await axiosInstance.get<unknown>(
			`${API_PATH.PROJECT.LIST}?${q.toString()}`,
		);

		const parsed = parseProjectListResponse(body);
		if (!parsed) {
			const msg =
				body &&
				typeof body === "object" &&
				"message" in body &&
				typeof (body as { message?: unknown }).message === "string"
					? (body as { message: string }).message
					: "Invalid project list response";
			return { success: false, data: null, error: msg };
		}

		const quotes = parsed.items
			.map(mapProjectRowToQuote)
			.filter((row): row is Quote => row !== null);

		const total = parsed.total ?? quotes.length;
		const totalPages = Math.ceil(total / normalizedPageSize) || 1;

		return {
			success: true,
			data: {
				quotes,
				totalItems: total,
				totalPages,
			},
			error: null,
		};
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: false,
			data: null,
			error:
				apiError.response?.data?.message || "Failed to load projects",
		};
	}
}
