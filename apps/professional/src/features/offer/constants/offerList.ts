import { BreadcrumbItem } from "@/types/common";
import localizationConstants from "@/utils/translation/constants";
import { OfferList } from "../types";

export const DUMMY_OFFERS: OfferList[] = [
	{
		id: "1001",
		idNumber: "001",
		jobName: "Badrumsrenovering - Stockholm",
		date: "2026-07-10",
		type: "B2C-Offert",
		request: "REQUESTED",
		municipality: "Stockholm",
		category: "Renovering",
		isFavorite: false,
	},
	{
		id: "1002",
		idNumber: "002",
		jobName: "Köksrenovering - Göteborg",
		date: "2026-07-12",
		type: "Express",
		request: "REQUESTED",
		municipality: "Göteborg",
		category: "Renovering",
		isFavorite: true,
	},
	{
		id: "1003",
		idNumber: "003",
		jobName: "Kontorslokal uthyrning - Malmö",
		date: "2026-07-14",
		type: "B2B-Hyra UT",
		request: "REQUESTED",
		municipality: "Malmö",
		category: "Uthyrning",
		isFavorite: false,
	},
	{
		id: "1004",
		idNumber: "004",
		jobName: "Takreparation - Uppsala",
		date: "2026-07-15",
		type: "B2C-Offert",
		request: "REQUESTED",
		municipality: "Uppsala",
		category: "Bygg & Mark",
		isFavorite: false,
	},
	{
		id: "1005",
		idNumber: "005",
		jobName: "Fasadrenovering - Västerås",
		date: "2026-07-18",
		type: "B2B-Hyra IN",
		request: "REQUESTED",
		municipality: "Västerås",
		category: "Fasad",
		isFavorite: true,
	},
];

export const BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.moduleItem },
	{ label: localizationConstants.business },
	{
		label: localizationConstants.offer,
		href: "/module/business/offer/dashboard",
	},
	{ label: localizationConstants.offerList },
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
