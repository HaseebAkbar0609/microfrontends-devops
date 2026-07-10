import localizationConstants from "@/utils/translation/constants";
import { BreadcrumbItem } from "@/types/user";

export const SUPPLIER_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.tools },
	{ label: localizationConstants.suppliers },
];
