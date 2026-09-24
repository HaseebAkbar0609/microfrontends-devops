"use client";

import { LayoutList } from "lucide-react";

import { SectionTabs, type SectionTabItem } from "@/components/layout/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { forecastBreadcrumbs } from "../../../constants/economyNav.config";
import { useForecastAnalysis } from "../../../hooks/useForecastAnalysis";
import { AnalysisDashboard } from "./AnalysisDashboard";
import { AnalysisFilterCard } from "./AnalysisFilterCard";

/* Nyckeltal is the next page the frames draw but has none of its own yet, so it
   stays in the row, disabled, and says why. */
const ANALYSIS_TABS: SectionTabItem[] = [
	{ id: "analysis", labelKey: localizationConstants.forecastAnalysisTitle },
	{
		id: "keyFigures",
		labelKey: localizationConstants.forecastAnalysisTabKeyFigures,
		disabled: true,
		disabledReasonKey: localizationConstants.forecastAnalysisTabUnavailable,
	},
];

/** Prognos › Analys: the selection, and what the figures make of it. */
export function AnalysisPage() {
	const t = useTranslate();
	const analysis = useForecastAnalysis();
	const { isRearranging, setIsRearranging } = analysis;
	const toggleRearrange = () => setIsRearranging((prev) => !prev);

	return (
		<div className="flex flex-1 flex-col bg-white">
			<PageHeader
				title={localizationConstants.forecastAnalysisTitle}
				breadcrumbs={forecastBreadcrumbs(localizationConstants.forecastAnalysisTitle)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			<div className="flex-1 px-6 pb-8">
				<SectionTabs
					items={ANALYSIS_TABS}
					paramName="tab"
					ariaLabel={t(localizationConstants.forecastAnalysisTabsLabel)}
					actions={
						/* The frame keeps Ordna om beside the tabs, in both states. */
						<Button
							type="button"
							variant={isRearranging ? "default" : "secondary"}
							size="sm"
							onClick={toggleRearrange}
							aria-pressed={isRearranging}
							className={cn(
								"mb-2 flex cursor-pointer items-center gap-2 rounded-sm px-4 py-2 text-sm font-medium",
								isRearranging ? "bg-[#111827] text-white hover:bg-black" : "bg-[#F4F4F5] text-slate-700 hover:bg-slate-200",
							)}
						>
							<LayoutList size={16} aria-hidden />
							<Translate text={localizationConstants.rearrange} />
						</Button>
					}
				>
					<TabsContent value="analysis" className="flex flex-col gap-5 pt-5">
						<AnalysisFilterCard
							filters={analysis.draft}
							objects={analysis.allObjects}
							onChange={analysis.setFilter}
							onToggleObject={analysis.toggleObject}
							onApply={analysis.apply}
							onReset={analysis.reset}
						/>
						<AnalysisDashboard
							data={{
								kpis: analysis.kpis,
								summaryRows: analysis.summaryRows,
								performance: analysis.performance,
								trend: analysis.trend,
								opportunities: analysis.opportunities,
								risks: analysis.risks,
							}}
							isRearranging={isRearranging}
							onToggleRearrange={toggleRearrange}
						/>
					</TabsContent>
				</SectionTabs>
			</div>
		</div>
	);
}

export default AnalysisPage;
