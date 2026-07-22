import { BreadcrumbItem } from "@/types/user";
import localizationConstants from "@/utils/translation/constants";
import type { ConsultantTypeItem } from "../types/consultantType";
import type { ConsultantRequest } from "../types/consultantRequest";

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

export const DUMMY_CONSULTANT_TYPES: ConsultantTypeItem[] = [
	{
		id: "architect",
		name: localizationConstants.ctTypeArchitectName,
		sections: [
			{
				title: localizationConstants.ctTypeArchitectS1Title,
				bullets: [
					localizationConstants.ctTypeArchitectS1B1,
					localizationConstants.ctTypeArchitectS1B2,
					localizationConstants.ctTypeArchitectS1B3,
					localizationConstants.ctTypeArchitectS1B4,
				],
			},
			{
				title: localizationConstants.ctTypeArchitectS2Title,
				bullets: [
					localizationConstants.ctTypeArchitectS2B1,
					localizationConstants.ctTypeArchitectS2B2,
					localizationConstants.ctTypeArchitectS2B3,
				],
			},
		],
	},
	{
		id: "inspection-man",
		name: localizationConstants.ctTypeInspectionName,
		sections: [
			{
				title: localizationConstants.ctTypeInspectionS1Title,
				bullets: [
					localizationConstants.ctTypeInspectionS1B1,
					localizationConstants.ctTypeInspectionS1B2,
					localizationConstants.ctTypeInspectionS1B3,
				],
			},
		],
	},
	{
		id: "hvac-consultant",
		name: localizationConstants.ctTypeHvacName,
		sections: [
			{
				title: localizationConstants.ctTypeHvacS1Title,
				bullets: [
					localizationConstants.ctTypeHvacS1B1,
					localizationConstants.ctTypeHvacS1B2,
					localizationConstants.ctTypeHvacS1B3,
				],
			},
		],
	},
	{
		id: "electrical-consultant",
		name: localizationConstants.ctTypeElectricalName,
		sections: [
			{
				title: localizationConstants.ctTypeElectricalS1Title,
				bullets: [
					localizationConstants.ctTypeElectricalS1B1,
					localizationConstants.ctTypeElectricalS1B2,
					localizationConstants.ctTypeElectricalS1B3,
				],
			},
		],
	},
	{
		id: "fire-consultant",
		name: localizationConstants.ctTypeFireName,
		sections: [
			{
				title: localizationConstants.ctTypeFireS1Title,
				bullets: [
					localizationConstants.ctTypeFireS1B1,
					localizationConstants.ctTypeFireS1B2,
					localizationConstants.ctTypeFireS1B3,
				],
			},
		],
	},
	{
		id: "site-development",
		name: localizationConstants.ctTypeSiteDevName,
		sections: [
			{
				title: localizationConstants.ctTypeSiteDevS1Title,
				bullets: [
					localizationConstants.ctTypeSiteDevS1B1,
					localizationConstants.ctTypeSiteDevS1B2,
					localizationConstants.ctTypeSiteDevS1B3,
				],
			},
		],
	},
	{
		id: "interior-architect",
		name: localizationConstants.ctTypeInteriorName,
		sections: [
			{
				title: localizationConstants.ctTypeInteriorS1Title,
				bullets: [
					localizationConstants.ctTypeInteriorS1B1,
					localizationConstants.ctTypeInteriorS1B2,
					localizationConstants.ctTypeInteriorS1B3,
				],
			},
		],
	},
	{
		id: "geotechnical-engineer",
		name: localizationConstants.ctTypeGeotechName,
		sections: [
			{
				title: localizationConstants.ctTypeGeotechS1Title,
				bullets: [
					localizationConstants.ctTypeGeotechS1B1,
					localizationConstants.ctTypeGeotechS1B2,
					localizationConstants.ctTypeGeotechS1B3,
				],
			},
		],
	},
	{
		id: "surveying",
		name: localizationConstants.ctTypeSurveyingName,
		sections: [
			{
				title: localizationConstants.ctTypeSurveyingS1Title,
				bullets: [
					localizationConstants.ctTypeSurveyingS1B1,
					localizationConstants.ctTypeSurveyingS1B2,
					localizationConstants.ctTypeSurveyingS1B3,
				],
			},
		],
	},
	{
		id: "building-permit",
		name: localizationConstants.ctTypePermitName,
		sections: [
			{
				title: localizationConstants.ctTypePermitS1Title,
				bullets: [
					localizationConstants.ctTypePermitS1B1,
					localizationConstants.ctTypePermitS1B2,
					localizationConstants.ctTypePermitS1B3,
				],
			},
		],
	},
];

export const DUMMY_CONSULTANT_REQUESTS: ConsultantRequest[] = [
	{
		id: "1",
		project: "New Villa",
		applications: 4,
		date: "2025-06-10",
		consultant: "Architect",
		consultantType: "architect",
	},
	{
		id: "2",
		project: "Renovation",
		applications: 2,
		date: "2025-01-01",
		consultant: "Construction Consultant",
		consultantType: "construction",
	},
	{
		id: "3",
		project: "Office Fit-out",
		applications: 5,
		date: "2025-04-22",
		consultant: "Interior Architect",
		consultantType: "interior",
	},
	{
		id: "4",
		project: "Warehouse HVAC",
		applications: 1,
		date: "2025-03-14",
		consultant: "HVAC Consultant",
		consultantType: "hvac",
	},
	{
		id: "5",
		project: "Rooftop Solar",
		applications: 3,
		date: "2025-05-02",
		consultant: "Electrical Consultant",
		consultantType: "electrical",
	},
];
