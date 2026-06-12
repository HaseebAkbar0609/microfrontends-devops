import { Suspense } from "react";
import { LeadsManagementPage } from "@/features/leads/management/components/LeadsManagementPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LeadsManagementPage />
    </Suspense>
  );
}
