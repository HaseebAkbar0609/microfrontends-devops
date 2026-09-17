import { mockDate } from "../../../constants/mockData";
import type { DiaryContent, ProjectDiary } from "../types";

const EMPTY_CONTENT: DiaryContent = {
	weather: [],
	workforce: [],
	works: [],
	machines: [],
	deviations: [],
	generalNotes: "",
	selfControlNote: "",
};

/** The frame's page, row for row. */
const FRAME_CONTENT: DiaryContent = {
	weather: [
		{ id: "w1", temperature: 22, unit: "celsius", condition: "soligt", description: "Klart hela dagen", otherNote: "" },
	],
	workforce: [
		{ id: "wf1", role: "Elektriker", own: 0, ue: 2, hours: 16, note: "UE – Pelles El" },
		{ id: "wf2", role: "Rörmokare", own: 0, ue: 2, hours: 16, note: "UE – Nisses Rör" },
		{ id: "wf3", role: "Snickare", own: 10, ue: null, hours: 80, note: "" },
		{ id: "wf4", role: "Snickare", own: null, ue: 5, hours: 40, note: "Inhyrd snickare" },
	],
	works: [
		{ id: "wk1", name: "Ny vägg", status: "pagar", note: "Rum 110" },
		{ id: "wk2", name: "Läggning golv", status: "pagar", note: "Spackling golv" },
	],
	machines: [
		{ id: "m1", name: "Grävmaskin", quantity: 1, hours: 8, note: "Gräva för rör" },
		{ id: "m2", name: "Hjullastare", quantity: 1, hours: 8, note: "Ta bort massor" },
	],
	deviations: [
		{ id: "d1", number: 1, type: "ata", status: "pagar", note: "Extra arbete" },
		{ id: "d2", number: 2, type: "fel", status: "atgardas", note: "Fel bänkskiva" },
	],
	generalNotes: "Leverans av gipsskivor flyttad till torsdag.",
	selfControlNote: "Egenkontroll fuktmätning utförd i rum 110.",
};

/** A copy with ids made unique per diary, so rows never share an id across diaries. */
function contentFor(diaryId: string, content: DiaryContent): DiaryContent {
	const tag = <T extends { id: string }>(rows: T[]) => rows.map((row) => ({ ...row, id: `${diaryId}-${row.id}` }));
	return {
		...content,
		weather: tag(content.weather),
		workforce: tag(content.workforce),
		works: tag(content.works),
		machines: tag(content.machines),
		deviations: tag(content.deviations),
	};
}

/**
 * Each project's Dagbok.
 *
 * 5001 has three days: the frame's page, published and signed by both; a
 * shorter published day whose crew worked half days, for the part-time
 * colour; and today's draft, unsigned, with one weather reading. 5000 has one
 * draft; 5002 has none, for the empty state. The signers are the project's
 * own — its project manager and the customer's contact.
 *
 * Dates come from `mockDate`, never `new Date()`.
 */
export const SEEDED_PROJECT_DIARIES: ProjectDiary[] = [
	{
		id: "diary-5001-1",
		projectId: "5001",
		date: mockDate(-3),
		status: "publicerad",
		...contentFor("diary-5001-1", FRAME_CONTENT),
		signatures: {
			platschef: { name: "Abram Siphron", signedDate: mockDate(-3) },
			bestallare: { name: "Anders Svensson", signedDate: mockDate(-2) },
		},
		createdBy: "Abram Siphron",
		updatedDate: mockDate(-3),
		publishedDate: mockDate(-2),
	},
	{
		id: "diary-5001-2",
		projectId: "5001",
		date: mockDate(-2),
		status: "publicerad",
		...contentFor("diary-5001-2", {
			...EMPTY_CONTENT,
			weather: [{ id: "w1", temperature: 14, unit: "celsius", condition: "regn", description: "Regn på eftermiddagen", otherNote: "Arbetet avbröts 12:00" }],
			workforce: [{ id: "wf1", role: "Snickare", own: 6, ue: null, hours: 24, note: "Halvdag på grund av regn" }],
			works: [{ id: "wk1", name: "Ny vägg", status: "pagar", note: "Rum 110" }],
		}),
		signatures: { platschef: { name: "Abram Siphron", signedDate: mockDate(-2) }, bestallare: null },
		createdBy: "Abram Siphron",
		updatedDate: mockDate(-2),
		publishedDate: mockDate(-2),
	},
	{
		id: "diary-5001-3",
		projectId: "5001",
		date: mockDate(0),
		status: "utkast",
		...contentFor("diary-5001-3", {
			...EMPTY_CONTENT,
			weather: [{ id: "w1", temperature: 19, unit: "celsius", condition: "mulet", description: "", otherNote: "" }],
			workforce: [{ id: "wf1", role: "Snickare", own: 8, ue: null, hours: 64, note: "" }],
			works: [{ id: "wk1", name: "Läggning golv", status: "pagar", note: "Plan 2" }],
		}),
		signatures: { platschef: null, bestallare: null },
		createdBy: "Abram Siphron",
		updatedDate: mockDate(0),
		publishedDate: null,
	},
	{
		id: "diary-5000-1",
		projectId: "5000",
		date: mockDate(-1),
		status: "utkast",
		...contentFor("diary-5000-1", {
			...EMPTY_CONTENT,
			workforce: [{ id: "wf1", role: "Målare", own: 2, ue: 1, hours: 24, note: "UE – ByggTeam Stockholm AB" }],
		}),
		signatures: { platschef: null, bestallare: null },
		createdBy: "Lindsey Philips",
		updatedDate: mockDate(-1),
		publishedDate: null,
	},
];
