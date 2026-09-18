import localizationConstants from "@/utils/translation/constants";
import {
	Briefcase,
	Building2,
	FileText,
	Folder,
	Headset,
	Heart,
	Home,
	Landmark,
	Package2,
	Pickaxe,
	ShoppingCart,
	Tag,
	UserCog,
	UserRound,
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
	comingSoon?: boolean;
}

export interface NavGroup {
	id: string;
	label: string;
	icon: LucideIcon;
	href?: string;
	defaultOpen?: boolean;
	items: NavSubItem[];
}

export interface FlyoutSubSidebarItem {
	id: string;
	labelKey: string;
	href: string;
}

export interface FlyoutSubSidebarConfig {
	titleKey: string;
	items: FlyoutSubSidebarItem[];
}

export const HIDDEN_SUBSIDEBAR_PATH_PREFIXES = [
	"/module/business/offer",
	"/module/business/b2b",
	"/module/business/calculation",
	"/module/business-support",
	"/module/financial-management",
	"/module/production/order",
	"/module/production/project",
	"/module/production/machine",
];

export const navConfig: NavGroup[] = [
	{
		id: "home",
		label: localizationConstants.home,
		icon: Home,
		href: "/home",
		items: [],
	},
	{
		id: "favorites",
		label: localizationConstants.favorites,
		icon: Heart,
		items: [],
	},
	{
		id: "tools",
		label: localizationConstants.tools,
		icon: Pickaxe,
		defaultOpen: true,
		items: [
			{
				id: "diary",
				label: localizationConstants.diary,
				href: "/tools/diary",
			},
			{
				id: "time",
				label: localizationConstants.timeItem,
				href: "/tools/time",
			},
			{
				id: "register",
				label: localizationConstants.register,
				href: "/tools/register",
				flyoutItems: [
					{
						id: "kunder",
						label: localizationConstants.registerKunder,
						href: "/tools/register/customer",
						icon: UserRound,
					},
					{
						id: "leverantorer",
						label: localizationConstants.registerLeverantorer,
						href: "/tools/register/supplier",
						icon: Building2,
					},
					{
						id: "projekt",
						label: localizationConstants.projectList,
						href: "/tools/register/project-list",
						icon: Folder,
					},
					{
						id: "order",
						label: localizationConstants.orderList,
						href: "/tools/register/order-list",
						icon: ShoppingCart,
					},
					{
						id: "offerter",
						label: localizationConstants.registerOfferter,
						href: "/tools/register/quote-list",
						icon: FileText,
					},
					{
						id: "prislistor",
						label: localizationConstants.registerPrislistor,
						href: "/tools/register/price-list",
						icon: Tag,
					},
					{
						id: "artiklar",
						label: localizationConstants.registerArtiklar,
						href: "/tools/register/articles",
						icon: Package2,
					},
					{
						id: "kontoplan",
						label: localizationConstants.accountPlan,
						href: "/tools/register/account-plan",
						icon: Landmark,
					},
					{
						id: "kostnadsstallen",
						label: localizationConstants.registerKostnadsstallen,
						href: "/tools/register/cost-centre",
						icon: Building2,
					},
					{
						id: "budget",
						label: localizationConstants.budgetOption,
						href: "/tools/register/budget",
						icon: Landmark,
					},
					{
						id: "wageTypes",
						label: localizationConstants.wageTypes,
						href: "/tools/register/wage-type",
						icon: Briefcase,
					},
				],
			},
			{
				id: "templates",
				label: localizationConstants.templatesItem,
				href: "/tools/templates",
			},
			{
				id: "discount",
				label: localizationConstants.discountsItem,
				href: "/tools/discount",
			},
			{
				id: "my-pages",
				label: localizationConstants.myPages,
				href: "/tools/my-pages",
				flyoutItems: [
					{
						id: "company",
						label: localizationConstants.companyItem,
						href: "/tools/my-pages/company",
						icon: Building2,
					},
					{
						id: "employment",
						label: localizationConstants.employment,
						href: "/tools/my-pages/employment",
						icon: Briefcase,
					},
					{
						id: "profile-settings",
						label: localizationConstants.profileSettings,
						href: "/tools/my-pages/profile-settings",
						icon: UserCog,
					},
					{
						id: "it-support",
						label: localizationConstants.itSupport,
						href: "/tools/my-pages/it-support",
						icon: Headset,
					},
				],
			},
		],
	},
	{
		id: "module",
		label: localizationConstants.moduleItem,
		icon: Package2,
		items: [
			{
				id: "business",
				label: localizationConstants.business,
				href: "/module/business",
				flyoutItems: [
					{
						id: "offer",
						label: localizationConstants.offerList,
						href: "/module/business/offer/dashboard",
					},
					{
						id: "b2b",
						label: localizationConstants.b2b,
						href: "/module/business/b2b",
					},
					{
						id: "calculation",
						label: localizationConstants.calculation,
						href: "/module/business/calculation",
					},
				],
			},
			{
				id: "production",
				label: localizationConstants.production,
				href: "/module/production",
				flyoutItems: [
					{
						id: "project",
						label: localizationConstants.project,
						href: "/module/production/project",
					},
					{
						id: "order",
						label: localizationConstants.order,
						href: "/module/production/order",
					},
					{
						id: "purchase",
						label: localizationConstants.purchase,
						href: "/module/production/purchase",
					},
					{
						id: "design",
						label: localizationConstants.design,
						href: "/module/production/design",
					},
					{
						id: "kma",
						label: localizationConstants.kma,
						href: "/module/production/kma",
					},
					{
						id: "material-storage",
						label: localizationConstants.materialStorage,
						href: "/module/production/material-storage",
					},
					{
						id: "machine",
						label: localizationConstants.machine,
						href: "/module/production/machine",
					},
					{
						id: "vehicle",
						label: localizationConstants.vehicle,
						href: "/module/production/vehicle",
					},
					{
						id: "access",
						label: localizationConstants.access,
						href: "/module/production/access",
					},
				],
			},
			{
				id: "financial-management",
				label: localizationConstants.financialManagement,
				href: "/module/financial-management",
				flyoutItems: [
					{
						id: "invoice",
						label: localizationConstants.invoice,
						href: "/module/financial-management/invoice",
					},
					{
						id: "economy",
						label: localizationConstants.economy,
						href: "/module/financial-management/economy",
					},
					{
						id: "forecast",
						label: localizationConstants.forecast,
						href: "/module/financial-management/forecast",
					},
					{
						id: "personnel",
						label: localizationConstants.personnel,
						href: "/module/financial-management/personnel",
					},
					{
						id: "law",
						label: localizationConstants.law,
						href: "/module/financial-management/law",
					},
					{
						id: "debtCollection",
						label: localizationConstants.debtCollection,
						href: "/module/financial-management/debt-collection",
					},
				],
			},
			{
				id: "business-support",
				label: localizationConstants.businessSupport,
				href: "/module/business-support",
				flyoutItems: [
					{
						id: "managementSupport",
						label: localizationConstants.managementSupport,
						href: "/module/business-support/management-support",
					},
					{
						id: "marketingSales",
						label: localizationConstants.marketingSales,
						href: "/module/business-support/marketing-sales",
					},
					{
						id: "agreement",
						label: localizationConstants.agreement,
						href: "/module/business-support/agreement/dashboard",
					},
					{
						id: "dataIT",
						label: localizationConstants.dataIT,
						href: "/module/business-support/data-it",
					},
					{
						id: "templates",
						label: localizationConstants.templates,
						href: "/module/business-support/templates",
					},
				],
			},
		],
	},
	{
		id: "admin",
		label: localizationConstants.adminItem,
		icon: UserRound,
		items: [
			{
				id: "company-information",
				label: localizationConstants.companyInformation,
				href: "/admin/company-information",
			},
			{
				id: "admin-user",
				label: localizationConstants.adminUser,
				href: "/admin/user",
			},
			{
				id: "admin-licenses",
				label: localizationConstants.adminLicence,
				href: "/admin/licenses",
			},
			{
				id: "admin-subscription",
				label: localizationConstants.adminSubscription,
				href: "/admin/subscription",
			},
			{
				id: "admin-integration",
				label: localizationConstants.adminIntegration,
				href: "/admin/integration",
			},
			{
				id: "admin-settings",
				label: localizationConstants.adminSetting,
				href: "/admin/settings",
			},
			{
				id: "admin-lead-economy",
				label: localizationConstants.adminEconomy,
				href: "/admin/economy",
			},
		],
	},
];
