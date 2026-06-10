import {
	DollarSign,
	ShieldCheck,
	UserRound,
	Lightbulb,
	BookOpen,
	HelpCircle,
	Calculator,
} from "lucide-react";

import type {
	QuickStat,
	DashboardNewsItem,
	ResourceLink,
} from "@/features/dashboard/types/dashboard";
import localizationConstants from "@/utils/translation/constants";

export const DASHBOARD_QUICK_STATS: QuickStat[] = [
	{
		id: "active-projects",
		title: localizationConstants.activeProjectsTitle,
		value: localizationConstants.activeProjectsValue,
		href: "/projectmanagement",
		icon: DollarSign,
	},
	{
		id: "offer-management",
		title: localizationConstants.offerManagementTitle,
		value: localizationConstants.offerManagementValue,
		href: "/quote",
		icon: ShieldCheck,
	},
	{
		id: "completed-projects",
		title: localizationConstants.completedProjectsTitle,
		value: localizationConstants.completedProjectsValue,
		href: "/archivedprojects",
		icon: UserRound,
	},
];

export const DASHBOARD_NEWS: DashboardNewsItem[] = [
	{
		id: "news-1",
		title: localizationConstants.newsTitle,
		time: localizationConstants.newsTime,
		description: localizationConstants.newsDescription,
	},
	{
		id: "news-2",
		title: localizationConstants.newsTitle,
		time: localizationConstants.newsTime,
		description: localizationConstants.newsDescription,
	},
];

export const DASHBOARD_RESOURCE_LINKS: ResourceLink[] = [
	{
		id: "advice",
		label: localizationConstants.adviceLabel,
		icon: Lightbulb,
		href: "/inspiration",
	},
	{
		id: "guide",
		label: localizationConstants.guideLabel,
		icon: BookOpen,
		href: "/support",
	},
	{
		id: "faq",
		label: localizationConstants.faqLabel,
		icon: HelpCircle,
		href: "/questions",
	},
	{
		id: "calculator",
		label: localizationConstants.calculation,
		icon: Calculator,
		href: "/priceCalculator",
	},
];
