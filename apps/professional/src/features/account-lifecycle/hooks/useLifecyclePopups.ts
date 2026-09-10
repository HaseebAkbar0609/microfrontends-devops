"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthStatus } from "@/context/AuthContext";
import {
	acknowledgeLifecyclePopupAPIAction,
	listLifecyclePopupsAPIAction,
} from "@/api-actions/companies/lifecycle";
import {
	LIFECYCLE_POPUP_REFETCH_INTERVAL_MS,
	LIFECYCLE_QUERY_KEYS,
} from "../constants";

/**
 * Pending in-app popups (currently: Demo/Trial reminders — see
 * tfs-backend/docs/account-lifecycle-design.md §5). Acknowledging a popup is
 * server-side and permanent, so there's no client-side dedup/localStorage
 * needed here.
 */
export function useLifecyclePopups() {
	const { company, isAuthenticated } = useAuthStatus();
	const companyId = company?.id;
	const queryClient = useQueryClient();

	const query = useQuery({
		queryKey: LIFECYCLE_QUERY_KEYS.popups(companyId),
		queryFn: () => listLifecyclePopupsAPIAction(companyId as string),
		enabled: isAuthenticated && !!companyId,
		refetchInterval: LIFECYCLE_POPUP_REFETCH_INTERVAL_MS,
		refetchOnWindowFocus: true,
	});

	const acknowledge = useMutation({
		mutationFn: (notificationId: string) =>
			acknowledgeLifecyclePopupAPIAction(companyId as string, notificationId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: LIFECYCLE_QUERY_KEYS.popups(companyId),
			});
		},
	});

	return {
		popups: query.data ?? [],
		isLoading: query.isLoading,
		acknowledge: acknowledge.mutate,
		isAcknowledging: acknowledge.isPending,
	};
}
