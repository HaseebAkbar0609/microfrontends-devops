import type { BreadcrumbItem } from "@/types/common";
import type { RouteTabItem } from "@/types/navigation";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";

export const ECONOMY_MODULE_BASE_URL = "/module/financial-management";
export const ECONOMY_INVOICE_BASE_URL = `${ECONOMY_MODULE_BASE_URL}/invoice`;
export const ECONOMY_EXPENSE_BASE_URL = `${ECONOMY_MODULE_BASE_URL}/economy`;
export const ECONOMY_SUPPLIER_INVOICES_BASE_URL = `${ECONOMY_EXPENSE_BASE_URL}/supplier-invoices`;
export const ECONOMY_ROT_RUT_BASE_URL = `${ECONOMY_EXPENSE_BASE_URL}/rot-rut`;
export const ECONOMY_CERTIFICATES_BASE_URL = `${ECONOMY_EXPENSE_BASE_URL}/certificates`;
export const ECONOMY_BUDGET_BASE_URL = `${ECONOMY_EXPENSE_BASE_URL}/budget`;
export const ECONOMY_BANK_BASE_URL = `${ECONOMY_EXPENSE_BASE_URL}/bank`;
export const ECONOMY_AUTHORITIES_BASE_URL = `${ECONOMY_EXPENSE_BASE_URL}/authorities`;
export const ECONOMY_YEAR_END_BASE_URL = `${ECONOMY_EXPENSE_BASE_URL}/year-end`;
export const ECONOMY_CLAIMS_BASE_URL = `${ECONOMY_EXPENSE_BASE_URL}/claims`;
export const ECONOMY_CASES_BASE_URL = `${ECONOMY_EXPENSE_BASE_URL}/cases`;
export const ECONOMY_CUSTOMERS_BASE_URL = `${ECONOMY_EXPENSE_BASE_URL}/customers`;
export const ECONOMY_SUPPLIERS_BASE_URL = `${ECONOMY_EXPENSE_BASE_URL}/suppliers`;
export const ECONOMY_ARTICLES_BASE_URL = `${ECONOMY_EXPENSE_BASE_URL}/articles`;
export const ECONOMY_PRICE_LISTS_BASE_URL = `${ECONOMY_EXPENSE_BASE_URL}/price-lists`;
export const ECONOMY_ACCOUNT_PLAN_BASE_URL = `${ECONOMY_EXPENSE_BASE_URL}/account-plan`;
export const ECONOMY_COST_CENTERS_BASE_URL = `${ECONOMY_EXPENSE_BASE_URL}/cost-centers`;
export const ECONOMY_WAGE_TYPES_BASE_URL = `${ECONOMY_EXPENSE_BASE_URL}/wage-types`;

export const ECONOMY_SECTIONS = [
	{ id: "supplier-invoices", labelKey: localizationConstants.expenseTopTabSupplierInvoice, href: ECONOMY_SUPPLIER_INVOICES_BASE_URL, implemented: true },
	{ id: "rot-rut", labelKey: localizationConstants.rotRutNav, href: ECONOMY_ROT_RUT_BASE_URL, implemented: true },
	{ id: "certificates", labelKey: localizationConstants.certificatesNav, href: ECONOMY_CERTIFICATES_BASE_URL, implemented: true },
	{ id: "budget", labelKey: localizationConstants.budget, href: ECONOMY_BUDGET_BASE_URL, implemented: true },
	{ id: "bank", labelKey: localizationConstants.bank, href: ECONOMY_BANK_BASE_URL, implemented: true },
	{ id: "authorities", labelKey: localizationConstants.authorities, href: ECONOMY_AUTHORITIES_BASE_URL, implemented: true },
	{ id: "year-end", labelKey: localizationConstants.yearEnd, href: ECONOMY_YEAR_END_BASE_URL, implemented: true },
	{ id: "claims", labelKey: localizationConstants.claims, href: ECONOMY_CLAIMS_BASE_URL, implemented: true },
	{ id: "cases", labelKey: localizationConstants.cases, href: ECONOMY_CASES_BASE_URL, implemented: false },
	{ id: "customers", labelKey: localizationConstants.customerRegister, href: ECONOMY_CUSTOMERS_BASE_URL, implemented: false },
	{ id: "suppliers", labelKey: localizationConstants.supplierRegister, href: ECONOMY_SUPPLIERS_BASE_URL, implemented: false },
	{ id: "articles", labelKey: localizationConstants.registerArtiklar, href: ECONOMY_ARTICLES_BASE_URL, implemented: false },
	{ id: "price-lists", labelKey: localizationConstants.priceList, href: ECONOMY_PRICE_LISTS_BASE_URL, implemented: false },
	{ id: "account-plan", labelKey: localizationConstants.accountPlan, href: ECONOMY_ACCOUNT_PLAN_BASE_URL, implemented: false },
	{ id: "cost-centers", labelKey: localizationConstants.costCentre, href: ECONOMY_COST_CENTERS_BASE_URL, implemented: false },
	{ id: "wage-types", labelKey: localizationConstants.wageTypes, href: ECONOMY_WAGE_TYPES_BASE_URL, implemented: false },
] as const;

