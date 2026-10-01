"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuthStatus } from "@/context/AuthContext";
import { CALCULATION_DASHBOARD_QUERY_KEY, CALCULATION_DASHBOARD_STALE_MS, getCalculationDashboard } from "../api/calculationDashboard";

export function useCalculationDashboard() {
    const { company, user } = useAuthStatus();
    const companyId = company?.id ?? "";
    const userId = user && typeof user === "object" && "id" in user && typeof user.id === "string" ? user.id : "";
    return useQuery({
        queryKey: [CALCULATION_DASHBOARD_QUERY_KEY, companyId, userId],
        queryFn: ({ signal }) => getCalculationDashboard(companyId, userId, signal),
        enabled: Boolean(companyId && userId),
        staleTime: CALCULATION_DASHBOARD_STALE_MS,
        retry: false,
    });
}
