import { mockDate } from "../../../constants/mockData";
import { emptyNextMeeting } from "../meetingDefaults";
import type { MeetingPlan, MeetingPoint, PointStatus, ProtocolMeeting } from "../types";

/*
 * The meetings behind 5001's Standard protocols. People are 5001's own — its
 * project manager, organisation contacts and staff ledger — so they are in the
 * pickers. Days count from `mockDate`, never `new Date()`.
 */

const SITE = { address: "Sveavägen 44", postalCode: "112 21", city: "Stockholm" };

/** A seeded point. Only an Action meeting's points pass a status. */
export const point = (
	nr: string,
	title: string,
	responsible: string,
	description = "",
	decision = "",
	status: PointStatus | null = null,
): MeetingPoint => ({
	id: `point-${nr}`,
	nr,
	title,
	responsible,
	description,
	decision,
	status,
});

/** A self-check held on site, with a short agenda and no follow-up planned yet. */
export const MEETING_5001_SELF_CHECK: ProtocolMeeting = {
	details: {
		...SITE,
		host: "Abram Siphron",
		title: "Egenkontroll badrum plan 2",
		location: "Badrum plan 2",
		participants: ["Kalle Svensson", "Stina Larsson"],
		startDate: mockDate(-2),
		startTime: "09:00",
		endDate: mockDate(-2),
		endTime: "10:00",
		information: "Kontroll av tätskikt före plattsättning.",
		type: "egenkontroll",
		category: "bygg",
		number: "5001-01",
		subject: "Tätskikt och golvbrunnar",
		comment: "",
	},
	next: emptyNextMeeting(),
	points: [
		point("001", "Tätskikt", "Kalle Svensson", "Tätskiktet i duschdelen kontrolleras mot tillverkarens anvisning.", "Godkänt."),
		point("002", "Golvbrunn", "Stina Larsson", "Klämring och fall mot brunnen kontrolleras.", "Fallet vid dörren justeras."),
		point("003", "Dokumentation", "Abram Siphron", "Foton och egenkontrollen läggs in under Handlingar."),
	],
};

/** What this site meeting and the next one share. */
const SITE_MEETING: Omit<MeetingPlan, "title" | "startDate" | "endDate" | "information"> = {
	...SITE,
	host: "Abram Siphron",
	location: "Kontoret",
	participants: ["Anders Svensson", "Johan Berg", "Kalle Svensson", "Stefan Eriksson"],
	startTime: "15:00",
	endTime: "17:00",
};

/** A site meeting with the frame's agenda, its next meeting planned, and already sent. */
export const MEETING_5001_SITE_MEETING: ProtocolMeeting = {
	details: {
		...SITE_MEETING,
		type: "byggmote",
		category: "bygg",
		title: "Byggmöte 5",
		startDate: mockDate(-1),
		endDate: mockDate(-1),
		information: "Vi bjuder på kaffe och smörgås.",
		number: "5001-02",
		subject: "Stomme och tidplan",
		comment: "Nästa möte hålls på plats.",
	},
	next: {
		...SITE_MEETING,
		category: "bygg",
		title: "Byggmöte 6",
		startDate: mockDate(13),
		endDate: mockDate(13),
		information: "Genomgång av tidplanen för stommen.",
	},
	points: [
		point("001", "1. Välkommen", "Abram Siphron"),
		point("002", "1.1 Öppning", "Abram Siphron", "Mötesledaren öppnar mötet och hälsar alla välkomna.", "Mötet öppnat."),
		point("003", "1.2 Närvaro", "Abram Siphron", "Mötesledaren går igenom listan över deltagare och gäster.", "Alla kallade är på plats."),
		point("004", "1.3 Godkännande av dagordningen", "Abram Siphron", "Dagordningen för mötet gås igenom.", "Dagordningen godkänd."),
		point("005", "2. Problem och avvikelser", "Johan Berg", "Leveransen av stålbalkar är en vecka försenad.", "Leverantören kontaktas."),
		point("006", "3. Åtgärder för försenade leveranser", "Kalle Svensson", "Montageordningen läggs om så att arbetet kan fortsätta.", "En ny montageordning tas fram."),
		point("007", "4. Slutsats", "Abram Siphron", "Beslut och ansvar sammanfattas inför nästa möte."),
	],
};
