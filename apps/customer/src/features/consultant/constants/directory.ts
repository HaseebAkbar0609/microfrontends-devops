import { BreadcrumbItem } from "@/types/user";
import localizationConstants from "@/utils/translation/constants";


export const DIRECTORY_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.business, href: "/business" },
	{ label: localizationConstants.consultantDirectoryTitle },
];

export const CONSULTANT_DIRECTORY_TABS = [
	{ value: "type", label: localizationConstants.type },
	{ value: "requests", label: localizationConstants.consultantRequestsTab },
] as const;

export type ConsultantDirectoryTabValue =
	(typeof CONSULTANT_DIRECTORY_TABS)[number]["value"];

export const CONSULTANT_DIRECTORY_TAB_VALUES = CONSULTANT_DIRECTORY_TABS.map(
	(t) => t.value,
) as readonly ConsultantDirectoryTabValue[];

export const CONSULTANT_DIRECTORY_DEFAULT_TAB: ConsultantDirectoryTabValue =
	"type";

export const CONSULTANT_REQUEST_COLUMNS = [
	{
		label: localizationConstants.reqColProject,
		field: "project",
		sortable: true,
	},
	{
		label: localizationConstants.reqColApplications,
		field: "applications",
		sortable: true,
	},
	{ label: localizationConstants.reqColDate, field: "date", sortable: true },
	{
		label: localizationConstants.reqColConsultant,
		field: "consultant",
		sortable: true,
	},
	{ label: localizationConstants.actions, field: "actions", sortable: false },
] as const;

export const CONSULTANT_REQUEST_FILTER_OPTIONS = [
	{ label: "Architect", value: "Architect" },
	{ label: "Construction Consultant", value: "Construction Consultant" },
	{ label: "HVAC Consultant", value: "HVAC Consultant" },
	{ label: "Electrical Consultant", value: "Electrical Consultant" },
];



