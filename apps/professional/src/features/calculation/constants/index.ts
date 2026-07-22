import {
	Archive,
	ArrowRight,
	BarChart3,
	Battery,
	CalendarDays,
	CircleDollarSign,
	Construction,
	FileText,
	Image as ImageIcon,
	Newspaper,
	Trophy,
} from "lucide-react";
import { BreadcrumbItem } from "@/types/common";
import { DynamicSubSidebarItem } from "@/components/layout/sidebar/DynamicSubSidebar";
import { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import localizationConstants from "@/utils/translation/constants";

export const CALCULATION_DASHBOARD_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{
		label: localizationConstants.calculation,
		href: "/module/business/calculation",
	},
	{ label: localizationConstants.calcOverview },
];

export const calculationSidebarItems: DynamicSubSidebarItem[] = [
	{
		id: "overview",
		labelKey: localizationConstants.calcOverview,
		href: "/module/business/calculation",
		icon: FileText,
		exact: true,
	},
	{
		id: "kalkyl",
		labelKey: localizationConstants.calcKalkyl,
		href: "/module/business/calculation/kalkyl",
		icon: FileText,
	},
	{
		id: "statistics",
		labelKey: localizationConstants.calcStatistics,
		href: "/module/business/calculation/statistics",
		icon: BarChart3,
	},
	{
		id: "archive",
		labelKey: localizationConstants.archive,
		href: "/module/business/calculation/archive",
		icon: Archive,
	},
];

export const calculationGoToItems: DynamicSubSidebarItem[] = [
	{
		id: "calculation-3001",
		label: "Calculation 3001",
		href: "/module/business/calculation",
		icon: ArrowRight,
	},
];

export const CALCULATION_SIDEBAR_ITEMS: WidgetItem[] = [
	{
		id: "calcStatus",
		label: localizationConstants.calcStatus,
		icon: Battery,
	},
	{
		id: "calcCalendarWidget",
		label: localizationConstants.calcCalendarWidget,
		icon: CalendarDays,
	},
	{
		id: "wonLost",
		label: localizationConstants.calcWonLost,
		icon: Trophy,
	},
	{
		id: "totalValue",
		label: localizationConstants.calcTotalValue,
		icon: CircleDollarSign,
	},
	{
		id: "costDistribution",
		label: localizationConstants.calcCostDistribution,
		icon: Construction,
	},
	{
		id: "statistics",
		label: localizationConstants.calcStatistics,
		icon: BarChart3,
	},
	{ id: "image", label: localizationConstants.imageLabel, icon: ImageIcon },
	{ id: "news", label: localizationConstants.newsLabel, icon: Newspaper },
];
