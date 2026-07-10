import type { ActionResult } from "@/types/api";

export interface CreateConsultantRequestPayload {
	project: string;
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
		await new Promise((resolve) => setTimeout(resolve, 600));

		void payload;

		return {
			success: true,
			data: { request_id: `req-${Date.now()}` },
			error: null,
		};
	} catch (error) {
		return {
			success: false,
			data: null,
			error:
				error instanceof Error
					? error.message
					: "Failed to submit consultant request",
		};
	}
}
