"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { forecastBreadcrumbs } from "../../../constants/economyNav.config";
import { TemplatesListPanel } from "./TemplatesListPanel";

/**
 * Prognos › Mallar: the template documents the forecast work is built from.
 *
 * No section tabs — the frame draws none, and unlike Rapporter there is no
 * second view for a tab row to hold.
 */
export function ForecastTemplatesPage() {
	return (
		<div className="flex flex-1 flex-col bg-white">
			<PageHeader
				title={localizationConstants.forecastTemplatesTitle}
				breadcrumbs={forecastBreadcrumbs(localizationConstants.forecastTemplatesTitle)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			<div className="flex-1 px-6 pb-8 pt-5">
				<TemplatesListPanel />
			</div>
		</div>
	);
}

export default ForecastTemplatesPage;
