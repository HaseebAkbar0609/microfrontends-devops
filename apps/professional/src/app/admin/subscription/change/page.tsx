"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SubscriptionChangeEditor } from "@/features/admin/subscription/components/SubscriptionChangeEditor";

function SubscriptionChangeRoute() {
  const params = useSearchParams();
  return <SubscriptionChangeEditor mode={params.get("mode") === "licenses" ? "licenses" : "subscription"} />;
}
export default function Page() {
  return <Suspense><SubscriptionChangeRoute /></Suspense>;
}
