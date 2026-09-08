import {
	Activity,
	Bot,
	CalendarDays,
	Clock,
	FileImage,
	Layers,
	Newspaper,
	PenTool,
	Users,
} from "lucide-react";

import {
	PlacedWidgetEntry,
	WidgetProps,
} from "@/features/widgetdashboard/types/dashboard";
import { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import localizationConstants from "@/utils/translation/constants";
import { DesignModalType } from "./components/DesignDashboardModals";
import { getDesignOverviewWidgets } from "./widgets/designOverviewWidgets";
import { getDesignTimeWidgets } from "./widgets/designTimeWidgets";

export const getDesignWidgetMap = (
	onOpenModal: (type: DesignModalType, prompt?: string) => void,
): Record<string, WidgetProps> => ({
	...getDesignOverviewWidgets(onOpenModal),
	...getDesignTimeWidgets(onOpenModal),
	emptyPage: {
		title: localizationConstants.emptyPageLabel,
		icon: Layers,
	},
});

export const DESIGN_WIDGET_ORDER = [
	"designOverview",
	"designMeetings",
	"designActivities",
	"designTime",
	"designAiAssistant",
	"designCalendar",
	"designImage",
	"designNews",
] as const;

export type DesignWidgetId = (typeof DESIGN_WIDGET_ORDER)[number];

const DESIGN_WIDGET_COL_SPAN = "col-span-12 md:col-span-6 xl:col-span-4";

export const getDesignInitialWidgets = (
	widgetMap: Record<string, WidgetProps>,
): PlacedWidgetEntry[] =>
	DESIGN_WIDGET_ORDER.map((id: DesignWidgetId) => ({
		uid: `design-${id}`,
		sidebarId: id,
		colSpanClass: DESIGN_WIDGET_COL_SPAN,
		widgetProps: widgetMap[id],
	}));

export const DESIGN_SIDEBAR_ITEMS: WidgetItem[] = [
	{
		id: "emptyPage",
		label: localizationConstants.emptyPageLabel,
		icon: Layers,
	},
	{
		id: "designOverview",
		label: localizationConstants.designWidgetOverviewTitle,
		icon: PenTool,
	},
	{
		id: "designMeetings",
		label: localizationConstants.designWidgetMeetingsTitle,
		icon: Users,
	},
	{
		id: "designActivities",
		label: localizationConstants.designWidgetActivitiesTitle,
		icon: Activity,
	},
	{
		id: "designTime",
		label: localizationConstants.designWidgetTimeTitle,
		icon: Clock,
	},
	{
		id: "designAiAssistant",
		label: localizationConstants.designWidgetAiTitle,
		icon: Bot,
	},
	{
		id: "designCalendar",
		label: localizationConstants.designWidgetCalendarTitle,
		icon: CalendarDays,
	},
	{
		id: "designImage",
		label: localizationConstants.designWidgetImageTitle,
		icon: FileImage,
	},
	{
		id: "designNews",
		label: localizationConstants.designWidgetNewsTitle,
		icon: Newspaper,
	},
];
