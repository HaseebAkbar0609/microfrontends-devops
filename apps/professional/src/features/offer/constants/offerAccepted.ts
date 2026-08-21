import { BreadcrumbItem } from "@/types/common";
import localizationConstants from "@/utils/translation/constants";

export const OFFER_ACCEPTED_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.moduleItem, href: "/module" },
	{ label: localizationConstants.business, href: "/module/business" },
	{ label: localizationConstants.offerList, href: "/module/business/offer/dashboard" },
	{ label: localizationConstants.offerAcceptedListBreadcrumb },
];
