import {
	Activity,
	BarChart3,
	Bot,
	Building2,
	CalendarDays,
	Image as ImageIcon,
	Layers,
	MapPin,
	Radio,
	Truck,
	Wrench,
	Zap,
} from "lucide-react";

import {
	PlacedWidgetEntry,
	WidgetProps,
} from "@/features/widgetdashboard/types/dashboard";
import { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import localizationConstants from "@/utils/translation/constants";
import { MachineModalType } from "./components/MachineDashboardModals";
import { getMachineFleetWidgets } from "./widgets/machineFleetWidgets";
import { getMachineOperationsWidgets } from "./widgets/machineOperationsWidgets";
import { getMachinePlanningWidgets } from "./widgets/machinePlanningWidgets";

export const getMachineWidgetMap = (
	onOpenModal: (type: MachineModalType, prompt?: string) => void,
): Record<string, WidgetProps> => ({
	...getMachineFleetWidgets(onOpenModal),
	...getMachineOperationsWidgets(onOpenModal),
	...getMachinePlanningWidgets(onOpenModal),
	emptyPage: {
		title: localizationConstants.emptyPageLabel,
		icon: Layers,
	},
});

/**
 * Grid order matching the exact 11-widget requirement in TFS-954:
 * 1. Machine Health Score
 * 2. Machine Overview (Maskinöversikt)
 * 3. Machine Status (Maskinstatus)
 * 4. Machine Fleet (Maskinpark)
 * 5. Machine Usage (Maskinanvändning)
 * 6. Latest Activities (Senaste aktiviteter)
 * 7. GPS & Position
 * 8. AI Machine Assistant (AI Maskinassistent)
 * 9. Repairs (Reparationer)
 * 10. Bookings (Bokningar)
 * 11. Image (Bild)
 */
export const MACHINE_WIDGET_ORDER = [
	"machineHealth",
	"machineOverview",
	"machineStatus",
	"machineFleet",
	"machineUsage",
	"machineActivities",
	"machineGps",
	"machineAiAssistant",
	"machineRepairs",
	"machineBookings",
	"machineImage",
] as const;

export type MachineWidgetId = (typeof MACHINE_WIDGET_ORDER)[number];

const MACHINE_WIDGET_COL_SPAN = "col-span-12 md:col-span-6 xl:col-span-4";

export const getMachineInitialWidgets = (
	widgetMap: Record<string, WidgetProps>,
): PlacedWidgetEntry[] =>
	MACHINE_WIDGET_ORDER.map((id: MachineWidgetId) => ({
		uid: `machine-${id}`,
		sidebarId: id,
		colSpanClass: MACHINE_WIDGET_COL_SPAN,
		widgetProps: widgetMap[id],
	}));

/** Entries offered in the rail's Menu card */
export const MACHINE_SIDEBAR_ITEMS: WidgetItem[] = [
	{
		id: "emptyPage",
		label: localizationConstants.emptyPageLabel,
		icon: Layers,
	},
	{
		id: "machineHealth",
		label: localizationConstants.machineWidgetHealthTitle,
		icon: Activity,
	},
	{
		id: "machineOverview",
		label: localizationConstants.machineWidgetOverviewTitle,
		icon: Truck,
	},
	{
		id: "machineStatus",
		label: localizationConstants.machineWidgetStatusTitle,
		icon: Radio,
	},
	{
		id: "machineFleet",
		label: localizationConstants.machineWidgetFleetTitle,
		icon: Building2,
	},
	{
		id: "machineUsage",
		label: localizationConstants.machineWidgetUsageTitle,
		icon: BarChart3,
	},
	{
		id: "machineActivities",
		label: localizationConstants.machineWidgetActivitiesTitle,
		icon: Zap,
	},
	{
		id: "machineGps",
		label: localizationConstants.machineWidgetGpsTitle,
		icon: MapPin,
	},
	{
		id: "machineAiAssistant",
		label: localizationConstants.machineWidgetAiTitle,
		icon: Bot,
	},
	{
		id: "machineRepairs",
		label: localizationConstants.machineWidgetRepairsTitle,
		icon: Wrench,
	},
	{
		id: "machineBookings",
		label: localizationConstants.machineWidgetBookingsTitle,
		icon: CalendarDays,
	},
	{
		id: "machineImage",
		label: localizationConstants.machineWidgetImageTitle,
		icon: ImageIcon,
	},
];
