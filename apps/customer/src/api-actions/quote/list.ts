import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";
import { handleApiError } from "@/utils/apiError";

export interface ProjectQuoteItem {
	id: string | null;
	quote_id: string | null;
	company_id: string;
	company_name: string;
	organization_number: string | null;
	contact_person: string | null;
	email: string | null;
	price: number;
	currency: string;
	status: string;
	is_invited: boolean;
}

export async function getProjectQuotesAPIAction(
	projectId: string,
): Promise<ActionResult<ProjectQuoteItem[]>> {
	if (!projectId?.trim()) {
		return { success: false, data: null, error: "Missing project id" };
	}
	try {
		const { data: body } = await axiosInstance.get<{ data: ProjectQuoteItem[] }>(
			API_PATH.QUOTE.project(projectId.trim()),
			{ params: { visible_only: true, page: 1, page_size: 20 } },
		);
		return {
			success: true,
			data: Array.isArray(body.data) ? body.data : [],
			error: null,
		};
	} catch (error: unknown) {
		return handleApiError(error, "Failed to load project offers");
	}
}
