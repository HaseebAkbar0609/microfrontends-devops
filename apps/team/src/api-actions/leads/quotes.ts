import axiosInstance from "@/lib/axiosInstance";
import type { LeadQuoteRow } from "@/features/leads/types";

// The backend returns an array of quote objects
export type QuoteListApiResponse = {
	success: boolean;
	message: string;
	data: Record<string, unknown>[]; // The quotes data
};

export async function listQuotesAPIAction(
	leadId: string
): Promise<LeadQuoteRow[]> {
	const response = await axiosInstance.get<QuoteListApiResponse>(
		`/api/v1/teams/lead/${leadId}/quotes`
	);
	
	const payload = response.data;
	
	return (payload.data ?? []).map((item: Record<string, unknown>) => ({
		id: (item.id as string) || Math.random().toString(),
		companyName: (item.company_name as string) || "-",
		contactPerson: (item.contact_person as string) || "-",
		orgNumber: (item.org_number as string) || "-",
		quotePrice: item.quote_price ? `${item.quote_price} kr` : "-",
		status: (item.status as LeadQuoteRow["status"]) || "waiting",
	}));
}
