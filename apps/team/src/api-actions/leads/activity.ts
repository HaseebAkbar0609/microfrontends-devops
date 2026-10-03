import axiosInstance from "@/lib/axiosInstance";

export type LeadActivityEvent = {
  event: "lead_created" | "offer_sent" | "offer_accepted";
  at: string;
  quote_id?: string;
  company_name?: string;
};

export async function getLeadActivityAPIAction(leadId: string): Promise<LeadActivityEvent[]> {
  const { data } = await axiosInstance.get<{
    data: { activity_history?: LeadActivityEvent[] };
  }>(`/api/v1/teams/leads/${leadId}`);
  return data.data.activity_history ?? [];
}