export const ECONOMY_NAV_ITEMS: RouteTabItem[] = [
	{ id: "dashboard", labelKey: localizationConstants.dashboard, href: ECONOMY_EXPENSE_BASE_URL, exact: true },
	...ECONOMY_SECTIONS.map((section) => ({
		id: section.id,
		labelKey: section.labelKey,
		href: section.href,
	})),
];
export const ECONOMY_FORECAST_BASE_URL = `${ECONOMY_MODULE_BASE_URL}/forecast`;
export const ECONOMY_PERSONNEL_BASE_URL = `${ECONOMY_MODULE_BASE_URL}/personnel`;
export const ECONOMY_LAW_BASE_URL = `${ECONOMY_MODULE_BASE_URL}/law`;
export const ECONOMY_DEBT_COLLECTION_BASE_URL = `${ECONOMY_MODULE_BASE_URL}/debt-collection`;

/** Module title shown as the H1 on every page of the Economi module (Rule 1). */
export const ECONOMY_MODULE_TITLE = localizationConstants.financialManagement;

/**
 * `Home > Modul > Ekonomistyrning` breadcrumb for Economi Dashboard / Overview.
 */
export function economyDashboardBreadcrumbs(
	section?: TranslationKeys,
): BreadcrumbItem[] {
	return [
		{ label: localizationConstants.home, href: "/dashboard" },
		{ label: localizationConstants.moduleItem },
		{
			label: localizationConstants.financialManagement,
			href: ECONOMY_MODULE_BASE_URL,
		},
		{ label: section ?? localizationConstants.dashboard },
	];
}

/**
 * `Home > Modul > Ekonomistyrning > Section` breadcrumb for Economi subpages (Rule 2).
 */
export function economyBreadcrumbs(section: TranslationKeys): BreadcrumbItem[] {
	return [
		{ label: localizationConstants.home, href: "/dashboard" },
		{ label: localizationConstants.moduleItem },
		{
			label: localizationConstants.financialManagement,
			href: ECONOMY_MODULE_BASE_URL,
		},
		{ label: section },
	];
}

/** Primary tab row for the Economi (Financial Management) module (Rule 1). */
export const ECONOMY_MODULE_TABS: RouteTabItem[] = [
	{
		id: "overview",
		labelKey: localizationConstants.dashboard,
		href: ECONOMY_MODULE_BASE_URL,
		exact: true,
	},
	{
		id: "invoice",
		labelKey: localizationConstants.invoice,
		href: ECONOMY_INVOICE_BASE_URL,
	},
	{
		id: "economy",
		labelKey: localizationConstants.economy,
		href: ECONOMY_EXPENSE_BASE_URL,
	},
	{
		id: "forecast",
		labelKey: localizationConstants.forecast,
		href: ECONOMY_FORECAST_BASE_URL,
	},
	{
		id: "personnel",
		labelKey: localizationConstants.personnel,
		href: ECONOMY_PERSONNEL_BASE_URL,
	},
	{
		id: "law",
		labelKey: localizationConstants.law,
		href: ECONOMY_LAW_BASE_URL,
	},
	{
		id: "debt-collection",
		labelKey: localizationConstants.debtCollection,
		href: ECONOMY_DEBT_COLLECTION_BASE_URL,
	},
];
