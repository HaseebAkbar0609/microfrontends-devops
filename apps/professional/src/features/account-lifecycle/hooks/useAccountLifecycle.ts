"use client";

import { useQuery } from "@tanstack/react-query";

import { useAuthStatus } from "@/context/AuthContext";
import { getCompanyLifecycleAPIAction } from "@/api-actions/companies/lifecycle";
import {
	LIFECYCLE_QUERY_KEYS,
	LIFECYCLE_REFETCH_INTERVAL_MS,
} from "../constants";

/**
 * The single source of truth for Demo/Trial status on the client — always
 * reads tfs-backend's computed fields, never derives expiry locally (see
 * tfs-backend/docs/account-lifecycle-design.md §8).
 */
export function useAccountLifecycle() {
	const { company, isAuthenticated } = useAuthStatus();
	const companyId = company?.id;

	const query = useQuery({
		queryKey: LIFECYCLE_QUERY_KEYS.status(companyId),
		queryFn: () => getCompanyLifecycleAPIAction(companyId as string),
		enabled: isAuthenticated && !!companyId,
		refetchInterval: LIFECYCLE_REFETCH_INTERVAL_MS,
		refetchOnWindowFocus: true,
		staleTime: LIFECYCLE_REFETCH_INTERVAL_MS,
	});

	return {
		lifecycle: query.data,
		isLoading: query.isLoading,
		isError: query.isError,
	};
}

/**
 * Whether the current company may create new content right now. Defaults to
 * `true` while the lifecycle hasn't loaded yet (or failed to load) — this is
 * a UX convenience only; the backend is the actual enforcement point and
 * will reject the request with ACCOUNT_EXPIRED_READ_ONLY regardless of what
 * this hook returns, so failing open here never weakens the real guarantee.
 */
export function useCanCreateContent(): boolean {
	const { lifecycle, isLoading, isError } = useAccountLifecycle();
	if (isLoading || isError || !lifecycle) return true;
	return lifecycle.canCreateContent;
}
