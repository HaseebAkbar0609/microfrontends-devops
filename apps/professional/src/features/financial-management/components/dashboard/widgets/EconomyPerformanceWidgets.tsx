"use client";

import {
	Briefcase,
	Calculator,
	FileSpreadsheet,
	Package,
	TrendingDown,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";

import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import type { EconomyDashboardState } from "../../../types/economyDashboard.types";

export function createEconomyPerformanceWidgets(
	_state: EconomyDashboardState,
): Record<string, WidgetProps> {
	return {
		// 5) Lönsamhet
		profitability: {
			title: localizationConstants.profitabilityWidgetTitle,
			icon: TrendingDown,
		},

		// 6) Resultat (Simplified P&L)
		incomeStatement: {
			title: localizationConstants.incomeStatementWidgetTitle,
			icon: FileSpreadsheet,
		},

		// 10) Intäktsfördelning
		revenueDistribution: {
			title: localizationConstants.revenueDistributionWidgetTitle,
			icon: Briefcase,
		},

		// 13) Kostnadsfördelning
		costDistribution: {
			title: localizationConstants.costDistributionWidgetTitle,
			icon: Package,
		},

		// 15) Budget
		budget: {
			title: localizationConstants.budgetWidgetTitle,
			icon: Calculator,
		},
	};
}
