import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
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

		const response = await axiosInstance.get(
			`/api/v1/customers/consultation/applications/list?${query.toString()}`,
		);

		const data = response.data?.data || [];

		const consultants: Consultant[] = (data as ApplicationItem[]).map((item) => ({
			id: item.id,
			name: item.company?.company_name || "Unknown Company",
			type: (item.consultant_type_id || "architect") as Consultant["type"],
			project: item.project_name || "Unknown Project",
			status: (item.status || "pending") as Consultant["status"],
			email: item.company?.email || "",
			phone: item.company?.phone || "",
			updatedAt: new Date(item.created_at).toISOString().split("T")[0],
		}));

		return {
			success: true,
			data: { 
				consultants, 
				totalItems: response.data?.meta?.total_items || consultants.length 
			},
			error: null,
		};
	} catch (error: unknown) {
		const apiError = error as { response?: { data?: { message?: string } }; message?: string };
		return {
			success: false,
			data: null,
			error:
				apiError.response?.data?.message ||
				apiError.message ||
				"Failed to load consultants",
		};
	}
}
