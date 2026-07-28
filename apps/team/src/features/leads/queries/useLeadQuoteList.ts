import { useQuery } from "@tanstack/react-query";
import { listQuotesAPIAction } from "@/api-actions/leads/quotes";
import type { LeadQuoteRow } from "@/features/leads/types";

const quoteListQueryKey = (leadId: string) => ["lead-quote-list", leadId];

export function useLeadQuoteList(leadId: string) {
	return useQuery<LeadQuoteRow[]>({
		queryKey: quoteListQueryKey(leadId),
		queryFn: () => listQuotesAPIAction(leadId),
		enabled: Boolean(leadId),
		staleTime: 5 * 60 * 1000,
		gcTime: 30 * 60 * 1000,
	});
}
