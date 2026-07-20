import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult } from "@/types/api";

export interface CreateConsultantRequestPayload {
	project_id: string;
	consultant_type_id: string;
	customer_name: string;
	email: string;
	mobile_number: string;
	city: string;
	description: string;
	media_ids: string[];
}

export interface CreateConsultantRequestResponse {
	request_id: string;
}

export async function createConsultantRequestAPIAction(
	payload: CreateConsultantRequestPayload,
): Promise<ActionResult<CreateConsultantRequestResponse>> {
	try {
		const apiPayload = {
			description: payload.description,
			media_ids: payload.media_ids,
            project_id: payload.project_id,
			selected_options: {
				consultant_type_id: payload.consultant_type_id,
				customer_name: payload.customer_name,
				email: payload.email,
				mobile_number: payload.mobile_number,
				city: payload.city,
			},
		};

		const response = await axiosInstance.post(
			"/api/v1/customers/consultation/create",
			apiPayload,
		);

		return {
			success: true,
			data: { request_id: response.data?.data?.id || "unknown" },
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
				"Failed to submit consultant request",
		};
	}
}
