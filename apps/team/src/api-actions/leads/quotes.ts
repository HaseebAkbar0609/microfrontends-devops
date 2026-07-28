import { z } from "zod";
import axiosInstance from "@/lib/axiosInstance";
import type { LeadQuoteRow } from "@/features/leads/types";

export const LeadQuoteItemSchema = z.object({
	id: z.string().min(1),
	company_name: z.string().optional().nullable(),
	contact_person: z.string().optional().nullable(),
	org_number: z.string().optional().nullable(),
	quote_price: z.union([z.string(), z.number()]).optional().nullable(),
	status: z.string().optional().nullable(),
});

export const QuoteListApiResponseSchema = z.object({
	success: z.boolean().optional(),
	message: z.string().optional(),
	data: z.array(LeadQuoteItemSchema).optional().nullable(),
});

export type QuoteListApiResponse = z.infer<typeof QuoteListApiResponseSchema>;

export async function listQuotesAPIAction(
	leadId: string
): Promise<LeadQuoteRow[]> {
	const response = await axiosInstance.get(
		`/api/v1/teams/lead/${leadId}/quotes`
	);
	
	const parsed = QuoteListApiResponseSchema.parse(response.data);
	const items = parsed.data ?? [];
	
	return items
		.filter((item): item is z.infer<typeof LeadQuoteItemSchema> => Boolean(item.id && item.id.trim().length > 0))
		.map((item) => ({
			id: item.id,
			companyName: item.company_name || "-",
			contactPerson: item.contact_person || "-",
			orgNumber: item.org_number || "-",
			quotePrice: item.quote_price ? `${item.quote_price} kr` : "-",
			status: (item.status as LeadQuoteRow["status"]) || "waiting",
		}));
}
