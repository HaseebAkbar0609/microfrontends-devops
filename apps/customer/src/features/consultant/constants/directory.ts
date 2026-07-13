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
		name: "Architect",
		sections: [
			{
				title: "Design and plan new buildings or conversions",
				bullets: [
					"An architect can help you develop ideas for your dream villa, holiday home, garage or other type of building.",
					"They create drawings and details for the construction and ensure all relevant building regulations and standards are met.",
					"They collaborate with you to choose materials, interior design and other details.",
					"They handle building permit applications and communication with authorities.",
				],
			},
			{
				title: "Improve existing buildings",
				bullets: [
					"An architect can advise you on how to improve functionality, aesthetics or energy efficiency in your home.",
					"They create drawings for renovations or extensions.",
					"They help you choose the right materials and contractors for the job.",
				],
			},
		],
	},
	{
		id: "inspection-man",
		name: "Inspection man",
		sections: [
			{
				title: "Independent inspections",
				bullets: [
					"Reviews completed work to confirm it meets contract and regulatory requirements.",
					"Documents defects and produces a formal inspection report.",
					"Advises on remediation and follow-up inspections.",
				],
			},
		],
	},
	{
		id: "hvac-consultant",
		name: "HVAC Consultant",
		sections: [
			{
				title: "Heating, ventilation and air conditioning",
				bullets: [
					"Designs efficient HVAC systems tailored to your property.",
					"Calculates capacity, airflow and energy performance.",
					"Recommends equipment and helps with compliance.",
				],
			},
		],
	},
	{
		id: "electrical-consultant",
		name: "Electrical Consultant",
		sections: [
			{
				title: "Electrical design and safety",
				bullets: [
					"Plans electrical layouts, load distribution and lighting.",
					"Ensures installations meet current electrical safety standards.",
					"Reviews existing wiring and recommends upgrades.",
				],
			},
		],
	},
	{
		id: "fire-consultant",
		name: "Fire Consultant",
		sections: [
			{
				title: "Fire safety and prevention",
				bullets: [
					"Assesses fire risks and designs mitigation measures.",
					"Prepares fire protection documentation for permits.",
					"Advises on escape routes, alarms and materials.",
				],
			},
		],
	},
	{
		id: "site-development",
		name: "Site Development",
		sections: [
			{
				title: "Land and site planning",
				bullets: [
					"Evaluates site suitability and constraints.",
					"Plans access, drainage and utilities.",
					"Coordinates with authorities on zoning and permits.",
				],
			},
		],
	},
	{
		id: "interior-architect",
		name: "Interior Architect",
		sections: [
			{
				title: "Interior spaces and materials",
				bullets: [
					"Designs functional and aesthetic interior layouts.",
					"Selects finishes, lighting and furnishings.",
					"Produces detailed interior drawings and specifications.",
				],
			},
		],
	},
	{
		id: "geotechnical-engineer",
		name: "Geotechnical Engineer",
		sections: [
			{
				title: "Ground and foundation assessment",
				bullets: [
					"Investigates soil conditions and load-bearing capacity.",
					"Recommends foundation solutions for your project.",
					"Assesses risks such as settlement and groundwater.",
				],
			},
		],
	},
	{
		id: "surveying",
		name: "Surveying",
		sections: [
			{
				title: "Measurement and mapping",
				bullets: [
					"Provides accurate site measurements and boundary maps.",
					"Sets out reference points for construction.",
					"Delivers survey data for design and permits.",
				],
			},
		],
	},
	{
		id: "building-permit",
		name: "Building Permit",
		sections: [
			{
				title: "Permit applications and approvals",
				bullets: [
					"Prepares and submits building permit applications.",
					"Compiles the required drawings and documentation.",
					"Manages communication with the municipality.",
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
	},
	{
		id: "2",
		project: "Renovation",
		applications: 2,
		date: "2025-01-01",
		consultant: "Construction Consultant",
	},
	{
		id: "3",
		project: "Office Fit-out",
		applications: 5,
		date: "2025-04-22",
		consultant: "Interior Architect",
	},
	{
		id: "4",
		project: "Warehouse HVAC",
		applications: 1,
		date: "2025-03-14",
		consultant: "HVAC Consultant",
	},
	{
		id: "5",
		project: "Rooftop Solar",
		applications: 3,
		date: "2025-05-02",
		consultant: "Electrical Consultant",
	},
];
