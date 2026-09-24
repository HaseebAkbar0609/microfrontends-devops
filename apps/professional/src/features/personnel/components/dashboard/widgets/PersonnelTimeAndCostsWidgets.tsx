"use client";

import {
	Bot,
	Clock,
	Coins,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";

import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import type { PersonnelDashboardState } from "../../../types/personnelDashboard.types";

export function createPersonnelTimeAndCostsWidgets(
	_state: PersonnelDashboardState,
): Record<string, WidgetProps> {
	return {
		// 5) Tidrapportering
		timeReporting: {
			title: localizationConstants.wTimeReportingTitle,
			icon: Clock,
			emptyTitle: localizationConstants.wTimeReportingTitle,
			emptyDescription: localizationConstants.wTimeReportingDesc,
		},

		// 6) Personalkostnader
		personnelCosts: {
			title: localizationConstants.wPersonnelCostsTitle,
			icon: Coins,
			emptyTitle: localizationConstants.wPersonnelCostsTitle,
			emptyDescription: localizationConstants.wPersonnelCostsDesc,
		},

		// 7) AI Personalassistent
		aiPersonalAssistant: {
			title: localizationConstants.wAiAssistantTitle,
			icon: Bot,
			emptyTitle: localizationConstants.wAiAssistantTitle,
			emptyDescription: localizationConstants.wAiAssistantDesc,
		},
	};
}
