import {
	Activity,
	Banknote,
	BarChart3,
	Bot,
	Briefcase,
	Building,
	Building2,
	Calculator,
	CalendarDays,
	ClipboardList,
	Coins,
	CreditCard,
	FileSpreadsheet,
	Image as ImageIcon,
	Layers,
	Newspaper,
	Package,
	ReceiptText,
	TrendingDown,
	Zap,
} from "lucide-react";

import { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import {
	PlacedWidgetEntry,
	WidgetProps,
} from "@/features/widgetdashboard/types/dashboard";
import localizationConstants from "@/utils/translation/constants";
import type { EconomyDashboardState } from "../../types/economyDashboard.types";
import { ECONOMY_WIDGET_COL_SPAN } from "../../constants/economyDashboard.constants";
import { createEconomyHealthWidgets } from "./widgets/EconomyHealthWidgets";
import { createEconomyPerformanceWidgets } from "./widgets/EconomyPerformanceWidgets";
import { createEconomyOperationsWidgets } from "./widgets/EconomyOperationsWidgets";
import { createEconomyEngagementWidgets } from "./widgets/EconomyEngagementWidgets";

/** Exact widget order required by the specification (1 to 19). */
export const ECONOMY_WIDGET_ORDER = [
	"financialHealthScore",
	"economyOverview",
	"kpiDashboard",
	"cashFlow",
	"profitability",
	"incomeStatement",
	"aiEconomyAssistant",
	"financeCalendar",
	"recentEconomyActivities",
	"revenueDistribution",
	"accountsReceivable",
	"accountsPayable",
	"costDistribution",
	"invoicing",
	"budget",
	"projectEconomy",
	"orderEconomy",
	"economyImage",
	"economyNews",
] as const;

export type EconomyWidgetId = (typeof ECONOMY_WIDGET_ORDER)[number];

export function buildEconomyWidgetMap(
	state: EconomyDashboardState,
	handlers?: {
		activeAiQuestion: string | null;
		onSelectAiQuestion: (q: string) => void;
	},
): Record<string, WidgetProps> {
	return {
		...createEconomyHealthWidgets(state),
		...createEconomyPerformanceWidgets(state),
		...createEconomyOperationsWidgets(state),
		...createEconomyEngagementWidgets(state, handlers),
		emptyPage: {
			title: localizationConstants.emptyPageLabel,
			icon: Layers,
		},
	};
}

export function buildEconomyInitialWidgets(
	widgetMap: Record<string, WidgetProps>,
): PlacedWidgetEntry[] {
	return ECONOMY_WIDGET_ORDER.map((id: EconomyWidgetId) => ({
		uid: `economy-${id}`,
		sidebarId: id,
		colSpanClass: ECONOMY_WIDGET_COL_SPAN,
		widgetProps: widgetMap[id],
	}));
}

/** Sidebar menu entries for the rearrange rail */
export const ECONOMY_SIDEBAR_ITEMS: WidgetItem[] = [
	{
		id: "emptyPage",
		label: localizationConstants.emptyPageLabel,
		icon: Layers,
	},
	{
		id: "financialHealthScore",
		label: localizationConstants.financialHealthScoreTitle,
		icon: Activity,
	},
	{
		id: "economyOverview",
		label: localizationConstants.economyOverviewWidgetTitle,
		icon: Coins,
	},
	{
		id: "kpiDashboard",
		label: localizationConstants.kpiDashboardWidgetTitle,
		icon: BarChart3,
	},
	{
		id: "cashFlow",
		label: localizationConstants.cashFlowWidgetTitle,
		icon: Banknote,
	},
	{
		id: "profitability",
		label: localizationConstants.profitabilityWidgetTitle,
		icon: TrendingDown,
	},
	{
		id: "incomeStatement",
		label: localizationConstants.incomeStatementWidgetTitle,
		icon: FileSpreadsheet,
	},
	{
		id: "aiEconomyAssistant",
		label: localizationConstants.aiEconomyAssistantWidgetTitle,
		icon: Bot,
	},
	{
		id: "financeCalendar",
		label: localizationConstants.financeCalendarWidgetTitle,
		icon: CalendarDays,
	},
	{
		id: "recentEconomyActivities",
		label: localizationConstants.recentEconomyActivitiesWidgetTitle,
		icon: Zap,
	},
	{
		id: "revenueDistribution",
		label: localizationConstants.revenueDistributionWidgetTitle,
		icon: Briefcase,
	},
	{
		id: "accountsReceivable",
		label: localizationConstants.accountsReceivableWidgetTitle,
		icon: CreditCard,
	},
	{
		id: "accountsPayable",
		label: localizationConstants.accountsPayableWidgetTitle,
		icon: Building2,
	},
	{
		id: "costDistribution",
		label: localizationConstants.costDistributionWidgetTitle,
		icon: Package,
	},
	{
		id: "invoicing",
		label: localizationConstants.invoicingWidgetTitle,
		icon: ReceiptText,
	},
	{
		id: "budget",
		label: localizationConstants.budgetWidgetTitle,
		icon: Calculator,
	},
	{
		id: "projectEconomy",
		label: localizationConstants.projectEconomyWidgetTitle,
		icon: Building,
	},
	{
		id: "orderEconomy",
		label: localizationConstants.orderEconomyWidgetTitle,
		icon: ClipboardList,
	},
	{
		id: "economyImage",
		label: localizationConstants.economyImageWidgetTitle,
		icon: ImageIcon,
	},
	{
		id: "economyNews",
		label: localizationConstants.economyNewsWidgetTitle,
		icon: Newspaper,
	},
];
