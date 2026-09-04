import { BreadcrumbItem } from "@/types/common";
import localizationConstants from "@/utils/translation/constants";

export const AGREEMENT_DASHBOARD_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/" },
	{
		label: localizationConstants.modulesTitle,
	},
	{
		label: localizationConstants.businessSupportCategory,
	},
	{
		label: localizationConstants.agreement,
		href: "/module/business-support/agreement/dashboard",
	},
	{ label: localizationConstants.agreementDashboardTitle },
];

export const AGREEMENT_ROUTES = {
	dashboard: "/module/business-support/agreement/dashboard",
	overview: "/module/business-support/agreement/overview",
	documents: "/module/business-support/agreement/documents",
	archive: "/module/business-support/agreement/archive",
	detail: (id: string) => `/module/business-support/agreement/${id}`,
	create: "/module/business-support/agreement/create",
} as const;
