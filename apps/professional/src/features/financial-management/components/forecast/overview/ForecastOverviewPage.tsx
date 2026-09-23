"use client";

import { SectionTabs, type SectionTabItem } from "@/components/layout/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { TabsContent } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { forecastBreadcrumbs } from "../../../constants/economyNav.config";
import { ForecastListPanel } from "./ForecastListPanel";

/* Resultat prognos has no frame yet, so it stays in the row, disabled, and says why. */
const OVERVIEW_TABS: SectionTabItem[] = [
	{ id: "list", labelKey: localizationConstants.forecastListTab },
	{
		id: "result",
		labelKey: localizationConstants.forecastResultTab,
		disabled: true,
		disabledReasonKey: localizationConstants.forecastResultUnavailable,
	},
];

/** Prognos › Prognos Översikt: Prognoslista, and Resultat prognos once it is drawn. */
export function ForecastOverviewPage() {
	const t = useTranslate();

	return (
		<div className="flex flex-1 flex-col bg-white">
			<PageHeader
				title={localizationConstants.forecastOverviewTitle}
				breadcrumbs={forecastBreadcrumbs(localizationConstants.forecastOverviewTitle)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>
			<div className="flex-1 px-6 pb-8">
				<SectionTabs items={OVERVIEW_TABS} paramName="tab" ariaLabel={t(localizationConstants.forecastOverviewTabsLabel)}>
					<TabsContent value="list" className="pt-5">
						<ForecastListPanel />
					</TabsContent>
				</SectionTabs>
			</div>
		</div>
	);
}

export default ForecastOverviewPage;
