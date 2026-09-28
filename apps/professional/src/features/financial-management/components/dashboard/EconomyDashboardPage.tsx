"use client";

import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { economyBreadcrumbs } from "../../constants/economyNav.config";
import { EconomyDashboard } from "./EconomyDashboard";


export function EconomyDashboardPage() {
	return (
		<div className="p-6 w-full space-y-6">
			<PageHeader
				title={localizationConstants.economyDashboardTitle}
				breadcrumbs={economyBreadcrumbs(
					localizationConstants.dashboard,
				)}
				className="border-b-0 p-0"
			/>
			<div>
				<EconomyDashboard />
			</div>
		</div>
	);
}

export default EconomyDashboardPage;

