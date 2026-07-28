import {
	PlacedWidgetEntry,
	WidgetProps,
} from "@/features/widgetdashboard/types/dashboard";
import { PROJECT_OVERVIEW_WIDGETS } from "./widgets/projectOverviewWidgets";
import { PROJECT_DELIVERY_WIDGETS } from "./widgets/projectDeliveryWidgets";
import { PROJECT_INSIGHT_WIDGETS } from "./widgets/projectInsightWidgets";

export const PROJECT_SIDEBAR_WIDGET_MAP: Record<string, WidgetProps> = {
	...PROJECT_OVERVIEW_WIDGETS,
	...PROJECT_DELIVERY_WIDGETS,
	...PROJECT_INSIGHT_WIDGETS,
};

export const PROJECT_WIDGET_ORDER = [
	"projectOverview",
	"projectStatus",
	"projectOfMonth",
	"projectCalendar",
	"projectMilestones",
	"projectMap",
	"projectResources",
	"projectTimeReporting",
	"projectValue",
	"projectAta",
	"projectKma",
	"projectSecureCheck",
	"projectInspection",
	"projectRequiresAction",
	"projectAiAssistant",
	"projectActivity",
	"projectStatistics",
	"projectNews",
	"image",
] as const;

export type ProjectWidgetId = (typeof PROJECT_WIDGET_ORDER)[number];

const PROJECT_WIDGET_COL_SPAN = "col-span-12 md:col-span-6 xl:col-span-4";

export const PROJECT_INITIAL_WIDGETS: PlacedWidgetEntry[] =
	PROJECT_WIDGET_ORDER.map((id: ProjectWidgetId) => ({
		uid: `project-${id}`,
		sidebarId: id,
		colSpanClass: PROJECT_WIDGET_COL_SPAN,
		widgetProps: PROJECT_SIDEBAR_WIDGET_MAP[id],
	}));
