import axiosInstance from "@/lib/axiosInstance";

export async function deleteLeadAPIAction(leadId: string): Promise<{ success: boolean; message: string }> {
	const response = await axiosInstance.delete(`/api/v1/teams/lead/${leadId}`);
	return response.data;
}
