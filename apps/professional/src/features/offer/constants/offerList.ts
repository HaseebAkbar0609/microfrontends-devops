import { BreadcrumbItem } from "@/types/common";
import localizationConstants from "@/utils/translation/constants";
import { OfferList } from "../types";

export const DUMMY_DATA: OfferList[] = [
	{
		id: "1",
		idNumber: "0101",
		jobName: "Bathroom",
		date: "2026-03-17",
		type: "B2C Quote",
		request: "0/10",
		municipality: "Stockholm",
		category: "Painter",
		isFavorite: true,
	},
	{
		id: "2",
		idNumber: "002",
		jobName: "Kitchen",
		date: "2026-03-17",
		type: "Express",
		request: "2/5",
		municipality: "Stockholm",
		category: "Painter",
		isFavorite: false,
	},
	{
		id: "3",
		idNumber: "003",
		jobName: "Bathroom",
		date: "2026-03-17",
		type: "B2B Rent OUT",
		request: "4/5",
		municipality: "Stockholm",
		category: "Carpenter",
		isFavorite: true,
	},
];

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
