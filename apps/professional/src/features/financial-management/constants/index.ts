import {
	BadgeDollarSign,
	BarChart3,
	Receipt,
	Scale,
	TrendingUp,
	Users,
} from "lucide-react";
import { DynamicSubSidebarItem } from "@/components/layout/sidebar/DynamicSubSidebar";
import localizationConstants from "@/utils/translation/constants";

export const financialSidebarItems: DynamicSubSidebarItem[] = [
	{
		id: "invoice",
		labelKey: localizationConstants.invoice,
		href: "/module/financial-management/invoice",
		icon: Receipt,
	},
	{
		id: "economy",
		labelKey: localizationConstants.economy,
		href: "/module/financial-management/economy",
		icon: BarChart3,
	},
	{
		id: "forecast",
		labelKey: localizationConstants.forecast,
		href: "/module/financial-management/forecast",
		icon: TrendingUp,
	},
	{
		id: "personnel",
		labelKey: localizationConstants.personnel,
		href: "/module/financial-management/personnel",
		icon: Users,
	},
	{
		id: "law",
		labelKey: localizationConstants.law,
		href: "/module/financial-management/law",
		icon: Scale,
	},
	{
		id: "debt-collection",
		labelKey: localizationConstants.debtCollection,
		href: "/module/financial-management/debt-collection",
		icon: BadgeDollarSign,
	},
];
