import { mockDate } from "../../../constants/mockData";
import { emptyNextMeeting } from "../meetingDefaults";
import type { ProtocolMeeting } from "../types";
import { point } from "./projectProtocolMeetings.mock";

/*
 * The Action meetings, whose points carry a status. People are each project's
 * own — its manager, organisation contacts and staff ledger — so they are in
 * the pickers. Days count from `mockDate`, never `new Date()`.
 */

/** 5000's quality check on the frame, converted from TFS-713's bare Action row: same day, Typ and Rubrik. */
export const MEETING_5000_QUALITY_CHECK: ProtocolMeeting = {
	details: {
		host: "Lindsey Philips",
		title: "Kvalitetskontroll stomme",
		address: "Kungsgatan 3",
		postalCode: "111 35",
		city: "Stockholm",
		location: "Plan 3",
		participants: ["Stina Andersson", "Sara Nilsson", "Kalle Svensson"],
		startDate: mockDate(-4),
		startTime: "08:00",
		endDate: mockDate(-4),
		endTime: "09:30",
		information: "Genomgång av stommen inför gjutningen.",
		type: "kvalitetskontroll",
		category: "bygg",
		number: "5000-01",
		subject: "Stomme plan 3",
		comment: "",
	},
	next: emptyNextMeeting(),
	points: [
		point("001", "Armering", "Kalle Svensson", "Armeringen i bjälklaget kontrolleras mot ritning K-12.", "Godkänd.", "done"),
		point("002", "Ingjutningsgods", "Stefan Eriksson", "Ingjutningsgods för installationerna kontrolleras.", "Två genomföringar saknas.", "ongoing"),
		point("003", "Egenkontroll", "Sara Nilsson", "Egenkontrollen läggs in under Handlingar.", "", "notDone"),
		point("004", "Nästa kontroll", "Lindsey Philips"),
	],
};

/** 5001's action meeting with the frame's agenda, each point in the state the frame draws it. */
export const MEETING_5001_ACTIONS: ProtocolMeeting = {
	details: {
		host: "Abram Siphron",
		title: "Åtgärdsmöte stomme",
		address: "Sveavägen 44",
		postalCode: "112 21",
		city: "Stockholm",
		location: "Kontoret",
		participants: ["Anders Svensson", "Johan Berg", "Kalle Svensson"],
		startDate: mockDate(-5),
		startTime: "15:00",
		endDate: mockDate(-5),
		endTime: "17:00",
		information: "",
		type: "byggmote",
		category: "bygg",
		number: "5001-03",
		subject: "Åtgärder efter byggmöte 4",
		comment: "",
	},
	next: emptyNextMeeting(),
	points: [
		point("001", "1. Välkommen", "Abram Siphron", "", "", "ongoing"),
		point("002", "1.1 Öppning", "Abram Siphron", "Mötesledaren öppnar mötet och hälsar alla välkomna.", "Mötet öppnat.", "done"),
		point("003", "1.2 Närvaro", "Abram Siphron", "Mötesledaren går igenom listan över deltagare och gäster.", "Två deltagare saknas.", "notDone"),
		point("004", "1.3 Godkännande av dagordningen", "Abram Siphron", "Dagordningen för mötet gås igenom.", "Dagordningen godkänd.", "done"),
		point("005", "2. Problem och avvikelser", "Johan Berg", "Leveransen av stålbalkar är en vecka försenad.", "Leverantören kontaktas.", "ongoing"),
		point("006", "3. Åtgärder för försenade leveranser", "Kalle Svensson", "Montageordningen läggs om.", "En ny montageordning tas fram.", "done"),
		point("007", "4. Slutsats", "Abram Siphron", "Beslut och ansvar sammanfattas inför nästa möte."),
	],
};
