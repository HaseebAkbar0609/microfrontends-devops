// Development mock data — used only as initial UI state before API loads.
// This file should NOT be imported by API action modules.
import { CONSTRUCTION_LOG_CONSTANTS } from "../constants/constructionLog.constants";
import type { ConstructionLogEntry, ConstructionCalendarDay } from "../types/constructionLog.types";

export const INITIAL_MOCK_CONSTRUCTION_LOG: ConstructionLogEntry = {
	id: "log-5000-001-20260111",
	orderId: CONSTRUCTION_LOG_CONSTANTS.DEFAULT_ORDER_ID,
	date: "2026-01-11",
	projectName: CONSTRUCTION_LOG_CONSTANTS.DEFAULT_PROJECT_NAME,
	projectNo: CONSTRUCTION_LOG_CONSTANTS.DEFAULT_ORDER_ID,
	constructionDay: CONSTRUCTION_LOG_CONSTANTS.DEFAULT_CONSTRUCTION_DAY,
	address: CONSTRUCTION_LOG_CONSTANTS.DEFAULT_ADDRESS,
	weather: {
		location: CONSTRUCTION_LOG_CONSTANTS.DEFAULT_LOCATION,
		date: "2026-01-11",
		temperature: CONSTRUCTION_LOG_CONSTANTS.DEFAULT_TEMP,
		tempUnit: CONSTRUCTION_LOG_CONSTANTS.TEMP_UNITS.CELSIUS,
		weatherCondition: CONSTRUCTION_LOG_CONSTANTS.WEATHER_CONDITIONS.SUNNY,
		description: "",
		otherNote: "",
	},
	workforce: [
		{
			id: "wf-1",
			role: "Elektriker",
			ownCount: 0,
			subcontractorCount: 2,
			hours: 16,
			note: "UE - Pelles el",
		},
		{
			id: "wf-2",
			role: "Rörmokare",
			ownCount: 0,
			subcontractorCount: 2,
			hours: 16,
			note: "UE - Nisses Rört",
		},
		{
			id: "wf-3",
			role: "Snickare",
			ownCount: 10,
			subcontractorCount: null,
			hours: 80,
			note: CONSTRUCTION_LOG_CONSTANTS.FALLBACK_DASH,
		},
		{
			id: "wf-4",
			role: "Snickare",
			ownCount: null,
			subcontractorCount: 5,
			hours: 40,
			note: "Inhyrd snickare",
		},
	],
	activities: [
		{
			id: "act-1",
			title: "Ny vägg",
			status: CONSTRUCTION_LOG_CONSTANTS.ACTIVITY_STATUS.IN_PROGRESS,
			note: "Rum 110",
		},
		{
			id: "act-2",
			title: "Läggning golv",
			status: CONSTRUCTION_LOG_CONSTANTS.ACTIVITY_STATUS.IN_PROGRESS,
			note: "Spackling golv",
		},
	],
	machines: [
		{
			id: "mach-1",
			name: "Grävmaskin",
			quantity: "1 stycke",
			hours: 8,
			note: "Gräva för rör",
		},
		{
			id: "mach-2",
			name: "Hjullastare",
			quantity: "1 stycke",
			hours: 8,
			note: "Ta bort massor",
		},
	],
	deviations: [
		{
			id: "dev-1",
			number: 1,
			type: CONSTRUCTION_LOG_CONSTANTS.DEVIATION_TYPES.ATA,
			status: CONSTRUCTION_LOG_CONSTANTS.DEVIATION_STATUS.IN_PROGRESS,
			note: "Extra arbete",
		},
		{
			id: "dev-2",
			number: 2,
			type: CONSTRUCTION_LOG_CONSTANTS.DEVIATION_TYPES.ERROR,
			status: CONSTRUCTION_LOG_CONSTANTS.DEVIATION_STATUS.PENDING,
			note: "Fel bänkskiva!",
		},
	],
	generalNotes: "",
	selfInspectionNote: "",
	signatures: {
		siteManager: {
			name: CONSTRUCTION_LOG_CONSTANTS.DEFAULT_SITE_MANAGER.NAME,
			role: CONSTRUCTION_LOG_CONSTANTS.DEFAULT_SITE_MANAGER.ROLE,
			signed: true,
			signedAt: "2026-01-11",
		},
		client: {
			name: CONSTRUCTION_LOG_CONSTANTS.DEFAULT_CLIENT.NAME,
			role: CONSTRUCTION_LOG_CONSTANTS.DEFAULT_CLIENT.ROLE,
			signed: true,
			signedAt: "2026-01-11",
		},
	},
	status: "published",
	createdAt: "2026-01-11T08:00:00.000Z",
	updatedAt: "2026-01-11T16:30:00.000Z",
};

export const MOCK_CALENDAR_DAYS: ConstructionCalendarDay[] = [
	{ date: "2026-09-01", type: CONSTRUCTION_LOG_CONSTANTS.WORKDAY_TYPES.FULL_TIME },
	{ date: "2026-09-02", type: CONSTRUCTION_LOG_CONSTANTS.WORKDAY_TYPES.FULL_TIME },
	{ date: "2026-09-03", type: CONSTRUCTION_LOG_CONSTANTS.WORKDAY_TYPES.FULL_TIME },
	{ date: "2026-09-04", type: CONSTRUCTION_LOG_CONSTANTS.WORKDAY_TYPES.PART_TIME },
	{ date: "2026-09-05", type: CONSTRUCTION_LOG_CONSTANTS.WORKDAY_TYPES.FULL_TIME },
	{ date: "2026-09-08", type: CONSTRUCTION_LOG_CONSTANTS.WORKDAY_TYPES.FULL_TIME },
	{ date: "2026-09-09", type: CONSTRUCTION_LOG_CONSTANTS.WORKDAY_TYPES.FULL_TIME },
	{ date: "2026-09-10", type: CONSTRUCTION_LOG_CONSTANTS.WORKDAY_TYPES.PART_TIME },
	{ date: "2026-09-11", type: CONSTRUCTION_LOG_CONSTANTS.WORKDAY_TYPES.FULL_TIME },
	{ date: "2026-09-12", type: CONSTRUCTION_LOG_CONSTANTS.WORKDAY_TYPES.FULL_TIME },
	{ date: "2026-09-15", type: CONSTRUCTION_LOG_CONSTANTS.WORKDAY_TYPES.FULL_TIME },
	{ date: "2026-09-16", type: CONSTRUCTION_LOG_CONSTANTS.WORKDAY_TYPES.FULL_TIME },
	{ date: "2026-09-17", type: CONSTRUCTION_LOG_CONSTANTS.WORKDAY_TYPES.SELECTED },
	{ date: "2026-09-18", type: CONSTRUCTION_LOG_CONSTANTS.WORKDAY_TYPES.PART_TIME },
	{ date: "2026-09-19", type: CONSTRUCTION_LOG_CONSTANTS.WORKDAY_TYPES.FULL_TIME },
];
