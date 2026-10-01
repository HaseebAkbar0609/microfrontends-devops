import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getLeadByIdAPIAction, listLeadsAPIAction } from "@/api-actions";
import { listAcceptedLeadsAPIAction } from "@/api-actions/leads/list";
import type { LeadsListQueryParams } from "@/features/leads/types";

export function useLeadsList(
	params: LeadsListQueryParams,
	enabled = true
) {
	return useQuery({
		queryKey: ["leads-list", params.page ?? 1, params.pageSize ?? 10],
		queryFn: () => listLeadsAPIAction(params),
		enabled,
		placeholderData: keepPreviousData,
		refetchOnWindowFocus: false,
		staleTime: 5 * 60 * 1000,
		gcTime: 30 * 60 * 1000,
	});
}

export function useLeadById(leadId: string) {
	return useQuery({
		queryKey: ["lead-by-id", leadId],
		queryFn: () => getLeadByIdAPIAction(leadId),
		enabled: Boolean(leadId),
		refetchOnWindowFocus: false,
		staleTime: 5 * 60 * 1000,
		gcTime: 30 * 60 * 1000,
	});
}

export function useAcceptedLeadsList(enabled = true) {
	return useQuery({
		queryKey: ["leads-accepted-enriched"],
		queryFn: listAcceptedLeadsAPIAction,
		enabled,
		refetchOnWindowFocus: false,
		staleTime: 0,
	});
}
