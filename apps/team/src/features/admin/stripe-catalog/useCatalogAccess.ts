"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStatus } from "@/context/AuthContext";
import { catalogCapabilityKey, getCatalogCapability } from "./stripeCatalog.api";

export function useCatalogAccess() {
  const { user, isAuthenticated, isReady } = useAuthStatus();
  const identity = user && typeof user === "object" ? user as Record<string, unknown> : {};
  const company = identity.last_visited_company;
  const companyId = identity.last_visited_company_id ??
    (company && typeof company === "object" && "id" in company ? company.id : company);
  const scope = JSON.stringify([identity.id ?? null, companyId ?? null, isAuthenticated]);
  const access = useQuery({
    queryKey: [...catalogCapabilityKey, scope], queryFn: getCatalogCapability,
    enabled: isReady && isAuthenticated, retry: false, staleTime: 0,
  });
  return { access, scope };
}
