import { BreadcrumbItem } from "@/types/common";
import localizationConstants from "@/utils/translation/constants";
import { OfferList } from "../types";

export const BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{
		label: localizationConstants.offer,
		href: "module/business/offer/dashboard",
	},
	{ label: localizationConstants.quoteList },
];

export const OFFER_LIST_COLUMNS = [
	{ label: localizationConstants.number, field: "idNumber" },
	{ label: localizationConstants.job, field: "jobName" },
	{ label: localizationConstants.date, field: "date" },
	{ label: localizationConstants.type, field: "type" },
	{ label: localizationConstants.request, field: "request" },
	{ label: localizationConstants.municipality, field: "municipality" },
	{ label: localizationConstants.category, field: "category" },
	{ label: localizationConstants.actions, field: "actions" },
] as const;
