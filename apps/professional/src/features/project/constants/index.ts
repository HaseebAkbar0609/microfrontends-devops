import {
	Award,
	BarChart3,
	Bell,
	Bot,
	CalendarDays,
	CalendarRange,
	CircleDollarSign,
	HardHat,
	Image as ImageIcon,
	Layers,
	Map as MapIcon,
	Newspaper,
	PieChart,
	Plus,
	ShieldCheck,
	Target,
	Timer,
	TrafficCone,
	Zap,
} from "lucide-react";
import { BreadcrumbItem } from "@/types/common";
import { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import localizationConstants from "@/utils/translation/constants";

export const PROJECT_DASHBOARD_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/dashboard" },
	{ label: localizationConstants.production },
	{ label: localizationConstants.projectDashboardTitle },
];

export const PROJECT_OVERVIEW_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/dashboard" },
	{
		label: localizationConstants.projectModule,
		href: "/module/production/project",
	},
	{ label: localizationConstants.projectSubOverview },
];

export const PROJECT_ECONOMY_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/dashboard" },
	{
		label: localizationConstants.projectModule,
		href: "/module/production/project",
	},
	{ label: localizationConstants.projectEconomicOverview },
];

export const PROJECT_SIDEBAR_ITEMS: WidgetItem[] = [
	{
		id: "emptyPage",
		label: localizationConstants.emptyPageLabel,
		icon: Layers,
	},
	{
		id: "projectOverview",
		label: localizationConstants.projWidgetOverviewTitle,
		icon: PieChart,
	},
	{
		id: "projectStatus",
		label: localizationConstants.projWidgetStatusTitle,
		icon: TrafficCone,
	},
	{
		id: "projectOfMonth",
		label: localizationConstants.projWidgetMonthTitle,
		icon: CalendarDays,
	},
	{
		id: "projectCalendar",
		label: localizationConstants.projWidgetCalendarTitle,
		icon: CalendarRange,
	},
	{
		id: "projectMilestones",
		label: localizationConstants.projWidgetMilestonesTitle,
		icon: Target,
	},
	{
		id: "projectMap",
		label: localizationConstants.projWidgetMapTitle,
		icon: MapIcon,
	},
	{
		id: "projectResources",
		label: localizationConstants.projWidgetResourcesTitle,
		icon: HardHat,
	},
	{
		id: "projectTimeReporting",
		label: localizationConstants.projWidgetTimeTitle,
		icon: Timer,
	},
	{
		id: "projectValue",
		label: localizationConstants.projWidgetValueTitle,
		icon: CircleDollarSign,
	},
	{
		id: "projectAta",
		label: localizationConstants.projWidgetAtaTitle,
		icon: Plus,
	},
	{
		id: "projectKma",
		label: localizationConstants.projWidgetKmaTitle,
		icon: HardHat,
	},
	{
		id: "projectSecureCheck",
		label: localizationConstants.projWidgetSecureTitle,
		icon: ShieldCheck,
	},
	{
		id: "projectInspection",
		label: localizationConstants.projWidgetInspectionTitle,
		icon: Award,
	},
	{
		id: "projectRequiresAction",
		label: localizationConstants.projWidgetActionTitle,
		icon: Bell,
	},
	{
		id: "projectAiAssistant",
		label: localizationConstants.projWidgetAiTitle,
		icon: Bot,
	},
	{
		id: "projectActivity",
		label: localizationConstants.projWidgetActivityTitle,
		icon: Zap,
	},
	{
		id: "projectStatistics",
		label: localizationConstants.projWidgetStatsTitle,
		icon: BarChart3,
	},
	{
		id: "projectNews",
		label: localizationConstants.projWidgetNewsTitle,
		icon: Newspaper,
	},
	{
		id: "image",
		label: localizationConstants.projWidgetImageTitle,
		icon: ImageIcon,
	},
];
