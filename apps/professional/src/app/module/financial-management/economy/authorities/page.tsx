"use client";

import React, { Suspense } from "react";
import { AuthoritiesOverviewPage } from "@/features/financial-management/components/authorities";

export default function EconomyAuthoritiesPage() {
	return (
		<Suspense fallback={<div className="p-6 text-sm text-slate-500">Laddar...</div>}>
			<AuthoritiesOverviewPage />
		</Suspense>
	);
}
