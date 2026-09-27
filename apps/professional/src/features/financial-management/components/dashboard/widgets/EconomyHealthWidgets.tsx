"use client";

import {
	Activity,
	Banknote,
	BarChart3,
	Coins,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";

import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import type { EconomyDashboardState } from "../../../types/economyDashboard.types";

export function createEconomyHealthWidgets(
	_state: EconomyDashboardState,
): Record<string, WidgetProps> {
	return {
		// 1) Financial Health Score
		financialHealthScore: {
			title: localizationConstants.financialHealthScoreTitle,
			icon: Activity,
		},

		// 2) Ekonomiöversikt
		economyOverview: {
			title: localizationConstants.economyOverviewWidgetTitle,
			icon: Coins,
		},

		// 3) KPI Dashboard
		kpiDashboard: {
			title: localizationConstants.kpiDashboardWidgetTitle,
			icon: BarChart3,
		},

		// 4) Kassaflöde
		cashFlow: {
			title: localizationConstants.cashFlowWidgetTitle,
			icon: Banknote,
		},
	};
}
