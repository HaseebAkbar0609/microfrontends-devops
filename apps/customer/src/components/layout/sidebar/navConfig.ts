import localizationConstants from "@/utils/translation/constants";
import {
	Folders,
	Handshake,
	Home,
	Settings,
	Wrench,
	type LucideIcon,
} from "lucide-react";

export interface NavFlyoutItem {
	id: string;
	label: string;
	href: string;
	icon?: LucideIcon;
}

export interface NavSubItem {
	id: string;
	label: string;
	href: string;
	flyoutItems?: NavFlyoutItem[];
}

export interface NavGroup {
	id: string;
	label: string;
	icon: LucideIcon;
	defaultOpen?: boolean;
	href?: string;
	items: NavSubItem[];
}

export const navConfig: NavGroup[] = [
	{
		id: "home",
		label: localizationConstants.home,
		icon: Home,
		href: "/home",
		items: [],
	},
	{
		id: "business",
		label: localizationConstants.business,
		icon: Handshake,
		defaultOpen: true,
		items: [
			{
				id: "quote",
				label: localizationConstants.getQuote,
				href: "/business/offer",
			},

			{
				id: "consultant",
				label: localizationConstants.consultant,
				href: "/business/consultant",
			},
		],
	},
	{
		id: "myProject",
		label: localizationConstants.myProject,
		icon: Folders,
		items: [
			{
				id: "projectmanagement",
				label: localizationConstants.projectmanagement,
				href: "/projectmanagement",
			},
			{
				id: "archivedprojects",
				label: localizationConstants.archivedprojects,
				href: "/archivedprojects",
			},
		],
	},
	{
		id: "tools",
		label: localizationConstants.tools,
		icon: Wrench,
		items: [
			{
				id: "suppliers",
				label: localizationConstants.suppliers,
				href: "/suppliers",
			},
			{
				id: "priceCalculator",
				label: localizationConstants.priceCalculator,
				href: "/priceCalculator",
			},
			{
				id: "rootRut",
				label: localizationConstants.rootRut,
				href: "/rootRut",
			},
			{
				id: "inspiration",
				label: localizationConstants.inspiration,
				href: "/inspiration",
			},
			{
				id: "discounts",
				label: localizationConstants.discounts,
				href: "/discounts",
			},
			{
				id: "questions",
				label: localizationConstants.questions,
				href: "/questions",
			},
			{
				id: "support",
				label: localizationConstants.support,
				href: "/support",
			},
		],
	},
	{
		id: "setting",
		label: localizationConstants.setting,
		icon: Settings,
		href: "/setting",
		items: [],
	},
];
