"use client";

import { useQuery } from "@tanstack/react-query";
import { getSubscriptionOverview } from "../services/subscriptionService";

export const SUBSCRIPTION_OVERVIEW_QUERY_KEY = ["subscription-overview"] as const;

export function useSubscriptionOverview(enabled: boolean) {
	return useQuery({
		queryKey: SUBSCRIPTION_OVERVIEW_QUERY_KEY,
		queryFn: getSubscriptionOverview,
		enabled,
		refetchOnWindowFocus: true,
	});
}
