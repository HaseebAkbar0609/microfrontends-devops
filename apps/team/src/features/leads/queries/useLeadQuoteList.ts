import { useQuery } from "@tanstack/react-query";
import { leadQuoteListByLeadId } from "@/features/leads/constants/quotes";
import type { LeadQuoteRow } from "@/features/leads/types";

const quoteListQueryKey = (leadId: string) => ["lead-quote-list", leadId];

export function useLeadQuoteList(leadId: string) {
	return useQuery<LeadQuoteRow[]>({
		queryKey: quoteListQueryKey(leadId),
		queryFn: async () => leadQuoteListByLeadId[leadId] ?? [],
		staleTime: 5 * 60 * 1000,
		gcTime: 30 * 60 * 1000,
	});
}
