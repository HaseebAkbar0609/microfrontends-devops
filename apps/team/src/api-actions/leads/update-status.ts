import axiosInstance from "@/lib/axiosInstance";
import type {
	UpdateLeadStatusApiResponse,
	UpdateLeadStatusPayload,
} from "@/features/leads/types";

export async function updateLeadStatusAPIAction(
	leadId: string,
	payload: UpdateLeadStatusPayload
): Promise<UpdateLeadStatusApiResponse> {
	const response = await axiosInstance.patch<UpdateLeadStatusApiResponse>(
		`/api/v1/lead/${leadId}/status`,
		payload
	);

	return response.data;
}
