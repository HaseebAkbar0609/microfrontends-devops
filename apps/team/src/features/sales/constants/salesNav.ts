import type { ModuleTabItem } from "@/components/layout/navigation";
import type { BreadcrumbItem } from "@/types/common";
import localizationConstants from "@/utils/translation/constants";
import type { SalesCompany } from "../types";

export const SALES_MODULE_HREF = "/module/sales";

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
		href: SALES_MODULE_HREF,
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
