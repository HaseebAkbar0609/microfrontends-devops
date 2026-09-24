"use client";

import {
	Bot,
	CalendarDays,
	Image as ImageIcon,
	Newspaper,
	Zap,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";

import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import type { EconomyDashboardState } from "../../../types/economyDashboard.types";

interface EngagementWidgetHandlers {
	activeAiQuestion: string | null;
	onSelectAiQuestion: (q: string) => void;
}

export function createEconomyEngagementWidgets(
	_state: EconomyDashboardState,
	_handlers?: EngagementWidgetHandlers,
): Record<string, WidgetProps> {
	return {
		// 7) AI Ekonomiassistent
		aiEconomyAssistant: {
			title: localizationConstants.aiEconomyAssistantWidgetTitle,
			icon: Bot,
		},

		// 8) Kalender
		financeCalendar: {
			title: localizationConstants.financeCalendarWidgetTitle,
			icon: CalendarDays,
		},

		// 9) Senaste aktiviteter
		recentEconomyActivities: {
			title: localizationConstants.recentEconomyActivitiesWidgetTitle,
			icon: Zap,
		},

		// 18) Bild (Banner)
		economyImage: {
			title: localizationConstants.economyImageWidgetTitle,
			icon: ImageIcon,
		},

		// 19) Nyheter
		economyNews: {
			title: localizationConstants.economyNewsWidgetTitle,
			icon: Newspaper,
		},
	};
}
