import { mockDate } from "../../../constants/mockData";
import type { ProjectInspection } from "../types";

/**
 * Inspections on each project's Besiktning section.
 *
 * 5001 carries the frame's rows — Byggmöte with one PDF — plus enough variety
 * to exercise the table: a second Byggmöte for the type filter, a Förbesiktning
 * with three files (one a photo) for "+N fler", a Slutbesiktning not yet
 * scheduled, one with no files, and an archived Garantibesiktning for
 * Arkiverade. 5000 has two; 5002 has none, for the empty state.
 *
 * Seeded files have no URL — there is no file store behind them — so they list
 * by name and cannot be opened. Dates come from `mockDate`, which is
 * deterministic — never `new Date()` in a mock.
 */
export const SEEDED_PROJECT_INSPECTIONS: ProjectInspection[] = [
	{
		id: "insp-5001-1",
		projectId: "5001",
		date: mockDate(-7),
		type: "byggmote",
		inspectionDate: mockDate(23),
		documents: [{ id: "insp-5001-1-doc-1", name: "Protokoll byggmöte 3.pdf" }],
		archived: false,
	},
	{
		id: "insp-5001-2",
		projectId: "5001",
		date: mockDate(-21),
		type: "byggmote",
		inspectionDate: mockDate(-14),
		documents: [{ id: "insp-5001-2-doc-1", name: "Protokoll byggmöte 2.pdf" }],
		archived: false,
	},
	{
		id: "insp-5001-3",
		projectId: "5001",
		date: mockDate(-3),
		type: "forbesiktning",
		inspectionDate: mockDate(10),
		documents: [
			{ id: "insp-5001-3-doc-1", name: "Förbesiktning protokoll.pdf" },
			{ id: "insp-5001-3-doc-2", name: "Anmärkningslista.pdf" },
			{ id: "insp-5001-3-doc-3", name: "Foto fasad.jpg" },
		],
		archived: false,
	},
	{
		id: "insp-5001-4",
		projectId: "5001",
		date: mockDate(0),
		type: "slutbesiktning",
		inspectionDate: "",
		documents: [{ id: "insp-5001-4-doc-1", name: "Kallelse slutbesiktning.pdf" }],
		archived: false,
	},
	{
		id: "insp-5001-5",
		projectId: "5001",
		date: mockDate(-40),
		type: "sarskild",
		inspectionDate: mockDate(-35),
		documents: [],
		archived: false,
	},
	{
		id: "insp-5001-6",
		projectId: "5001",
		date: mockDate(-60),
		type: "garantibesiktning",
		inspectionDate: mockDate(-55),
		documents: [{ id: "insp-5001-6-doc-1", name: "Garantibesiktning protokoll.pdf" }],
		archived: true,
	},
	{
		id: "insp-5000-1",
		projectId: "5000",
		date: mockDate(-12),
		type: "byggmote",
		inspectionDate: mockDate(-5),
		documents: [{ id: "insp-5000-1-doc-1", name: "Protokoll byggmöte 1.pdf" }],
		archived: false,
	},
	{
		id: "insp-5000-2",
		projectId: "5000",
		date: mockDate(-2),
		type: "slutbesiktning",
		inspectionDate: mockDate(14),
		documents: [],
		archived: false,
	},
];
