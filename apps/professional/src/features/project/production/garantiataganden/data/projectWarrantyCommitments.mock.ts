import { mockDate } from "../../../constants/mockData";
import type { WarrantyCommitment } from "../types";

/**
 * Each project's warranty commitments.
 *
 * 5001 carries the frame's three rows — the two-, five- and ten-year
 * follow-ups after handover. 5000 has one, with the detail page's extra fields
 * left empty so a card's missing-value mark shows; 5002 has none, for the empty
 * state. The frame's own dates (2028-01-01, 2030-05-31, 2035-01-01) are
 * placeholder copy; these count years from `mockDate`, which is deterministic —
 * never `new Date()` in a mock.
 *
 * The inspection is held a month before the warranty runs out, as a
 * garantibesiktning is, and the reminder goes out a month before the
 * inspection. Garantiansvarig is the project's own manager. None of these
 * fields exist in the project data — see the ticket's flags.
 */
const YEAR = 365;

/** 5001's people: the customer's contact, the project manager and the site's own. */
const LOCUM_EMAILS = ["anders.svensson@locum.se", "kontakt@locum.se", "garanti@byggbolaget.se"];
const LOCUM_CONTACTS = ["Anders Svensson", "Abram Siphron", "Karin Lund"];

function commitment(years: number, index: number): WarrantyCommitment {
	const date = mockDate(years * YEAR);
	return {
		id: `warranty-5001-${index}`,
		projectId: "5001",
		date,
		name: `Garantibesiktning ${index}`,
		responsible: "Abram Siphron",
		approvedDate: mockDate(30),
		periodLabel: `${years} år`,
		endDate: mockDate(years * YEAR + 30),
		reminderDate: mockDate(years * YEAR - 30),
		reminderEmails: [...LOCUM_EMAILS],
		reminderContacts: [...LOCUM_CONTACTS],
		documents: [],
	};
}

export const SEEDED_WARRANTY_COMMITMENTS: WarrantyCommitment[] = [
	{
		...commitment(2, 1),
		/* The frame's three files. Seeded, so they have no stored file: Visa says why. */
		documents: [
			{ id: "warranty-doc-1", date: mockDate(30), name: "Garanti åtgärder", fileName: "Garanti åtgärder.pdf" },
			{ id: "warranty-doc-2", date: mockDate(30), name: "Drift underlag", fileName: "Drift underlag.pdf" },
			{ id: "warranty-doc-3", date: mockDate(45), name: "Rapport", fileName: "Rapport.pdf" },
		],
	},
	{
		...commitment(5, 2),
		documents: [{ id: "warranty-doc-4", date: mockDate(45), name: "Rapport", fileName: "Rapport.pdf" }],
	},
	commitment(10, 3),
	{
		id: "warranty-5000-1",
		projectId: "5000",
		date: mockDate(2 * YEAR),
		name: "Garantibesiktning 1",
		responsible: "Lindsey Philips",
		approvedDate: "",
		periodLabel: "",
		endDate: "",
		reminderDate: "",
		reminderEmails: [],
		reminderContacts: [],
		documents: [],
	},
];
