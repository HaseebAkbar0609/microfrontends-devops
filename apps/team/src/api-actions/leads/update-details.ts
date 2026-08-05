import axiosInstance from "@/lib/axiosInstance";

export interface UpdateLeadDetailsPayload {
	categories?: string[];
	regions?: string[];
}

export async function updateLeadDetailsAPIAction(
	leadId: string,
	payload: UpdateLeadDetailsPayload,
) {
	const response = await axiosInstance.patch(
		`/api/v1/teams/lead/${leadId}/details`,
		payload,
	);
	return response.data;
}
