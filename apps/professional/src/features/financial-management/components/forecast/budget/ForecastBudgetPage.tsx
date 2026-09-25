"use client";

import React from "react";

import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { BudgetOverviewPage } from "../../budget/BudgetOverviewPage";
import { FORECAST_BUDGET_BASE_ROUTE } from "../../../constants/budget.constants";
import { forecastBreadcrumbs } from "../../../constants/economyNav.config";

/**
 * Prognos › Budget: the budget register Ekonomi already holds, under this
 * module's title and breadcrumb. The screens themselves are shared, so a
 * budget created here is the same record either tab lists.
 */
export function ForecastBudgetPage() {
	return (
		<div className="flex flex-1 flex-col bg-white">
			<PageHeader
				title={localizationConstants.budget}
				breadcrumbs={forecastBreadcrumbs(localizationConstants.register)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>
			<BudgetOverviewPage basePath={FORECAST_BUDGET_BASE_ROUTE} />
		</div>
	);
}

export default ForecastBudgetPage;
