"use client";

import React from "react";

import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { forecastBreadcrumbs } from "../../../constants/economyNav.config";
import { RiskListPanel } from "./RiskListPanel";

/**
 * Prognos › Riskhantering: which clients owe what, and which of them have run
 * past the limits set for them.
 */
export function ForecastRiskPage() {
	return (
		<div className="flex flex-1 flex-col bg-white">
			<PageHeader
				title={localizationConstants.forecastRiskTitle}
				breadcrumbs={forecastBreadcrumbs(localizationConstants.forecastRiskTitle)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>

			<div className="flex-1 px-6 pb-8">
				{/* The frame's single tab; the page's others join it as they are built. */}
				<div className="mb-5 flex items-center gap-6 border-b border-slate-200">
					<span className="border-b-2 border-slate-900 pb-3 text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.forecastRiskListTab} />
					</span>
				</div>

				<RiskListPanel />
			</div>
		</div>
	);
}

export default ForecastRiskPage;
