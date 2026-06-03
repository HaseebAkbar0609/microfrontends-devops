import localizationConstants from "@/utils/translation/constants";
import type { SupplierColumn } from "./types/types";
import { BreadcrumbItem } from "@/types/user";

export const SUPPLIER_COLUMNS: readonly SupplierColumn[] = [
	{
		label: localizationConstants.companyNameLabel,
		field: "companyName",
		sortable: true,
	},
	{
		label: localizationConstants.orgNoLabel,
		field: "orgNo",
		sortable: true,
	},
	{
		label: localizationConstants.contactPersonNameLabel,
		field: "contactPersonName",
		sortable: true,
	},
	{
		label: localizationConstants.emailLabel,
		field: "email",
		sortable: true,
	},
	{
		label: localizationConstants.actions,
		field: "actions",
		sortable: false,
	},
] as const;

export const SUPPLIER_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.suppliers },
];
