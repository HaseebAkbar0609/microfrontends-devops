import { BreadcrumbItem } from "@/types/user";
import localizationConstants from "@/utils/translation/constants";
import type {
	ConsultantStatus,
	ConsultantType,
} from "../types/consultant";

export const BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.business, href: "/business" },
	{ label: localizationConstants.consultantListNav },
];

export const CONSULTANT_COLUMNS = [
	{
		label: localizationConstants.consultantColName,
		field: "name",
		sortable: true,
	},
	{
		label: localizationConstants.consultantColSpecialty,
		field: "specialty",
		sortable: false,
	},
	{
		label: localizationConstants.consultantColProject,
		field: "project",
		sortable: false,
	},
	{ label: localizationConstants.status, field: "status", sortable: false },
	{
		label: localizationConstants.consultantColContact,
		field: "contact",
		sortable: false,
	},
	{ label: localizationConstants.actions, field: "actions", sortable: false },
] as const;

export const CONSULTANT_STATUS_FILTER_OPTIONS: {
	label: string;
	value: ConsultantStatus;
}[] = [
	{ label: localizationConstants.consultantStatusActive, value: "active" },
	{ label: localizationConstants.consultantStatusPending, value: "pending" },
	{
		label: localizationConstants.consultantStatusCompleted,
		value: "completed",
	},
	{ label: localizationConstants.consultantStatusPast, value: "past" },
];

export const CONSULTANT_TYPE_FILTER_OPTIONS: {
	label: string;
	value: ConsultantType;
}[] = [
	{
		label: localizationConstants.consultantTypeArchitect,
		value: "architect",
	},
	{
		label: localizationConstants.consultantTypeElectrical,
		value: "electrical",
	},
	{
		label: localizationConstants.consultantTypeStructural,
		value: "structural",
	},
	{ label: localizationConstants.consultantTypePlumbing, value: "plumbing" },
	{ label: localizationConstants.consultantTypeHvac, value: "hvac" },
	{ label: localizationConstants.consultantTypeInterior, value: "interior" },
	{
		label: localizationConstants.consultantTypeConstruction,
		value: "construction",
	},
];

export const CONSULTANT_TYPE_LABEL_KEY: Record<ConsultantType, string> = {
	architect: localizationConstants.consultantTypeArchitect,
	electrical: localizationConstants.consultantTypeElectrical,
	structural: localizationConstants.consultantTypeStructural,
	plumbing: localizationConstants.consultantTypePlumbing,
	hvac: localizationConstants.consultantTypeHvac,
	interior: localizationConstants.consultantTypeInterior,
	construction: localizationConstants.consultantTypeConstruction,
};

export const CONSULTANT_STATUS_LABEL_KEY: Record<ConsultantStatus, string> = {
	active: localizationConstants.consultantStatusActive,
	pending: localizationConstants.consultantStatusPending,
	completed: localizationConstants.consultantStatusCompleted,
	past: localizationConstants.consultantStatusPast,
};


