import localizationConstants from "@/utils/translation/constants";
import {
	Briefcase,
	Building2,
	Headset,
	Heart,
	Package2,
	Pickaxe,
	UserCog,
	UserRound,
	type LucideIcon,
} from "lucide-react";

export interface NavFlyoutItem {
	id: string;
	label: string;
	href: string;
	icon?: LucideIcon;
	displaySubSidebar?: boolean;
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
	displaySubSidebar: boolean;
}

export const navConfig: NavGroup[] = [
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
				id: "register",
				label: localizationConstants.register,
				href: "/tools/register",
				flyoutItems: [
					{
						id: "employment",
						label: localizationConstants.accountPlan,
						href: "/tools/register/account-plan",
						icon: Briefcase,
					},
					{
						id: "costCentre",
						label: localizationConstants.costCentre,
						href: "/tools/register/cost-centre",
						icon: Briefcase,
					},
					{
						id: "items",
						label: localizationConstants.itemsLabel,
						href: "/tools/register/items",
						icon: Briefcase,
					},
					{
						id: "accountPlan",
						label: localizationConstants.wageTypes,
						href: "/tools/register/wage-type",
						icon: Briefcase,
					},
					{
						id: "priceList",
						label: localizationConstants.priceList,
						href: "/tools/register/price-list",
						icon: Briefcase,
					},
					{
						id: "customerRegister",
						label: localizationConstants.customerRegister,
						href: "/tools/register/customer-register",
						icon: Briefcase,
					},
					{
						id: "supplierRegister",
						label: localizationConstants.supplierRegister,
						href: "/tools/register/supplier-register",
						icon: Briefcase,
					},
					{
						id: "quoteList",
						label: localizationConstants.quoteList,
						href: "/tools/register/quote-list",
						icon: Briefcase,
					},
					{
						id: "projectList",
						label: localizationConstants.projectList,
						href: "/tools/register/project-list",
						icon: Briefcase,
					},
					{
						id: "orderList",
						label: localizationConstants.orderList,
						href: "/tools/register/order-list",
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
				id: "my-pages",
				label: localizationConstants.myPages,
				href: "/tools/my-pages",
				flyoutItems: [
					{
						id: "employment",
						label: localizationConstants.employment,
						href: "/tools/my-pages/employment",
						icon: Briefcase,
					},
					{
						id: "company",
						label: localizationConstants.companyItem,
						href: "/tools/my-pages/company",
						icon: Building2,
					},

					{
						id: "it-support",
						label: localizationConstants.itSupport,
						href: "/tools/my-pages/it-support",
						icon: Headset,
					},
					{
						id: "profile-settings",
						label: localizationConstants.profileSettings,
						href: "/tools/my-pages/profile-settings",
						icon: UserCog,
					},
				],
			},
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
						label: localizationConstants.offer,
						href: "/module/business/offer/dashboard",
						displaySubSidebar: false,
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
						id: "order",
						label: localizationConstants.order,
						href: "/module/production/order",
					},
					{
						id: "project",
						label: localizationConstants.project,
						href: "/module/production/project",
					},
					{
						id: "purchase",
						label: localizationConstants.purchase,
						href: "/module/production/purchase",
					},
					{
						id: "kma",
						label: localizationConstants.kma,
						href: "/module/production/kma",
					},
					{
						id: "design",
						label: localizationConstants.design,
						href: "/module/production/design",
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
						id: "machine",
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
						id: "economy",
						label: localizationConstants.economy,
						href: "/module/financial-management/economy",
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
					{
						id: "forecast",
						label: localizationConstants.forecast,
						href: "/module/financial-management/forecast",
					},

					{
						id: "invoice",
						label: localizationConstants.invoice,
						href: "/module/financial-management/invoice",
					},
				],
			},
			{
				id: "business-support",
				label: localizationConstants.businessSupport,
				href: "/module/business-support",
				flyoutItems: [
					{
						id: "templates",
						label: localizationConstants.templates,
						href: "/module/business-support/templates",
					},
					{
						id: "agreement",
						label: localizationConstants.agreement,
						href: "/module/business-support/agreement",
					},

					{
						id: "marketingSales",
						label: localizationConstants.marketingSales,
						href: "/module/business-support/marketing-sales",
					},
					{
						id: "dataIT",
						label: localizationConstants.dataIT,
						href: "/module/business-support/data-it",
					},
					{
						id: "managementSupport",
						label: localizationConstants.managementSupport,
						href: "/module/business-support/management-support",
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
				id: "admin-settings",
				label: localizationConstants.admitSetting,
				href: "/admin/settings",
			},
			{
				id: "admin-intergration",
				label: localizationConstants.adminIntegration,
				href: "/admin/intergration",
			},
			{
				id: "admin-subscription",
				label: localizationConstants.adminSubscription,
				href: "/admin/subscription",
			},
			{
				id: "admin-licenses",
				label: localizationConstants.adminLicence,
				href: "/admin/licenses",
			},
			{
				id: "admin-lead-economy",
				label: localizationConstants.adminEconomy,
				href: "/admin/economy",
			},
			{
				id: "admin-user",
				label: localizationConstants.adminUser,
				href: "/admin/user",
			},

			{
				id: "company-information",
				label: localizationConstants.companyInformation,
				href: "/admin/company-information",
			},
		],
	},
];

export function getFlyoutSubSidebarConfigByPath(
	pathname: string,
): FlyoutSubSidebarConfig | null {
	for (const group of navConfig) {
		for (const item of group.items) {
			if (!item.flyoutItems?.length) continue;

			const isParentMatch =
				pathname === item.href || pathname.startsWith(`${item.href}/`);
			const isFlyoutMatch = item.flyoutItems.some(
				(flyoutItem) =>
					pathname === flyoutItem.href ||
					pathname.startsWith(`${flyoutItem.href}/`),
			);

			if (!isParentMatch && !isFlyoutMatch) continue;

			const matchedFlyoutItem = item.flyoutItems.find(
				(flyoutItem) =>
					pathname === flyoutItem.href ||
					pathname.startsWith(`${flyoutItem.href}/`),
			);

			return {
				titleKey: item.label,
				items: item.flyoutItems.map((flyoutItem) => ({
					id: flyoutItem.id,
					labelKey: flyoutItem.label,
					href: flyoutItem.href,
				})),
				displaySubSidebar: matchedFlyoutItem?.displaySubSidebar ?? true,
			};
		}
	}

	return null;
}
