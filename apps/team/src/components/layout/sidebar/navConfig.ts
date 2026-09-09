import localizationConstants from "@/utils/translation/constants";
import {
	Heart,
	Home,
	LayoutGrid,
	Headset,
	Pickaxe,
	Filter,
	Handshake,
	Smartphone,
	UserRound,
	type LucideIcon,
	ShieldUser,
} from "lucide-react";

export interface NavFlyoutItem {
	id: string;
	label: string;
	href: string;
	icon?: LucideIcon;
	isFavoriteSupported?: boolean;
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

/**
 * Sales and Marketing navigate through their own tab rows
 * (`ModulePageHeader`), the way the professional app does. Keeping them out of
 * `flyoutItems` stops the flyout sub-sidebar from opening on top of that
 * navigation and reclaims the 256px it would otherwise take from the content
 * column.
 */
const moduleSalesItem: NavFlyoutItem = {
	id: "module-business-sales",
	label: localizationConstants.sales,
	href: "/module/sales",
	isFavoriteSupported: true,
};

const moduleMarketingItem: NavFlyoutItem = {
	id: "module-business-marketing",
	label: localizationConstants.marketing,
	href: "/module/business/marketing",
	isFavoriteSupported: true,
};

const moduleOperationsItems: NavFlyoutItem[] = [
	{
		id: "module-operations-invoice",
		label: localizationConstants.invoice,
		href: "/module/operations/invoice",
		isFavoriteSupported: true,
	},
	{
		id: "module-operations-forecast",
		label: localizationConstants.forecast,
		href: "/module/operations/forecast",
		isFavoriteSupported: true,
	},
	{
		id: "module-operations-personnel",
		label: localizationConstants.personnel,
		href: "/module/operations/personnel",
		isFavoriteSupported: true,
	},
	{
		id: "module-operations-economy",
		label: localizationConstants.finance,
		href: "/module/operations/economy",
		isFavoriteSupported: true,
	},
	{
		id: "module-operations-law",
		label: localizationConstants.law,
		href: "/module/operations/law",
		isFavoriteSupported: true,
	},
];

const moduleGovernanceItems: NavFlyoutItem[] = [
	{
		id: "module-governance-agreement",
		label: localizationConstants.agreement,
		href: "/module/governance/agreement",
		isFavoriteSupported: true,
	},
	{
		id: "module-governance-data-it",
		label: localizationConstants.dataIT,
		href: "/module/governance/data-it",
		isFavoriteSupported: true,
	},
	{
		id: "module-governance-templates",
		label: localizationConstants.templates,
		href: "/module/governance/templates",
		isFavoriteSupported: true,
	},
	{
		id: "module-governance-management-support",
		label: localizationConstants.managementSupport,
		href: "/module/governance/management-support",
		isFavoriteSupported: true,
	},
	{
		id: "module-governance-kma",
		label: localizationConstants.kma,
		href: "/module/governance/kma",
		isFavoriteSupported: true,
	},
];

export const favoriteableNavItems: NavFlyoutItem[] = [
	moduleSalesItem,
	moduleMarketingItem,
	...moduleOperationsItems,
	...moduleGovernanceItems,
];

function toFavoriteSubItem(item: NavFlyoutItem): NavSubItem {
	return {
		id: item.id,
		label: item.label,
		href: item.href,
	};
}

export function getNavConfig(favoriteItems: NavSubItem[] = []): NavGroup[] {
	const myPagesFlyoutItems: NavFlyoutItem[] = [
		{
			id: "my-pages-employment",
			label: localizationConstants.myPagesEmployment,
			href: "/tools/my-pages/employment",
		},
		{
			id: "my-pages-company",
			label: localizationConstants.myPagesCompany,
			href: "/tools/my-pages/company",
		},
		{
			id: "my-pages-it-support",
			label: localizationConstants.myPagesItSupport,
			href: "/tools/my-pages/it-support",
		},
		{
			id: "my-pages-profile-settings",
			label: localizationConstants.myPagesProfileSettings,
			href: "/tools/my-pages/profile-settings",
		},
	];

	return [
		{
			id: "home",
			label: localizationConstants.dashboard,
			icon: Home,
			href: "/home",
			items: [],
		},
		{
			id: "favorites",
			label: localizationConstants.favorites,
			icon: Heart,
			href: favoriteItems.length === 0 ? "/favorites" : undefined,
			defaultOpen: favoriteItems.length > 0,
			items: favoriteItems,
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
					flyoutItems: myPagesFlyoutItems,
				},
				{
					id: "diary",
					label: localizationConstants.diary,
					href: "/tools/diary",
				},
				{
					id: "work-time",
					label: localizationConstants.timeItem,
					href: "/tools/work-time",
				},
			],
		},
		{
			id: "module",
			label: localizationConstants.moduleItem,
			icon: LayoutGrid,
			items: [
				{
					id: moduleSalesItem.id,
					label: moduleSalesItem.label,
					href: moduleSalesItem.href,
				},
				{
					id: moduleMarketingItem.id,
					label: moduleMarketingItem.label,
					href: moduleMarketingItem.href,
				},
				{
					id: "module-operations",
					label: localizationConstants.moduleOperations,
					href: "/module/operations",
					flyoutItems: moduleOperationsItems,
				},
				{
					id: "module-governance",
					label: localizationConstants.moduleGovernance,
					href: "/module/governance",
					flyoutItems: moduleGovernanceItems,
				},
			],
		},
		{
			id: "customers",
			label: localizationConstants.customerUsers,
			icon: UserRound,
			items: [
				{
					id: "professional",
					label: localizationConstants.professional,
					href: "/customers/professional",
				},
				{
					id: "private",
					label: localizationConstants.customerPrivatePersons,
					href: "/customers/private",
				},
			],
		},
		{
			id: "leads",
			label: localizationConstants.leads,
			icon: Filter,
			items: [
				{
					id: "leads-management",
					label: localizationConstants.leadsManagement,
					href: "/leads/management",
				},
			],
		},
		{
			id: "support",
			label: localizationConstants.support,
			icon: Headset,
			href: "/support",
			items: [],
		},
		{
			id: "timeflow-app",
			label: localizationConstants.timeflowApp,
			icon: Smartphone,
			items: [
				{
					id: "timeflow-home",
					label: localizationConstants.timeflowHome,
					href: "/timeflow-app/home",
				},
				{
					id: "timeflow-work",
					label: localizationConstants.timeflowWork,
					href: "/timeflow-app/work",
				},
				{
					id: "timeflow-team",
					label: localizationConstants.timeflowTeam,
					href: "/timeflow-app/team",
				},
			],
		},
		{
			id: "partners",
			label: localizationConstants.partners,
			icon: Handshake,
			items: [
				{
					id: "partners-dashboard",
					label: localizationConstants.partnerDashboardItem,
					href: "/partners/dashboard",
				},
				{
					id: "partners-admin",
					label: localizationConstants.partnerAdminItem,
					href: "/partners/admin",
				},
			],
		},
		{
			id: "admin",
			label: localizationConstants.adminItem,
			icon: ShieldUser,
			items: [
				{
					id: "admin-settings",
					label: localizationConstants.settings,
					href: "/admin",
				},
				{
					id: "admin-users",
					label: localizationConstants.adminUsers,
					href: "/admin/users",
				},
				{
					id: "admin-company-information",
					label: localizationConstants.adminCompanyInformation,
					href: "/admin/company-information",
				},
				{
					id: "admin-content",
					label: localizationConstants.contentModuleTitle,
					href: "/admin/content",
				},
			],
		},
	];
}

export function getFavoriteNavItems(favoriteIds: string[]) {
	const favoriteIdSet = new Set(favoriteIds);
	return favoriteableNavItems
		.filter((item) => favoriteIdSet.has(item.id))
		.map(toFavoriteSubItem);
}

export function getFlyoutSubSidebarConfigByPath(
	pathname: string,
): FlyoutSubSidebarConfig | null {
	const groups = getNavConfig();

	for (const group of groups) {
		for (const item of group.items) {
			if (!item.flyoutItems?.length) continue;

			const isParentMatch =
				pathname === item.href || pathname.startsWith(item.href + "/");
			const isFlyoutMatch = item.flyoutItems.some(
				(flyoutItem) =>
					pathname === flyoutItem.href ||
					pathname.startsWith(flyoutItem.href + "/"),
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

export const navConfig: NavGroup[] = getNavConfig();
