"use client";

import {
	CalendarDays,
	GraduationCap,
	Zap,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";

import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import type { PersonnelDashboardState } from "../../../types/personnelDashboard.types";

export function createPersonnelOperationsWidgets(
	_state: PersonnelDashboardState,
): Record<string, WidgetProps> {
	return {
		// 8) Kalender
		personnelCalendar: {
			title: localizationConstants.wCalendarTitle,
			icon: CalendarDays,
			emptyTitle: localizationConstants.wCalendarTitle,
			emptyDescription: localizationConstants.wCalendarDesc,
		},

		// 9) Senaste aktiviteter
		recentActivities: {
			title: localizationConstants.wActivitiesTitle,
			icon: Zap,
			emptyTitle: localizationConstants.wActivitiesTitle,
			emptyDescription: localizationConstants.wActivitiesDesc,
		},

		// 10) Kompetenser
		competences: {
			title: localizationConstants.wCompetencesTitle,
			icon: GraduationCap,
			emptyTitle: localizationConstants.wCompetencesTitle,
			emptyDescription: localizationConstants.wCompetencesDesc,
		},
	};
}
