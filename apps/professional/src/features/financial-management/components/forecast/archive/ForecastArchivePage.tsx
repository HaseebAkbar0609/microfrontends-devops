"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { forecastBreadcrumbs } from "../../../constants/economyNav.config";
import { ForecastListPanel } from "../overview/ForecastListPanel";

/**
 * Prognos › Arkiv: the forecasts that have been put away.
 *
 * Prognoslista's own table, over the other side of the register — the frame
 * draws the same thirteen columns in the same order. It carries no section
 * tabs, where Prognos Översikt has two.
 */
export function ForecastArchivePage() {
	return (
		<div className="flex flex-1 flex-col bg-white">
			<PageHeader
				title={localizationConstants.forecastArchiveTitle}
				breadcrumbs={forecastBreadcrumbs(localizationConstants.forecastArchiveTitle)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>
			<div className="flex-1 px-6 pb-8 pt-5">
				<ForecastListPanel archived />
			</div>
		</div>
	);
}

export default ForecastArchivePage;
