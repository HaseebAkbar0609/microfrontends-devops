import { useQuery } from "@tanstack/react-query";
import { getLeadProjectDetailsAPIAction } from "@/api-actions";
import type { LeadRequestDetails } from "@/features/leads/types";

const requestDetailsQueryKey = (leadId: string) => ["lead-request-details", leadId];

export function useLeadRequestDetails(leadId: string) {
	return useQuery<LeadRequestDetails | null>({
		queryKey: requestDetailsQueryKey(leadId),
		queryFn: () => getLeadProjectDetailsAPIAction(leadId),
		enabled: Boolean(leadId),
		refetchOnMount: "always",
		refetchOnWindowFocus: false,
		staleTime: 0,
		gcTime: 30 * 60 * 1000,
	});
}
