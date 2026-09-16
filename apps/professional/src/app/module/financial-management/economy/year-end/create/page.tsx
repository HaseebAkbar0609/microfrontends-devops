"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CreateYearEndPage } from "@/features/financial-management/components/year-end/create/CreateYearEndPage";
import { DEFAULT_FISCAL_YEAR } from "@/features/financial-management/constants/yearEnd.constants";
import type { YearEndTabType } from "@/features/financial-management/types/yearEnd.types";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

function CreateYearEndPageContent() {
	const searchParams = useSearchParams();
	const tabParam = (searchParams.get("tab") as YearEndTabType) || "bokslut";
	const yearParam = Number(searchParams.get("year")) || DEFAULT_FISCAL_YEAR;

	return (
		<CreateYearEndPage
			initialTab={tabParam}
			initialYear={yearParam}
		/>
	);
}

export default function CreateYearEndRoute() {
	return (
		<Suspense
			fallback={
				<div className="p-6 text-sm text-slate-500">
					<Translate text={localizationConstants.loadingLabel} />
				</div>
			}
		>
			<CreateYearEndPageContent />
		</Suspense>
	);
}
