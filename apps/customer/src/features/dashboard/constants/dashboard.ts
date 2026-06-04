import {
	ShieldCheck,
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
		id: "offer-management",
		title: localizationConstants.offerManagementTitle,
		value: localizationConstants.offerManagementValue,
		href: "/quote",
		icon: ShieldCheck,
	},
];

export const DASHBOARD_NEWS: DashboardNewsItem[] = [];

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
