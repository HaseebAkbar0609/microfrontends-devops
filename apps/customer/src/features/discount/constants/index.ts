import type { BreadcrumbItem } from "@/types/user";
import localizationConstants from "@/utils/translation/constants";

export const DISCOUNT_DETAIL_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.tools, href: "#" },
	{ label: localizationConstants.discounts, href: "/discounts" },
];
