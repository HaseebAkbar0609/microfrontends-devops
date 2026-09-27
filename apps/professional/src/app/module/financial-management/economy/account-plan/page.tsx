"use client";

import React, { Suspense } from "react";
import { AccountPlanOverviewPage } from "@/features/financial-management/components/account-plan";

export default function AccountPlanRoutePage() {
	return (
		<Suspense fallback={<div className="p-6 text-sm text-slate-500">Laddar...</div>}>
			<AccountPlanOverviewPage />
		</Suspense>
	);
}
