import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiError } from "@/types/api";
import type { Consultant } from "@/features/consultant/types/consultant";

export interface GetConsultantListParams {
	page?: number;
	pageSize?: number;
	search?: string;
	status?: string;
	type?: string;
	requestId?: string;
	projectId?: string;
	sortBy?: string;
	sortOrder?: string;
}

export interface ConsultantListPayload {
	consultants: Consultant[];
	totalItems: number;
}

interface ApplicationItem {
	id: string;
	consultant_type_id?: string;
	project_name?: string;
	status: string;
	created_at: number;
	company?: { company_name?: string; email?: string; phone?: string };
}

// The backend's pagination_response puts the totals next to `data`, not under `meta`.
interface ApplicationsListResponse {
	data?: ApplicationItem[];
	total_items?: number;
}

export async function getConsultantListAPIAction(
	params: GetConsultantListParams = {},
): Promise<ActionResult<ConsultantListPayload>> {
	const {
		page = 1,
		pageSize = 10,
		search,
		status,
		type,
		requestId,
		projectId,
		sortBy,
		sortOrder = "asc",
	} = params;

	try {
		const query = new URLSearchParams({
			page: page.toString(),
			page_size: pageSize.toString(),
		});

		if (search) query.append("search", search);
		if (status) query.append("status", status);
		if (type) query.append("consultant_type", type);
		if (requestId) query.append("request_id", requestId);
		if (projectId) query.append("project_id", projectId);
		if (sortBy) query.append("sort_by", sortBy);
		if (sortOrder) query.append("sort_order", sortOrder);

		const response = await axiosInstance.get<ApplicationsListResponse>(
			`${API_PATH.CONSULTATION.APPLICATIONS_LIST}?${query.toString()}`,
		);

		const data = response.data?.data || [];

		const consultants: Consultant[] = data.map((item) => ({
			id: item.id,
			name: item.company?.company_name || "Unknown Company",
			type: (item.consultant_type_id || "architect") as Consultant["type"],
			project: item.project_name || "Unknown Project",
			status: (item.status || "pending") as Consultant["status"],
			email: item.company?.email || "",
			phone: item.company?.phone || "",
			updatedAt: new Date(item.created_at).toISOString().split("T")[0],
		}));

		const totalItems = response.data?.total_items ?? consultants.length;

		return {
			success: true,
			data: {
				consultants,
				totalItems,
			},
			error: null,
		};
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: false,
			data: null,
			error:
				apiError.response?.data?.message ||
				(error instanceof Error
					? error.message
					: "Failed to load consultants"),
		};
	}
}

