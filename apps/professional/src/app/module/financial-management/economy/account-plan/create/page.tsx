"use client";

import React, { Suspense } from "react";
import { CreateAccountPage } from "@/features/financial-management/components/account-plan";

export default function AccountPlanCreateRoutePage() {
	return (
		<Suspense fallback={<div className="p-6 text-sm text-slate-500">Laddar...</div>}>
			<CreateAccountPage />
		</Suspense>
	);
}
