"use client";

import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { economyBreadcrumbs } from "../../constants/economyNav.config";
import { EconomyDashboard } from "./EconomyDashboard";


export function EconomyDashboardPage() {
	return (
		<div className="flex flex-1 flex-col bg-slate-50/50">
			<PageHeader
				title={localizationConstants.economyDashboardTitle}
				breadcrumbs={economyBreadcrumbs(
					localizationConstants.dashboard,
				)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>
			<div className="flex-1 p-5">
				<EconomyDashboard />
			</div>
		</div>
	);
}

export default EconomyDashboardPage;

