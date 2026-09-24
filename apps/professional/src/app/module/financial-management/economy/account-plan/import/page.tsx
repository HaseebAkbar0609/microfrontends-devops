"use client";

import React, { Suspense } from "react";
import { AccountPlanImportPage } from "@/features/financial-management/components/account-plan";

export default function AccountPlanImportRoutePage() {
	return (
		<Suspense fallback={<div className="p-6 text-sm text-slate-500">Laddar...</div>}>
			<AccountPlanImportPage />
		</Suspense>
	);
}
