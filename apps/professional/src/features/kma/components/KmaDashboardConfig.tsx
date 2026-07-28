import {
	PlacedWidgetEntry,
	WidgetProps,
} from "@/features/widgetdashboard/types/dashboard";
import { KMA_COMPLIANCE_WIDGETS } from "./widgets/kmaComplianceWidgets";
import { KMA_CONTROL_WIDGETS } from "./widgets/kmaControlWidgets";
import { KMA_INSIGHT_WIDGETS } from "./widgets/kmaInsightWidgets";

export const KMA_SIDEBAR_WIDGET_MAP: Record<string, WidgetProps> = {
	...KMA_COMPLIANCE_WIDGETS,
	...KMA_CONTROL_WIDGETS,
	...KMA_INSIGHT_WIDGETS,
};

export const KMA_WIDGET_ORDER = [
	"kmaScore",
	"kmaOverview",
	"kmaDeviations",
	"kmaIncidents",
	"kmaRiskAssessments",
	"kmaSecureCheck",
	"kmaSafetyRounds",
	"kmaControlPlan",
	"kmaCalendar",
	"kmaCertificates",
	"kmaEnvironment",
	"kmaAiAssistant",
	"kmaActivity",
	"kmaStatistics",
	"kmaNews",
] as const;

export type KmaWidgetId = (typeof KMA_WIDGET_ORDER)[number];

const KMA_WIDGET_COL_SPAN = "col-span-12 md:col-span-6 xl:col-span-4";

export const KMA_INITIAL_WIDGETS: PlacedWidgetEntry[] = KMA_WIDGET_ORDER.map(
	(id: KmaWidgetId) => ({
		uid: `kma-${id}`,
		sidebarId: id,
		colSpanClass: KMA_WIDGET_COL_SPAN,
		widgetProps: KMA_SIDEBAR_WIDGET_MAP[id],
	}),
);
