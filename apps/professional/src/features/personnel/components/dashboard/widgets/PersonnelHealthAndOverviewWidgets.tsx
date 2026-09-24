"use client";

import {
	Activity,
	CalendarCheck,
	HardHat,
	Users,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";

import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import type { PersonnelDashboardState } from "../../../types/personnelDashboard.types";

export function createPersonnelHealthAndOverviewWidgets(
	_state: PersonnelDashboardState,
): Record<string, WidgetProps> {
	return {
		// 1) Workforce Health Score
		workforceHealthScore: {
			title: localizationConstants.wHealthScoreTitle,
			icon: Activity,
			isLocked: true,
			emptyTitle: localizationConstants.wHealthScoreTitle,
			emptyDescription: localizationConstants.wHealthScoreDesc,
		},

		// 2) Personalöversikt
		personalOverview: {
			title: localizationConstants.wPersonalOverviewTitle,
			icon: Users,
			isLocked: true,
			emptyTitle: localizationConstants.wPersonalOverviewTitle,
			emptyDescription: localizationConstants.wPersonalOverviewDesc,
		},

		// 3) Närvaro
		attendance: {
			title: localizationConstants.wAttendanceTitle,
			icon: CalendarCheck,
			emptyTitle: localizationConstants.wAttendanceTitle,
			emptyDescription: localizationConstants.wAttendanceDesc,
		},

		// 4) Bemanning
		staffing: {
			title: localizationConstants.wStaffingTitle,
			icon: HardHat,
			emptyTitle: localizationConstants.wStaffingTitle,
			emptyDescription: localizationConstants.wStaffingDesc,
		},
	};
}
