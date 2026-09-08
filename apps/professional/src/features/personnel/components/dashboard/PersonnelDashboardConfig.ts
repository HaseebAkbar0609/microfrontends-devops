import {
	Activity,
	BookOpen,
	Bot,
	CalendarCheck,
	CalendarDays,
	Clock,
	Coins,
	FileCheck,
	GraduationCap,
	HardHat,
	Image as ImageIcon,
	Layers,
	Newspaper,
	Users,
	Zap,
} from "lucide-react";

import { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import {
	PlacedWidgetEntry,
	WidgetProps,
} from "@/features/widgetdashboard/types/dashboard";
import localizationConstants from "@/utils/translation/constants";
import type { PersonnelDashboardState } from "../../types/personnelDashboard.types";
import { createPersonnelHealthAndOverviewWidgets } from "./widgets/PersonnelHealthAndOverviewWidgets";
import { createPersonnelTimeAndCostsWidgets } from "./widgets/PersonnelTimeAndCostsWidgets";
import { createPersonnelOperationsWidgets } from "./widgets/PersonnelOperationsWidgets";
import { createPersonnelDevelopmentWidgets } from "./widgets/PersonnelDevelopmentWidgets";

export const PERSONNEL_WIDGET_COL_SPAN = "col-span-12 md:col-span-6 xl:col-span-4";

/** Exact widget order required by the Jira TFS-973 specification (1 to 14). */
export const PERSONNEL_WIDGET_ORDER = [
	"workforceHealthScore",
	"personalOverview",
	"attendance",
	"staffing",
	"timeReporting",
	"personnelCosts",
	"aiPersonalAssistant",
	"personnelCalendar",
	"recentActivities",
	"competences",
	"trainings",
	"certificates",
	"teamImage",
	"personnelNews",
] as const;

export type PersonnelWidgetId = (typeof PERSONNEL_WIDGET_ORDER)[number];

export function buildPersonnelWidgetMap(
	state: PersonnelDashboardState,
): Record<string, WidgetProps> {
	return {
		...createPersonnelHealthAndOverviewWidgets(state),
		...createPersonnelTimeAndCostsWidgets(state),
		...createPersonnelOperationsWidgets(state),
		...createPersonnelDevelopmentWidgets(state),
		emptyPage: {
			title: localizationConstants.emptyPageLabel,
			icon: Layers,
		},
	};
}

export function buildPersonnelInitialWidgets(
	widgetMap: Record<string, WidgetProps>,
): PlacedWidgetEntry[] {
	return PERSONNEL_WIDGET_ORDER.map((id: PersonnelWidgetId) => ({
		uid: `personnel-${id}`,
		sidebarId: id,
		colSpanClass: PERSONNEL_WIDGET_COL_SPAN,
		widgetProps: widgetMap[id],
	}));
}

/** Sidebar menu entries for the rearrange rail */
export const PERSONNEL_SIDEBAR_ITEMS: WidgetItem[] = [
	{
		id: "emptyPage",
		label: localizationConstants.emptyPageLabel,
		icon: Layers,
	},
	{
		id: "workforceHealthScore",
		label: localizationConstants.wHealthScoreTitle,
		icon: Activity,
	},
	{
		id: "personalOverview",
		label: localizationConstants.wPersonalOverviewTitle,
		icon: Users,
	},
	{
		id: "attendance",
		label: localizationConstants.wAttendanceTitle,
		icon: CalendarCheck,
	},
	{
		id: "staffing",
		label: localizationConstants.wStaffingTitle,
		icon: HardHat,
	},
	{
		id: "timeReporting",
		label: localizationConstants.wTimeReportingTitle,
		icon: Clock,
	},
	{
		id: "personnelCosts",
		label: localizationConstants.wPersonnelCostsTitle,
		icon: Coins,
	},
	{
		id: "aiPersonalAssistant",
		label: localizationConstants.wAiAssistantTitle,
		icon: Bot,
	},
	{
		id: "personnelCalendar",
		label: localizationConstants.wCalendarTitle,
		icon: CalendarDays,
	},
	{
		id: "recentActivities",
		label: localizationConstants.wActivitiesTitle,
		icon: Zap,
	},
	{
		id: "competences",
		label: localizationConstants.wCompetencesTitle,
		icon: GraduationCap,
	},
	{
		id: "trainings",
		label: localizationConstants.wTrainingsTitle,
		icon: BookOpen,
	},
	{
		id: "certificates",
		label: localizationConstants.wCertificatesTitle,
		icon: FileCheck,
	},
	{
		id: "teamImage",
		label: localizationConstants.wImageTitle,
		icon: ImageIcon,
	},
	{
		id: "personnelNews",
		label: localizationConstants.wNewsTitle,
		icon: Newspaper,
	},
];
