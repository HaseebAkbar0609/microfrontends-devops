"use client";
import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { KeyRound, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStatus } from "@/context/AuthContext";
import { useTranslate } from "@/utils/translation/translate";
import { getSubscriptionOverview } from "@/features/admin/subscription/services/subscriptionService";
import { ensureRefreshedAccessToken } from "@/lib/axiosInstance";
import { setRequiresSubscriptionCookie } from "@/lib/requiresSubscriptionCookie";
import { STAFF_LICENSE_RECHECK_MS } from "./license.constants";
import { State } from "./ui";

export default function StaffLicenseGate({ children }: { children: ReactNode }) {
  const t = useTranslate();
  const { company, user } = useAuthStatus();
  const actorId = user && typeof user === "object" && "id" in user ? user.id : null;
  const query = useQuery({ queryKey: ["staff-license-access", company?.id, actorId], queryFn: getSubscriptionOverview,
    enabled: !!company?.id, retry: false, refetchInterval: STAFF_LICENSE_RECHECK_MS });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const state = query.data?.status?.access_state;
  const active = state === "ACTIVE" || state === "ACTIVE_IN_GRACE" || state === "RESTRICTED";
  async function check() {
    setBusy(true); setError(undefined);
    try {
      const result = await query.refetch();
      if (result.error) throw result.error;
      if (["ACTIVE", "ACTIVE_IN_GRACE", "RESTRICTED"].includes(result.data?.status?.access_state || "")) {
        await ensureRefreshedAccessToken();
        setRequiresSubscriptionCookie(false);
        window.location.href = "/home";
      }
    } catch (e) { setError(e); } finally { setBusy(false); }
  }
  if (query.isLoading || !company?.id) return <div role="status" className="p-6"><Loader2 className="h-5 w-5 animate-spin" aria-label={t("proAdminLoading")} /></div>;
  if (query.isError) return <div className="p-6"><State error={query.error} retry={() => void query.refetch()} /></div>;
  if (!query.data?.managed_license) return <>{children}</>;
  return <section className="mx-auto w-full max-w-xl space-y-4 px-6 py-12">
    <KeyRound className="h-8 w-8 text-muted-foreground" aria-hidden />
    <h1 className="text-xl font-semibold">{t(active ? "staffLicenseReady" : query.data.license_required ? "staffLicenseWaiting" : "staffLicenseUnavailable")}</h1>
    <p className="text-sm leading-6 text-muted-foreground">{t(active ? "staffLicenseManaged" : query.data.license_required ? "staffLicenseWaitingText" : "staffLicenseUnavailableText")}</p>
    {query.data.plan && <p className="font-medium">{query.data.plan.name}</p>}
    <State error={error} />
    <Button variant="outline" disabled={busy || query.isFetching} onClick={() => void check()}>
      <RefreshCw className={`mr-2 h-4 w-4 ${busy ? "animate-spin" : ""}`} />{t(active ? "staffLicenseContinue" : "staffLicenseCheck")}
    </Button>
  </section>;
}
