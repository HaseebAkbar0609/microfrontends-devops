"use client";

import { SectionTabs, type SectionTabItem } from "@/components/layout/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { TabsContent } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { forecastBreadcrumbs } from "../../../constants/economyNav.config";
import { ReportsListPanel } from "./ReportsListPanel";

const REPORT_TABS: SectionTabItem[] = [
	{ id: "list", labelKey: localizationConstants.forecastReportsListTab },
	{
		/* The frame names it but draws nothing behind it; it stays in the row,
		   disabled, rather than opening on an empty screen. */
		id: "custom",
		labelKey: localizationConstants.reportTabCustomReports,
		disabled: true,
		disabledReasonKey: localizationConstants.forecastAnalysisTabUnavailable,
	},
];

/** Prognos › Rapporter: the reports filed for the forecast, and what they hold. */
export function ForecastReportsPage() {
	const t = useTranslate();

	return (
		<div className="flex flex-1 flex-col bg-white">
			<PageHeader
				title={localizationConstants.forecastReportsTitle}
				breadcrumbs={forecastBreadcrumbs(localizationConstants.forecastReportsTitle)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			<div className="flex-1 px-6 pb-8">
				<SectionTabs
					items={REPORT_TABS}
					paramName="tab"
					ariaLabel={t(localizationConstants.forecastReportsTabsLabel)}
				>
					<TabsContent value="list" className="pt-5">
						<ReportsListPanel />
					</TabsContent>
				</SectionTabs>
			</div>
		</div>
	);
}

export default ForecastReportsPage;
