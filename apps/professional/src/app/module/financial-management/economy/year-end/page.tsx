"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { YearEndOverviewPage } from "@/features/financial-management/components/year-end";
import { DEFAULT_FISCAL_YEAR } from "@/features/financial-management/constants/yearEnd.constants";
import type { YearEndTabType } from "@/features/financial-management/types/yearEnd.types";

function YearEndPageContent() {
	const searchParams = useSearchParams();
	const tabParam = (searchParams.get("tab") as YearEndTabType) || "bokslut";
	const yearParam = Number(searchParams.get("year")) || DEFAULT_FISCAL_YEAR;

	return <YearEndOverviewPage initialTab={tabParam} initialYear={yearParam} />;
}

import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export default function EconomyYearEndPage() {
	return (
		<Suspense
			fallback={
				<div className="p-6 text-sm text-slate-500">
					<Translate text={localizationConstants.loadingLabel} />
				</div>
			}
		>
			<YearEndPageContent />
		</Suspense>
	);
}
