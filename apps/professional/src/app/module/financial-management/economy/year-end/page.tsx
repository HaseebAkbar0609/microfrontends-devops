"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { YearEndOverviewPage } from "@/features/financial-management/components/year-end";
import type { YearEndTabType } from "@/features/financial-management/types/yearEnd.types";

function YearEndPageContent() {
	const searchParams = useSearchParams();
	const tabParam = (searchParams.get("tab") as YearEndTabType) || "bokslut";

	return <YearEndOverviewPage initialTab={tabParam} />;
}

export default function EconomyYearEndPage() {
	return (
		<Suspense fallback={<div className="p-6 text-sm text-slate-500">Laddar...</div>}>
			<YearEndPageContent />
		</Suspense>
	);
}
