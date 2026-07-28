import axiosInstance from "@/lib/axiosInstance";
import type { LeadDetailApiResponse, LeadRow } from "@/features/leads/types";
import { mapLeadDetailToRow } from "@/api-actions/leads/shared";

export async function getLeadByIdAPIAction(leadId: string): Promise<LeadRow> {
	const response = await axiosInstance.get<LeadDetailApiResponse>(`/api/v1/teams/lead/${leadId}`);
	return mapLeadDetailToRow(response.data.data);
}
