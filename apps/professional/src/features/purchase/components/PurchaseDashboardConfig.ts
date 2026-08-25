import {
	Bot,
	CalendarDays,
	CircleCheck,
	Coins,
	Image as ImageIcon,
	Layers,
	Leaf,
	ShoppingCart,
	Truck,
	Zap,
} from "lucide-react";

import { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import {
	PlacedWidgetEntry,
	WidgetProps,
} from "@/features/widgetdashboard/types/dashboard";
import localizationConstants from "@/utils/translation/constants";
import { PURCHASE_INSIGHT_WIDGETS } from "./widgets/purchaseInsightWidgets";
import { PURCHASE_LOGISTICS_WIDGETS } from "./widgets/purchaseLogisticsWidgets";
import { PURCHASE_OVERVIEW_WIDGETS } from "./widgets/purchaseOverviewWidgets";

export const PURCHASE_WIDGET_MAP: Record<string, WidgetProps> = {
	...PURCHASE_OVERVIEW_WIDGETS,
	...PURCHASE_LOGISTICS_WIDGETS,
	...PURCHASE_INSIGHT_WIDGETS,
	emptyPage: {
		title: localizationConstants.emptyPageLabel,
		icon: Layers,
	},
};

/** Grid order, following the reading order of the ticket's widget list. */
export const PURCHASE_WIDGET_ORDER = [
	"purchaseOverview",
	"purchaseValue",
	"purchaseDeliveries",
	"purchaseCalendar",
	"purchaseActivity",
	"purchaseAiAssistant",
	"purchaseDeliveryControl",
	"purchaseEnvironment",
	"purchaseImage",
] as const;

export type PurchaseWidgetId = (typeof PURCHASE_WIDGET_ORDER)[number];

const PURCHASE_WIDGET_COL_SPAN = "col-span-12 md:col-span-6 xl:col-span-4";

export const PURCHASE_INITIAL_WIDGETS: PlacedWidgetEntry[] =
	PURCHASE_WIDGET_ORDER.map((id: PurchaseWidgetId) => ({
		uid: `purchase-${id}`,
		sidebarId: id,
		colSpanClass: PURCHASE_WIDGET_COL_SPAN,
		widgetProps: PURCHASE_WIDGET_MAP[id],
	}));

/** Entries offered in the rail's Menu card. */
export const PURCHASE_SIDEBAR_ITEMS: WidgetItem[] = [
	{
		id: "emptyPage",
		label: localizationConstants.emptyPageLabel,
		icon: Layers,
	},
	{
		id: "purchaseOverview",
		label: localizationConstants.purchaseWidgetOverviewTitle,
		icon: ShoppingCart,
	},
	{
		id: "purchaseValue",
		label: localizationConstants.purchaseWidgetValueTitle,
		icon: Coins,
	},
	{
		id: "purchaseDeliveries",
		label: localizationConstants.purchaseWidgetDeliveriesTitle,
		icon: Truck,
	},
	{
		id: "purchaseCalendar",
		label: localizationConstants.purchaseWidgetCalendarTitle,
		icon: CalendarDays,
	},
	{
		id: "purchaseActivity",
		label: localizationConstants.purchaseWidgetActivityTitle,
		icon: Zap,
	},
	{
		id: "purchaseAiAssistant",
		label: localizationConstants.purchaseWidgetAiTitle,
		icon: Bot,
	},
	{
		id: "purchaseDeliveryControl",
		label: localizationConstants.purchaseWidgetControlTitle,
		icon: CircleCheck,
	},
	{
		id: "purchaseEnvironment",
		label: localizationConstants.purchaseWidgetEnvTitle,
		icon: Leaf,
	},
	{
		id: "purchaseImage",
		label: localizationConstants.purchaseWidgetImageTitle,
		icon: ImageIcon,
	},
];
