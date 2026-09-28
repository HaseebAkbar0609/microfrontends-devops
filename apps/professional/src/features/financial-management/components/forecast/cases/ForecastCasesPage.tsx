"use client";

import React from "react";

import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { forecastBreadcrumbs } from "../../../constants/economyNav.config";
import { FORECAST_CASES_BASE_ROUTE } from "../../../constants/cases.constants";
import { CasesOverviewPage } from "../../cases/CasesOverviewPage";

/**
 * Prognos › Ärendehantering: the same register Ekonomi keeps, under Prognos's
 * own chrome. The frame draws one button here, so the import screen stays on
 * the Ekonomi side.
 */
export function ForecastCasesPage() {
	return (
		<div className="flex flex-1 flex-col bg-white">
			<PageHeader
				title={localizationConstants.cases}
				breadcrumbs={forecastBreadcrumbs(localizationConstants.cases)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			<CasesOverviewPage basePath={FORECAST_CASES_BASE_ROUTE} showImport={false} />
		</div>
	);
}

export default ForecastCasesPage;
