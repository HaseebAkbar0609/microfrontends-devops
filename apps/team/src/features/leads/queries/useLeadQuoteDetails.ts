import { useQuery } from "@tanstack/react-query";
import { leadQuoteDetailsByLeadId } from "@/features/leads/constants/quote-details";
import type { QuoteDetail } from "@/features/leads/types";

const quoteDetailQueryKey = (leadId: string, quoteId: string) => [
	"lead-quote-detail",
	leadId,
	quoteId,
];

export function useLeadQuoteDetails(leadId: string, quoteId: string) {
	return useQuery<QuoteDetail | null>({
		queryKey: quoteDetailQueryKey(leadId, quoteId),
		queryFn: async () => leadQuoteDetailsByLeadId[leadId]?.[quoteId] ?? null,
		staleTime: 5 * 60 * 1000,
		gcTime: 30 * 60 * 1000,
	});
}
