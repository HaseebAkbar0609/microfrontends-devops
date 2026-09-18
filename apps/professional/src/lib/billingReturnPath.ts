const BILLING_PATHS = new Set(["/admin/subscription", "/module/business/offer/commissions"]);

export function billingReturnPath(value: string | null): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  const url = new URL(value, "https://timeflow.invalid");
  if (url.origin !== "https://timeflow.invalid" || !BILLING_PATHS.has(url.pathname)) return null;
  const result = new URL(url.pathname, url.origin);
  const commission = url.searchParams.get("commission");
  if (url.pathname.endsWith("/commissions") && commission && /^[0-9a-f-]{36}$/i.test(commission)) result.searchParams.set("commission", commission);
  if (url.pathname === "/admin/subscription" && url.searchParams.get("tab") === "payment") result.searchParams.set("tab", "payment");
  return result.pathname + result.search;
}
