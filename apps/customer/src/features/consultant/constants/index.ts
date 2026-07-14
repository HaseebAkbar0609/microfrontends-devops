import { BreadcrumbItem } from "@/types/user";
import localizationConstants from "@/utils/translation/constants";
import type {
	Consultant,
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

export const DUMMY_CONSULTANTS: Consultant[] = [
	{
		id: "1",
		name: "Anna Lind",
		type: "architect",
		project: "Bathroom Renovation",
		status: "active",
		email: "anna.lind@example.com",
		phone: "070-560 50 50",
		updatedAt: "2026-06-28",
	},
	{
		id: "2",
		name: "Erik Johansson",
		type: "structural",
		project: "Garage Extension",
		status: "pending",
		email: "erik.johansson@example.com",
		phone: "070-123 45 67",
		updatedAt: "2026-06-30",
	},
	{
		id: "3",
		name: "Maria Svensson",
		type: "electrical",
		project: "Kitchen Rewiring",
		status: "active",
		email: "maria.svensson@example.com",
		phone: "070-987 65 43",
		updatedAt: "2026-07-01",
	},
	{
		id: "4",
		name: "Johan Berg",
		type: "plumbing",
		project: "Bathroom Renovation",
		status: "completed",
		email: "johan.berg@example.com",
		phone: "070-222 33 44",
		updatedAt: "2026-05-12",
	},
	{
		id: "5",
		name: "Sofie Nilsson",
		type: "architect",
		project: "Attic Conversion",
		status: "past",
		email: "sofie.nilsson@example.com",
		phone: "070-555 66 77",
		updatedAt: "2026-03-20",
	},
	{
		id: "6",
		name: "Karl Andersson",
		type: "structural",
		project: "Deck Construction",
		status: "active",
		email: "karl.andersson@example.com",
		phone: "070-888 99 00",
		updatedAt: "2026-07-04",
	},
	{
		id: "7",
		name: "Elin Karlsson",
		type: "electrical",
		project: "Smart Home Install",
		status: "pending",
		email: "elin.karlsson@example.com",
		phone: "070-111 22 33",
		updatedAt: "2026-06-15",
	},
	{
		id: "8",
		name: "Peter Ek",
		type: "plumbing",
		project: "Kitchen Renovation",
		status: "completed",
		email: "peter.ek@example.com",
		phone: "070-444 55 66",
		updatedAt: "2026-04-08",
	},
	{
		id: "9",
		name: "Lars Holm",
		type: "hvac",
		project: "Warehouse HVAC",
		status: "active",
		email: "lars.holm@example.com",
		phone: "070-333 22 11",
		updatedAt: "2026-06-20",
	},
	{
		id: "10",
		name: "Emma Sjöberg",
		type: "interior",
		project: "Office Fit-out",
		status: "pending",
		email: "emma.sjoberg@example.com",
		phone: "070-777 88 99",
		updatedAt: "2026-06-25",
	},
	{
		id: "11",
		name: "Oskar Lindgren",
		type: "construction",
		project: "Renovation",
		status: "active",
		email: "oskar.lindgren@example.com",
		phone: "070-666 55 44",
		updatedAt: "2026-07-02",
	},
];
