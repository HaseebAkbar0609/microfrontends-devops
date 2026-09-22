"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { forecastBreadcrumbs } from "../../constants/economyNav.config";
import { ForecastDashboard } from "./ForecastDashboard";

/** Prognos › Prognos dashboard, the first page of the Prognos tab. */
export function ForecastDashboardPage() {
	return (
		<div className="flex flex-1 flex-col bg-slate-50/50">
			<PageHeader
				title={localizationConstants.forecastDashboardTitle}
				breadcrumbs={forecastBreadcrumbs()}
				className="border-b-0 px-6 pt-5 pb-2"
			/>
			<div className="flex-1 p-5">
				<ForecastDashboard />
			</div>
		</div>
	);
}

export default ForecastDashboardPage;
