"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { forecastBreadcrumbs } from "../../../constants/economyNav.config";
import { ProtocolsListPanel } from "./ProtocolsListPanel";

/**
 * Prognos › Protokoll: the minutes the forecast work rests on.
 *
 * No section tabs — the frame draws none. The card inside repeats the page's
 * own title, which the frame also draws; that is the project module's section
 * card, carried over with the table it wraps.
 */
export function ForecastProtocolsPage() {
	return (
		<div className="flex flex-1 flex-col bg-white">
			<PageHeader
				title={localizationConstants.projectProtocolTitle}
				breadcrumbs={forecastBreadcrumbs(localizationConstants.projectProtocolTitle)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			<div className="flex-1 px-6 pt-5 pb-8">
				<ProtocolsListPanel />
			</div>
		</div>
	);
}

export default ForecastProtocolsPage;
