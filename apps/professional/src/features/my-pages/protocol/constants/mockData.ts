import { mockDate } from "@/features/widgetdashboard/utils/mockDates";

export type ProtocolType = "standard" | "action";
export type ProtocolStatus = "notSent" | "sent" | "received";
export type PointStatus = "done" | "ongoing" | "notDone";

export interface Participant {
	id: string;
	name: string;
	handle: string;
}

export interface MeetingPoint {
	id: string;
	nr: string;
	subject: string;
	description: string;
	decision: string;
	responsible: string;
	status: PointStatus;
}

export interface MeetingDetails {
	host: string;
	startDate: string;
	startTime: string;
	endDate: string;
	endTime: string;
	subject: string;
	protocolNumber: string;
	participantIds: string[];
	title: string;
	category: string;
	location: string;
	address: string;
	postalCode: string;
	city: string;
	information: string;
	comment: string;
}

export interface Protocol {
	id: string;
	date: string;
	title: string;
	status: ProtocolStatus;
	department: string;
	type: ProtocolType;
	meeting: MeetingDetails;
	nextMeeting: MeetingDetails;
	points: MeetingPoint[];
}

export interface ProtocolNote {
	id: string;
	date: string;
	name: string;
	description: string;
}

// Mock people/categories are intentionally plain data (not i18n) — the
// backend will provide localized values once the protocol API lands.
export const PROTOCOL_PARTICIPANTS: Participant[] = [
	{ id: "u-1", name: "Robert Hellgren", handle: "@robert" },
	{ id: "u-2", name: "Thao Nghiem", handle: "@thao" },
	{ id: "u-3", name: "Anna Carlsson", handle: "@anna" },
	{ id: "u-4", name: "Rachel Meyers", handle: "@rachel" },
];

export const PROTOCOL_CATEGORIES = [
	"Ekonomi",
	"Produktion",
	"Personal",
	"IT",
] as const;

const MEETING_SUBJECT =
	"Ekonomi. Förslag om att acceptera naturliga förluster.";

const baseMeeting: MeetingDetails = {
	host: "Robert Hellgren",
	startDate: mockDate(7),
	startTime: "15:00",
	endDate: mockDate(7),
	endTime: "17:00",
	subject: MEETING_SUBJECT,
	protocolNumber: "000-01",
	participantIds: ["u-1", "u-2"],
	title: "Löner",
	category: "Ekonomi",
	location: "Kontoret",
	address: "",
	postalCode: "000792",
	city: "",
	information: "",
	comment: "",
};

const basePoints: MeetingPoint[] = [
	{
		id: "p-1",
		nr: "0001",
		subject: "1. Välkommen",
		description: "",
		decision: "Anna Carlsson",
		responsible: "Anna Carlsson",
		status: "ongoing",
	},
	{
		id: "p-2",
		nr: "0002",
		subject: "1.1 Öppning",
		description: "Presidenten tillkännager den officiella starten...",
		decision: "Anna Carlsson",
		responsible: "Anna Carlsson",
		status: "done",
	},
	{
		id: "p-3",
		nr: "0003",
		subject: "1.2 Närvaro",
		description: "Presidenten granskar listan över deltagare och gäster.",
		decision: "Anna Carlsson",
		responsible: "Anna Carlsson",
		status: "notDone",
	},
	{
		id: "p-4",
		nr: "0004",
		subject: "1.3 Godkännande av dagordningen",
		description: "Dagordningen för det aktuella mötet granskas.",
		decision: "Anna Carlsson",
		responsible: "Anna Carlsson",
		status: "done",
	},
	{
		id: "p-5",
		nr: "0005",
		subject: "2. Problem och ångest",
		description: "",
		decision: "Anna Carlsson",
		responsible: "Anna Carlsson",
		status: "ongoing",
	},
	{
		id: "p-6",
		nr: "0006",
		subject: "3. Strategier för att lösa problem som upplevs 2020",
		description: "",
		decision: "Anna Carlsson",
		responsible: "Anna Carlsson",
		status: "done",
	},
	{
		id: "p-7",
		nr: "0007",
		subject: "4. Slutsats",
		description: "",
		decision: "Anna Carlsson",
		responsible: "Anna Carlsson",
		status: "notDone",
	},
];

const protocolDefaults = {
	meeting: baseMeeting,
	nextMeeting: baseMeeting,
	points: basePoints,
};

export const PROTOCOLS: Protocol[] = [
	{
		id: "pr-1",
		date: mockDate(-1),
		title: "Möte med IT-team",
		status: "notSent",
		department: "Produktion",
		type: "action",
		...protocolDefaults,
	},
	{
		id: "pr-2",
		date: mockDate(-7),
		title: "Möte med kund",
		status: "sent",
		department: "Personal",
		type: "action",
		...protocolDefaults,
	},
	{
		id: "pr-3",
		date: mockDate(-6),
		title: "Möte - Byggbolaget AB",
		status: "received",
		department: "Ekonomi",
		type: "standard",
		...protocolDefaults,
	},
	{
		id: "pr-4",
		date: mockDate(-6),
		title: "Möte - Byggbolaget AB",
		status: "sent",
		department: "Ekonomi",
		type: "action",
		...protocolDefaults,
	},
	{
		id: "pr-5",
		date: mockDate(-6),
		title: "Möte - Byggbolaget AB",
		status: "received",
		department: "Ekonomi",
		type: "action",
		...protocolDefaults,
	},
	{
		id: "pr-6",
		date: mockDate(-6),
		title: "Möte - Byggbolaget AB",
		status: "notSent",
		department: "Ekonomi",
		type: "action",
		...protocolDefaults,
	},
];

export const PROTOCOL_NOTES: ProtocolNote[] = [
	{
		id: "n-1",
		date: mockDate(-1),
		name: "Möte med IT-team",
		description: "Anteckningar från mötet med IT-teamet.",
	},
	{
		id: "n-2",
		date: mockDate(-7),
		name: "Möte med IT-team",
		description: "Uppföljning av tidigare punkter.",
	},
	{
		id: "n-3",
		date: mockDate(-6),
		name: "Möte med IT-team",
		description: "Genomgång av systemuppdateringar.",
	},
	{
		id: "n-4",
		date: mockDate(-6),
		name: "Möte med IT-team",
		description: "Planering inför nästa sprint.",
	},
	{
		id: "n-5",
		date: mockDate(-6),
		name: "Möte med IT-team",
		description: "Statusrapport från supportärenden.",
	},
	{
		id: "n-6",
		date: mockDate(-6),
		name: "Möte med IT-team",
		description: "Övriga frågor och nästa steg.",
	},
];
