import { BreadcrumbItem } from "@/types/common";
import localizationConstants from "@/utils/translation/constants";
import { OfferList } from "../types";

export const DUMMY_OFFERS: OfferList[] = [
	{
		id: "1001",
		idNumber: "OFN001",
		jobName: "Köksrenoveringsjobb",
		date: "2024-05-10",
		type: "B2C-Offert",
		request: "0/10",
		municipality: "Järfälla",
		category: "Målning",
		isFavorite: true,
	},
	{
		id: "1002",
		idNumber: "OFN001",
		jobName: "Målare",
		date: "2024-05-10",
		type: "Express",
		request: "2/5",
		municipality: "Järfälla",
		category: "Målning",
		isFavorite: false,
	},
	{
		id: "1003",
		idNumber: "OFN001",
		jobName: "Köksrenoveringsjobb",
		date: "2024-05-10",
		type: "B2B-Hyra UT",
		request: "4/5",
		municipality: "Järfälla",
		category: "Målning",
		isFavorite: true,
	},
	{
		id: "1004",
		idNumber: "OFN001",
		jobName: "Målare",
		date: "2024-05-10",
		type: "B2B-Hyra IN",
		request: "3/5",
		municipality: "Järfälla",
		category: "Målning",
		isFavorite: false,
	},
	{
		id: "1005",
		idNumber: "OFN001",
		jobName: "Kök Reno Job",
		date: "2024-05-10",
		type: "B2C-Offert",
		request: "3/5",
		municipality: "Järfälla",
		category: "-",
		isFavorite: false,
	},
	{
		id: "1006",
		idNumber: "OFN001",
		jobName: "Målare",
		date: "2024-05-10",
		type: "B2C-Offert",
		request: "3/5",
		municipality: "Järfälla",
		category: "-",
		isFavorite: false,
	},
];

export const BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.moduleItem, href: "/module/business" },
	{ label: localizationConstants.business, href: "/module/business" },
	{ label: localizationConstants.offerList, href: "/module/business/offer/dashboard" },
	{ label: localizationConstants.offerAvailableListBreadcrumb },
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
