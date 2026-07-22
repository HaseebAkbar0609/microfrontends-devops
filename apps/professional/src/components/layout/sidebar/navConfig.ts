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
	"/module/business/offer/dashboard",
	"/module/business/offer/list",
	"/module/business/offer/archive",
	"/module/business/b2b",
	"/module/business/calculation",
];

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
						id: "invoiceDashboard",
						label: localizationConstants.invoiceDashboard,
						href: "/tools/register/invoice-dashboard",
						icon: Briefcase,
					},
					{
						id: "invoiceOverview",
						label: localizationConstants.invoiceOverview,
						href: "/tools/register/invoice-overview",
						icon: Briefcase,
					},
					{
						id: "contractInvoicing",
						label: localizationConstants.contractInvoicing,
						href: "/tools/register/contract-invoicing",
						icon: Briefcase,
					},
					{
						id: "settings",
						label: localizationConstants.settings,
						href: "/tools/register/settings",
						icon: Briefcase,
					},
					{
						id: "register",
						label: localizationConstants.registerDropdownLabel,
						href: "/tools/register",
						icon: Briefcase,
					},
					{
						id: "reports",
						label: localizationConstants.reportsItem,
						href: "/tools/register/reports",
						icon: Briefcase,
					},
					{
						id: "templates",
						label: localizationConstants.templates,
						href: "/tools/register/templates",
						icon: Briefcase,
					},
					{
						id: "protocols",
						label: localizationConstants.protocolsItem,
						href: "/tools/register/protocols",
						icon: Briefcase,
					},
					{
						id: "documentCenter",
						label: localizationConstants.documentCenterItem,
						href: "/tools/register/document-center",
						icon: Briefcase,
					},
					{
						id: "statistics",
						label: localizationConstants.statisticsItem,
						href: "/tools/register/statistics",
						icon: Briefcase,
					},
					{
						id: "archive",
						label: localizationConstants.archiveItem,
						href: "/tools/register/archive",
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
				label: localizationConstants.adminSetting,
				href: "/admin/settings",
			},
			{
				id: "admin-integration",
				label: localizationConstants.adminIntegration,
				href: "/admin/integration",
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

			return {
				titleKey: item.label,
				items: item.flyoutItems.map((flyoutItem) => ({
					id: flyoutItem.id,
					labelKey: flyoutItem.label,
					href: flyoutItem.href,
				})),
			};
		}
	}

	return null;
}
