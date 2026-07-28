import axiosInstance from "@/lib/axiosInstance";
import type { LeadsListApiResponse, LeadsListQueryParams, LeadsListResult } from "@/features/leads/types";
import { mapLeadListItemToRow } from "@/api-actions/leads/shared";

const LEADS_LIST_PATH = "/api/v1/teams/lead/list";
const DEFAULT_PAGE_SIZE = 10;

export async function listLeadsAPIAction(
	params: LeadsListQueryParams = {}
): Promise<LeadsListResult> {
	const page = params.page ?? 1;
	const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
	const response = await axiosInstance.get<LeadsListApiResponse>(LEADS_LIST_PATH, {
		params: {
			page,
			page_size: pageSize,
		},
	});
	const payload = response.data;

	return {
		items: (payload.data ?? []).map(mapLeadListItemToRow),
		totalPages: payload.total_pages ?? 1,
		totalItems: payload.total_items ?? 0,
		currentPage: payload.current_page ?? page,
		pageSize: payload.page_size ?? pageSize,
	};
}
