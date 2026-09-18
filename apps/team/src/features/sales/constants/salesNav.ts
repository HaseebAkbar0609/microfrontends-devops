import {
	BarChart3,
	Building2,
	FileText,
	LayoutGrid,
	PhoneCall,
	Settings,
	UsersRound,
	type LucideIcon,
} from "lucide-react";
import type { ModuleTabItem } from "@/components/layout/navigation";
import type { BreadcrumbItem } from "@/types/common";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import type { SalesCompany } from "../types";

export const SALES_MODULE_HREF = "/module/sales";

/** The company list. `/module/sales` itself is the sales dashboard. */
export const SALES_CRM_HREF = `${SALES_MODULE_HREF}/crm`;

/** The meeting booker workspace: call lists, customer cards and bookings. */
export const SALES_MEETING_BOOKER_HREF = `${SALES_MODULE_HREF}/meeting-booker`;

/**
 * Title shown on every page of the module. Rule 1 of the tab navigation
 * guideline: it does not change as you drill in — the record name goes in the
 * back-navigation row instead.
 */
export const SALES_MODULE_TITLE_KEY = localizationConstants.sales;

/** Primary tab row, present on every page of the module. */
export const SALES_MODULE_TABS: ModuleTabItem[] = [
	{
		id: "sales-customers",
		labelKey: localizationConstants.salesCompaniesTitle,
		href: SALES_CRM_HREF,
	},
];

/** Breadcrumb for the module's list page (pattern 1). */
export const SALES_OVERVIEW_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.dashboard, href: "/home" },
	{ label: localizationConstants.moduleItem },
	{ label: localizationConstants.sales },
];

export function getSalesCompanyHref(companyId: string): string {
	return `${SALES_MODULE_HREF}/companies/${companyId}`;
}

export function getSalesQuoteHref(companyId: string): string {
	return `${getSalesCompanyHref(companyId)}/quote`;
}

export function getSalesOrderHref(companyId: string): string {
	return `${getSalesCompanyHref(companyId)}/order-confirmation`;
}

/**
 * Secondary tabs for one company. The order confirmation only appears once an
 * order exists, so the row never links to a page that cannot render.
 */
export function getSalesRecordTabs(company: SalesCompany): ModuleTabItem[] {
	const tabs: ModuleTabItem[] = [
		{
			id: "sales-company-card",
			labelKey: localizationConstants.salesTabCompanyCard,
			href: getSalesCompanyHref(company.id),
			exact: true,
		},
		{
			id: "sales-company-quote",
			labelKey: localizationConstants.salesQuoteLabel,
			href: getSalesQuoteHref(company.id),
		},
	];

	if (company.order) {
		tabs.push({
			id: "sales-company-order",
			labelKey: localizationConstants.salesOrderLabel,
			href: getSalesOrderHref(company.id),
		});
	}

	return tabs;
}

export type SalesSubNavItem = {
	id: string;
	labelKey: TranslationKeys;
	href: string;
	icon: LucideIcon;
	/** Match only the exact route, so the dashboard is not active on every sales page. */
	exact?: boolean;
	/** Other route prefixes that belong to this item. */
	extraActiveHrefs?: string[];
};

/** Items in the sales sub-sidebar, in display order. */
export const SALES_SUB_NAV_ITEMS: SalesSubNavItem[] = [
	{
		id: "sales-dashboard",
		labelKey: localizationConstants.salesNavDashboard,
		href: SALES_MODULE_HREF,
		icon: LayoutGrid,
		exact: true,
	},
	{
		id: "sales-crm",
		labelKey: localizationConstants.salesNavCrm,
		href: SALES_CRM_HREF,
		icon: Building2,
		extraActiveHrefs: [`${SALES_MODULE_HREF}/companies`],
	},
	{
		id: "sales-meeting-booker",
		labelKey: localizationConstants.salesNavMeetingBooker,
		href: SALES_MEETING_BOOKER_HREF,
		icon: PhoneCall,
	},
	{
		id: "sales-organisation",
		labelKey: localizationConstants.salesNavSalesOrganisation,
		href: `${SALES_MODULE_HREF}/sales-organisation`,
		icon: UsersRound,
	},
	{
		id: "sales-documents",
		labelKey: localizationConstants.salesNavDocumentCenter,
		href: `${SALES_MODULE_HREF}/documents`,
		icon: FileText,
	},
	{
		id: "sales-statistics",
		labelKey: localizationConstants.salesNavStatistics,
		href: `${SALES_MODULE_HREF}/statistics`,
		icon: BarChart3,
	},
	{
		id: "sales-settings",
		labelKey: localizationConstants.salesNavSettings,
		href: `${SALES_MODULE_HREF}/settings`,
		icon: Settings,
	},
];

function matchesSalesHref(pathname: string, href: string): boolean {
	return pathname === href || pathname.startsWith(`${href}/`);
}

export function isSalesModulePath(pathname: string): boolean {
	return matchesSalesHref(pathname, SALES_MODULE_HREF);
}

export function isSalesSubNavItemActive(
	item: SalesSubNavItem,
	pathname: string,
): boolean {
	if (item.exact) return pathname === item.href;
	return [item.href, ...(item.extraActiveHrefs ?? [])].some((href) =>
		matchesSalesHref(pathname, href),
	);
}
