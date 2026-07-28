import { BreadcrumbItem } from "@/types/user";
import localizationConstants from "@/utils/translation/constants";

export const INSPIRATION_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.tools },
	{ label: localizationConstants.inspiration },
];
