import {
	AlertTriangle,
	BarChart3,
	Bot,
	CalendarDays,
	CheckCircle2,
	ClipboardList,
	HardHat,
	Layers,
	Leaf,
	Newspaper,
	ScrollText,
	Shield,
	ShieldAlert,
	Siren,
	Zap,
} from "lucide-react";
import { WidgetItem } from "@/features/widgetdashboard/components/DraggableSidebarItem";
import localizationConstants from "@/utils/translation/constants";

export const KMA_SIDEBAR_ITEMS: WidgetItem[] = [
	{
		id: "emptyPage",
		label: localizationConstants.emptyPageLabel,
		icon: Layers,
	},
	{
		id: "kmaScore",
		label: localizationConstants.kmaWidgetScoreTitle,
		icon: Shield,
	},
	{
		id: "kmaOverview",
		label: localizationConstants.kmaWidgetOverviewTitle,
		icon: HardHat,
	},
	{
		id: "kmaDeviations",
		label: localizationConstants.kmaWidgetDeviationsTitle,
		icon: Siren,
	},
	{
		id: "kmaIncidents",
		label: localizationConstants.kmaWidgetIncidentsTitle,
		icon: Zap,
	},
	{
		id: "kmaRiskAssessments",
		label: localizationConstants.kmaWidgetRisksTitle,
		icon: AlertTriangle,
	},
	{
		id: "kmaSecureCheck",
		label: localizationConstants.kmaWidgetSecureTitle,
		icon: CheckCircle2,
	},
	{
		id: "kmaSafetyRounds",
		label: localizationConstants.kmaWidgetRoundsTitle,
		icon: ShieldAlert,
	},
	{
		id: "kmaControlPlan",
		label: localizationConstants.kmaWidgetControlTitle,
		icon: ClipboardList,
	},
	{
		id: "kmaCalendar",
		label: localizationConstants.kmaWidgetCalendarTitle,
		icon: CalendarDays,
	},
	{
		id: "kmaCertificates",
		label: localizationConstants.kmaWidgetCertificatesTitle,
		icon: ScrollText,
	},
	{
		id: "kmaEnvironment",
		label: localizationConstants.kmaWidgetEnvironmentTitle,
		icon: Leaf,
	},
	{
		id: "kmaAiAssistant",
		label: localizationConstants.kmaWidgetAiTitle,
		icon: Bot,
	},
	{
		id: "kmaActivity",
		label: localizationConstants.kmaWidgetActivityTitle,
		icon: Zap,
	},
	{
		id: "kmaStatistics",
		label: localizationConstants.kmaWidgetStatsTitle,
		icon: BarChart3,
	},
	{
		id: "kmaNews",
		label: localizationConstants.kmaWidgetNewsTitle,
		icon: Newspaper,
	},
];
